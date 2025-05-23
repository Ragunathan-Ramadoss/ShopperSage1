import { ShopifyProduct, ShopifyCustomer, ShopifyOrder } from '@shared/types';

export class ShopifyClient {
  private apiKey: string;
  private shopName: string;
  private apiVersion: string;
  
  constructor() {
    this.apiKey = process.env.SHOPIFY_API_KEY || '';
    this.shopName = process.env.SHOPIFY_SHOP_NAME || '';
    this.apiVersion = '2023-10'; // Shopify API version
    
    if (!this.apiKey || !this.shopName) {
      console.warn('Shopify API credentials are missing. Please set SHOPIFY_API_KEY and SHOPIFY_SHOP_NAME environment variables.');
    }
  }
  
  private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    const url = `https://${this.shopName}.myshopify.com/admin/api/${this.apiVersion}${endpoint}`;
    
    const headers: Record<string, string> = {
      'X-Shopify-Access-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
    
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Shopify API Error (${response.status}): ${errorText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }
  
  // Products
  
  async getProducts(limit: number = 50, page: number = 1): Promise<{ products: ShopifyProduct[], count: number }> {
    const response = await this.request<{ products: ShopifyProduct[] }>(`/products.json?limit=${limit}&page=${page}`);
    const countResponse = await this.request<{ count: number }>('/products/count.json');
    return { products: response.products, count: countResponse.count };
  }
  
  async getProductById(productId: string): Promise<ShopifyProduct> {
    const response = await this.request<{ product: ShopifyProduct }>(`/products/${productId}.json`);
    return response.product;
  }
  
  async getProductsByIds(productIds: string[]): Promise<ShopifyProduct[]> {
    const productPromises = productIds.map(id => this.getProductById(id));
    return await Promise.all(productPromises);
  }
  
  // Customers
  
  async getCustomers(limit: number = 50, page: number = 1): Promise<{ customers: ShopifyCustomer[], count: number }> {
    const response = await this.request<{ customers: ShopifyCustomer[] }>(`/customers.json?limit=${limit}&page=${page}`);
    const countResponse = await this.request<{ count: number }>('/customers/count.json');
    return { customers: response.customers, count: countResponse.count };
  }
  
  async getCustomerById(customerId: string): Promise<ShopifyCustomer> {
    const response = await this.request<{ customer: ShopifyCustomer }>(`/customers/${customerId}.json`);
    return response.customer;
  }
  
  // Orders
  
  async getOrders(limit: number = 50, page: number = 1): Promise<{ orders: ShopifyOrder[], count: number }> {
    const response = await this.request<{ orders: ShopifyOrder[] }>(`/orders.json?limit=${limit}&page=${page}&status=any`);
    const countResponse = await this.request<{ count: number }>('/orders/count.json?status=any');
    return { orders: response.orders, count: countResponse.count };
  }
  
  async getOrdersForCustomer(customerId: string): Promise<ShopifyOrder[]> {
    const response = await this.request<{ orders: ShopifyOrder[] }>(`/orders.json?customer_id=${customerId}`);
    return response.orders;
  }
  
  // Collections
  
  async getCollections(): Promise<any> {
    const response = await this.request<any>('/custom_collections.json');
    const smartCollections = await this.request<any>('/smart_collections.json');
    return {
      custom_collections: response.custom_collections,
      smart_collections: smartCollections.smart_collections
    };
  }
  
  // Format product data for the recommendation engine
  
  formatProductForApi(product: ShopifyProduct): { 
    id: string; 
    title: string; 
    price: number; 
    image_url: string; 
    product_url: string; 
  } {
    const mainVariant = product.variants[0] || {};
    const mainImage = product.images[0] || {};
    
    return {
      id: product.id,
      title: product.title,
      price: parseFloat(mainVariant.price || '0') * 100, // Convert to cents
      image_url: mainImage.src || '',
      product_url: `https://${this.shopName}.myshopify.com/products/${product.handle}`,
    };
  }
}

// Create and export a singleton instance
export const shopifyClient = new ShopifyClient();
