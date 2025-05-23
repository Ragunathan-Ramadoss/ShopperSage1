import { 
  users, type User, type InsertUser,
  apiKeys, type ApiKey, type InsertApiKey,
  products, type Product, type InsertProduct,
  productRelationships, type ProductRelationship, type InsertProductRelationship
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByShopifyId(shopifyId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // API key methods
  getApiKeys(): Promise<ApiKey[]>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  
  // Product methods
  getProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(category: string, limit?: number): Promise<Product[]>;
  getProductByShopifyId(shopifyId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  
  // Product relationships methods
  getRelatedProductsByShopifyId(shopifyId: string, type?: string): Promise<Product[]>;
  createProductRelationship(relationship: InsertProductRelationship): Promise<ProductRelationship>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apiKeys: Map<number, ApiKey>;
  private products: Map<number, Product>;
  private productRelationships: Map<number, ProductRelationship>;
  private userIdCounter: number;
  private apiKeyIdCounter: number;
  private productIdCounter: number;
  private relationshipIdCounter: number;

  constructor() {
    this.users = new Map();
    this.apiKeys = new Map();
    this.products = new Map();
    this.productRelationships = new Map();
    this.userIdCounter = 1;
    this.apiKeyIdCounter = 1;
    this.productIdCounter = 1;
    this.relationshipIdCounter = 1;
  }

  // ===== User Methods =====
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByShopifyId(shopifyId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.shopifyId === shopifyId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // ===== API Key Methods =====
  
  async getApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values());
  }
  
  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      (apiKey) => apiKey.key === key
    );
  }
  
  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = this.apiKeyIdCounter++;
    const apiKey: ApiKey = {
      ...insertApiKey,
      id
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }
  
  // ===== Product Methods =====
  
  async getProducts(limit: number = 20): Promise<Product[]> {
    return Array.from(this.products.values()).slice(0, limit);
  }
  
  async getProductsByCategory(category: string, limit: number = 20): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category)
      .slice(0, limit);
  }
  
  async getProductByShopifyId(shopifyId: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.shopifyId === shopifyId
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...productUpdate,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // ===== Product Relationships Methods =====
  
  async getRelatedProductsByShopifyId(shopifyId: string, type: string = 'both'): Promise<Product[]> {
    // First, find the product by shopify ID
    const sourceProduct = await this.getProductByShopifyId(shopifyId);
    
    if (!sourceProduct) {
      return [];
    }
    
    // Get all relationships for this product
    const relationships = Array.from(this.productRelationships.values())
      .filter(rel => {
        if (type === 'both') {
          return rel.sourceProductId === sourceProduct.id;
        }
        return rel.sourceProductId === sourceProduct.id && rel.relationshipType === type;
      });
    
    // Get the related products
    const relatedProducts: Product[] = [];
    for (const relationship of relationships) {
      const product = this.products.get(relationship.relatedProductId);
      if (product) {
        relatedProducts.push(product);
      }
    }
    
    return relatedProducts;
  }
  
  async createProductRelationship(insertRelationship: InsertProductRelationship): Promise<ProductRelationship> {
    const id = this.relationshipIdCounter++;
    const now = new Date();
    const relationship: ProductRelationship = {
      ...insertRelationship,
      id,
      createdAt: now
    };
    this.productRelationships.set(id, relationship);
    return relationship;
  }
}

// Use the database implementation
import { DatabaseStorage } from './storage-db';

// Export a new database storage instance instead of memory storage
export const storage = new DatabaseStorage();
