import { CodeBlock } from "./CodeBlock";

export function CrossSellSection() {
  return (
    <div className="px-6 py-5">
      <p className="text-neutral-darkest dark:text-neutral-200 mb-4">
        The cross-selling feature suggests complementary products based on:
      </p>
      <ul className="list-disc pl-5 mb-4 text-neutral-darkest dark:text-neutral-200">
        <li>Products frequently bought together</li>
        <li>Category-based complementary items</li>
        <li>Historical purchase patterns</li>
        <li>Current shopping cart contents</li>
      </ul>
      
      <h3 className="font-medium text-neutral-darkest dark:text-white mb-2">Example Endpoint</h3>
      <CodeBlock 
        code={`GET /recommendations/cross-sell

Query Parameters:
product_id: "prod_1234567890"
user_id: "cust_0987654321" (optional)
limit: 3 (default: 5)`}
      />
    </div>
  );
}
