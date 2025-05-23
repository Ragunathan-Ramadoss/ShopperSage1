import { db } from "./db";
import { 
  users, type User, type InsertUser,
  apiKeys, type ApiKey, type InsertApiKey,
  products, type Product, type InsertProduct,
  productRelationships, type ProductRelationship, type InsertProductRelationship,
  recommendations, type Recommendation, type InsertRecommendation
} from "@shared/schema";
import { IStorage } from "./storage";
import { eq, and, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // ===== User Methods =====
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByShopifyId(shopifyId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.shopifyId, shopifyId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // ===== API Key Methods =====
  
  async getApiKeys(): Promise<ApiKey[]> {
    return await db.select().from(apiKeys);
  }
  
  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.key, key));
    return apiKey || undefined;
  }
  
  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db
      .insert(apiKeys)
      .values(insertApiKey)
      .returning();
    return apiKey;
  }
  
  // ===== Product Methods =====
  
  async getProducts(limit: number = 20): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .limit(limit);
  }
  
  async getProductsByCategory(category: string, limit: number = 20): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .limit(limit);
  }
  
  async getProductByShopifyId(shopifyId: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.shopifyId, shopifyId));
    return product || undefined;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...productUpdate,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();
      
    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }
  
  // ===== Product Relationships Methods =====
  
  async getRelatedProductsByShopifyId(shopifyId: string, type: string = 'both'): Promise<Product[]> {
    // First, find the product by shopify ID
    const sourceProduct = await this.getProductByShopifyId(shopifyId);
    
    if (!sourceProduct) {
      return [];
    }
    
    // Query for the relationship based on type
    const relatedProducts = await db
      .select({
        product: products
      })
      .from(products)
      .innerJoin(
        productRelationships,
        and(
          eq(productRelationships.sourceProductId, sourceProduct.id),
          type !== 'both' ? eq(productRelationships.relationshipType, type) : undefined
        )
      )
      .where(eq(products.id, productRelationships.relatedProductId))
      .limit(20);
    
    return relatedProducts.map(row => row.product);
  }
  
  async createProductRelationship(insertRelationship: InsertProductRelationship): Promise<ProductRelationship> {
    const [relationship] = await db
      .insert(productRelationships)
      .values(insertRelationship)
      .returning();
    return relationship;
  }
  
  // ===== Recommendation Methods =====
  
  async saveRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(recommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }
  
  async markRecommendationClicked(id: number): Promise<Recommendation | undefined> {
    const [recommendation] = await db
      .update(recommendations)
      .set({ clicked: true })
      .where(eq(recommendations.id, id))
      .returning();
    return recommendation;
  }
  
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.createdAt))
      .limit(limit);
  }
}