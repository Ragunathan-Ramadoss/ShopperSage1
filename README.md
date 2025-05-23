# eCommerce Recommendation Engine API

A RESTful API for generating personalized product recommendations for eCommerce chatbots. This API includes powerful cross-selling and upselling capabilities with seamless Shopify integration.

## Features

- **Personalized Product Recommendations**: Generate tailored product suggestions based on user behavior and preferences
- **Cross-Selling**: Suggest complementary products that pair well with items a customer is viewing or has purchased
- **Upselling**: Recommend premium alternatives and upgrades to products customers are interested in
- **Shopify Integration**: Seamlessly connect to your Shopify store to access product catalog and customer data
- **Secure API Authentication**: API key authentication for secure access to recommendation endpoints
- **Dashboard Interface**: Visual dashboard to manage settings and view documentation
- **PostgreSQL Database**: Persistent storage for products, users, and recommendation data

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Frontend**: React with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: RESTful endpoints with JSON responses
- **Authentication**: API key-based authentication
- **External Integration**: Shopify API
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have:

- Node.js (v16+) and npm installed
- PostgreSQL database access (or use a service like Neon, Supabase, etc.)
- A Shopify store with API access (for full functionality)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecommerce-recommendation-api.git
cd ecommerce-recommendation-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/recommendation_db

# Shopify Configuration
SHOPIFY_API_KEY=your_shopify_private_api_key
SHOPIFY_SHOP_NAME=your_shop_name_without_domain
```

### 4. Create database schema

The project uses Drizzle ORM for database management. To set up your database:

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

This will start both the backend API server and frontend dashboard on port 5000. Visit http://localhost:5000 to access the dashboard.

## API Usage

### Authentication

All API endpoints require an API key, which should be included in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

To create an API key, use the dashboard interface or the API key creation endpoint.

### Creating an API Key

```bash
curl -X POST http://localhost:5000/api/keys \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key", "key": "custom_key_or_generated", "active": true}'
```

### Getting Recommendations

#### General Recommendations

```bash
curl http://localhost:5000/api/recommendations?product_id=prod_123&user_id=cust_456&type=both&limit=5 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Cross-Sell Recommendations

```bash
curl http://localhost:5000/api/recommendations/cross-sell?product_id=prod_123&limit=3 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Up-Sell Recommendations

```bash
curl http://localhost:5000/api/recommendations/up-sell?product_id=prod_123&price_range=100-300&limit=2 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Shopify Integration

#### Fetching Products from Shopify

```bash
curl http://localhost:5000/api/shopify/products?limit=10&page=1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Syncing Products from Shopify to Local Database

```bash
curl -X POST http://localhost:5000/api/shopify/sync/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"limit": 50}'
```

## Response Format

All API responses follow a consistent format:

```json
{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "prod_1234567890",
        "title": "Premium Headphones",
        "price": 12999,
        "image_url": "https://cdn.shopify.com/s/files/1/headphones.jpg",
        "product_url": "https://yourstore.com/products/premium-headphones",
        "recommendation_type": "cross-sell",
        "recommendation_reason": "Frequently bought together"
      },
      // More recommendations...
    ]
  }
}
```

## Dashboard Interface

The dashboard provides several key features:

- **API Key Management**: Create and manage API keys
- **Documentation**: Interactive API documentation with examples
- **Recommendation Settings**: Configure cross-selling and upselling parameters
- **Shopify Integration**: Manage connection to your Shopify store
- **Analytics**: View recommendation performance metrics

## Development

### Project Structure

```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions
│   │   └── hooks/        # React hooks
├── server/               # Backend Express application
│   ├── middleware/       # Express middleware
│   ├── recommendation/   # Recommendation engine logic
│   ├── shopify/          # Shopify integration
│   ├── db.ts             # Database connection
│   └── routes.ts         # API routes
├── shared/               # Shared code between front and backend
│   ├── schema.ts         # Database schema
│   └── types.ts          # TypeScript types
└── drizzle.config.ts     # Drizzle ORM configuration
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Integrating with a Chatbot

To integrate with your eCommerce chatbot:

1. Create an API key through the dashboard
2. Use the recommendation endpoints in your chatbot logic
3. Format and display the returned recommendations to users during conversations

Example chatbot integration code:

```javascript
// When a user is viewing a product in your store
async function suggestRelatedProducts(productId, userId) {
  const response = await fetch(
    `https://your-api-url.com/api/recommendations?product_id=${productId}&user_id=${userId}&type=both&limit=3`,
    {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    }
  );
  
  const data = await response.json();
  
  if (data.status === 'success') {
    return data.data.recommendations;
  }
  
  return [];
}

// Display recommendations in your chatbot UI
const recommendations = await suggestRelatedProducts('prod_123', 'user_456');
if (recommendations.length > 0) {
  chatbot.sendMessage("You might also be interested in these products:");
  recommendations.forEach(product => {
    chatbot.sendProductCard({
      title: product.title,
      price: formatPrice(product.price),
      imageUrl: product.image_url,
      productUrl: product.product_url,
      reason: product.recommendation_reason
    });
  });
}
```

## License

MIT License

## Support

For questions or support, please open an issue on GitHub or contact our team at support@example.com.