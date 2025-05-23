import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { apiKeyAuth } from "./middleware/auth";
import { recommendationEngine } from "./recommendation/engine";
import { shopifyClient } from "./shopify/client";
import { z } from "zod";
import { insertApiKeySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== API Routes =====
  // All API routes are prefixed with /api

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'API is running' });
  });

  // ==== Authentication and API Keys ====
  
  // Create a new API key
  app.post('/api/keys', async (req, res) => {
    try {
      const validatedData = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey(validatedData);
      res.status(201).json({ 
        status: 'success', 
        data: { apiKey } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Invalid data format.', 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create API key.' 
      });
    }
  });

  // Get all API keys
  app.get('/api/keys', async (req, res) => {
    try {
      const apiKeys = await storage.getApiKeys();
      res.json({ 
        status: 'success', 
        data: { apiKeys } 
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to retrieve API keys.' 
      });
    }
  });

  // ==== Recommendation Endpoints ====
  // All recommendation endpoints require API key authentication
  
  // Get recommendations for a user
  app.get('/api/recommendations/user/:userId', apiKeyAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const { type = 'both', limit = '3' } = req.query;
      
      const recommendations = await recommendationEngine.getRecommendations({
        userId,
        type: type as 'cross-sell' | 'up-sell' | 'both',
        limit: parseInt(limit as string, 10)
      });
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error in user recommendations:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to generate recommendations.' 
      });
    }
  });
  
  // Get cross-sell recommendations for a product
  app.get('/api/recommendations/cross-sell', apiKeyAuth, async (req, res) => {
    try {
      const { product_id, limit = '5' } = req.query;
      
      if (!product_id) {
        return res.status(400).json({
          status: 'error',
          message: 'product_id is required'
        });
      }
      
      const recommendations = await recommendationEngine.getCrossSellRecommendations(
        product_id as string,
        parseInt(limit as string, 10)
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error in cross-sell recommendations:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to generate cross-sell recommendations.' 
      });
    }
  });
  
  // Get up-sell recommendations for a product
  app.get('/api/recommendations/up-sell', apiKeyAuth, async (req, res) => {
    try {
      const { product_id, price_range, limit = '3' } = req.query;
      
      if (!product_id) {
        return res.status(400).json({
          status: 'error',
          message: 'product_id is required'
        });
      }
      
      const recommendations = await recommendationEngine.getUpSellRecommendations(
        product_id as string,
        price_range as string,
        parseInt(limit as string, 10)
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error in up-sell recommendations:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to generate up-sell recommendations.' 
      });
    }
  });
  
  // General recommendations endpoint that supports both types
  app.get('/api/recommendations', apiKeyAuth, async (req, res) => {
    try {
      const { 
        user_id,
        product_id, 
        type = 'both', 
        limit = '3',
        price_range
      } = req.query;
      
      if (!user_id && !product_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Either user_id or product_id is required'
        });
      }
      
      const recommendations = await recommendationEngine.getRecommendations({
        userId: user_id as string,
        productId: product_id as string,
        type: type as 'cross-sell' | 'up-sell' | 'both',
        limit: parseInt(limit as string, 10),
        priceRange: price_range as string
      });
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error in recommendations:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to generate recommendations.' 
      });
    }
  });
  
  // ==== Shopify Integration Endpoints ====
  
  // Get all products from Shopify
  app.get('/api/shopify/products', apiKeyAuth, async (req, res) => {
    try {
      const { limit = '10', page = '1' } = req.query;
      const limitNum = parseInt(limit as string, 10);
      const pageNum = parseInt(page as string, 10);
      
      const { products, count } = await shopifyClient.getProducts(limitNum, pageNum);
      
      // Format the response
      const formattedProducts = products.map(product => shopifyClient.formatProductForApi(product));
      
      res.json({
        status: 'success',
        data: {
          products: formattedProducts,
          pagination: {
            next_page: pageNum * limitNum < count ? `/api/shopify/products?page=${pageNum + 1}&limit=${limitNum}` : null,
            previous_page: pageNum > 1 ? `/api/shopify/products?page=${pageNum - 1}&limit=${limitNum}` : null,
            total: count
          }
        }
      });
    } catch (error) {
      console.error('Error fetching Shopify products:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch products from Shopify.' 
      });
    }
  });
  
  // Get a specific product from Shopify
  app.get('/api/shopify/products/:productId', apiKeyAuth, async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await shopifyClient.getProductById(productId);
      
      // Format the response
      const formattedProduct = shopifyClient.formatProductForApi(product);
      
      res.json({
        status: 'success',
        data: {
          product: formattedProduct
        }
      });
    } catch (error) {
      console.error('Error fetching Shopify product:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch product from Shopify.' 
      });
    }
  });
  
  // Sync products from Shopify to local storage
  app.post('/api/shopify/sync/products', apiKeyAuth, async (req, res) => {
    try {
      const { limit = 50 } = req.body;
      const { products } = await shopifyClient.getProducts(limit);
      
      let syncedCount = 0;
      
      for (const shopifyProduct of products) {
        // Format product data using our helper method
        const productData = shopifyClient.convertToStorageFormat(shopifyProduct);
        
        // Check if product already exists
        const existingProduct = await storage.getProductByShopifyId(shopifyProduct.id);
        
        if (existingProduct) {
          // Update existing product
          await storage.updateProduct(existingProduct.id, productData);
        } else {
          // Create new product
          await storage.createProduct(productData);
        }
        
        syncedCount++;
      }
      
      res.json({
        status: 'success',
        data: {
          message: `Successfully synced ${syncedCount} products from Shopify.`
        }
      });
    } catch (error) {
      console.error('Error syncing Shopify products:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to sync products from Shopify.' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
