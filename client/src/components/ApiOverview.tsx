import { CodeBlock } from "./CodeBlock";

export function ApiOverview() {
  return (
    <div className="py-4">
      <p className="text-neutral-darkest dark:text-neutral-200 mb-4">
        The Recommendation Engine API provides personalized product recommendations for eCommerce chatbots. It leverages customer data to generate relevant product suggestions through RESTful endpoints.
      </p>
      
      <h3 className="font-medium text-lg text-neutral-darkest dark:text-white mb-2">Base URL</h3>
      <CodeBlock 
        code="https://api.recommendengine.com/v1" 
        className="mb-4"
      />

      <h3 className="font-medium text-lg text-neutral-darkest dark:text-white mb-2">Authentication</h3>
      <p className="text-neutral-darkest dark:text-neutral-200 mb-4">
        All API requests require the use of an API key which should be provided in the header:
      </p>
      <CodeBlock 
        code="Authorization: Bearer YOUR_API_KEY" 
        className="mb-6"
      />

      <h3 className="font-medium text-lg text-neutral-darkest dark:text-white mb-2">Example: Get Recommendations</h3>
      <CodeBlock 
        code={`GET /recommendations/user/{user_id}

Headers:
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

Query Parameters:
type: "cross-sell" | "up-sell" | "both"
limit: 5 (default: 3)`}
        className="mb-4"
      />

      <h3 className="font-medium text-lg text-neutral-darkest dark:text-white mb-2">Response Example</h3>
      <CodeBlock 
        code={`{
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
      {
        "id": "prod_0987654321",
        "title": "Wireless Charging Pad",
        "price": 3499,
        "image_url": "https://cdn.shopify.com/s/files/1/charging-pad.jpg",
        "product_url": "https://yourstore.com/products/wireless-charging-pad",
        "recommendation_type": "cross-sell",
        "recommendation_reason": "Customers also bought"
      },
      {
        "id": "prod_2468013579",
        "title": "Pro Audio Headphones",
        "price": 24999,
        "image_url": "https://cdn.shopify.com/s/files/1/pro-headphones.jpg",
        "product_url": "https://yourstore.com/products/pro-audio-headphones",
        "recommendation_type": "up-sell",
        "recommendation_reason": "Upgrade option"
      }
    ]
  }
}`}
        language="json"
        className="mb-6"
      />
    </div>
  );
}
