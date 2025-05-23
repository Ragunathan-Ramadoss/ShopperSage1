import { CodeBlock } from "./CodeBlock";
import { Bot, UserCircle } from "./icons";

export function ChatbotExamples() {
  return (
    <div className="px-6 py-5">
      <p className="text-neutral-darkest dark:text-neutral-200 mb-6">
        Examples of how product recommendations appear within the chatbot interface:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cross-Sell Example */}
        <div className="border border-neutral-light dark:border-neutral-700 rounded-lg p-4">
          <h3 className="font-medium text-neutral-darkest dark:text-white mb-3">Cross-Sell Example</h3>
          <div className="bg-neutral-lightest dark:bg-neutral-800 p-4 rounded-lg mb-3">
            <div className="flex items-start mb-4">
              <div className="mr-2 bg-neutral-light dark:bg-neutral-700 rounded-full p-2">
                <Bot className="h-5 w-5 text-neutral-dark dark:text-neutral-400" />
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 shadow-sm">
                <p className="text-neutral-darkest dark:text-neutral-200">Great choice on the wireless earbuds! Would you like to see some accessories that go well with it?</p>
              </div>
            </div>
            <div className="flex items-start justify-end mb-4">
              <div className="bg-primary bg-opacity-10 rounded-lg p-3">
                <p className="text-primary">Yes, show me some options</p>
              </div>
              <div className="ml-2 bg-primary rounded-full p-2">
                <UserCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-start mb-4">
              <div className="mr-2 bg-neutral-light dark:bg-neutral-700 rounded-full p-2">
                <Bot className="h-5 w-5 text-neutral-dark dark:text-neutral-400" />
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 shadow-sm">
                <p className="text-neutral-darkest dark:text-neutral-200 mb-3">Here are some accessories that go perfectly with your wireless earbuds:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-neutral-light dark:border-neutral-700 rounded-lg overflow-hidden">
                    <div className="w-full h-32 bg-neutral-light dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-neutral dark:text-neutral-400">Earbuds Carrying Case Image</span>
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm text-neutral-darkest dark:text-neutral-200">Protective Carrying Case</p>
                      <p className="text-sm text-neutral-dark dark:text-neutral-400">$19.99</p>
                      <a href="#" className="text-primary text-xs font-medium hover:underline">View product →</a>
                    </div>
                  </div>
                  <div className="border border-neutral-light dark:border-neutral-700 rounded-lg overflow-hidden">
                    <div className="w-full h-32 bg-neutral-light dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-neutral dark:text-neutral-400">Earbud Tips Image</span>
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm text-neutral-darkest dark:text-neutral-200">Memory Foam Ear Tips (3 pairs)</p>
                      <p className="text-sm text-neutral-dark dark:text-neutral-400">$14.99</p>
                      <a href="#" className="text-primary text-xs font-medium hover:underline">View product →</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CodeBlock 
            code={`GET /recommendations/cross-sell?product_id=earbuds-001&limit=2

Response Format:
{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "case-001",
        "title": "Protective Carrying Case",
        "price": 1999,
        "image_url": "https://...",
        "product_url": "https://..."
      },
      ...
    ]
  }
}`}
            language="json"
            className="text-xs"
          />
        </div>
        
        {/* Upsell Example */}
        <div className="border border-neutral-light dark:border-neutral-700 rounded-lg p-4">
          <h3 className="font-medium text-neutral-darkest dark:text-white mb-3">Upsell Example</h3>
          <div className="bg-neutral-lightest dark:bg-neutral-800 p-4 rounded-lg mb-3">
            <div className="flex items-start mb-4">
              <div className="mr-2 bg-neutral-light dark:bg-neutral-700 rounded-full p-2">
                <Bot className="h-5 w-5 text-neutral-dark dark:text-neutral-400" />
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 shadow-sm">
                <p className="text-neutral-darkest dark:text-neutral-200">I notice you're interested in the basic fitness tracker. Would you like to see some premium options with additional features?</p>
              </div>
            </div>
            <div className="flex items-start justify-end mb-4">
              <div className="bg-primary bg-opacity-10 rounded-lg p-3">
                <p className="text-primary">Yes, what do you recommend?</p>
              </div>
              <div className="ml-2 bg-primary rounded-full p-2">
                <UserCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-2 bg-neutral-light dark:bg-neutral-700 rounded-full p-2">
                <Bot className="h-5 w-5 text-neutral-dark dark:text-neutral-400" />
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 shadow-sm">
                <p className="text-neutral-darkest dark:text-neutral-200 mb-3">Here's a premium option that many customers prefer:</p>
                <div className="border border-neutral-light dark:border-neutral-700 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-40 bg-neutral-light dark:bg-neutral-700 flex items-center justify-center">
                    <span className="text-neutral dark:text-neutral-400">Premium Fitness Watch Image</span>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-neutral-darkest dark:text-neutral-200">Advanced Fitness Watch Pro</p>
                      <span className="bg-secondary-light bg-opacity-20 text-secondary-dark px-2 py-1 rounded text-xs font-medium">PREMIUM</span>
                    </div>
                    <p className="text-sm text-neutral-dark dark:text-neutral-400 mb-1">$199.99</p>
                    <p className="text-sm text-neutral-dark dark:text-neutral-400 mb-2">Includes heart rate monitoring, GPS tracking, and 7-day battery life</p>
                    <a href="#" className="inline-block bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark">View details</a>
                  </div>
                </div>
                <p className="text-neutral-darkest dark:text-neutral-200 text-sm">This model has a 4.8/5 star rating and includes advanced health metrics not available in the basic model.</p>
              </div>
            </div>
          </div>
          <CodeBlock 
            code={`GET /recommendations/up-sell?product_id=basic-fitness-tracker&limit=1

Response Format:
{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "premium-fitness-watch",
        "title": "Advanced Fitness Watch Pro",
        "price": 19999,
        "features": [...],
        "rating": 4.8,
        "image_url": "https://...",
        "product_url": "https://..."
      }
    ]
  }
}`}
            language="json"
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}