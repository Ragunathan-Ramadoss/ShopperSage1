import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { ApiOverview } from "@/components/ApiOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, BellRing, HelpCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

export default function ApiDocs() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-lightest dark:bg-neutral-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarVisible ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black opacity-25" onClick={toggleSidebar}></div>
        <div className="absolute inset-y-0 left-0 z-40 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="bg-white dark:bg-neutral-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center md:hidden">
                  <Button
                    variant="ghost"
                    className="text-primary dark:text-primary"
                    onClick={toggleSidebar}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="text-lg font-medium text-neutral-darkest dark:text-white">
                    API Documentation
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" className="p-1 rounded-full text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
                  <BellRing className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="ml-3 p-1 rounded-full text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-lightest dark:bg-neutral-900">
          {/* API Documentation */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
              <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">API Reference</h2>
            </div>
            <div className="px-6 py-5">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="cross-sell">Cross-Sell</TabsTrigger>
                  <TabsTrigger value="up-sell">Up-Sell</TabsTrigger>
                  <TabsTrigger value="shopify">Shopify Integration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <ApiOverview />
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-darkest dark:text-white">Recommendation Endpoints</h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white">Get Recommendations</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Get personalized recommendations for a user, product, or both.
                      </p>
                      
                      <CodeBlock 
                        title="GET /api/recommendations"
                        code={`Query Parameters:
user_id: string (optional) - Shopify customer ID
product_id: string (optional) - Shopify product ID
type: "cross-sell" | "up-sell" | "both" (default: "both")
limit: number (default: 3)
price_range: string (optional) - Format: "min-max" in dollars`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
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
      // Additional recommendations...
    ]
  }
}`}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cross-sell">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-darkest dark:text-white">Cross-Sell Endpoints</h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white">Get Cross-Sell Recommendations</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Get complementary product recommendations for a specific product.
                      </p>
                      
                      <CodeBlock 
                        title="GET /api/recommendations/cross-sell"
                        code={`Query Parameters:
product_id: string - Shopify product ID
user_id: string (optional) - Shopify customer ID for personalization
limit: number (default: 5)`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
                        code={`{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "prod_0987654321",
        "title": "Wireless Charging Pad",
        "price": 3499,
        "image_url": "https://cdn.shopify.com/s/files/1/charging-pad.jpg",
        "product_url": "https://yourstore.com/products/wireless-charging-pad",
        "recommendation_type": "cross-sell",
        "recommendation_reason": "Frequently bought together"
      },
      // Additional recommendations...
    ]
  }
}`}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="up-sell">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-darkest dark:text-white">Up-Sell Endpoints</h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white">Get Up-Sell Recommendations</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Get premium product recommendations as an upgrade to a specific product.
                      </p>
                      
                      <CodeBlock 
                        title="GET /api/recommendations/up-sell"
                        code={`Query Parameters:
product_id: string - Shopify product ID
price_range: string (optional) - Format: "min-max" in dollars
limit: number (default: 3)`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
                        code={`{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "prod_2468013579",
        "title": "Pro Audio Headphones",
        "price": 24999,
        "image_url": "https://cdn.shopify.com/s/files/1/pro-headphones.jpg",
        "product_url": "https://yourstore.com/products/pro-audio-headphones",
        "recommendation_type": "up-sell",
        "recommendation_reason": "Upgrade option"
      },
      // Additional recommendations...
    ]
  }
}`}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shopify">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-darkest dark:text-white">Shopify Integration Endpoints</h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white">Get Shopify Products</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Retrieve products from your Shopify store.
                      </p>
                      
                      <CodeBlock 
                        title="GET /api/shopify/products"
                        code={`Query Parameters:
limit: number (default: 10)
page: number (default: 1)`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
                        code={`{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "prod_1234567890",
        "title": "Premium Headphones",
        "price": 12999,
        "image_url": "https://cdn.shopify.com/s/files/1/headphones.jpg",
        "product_url": "https://yourstore.com/products/premium-headphones"
      },
      // Additional products...
    ],
    "pagination": {
      "next_page": "/api/shopify/products?page=2&limit=10",
      "previous_page": null,
      "total": 1284
    }
  }
}`}
                      />
                      
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white mt-6">Get Specific Shopify Product</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Retrieve a specific product by ID from your Shopify store.
                      </p>
                      
                      <CodeBlock 
                        title="GET /api/shopify/products/:productId"
                        code={`Path Parameters:
productId: string - Shopify product ID`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
                        code={`{
  "status": "success",
  "data": {
    "product": {
      "id": "prod_1234567890",
      "title": "Premium Headphones",
      "price": 12999,
      "image_url": "https://cdn.shopify.com/s/files/1/headphones.jpg",
      "product_url": "https://yourstore.com/products/premium-headphones"
    }
  }
}`}
                      />
                      
                      <h4 className="text-md font-medium text-neutral-darkest dark:text-white mt-6">Sync Shopify Products</h4>
                      <p className="text-neutral-dark dark:text-neutral-400 mb-2">
                        Sync products from your Shopify store to the recommendation engine.
                      </p>
                      
                      <CodeBlock 
                        title="POST /api/shopify/sync/products"
                        code={`Request Body:
{
  "limit": 50 // Number of products to sync
}`}
                      />
                      
                      <h5 className="font-medium text-neutral-darkest dark:text-white mt-4">Response</h5>
                      <CodeBlock 
                        language="json"
                        code={`{
  "status": "success",
  "data": {
    "message": "Successfully synced 50 products from Shopify."
  }
}`}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
