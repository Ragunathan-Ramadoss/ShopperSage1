import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API Keys
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  key: true,
  name: true,
  active: true,
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  shopifyId: text("shopify_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  compareAtPrice: integer("compare_at_price"), // Compare at price in cents
  imageUrl: text("image_url"),
  productUrl: text("product_url"),
  category: text("category"),
  tags: text("tags").array(),
  vendor: text("vendor"),
  inventory: integer("inventory"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Users/Customers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  shopifyId: text("shopify_id").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  preferences: jsonb("preferences"),
  purchaseHistory: jsonb("purchase_history"),
  browsedProducts: jsonb("browsed_products"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  recommendationType: text("recommendation_type").notNull(), // cross-sell, up-sell
  reason: text("reason"),
  score: integer("score"), // Higher score means better recommendation
  clicked: boolean("clicked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

// Relationships (for related products)
export const productRelationships = pgTable("product_relationships", {
  id: serial("id").primaryKey(),
  sourceProductId: integer("source_product_id").references(() => products.id).notNull(),
  relatedProductId: integer("related_product_id").references(() => products.id).notNull(),
  relationshipType: text("relationship_type").notNull(), // cross-sell, up-sell
  strength: integer("strength").default(1), // Higher strength means stronger relationship
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductRelationshipSchema = createInsertSchema(productRelationships).omit({
  id: true,
  createdAt: true,
});

// Types
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type ProductRelationship = typeof productRelationships.$inferSelect;
export type InsertProductRelationship = z.infer<typeof insertProductRelationshipSchema>;
