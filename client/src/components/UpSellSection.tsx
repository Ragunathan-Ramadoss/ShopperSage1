import { CodeBlock } from "./CodeBlock";

export function UpSellSection() {
  return (
    <div className="px-6 py-5">
      <p className="text-neutral-darkest dark:text-neutral-200 mb-4">
        The upselling feature suggests higher-end alternatives based on:
      </p>
      <ul className="list-disc pl-5 mb-4 text-neutral-darkest dark:text-neutral-200">
        <li>Products from the same category with higher price points</li>
        <li>Products with premium features compared to viewed items</li>
        <li>Products with better ratings in the same category</li>
        <li>Premium versions of items in the cart</li>
      </ul>
      
      <h3 className="font-medium text-neutral-darkest dark:text-white mb-2">Example Endpoint</h3>
      <CodeBlock 
        code={`GET /recommendations/up-sell

Query Parameters:
product_id: "prod_1234567890"
price_range: "120-300" (optional)
limit: 2 (default: 3)`}
      />
    </div>
  );
}
