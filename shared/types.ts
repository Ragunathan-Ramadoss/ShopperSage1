// Request and Response types for the API endpoints

export type RecommendationParams = {
  userId?: string;
  productId?: string;
  type?: 'cross-sell' | 'up-sell' | 'both';
  limit?: number;
  priceRange?: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  product_type: string;
  tags: string[];
  vendor: string;
  handle: string;
  published_at: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  price: string;
  compare_at_price: string | null;
  sku: string;
  inventory_quantity: number;
};

export type ShopifyImage = {
  id: string;
  src: string;
  alt: string | null;
};

export type ShopifyCustomer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  tags: string[];
  last_order_id: string | null;
};

export type ShopifyOrder = {
  id: string;
  customer: {
    id: string;
  };
  line_items: {
    id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price: string;
  }[];
  created_at: string;
};

export type RecommendationResponse = {
  status: string;
  data: {
    recommendations: RecommendationItem[];
    pagination?: {
      next_page?: string;
      previous_page?: string | null;
      total?: number;
    };
  };
};

export type RecommendationItem = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  product_url: string;
  recommendation_type: string;
  recommendation_reason?: string;
};

export type ApiError = {
  status: 'error';
  message: string;
  code?: string;
};
