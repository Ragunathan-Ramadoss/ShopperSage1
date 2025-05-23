import { storage } from '../storage';
import { shopifyClient } from '../shopify/client';
import { Product, User } from '@shared/schema';
import { RecommendationParams, RecommendationItem, RecommendationResponse } from '@shared/types';

export class RecommendationEngine {
  /**
   * Get recommendations based on parameters
   */
  async getRecommendations(params: RecommendationParams): Promise<RecommendationResponse> {
    const { userId, productId, type = 'both', limit = 3 } = params;
    let recommendations: RecommendationItem[] = [];

    try {
      // If user ID is provided, get user-specific recommendations
      if (userId) {
        const user = await storage.getUserByShopifyId(userId);
        if (user) {
          recommendations = await this.getUserBasedRecommendations(user, type, limit);
        }
      }
      
      // If product ID is provided, get product-based recommendations
      if (productId && recommendations.length < limit) {
        const additionalRecommendations = await this.getProductBasedRecommendations(
          productId, 
          type, 
          limit - recommendations.length
        );
        recommendations = [...recommendations, ...additionalRecommendations];
      }
      
      // If we still don't have enough recommendations, get general popular items
      if (recommendations.length < limit) {
        const generalRecommendations = await this.getGeneralRecommendations(
          type, 
          limit - recommendations.length
        );
        recommendations = [...recommendations, ...generalRecommendations];
      }
      
      return {
        status: 'success',
        data: {
          recommendations
        }
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Get cross-sell recommendations for a specific product
   */
  async getCrossSellRecommendations(productId: string, limit: number = 3): Promise<RecommendationResponse> {
    try {
      const recommendations = await this.getProductBasedRecommendations(productId, 'cross-sell', limit);
      
      return {
        status: 'success',
        data: {
          recommendations
        }
      };
    } catch (error) {
      console.error('Error generating cross-sell recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Get up-sell recommendations for a specific product
   */
  async getUpSellRecommendations(productId: string, priceRange?: string, limit: number = 3): Promise<RecommendationResponse> {
    try {
      const recommendations = await this.getProductBasedRecommendations(productId, 'up-sell', limit, priceRange);
      
      return {
        status: 'success',
        data: {
          recommendations
        }
      };
    } catch (error) {
      console.error('Error generating up-sell recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Generate recommendations based on user data
   */
  private async getUserBasedRecommendations(
    user: User, 
    type: string = 'both', 
    limit: number = 3
  ): Promise<RecommendationItem[]> {
    // If we have user purchase history, use it to make recommendations
    if (user.purchaseHistory) {
      const history = Array.isArray(user.purchaseHistory) ? user.purchaseHistory : [];
      
      // Get products based on purchase history
      const productIds = history.map((item: any) => item.productId).slice(0, 10);
      
      if (productIds.length > 0) {
        // For each product in history, find related products
        const relatedPromises = productIds.map(id => 
          storage.getRelatedProductsByShopifyId(id, type)
        );
        
        const relatedProductsArrays = await Promise.all(relatedPromises);
        let relatedProducts = relatedProductsArrays.flat();
        
        // Deduplicate recommendations
        const uniqueProductIds = new Set<number>();
        relatedProducts = relatedProducts.filter(product => {
          if (uniqueProductIds.has(product.id)) {
            return false;
          }
          uniqueProductIds.add(product.id);
          return true;
        });
        
        // Format products for response
        const items: RecommendationItem[] = relatedProducts.slice(0, limit).map(product => ({
          id: product.shopifyId,
          title: product.title,
          price: product.price,
          image_url: product.imageUrl || '',
          product_url: product.productUrl || '',
          recommendation_type: type !== 'both' ? type : (product.price > 10000 ? 'up-sell' : 'cross-sell'), // Default logic
          recommendation_reason: 'Based on your purchase history'
        }));
        
        return items;
      }
    }
    
    // Fallback to browsed products if available
    if (user.browsedProducts) {
      const browsed = Array.isArray(user.browsedProducts) ? user.browsedProducts : [];
      
      if (browsed.length > 0) {
        // Similar logic as above but for browsed products
        const productIds = browsed.map((item: any) => item.productId).slice(0, 5);
        
        if (productIds.length > 0) {
          const relatedPromises = productIds.map(id => 
            storage.getRelatedProductsByShopifyId(id, type)
          );
          
          const relatedProductsArrays = await Promise.all(relatedPromises);
          let relatedProducts = relatedProductsArrays.flat();
          
          // Deduplicate recommendations
          const uniqueProductIds = new Set<number>();
          relatedProducts = relatedProducts.filter(product => {
            if (uniqueProductIds.has(product.id)) {
              return false;
            }
            uniqueProductIds.add(product.id);
            return true;
          });
          
          // Format products for response
          const items: RecommendationItem[] = relatedProducts.slice(0, limit).map(product => ({
            id: product.shopifyId,
            title: product.title,
            price: product.price,
            image_url: product.imageUrl || '',
            product_url: product.productUrl || '',
            recommendation_type: type !== 'both' ? type : (product.price > 10000 ? 'up-sell' : 'cross-sell'),
            recommendation_reason: 'Based on products you viewed'
          }));
          
          return items;
        }
      }
    }
    
    // If we can't generate user-specific recommendations, return empty array
    return [];
  }
  
  /**
   * Generate recommendations based on a specific product
   */
  private async getProductBasedRecommendations(
    productId: string, 
    type: string = 'both', 
    limit: number = 3,
    priceRange?: string
  ): Promise<RecommendationItem[]> {
    try {
      // Get the source product
      const sourceProduct = await storage.getProductByShopifyId(productId);
      
      if (!sourceProduct) {
        // Try to fetch from Shopify and store it
        try {
          const shopifyProduct = await shopifyClient.getProductById(productId);
          // Convert and store the product
          const product = this.convertShopifyProduct(shopifyProduct);
          await storage.createProduct(product);
        } catch (err) {
          console.error(`Product ${productId} not found in storage or Shopify`, err);
          return [];
        }
      }
      
      // Get related products 
      let relatedProducts: Product[] = [];
      
      if (type === 'cross-sell' || type === 'both') {
        const crossSellProducts = await storage.getRelatedProductsByShopifyId(
          productId, 
          'cross-sell'
        );
        relatedProducts = [...relatedProducts, ...crossSellProducts];
      }
      
      if (type === 'up-sell' || type === 'both') {
        const upSellProducts = await storage.getRelatedProductsByShopifyId(
          productId, 
          'up-sell'
        );
        relatedProducts = [...relatedProducts, ...upSellProducts];
      }
      
      // Apply price range filter if specified
      if (priceRange && type !== 'cross-sell') {
        const [minPrice, maxPrice] = priceRange.split('-').map(p => parseInt(p, 10) * 100); // Convert to cents
        
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          relatedProducts = relatedProducts.filter(
            product => product.price >= minPrice && product.price <= maxPrice
          );
        }
      }
      
      // If we don't have enough related products, generate some based on category
      if (relatedProducts.length < limit && sourceProduct) {
        const categoryProducts = await storage.getProductsByCategory(
          sourceProduct.category || '',
          20 // Get more than we need so we can filter
        );
        
        // Filter out the source product
        const additionalProducts = categoryProducts.filter(
          p => p.shopifyId !== productId
        );
        
        // For cross-sell, get similar price range products
        // For up-sell, get more expensive products
        if (type === 'cross-sell') {
          const sourcePriceMin = sourceProduct.price * 0.7; // 70% of source price
          const sourcePriceMax = sourceProduct.price * 1.3; // 130% of source price
          
          const filteredProducts = additionalProducts.filter(
            p => p.price >= sourcePriceMin && p.price <= sourcePriceMax
          );
          
          relatedProducts = [...relatedProducts, ...filteredProducts];
        } else if (type === 'up-sell') {
          // Get products that are 20% to 200% more expensive
          const sourcePriceMin = sourceProduct.price * 1.2; 
          
          const filteredProducts = additionalProducts.filter(
            p => p.price >= sourcePriceMin
          ).sort((a, b) => a.price - b.price); // Sort by price ascending
          
          relatedProducts = [...relatedProducts, ...filteredProducts];
        } else {
          // Both types - just add all products from the same category
          relatedProducts = [...relatedProducts, ...additionalProducts];
        }
      }
      
      // Deduplicate recommendations
      const uniqueProductIds = new Set<number>();
      relatedProducts = relatedProducts.filter(product => {
        if (uniqueProductIds.has(product.id)) {
          return false;
        }
        uniqueProductIds.add(product.id);
        return true;
      });
      
      // Generate recommendation reasons based on type
      const getReasonByType = (type: string, product: Product): string => {
        if (type === 'cross-sell') {
          return 'Frequently bought together';
        } else if (type === 'up-sell') {
          return 'Upgrade option';
        } else {
          return product.price > sourceProduct?.price ? 'Upgrade option' : 'Customers also bought';
        }
      };
      
      // Format products for response
      const recommendations: RecommendationItem[] = relatedProducts.slice(0, limit).map(product => ({
        id: product.shopifyId,
        title: product.title,
        price: product.price,
        image_url: product.imageUrl || '',
        product_url: product.productUrl || '',
        recommendation_type: type !== 'both' ? type : (product.price > sourceProduct?.price ? 'up-sell' : 'cross-sell'),
        recommendation_reason: getReasonByType(type, product)
      }));
      
      return recommendations;
    } catch (error) {
      console.error('Error in product-based recommendations:', error);
      return [];
    }
  }
  
  /**
   * Get general recommendations when no user or product context is available
   */
  private async getGeneralRecommendations(
    type: string = 'both', 
    limit: number = 3
  ): Promise<RecommendationItem[]> {
    try {
      // Get popular products (this would typically be based on sales data)
      const products = await storage.getProducts(30); // Get more than needed
      
      // Filter products based on recommendation type
      let filteredProducts: Product[] = [];
      
      if (products.length > 0) {
        if (type === 'cross-sell' || type === 'both') {
          // For cross-sell, select lower to mid-priced products
          const lowerPriceProducts = products
            .filter(p => p.price < 10000) // Less than $100
            .sort(() => 0.5 - Math.random()); // Simple shuffle
          
          filteredProducts = [...filteredProducts, ...lowerPriceProducts];
        }
        
        if (type === 'up-sell' || type === 'both') {
          // For up-sell, select higher-priced products
          const higherPriceProducts = products
            .filter(p => p.price >= 10000) // $100 or more
            .sort((a, b) => b.price - a.price); // Sort by price descending
          
          filteredProducts = [...filteredProducts, ...higherPriceProducts];
        }
      }
      
      // If we still don't have enough products, just return whatever we have
      if (filteredProducts.length < limit) {
        filteredProducts = [...filteredProducts, ...products];
      }
      
      // Deduplicate and take only what we need
      const uniqueProductIds = new Set<number>();
      filteredProducts = filteredProducts
        .filter(product => {
          if (uniqueProductIds.has(product.id)) {
            return false;
          }
          uniqueProductIds.add(product.id);
          return true;
        })
        .slice(0, limit);
      
      // Format for response
      const recommendations: RecommendationItem[] = filteredProducts.map(product => ({
        id: product.shopifyId,
        title: product.title,
        price: product.price,
        image_url: product.imageUrl || '',
        product_url: product.productUrl || '',
        recommendation_type: type !== 'both' ? type : (product.price >= 10000 ? 'up-sell' : 'cross-sell'),
        recommendation_reason: product.price >= 10000 ? 'Popular premium item' : 'Popular item'
      }));
      
      return recommendations;
    } catch (error) {
      console.error('Error in general recommendations:', error);
      return [];
    }
  }
  
  /**
   * Convert a Shopify product to our internal product structure
   */
  private convertShopifyProduct(shopifyProduct: any): any {
    const mainVariant = shopifyProduct.variants[0] || {};
    const mainImage = shopifyProduct.images[0] || {};
    
    return {
      shopifyId: shopifyProduct.id,
      title: shopifyProduct.title,
      description: shopifyProduct.body_html || '',
      price: parseFloat(mainVariant.price || '0') * 100, // Convert to cents
      compareAtPrice: mainVariant.compare_at_price ? parseFloat(mainVariant.compare_at_price) * 100 : undefined,
      imageUrl: mainImage.src || '',
      productUrl: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/products/${shopifyProduct.handle}`,
      category: shopifyProduct.product_type || '',
      tags: shopifyProduct.tags ? shopifyProduct.tags.split(',').map((t: string) => t.trim()) : [],
      vendor: shopifyProduct.vendor || '',
      inventory: mainVariant.inventory_quantity || 0
    };
  }
}

// Create and export a singleton instance
export const recommendationEngine = new RecommendationEngine();
