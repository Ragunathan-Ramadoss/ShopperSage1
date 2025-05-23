import { CodeBlock } from "./CodeBlock";
import { SiShopify } from "./icons";

export function ShopifyIntegration() {
  const connectionStatus = [
    { dataType: "Products", endpoint: "/admin/api/2023-10/products.json", status: "Connected" },
    { dataType: "Customers", endpoint: "/admin/api/2023-10/customers.json", status: "Connected" },
    { dataType: "Orders", endpoint: "/admin/api/2023-10/orders.json", status: "Connected" },
    { dataType: "Collections", endpoint: "/admin/api/2023-10/collections.json", status: "Connected" },
  ];

  return (
    <div className="px-6 py-5">
      <p className="text-neutral-darkest dark:text-neutral-200 mb-4">
        The API seamlessly integrates with Shopify to fetch product and customer data.
      </p>
      
      <div className="mb-5">
        <h3 className="font-medium text-neutral-darkest dark:text-white mb-3">API Connections</h3>
        <div className="border border-neutral-light dark:border-neutral-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-light dark:divide-neutral-700">
            <thead className="bg-neutral-lightest dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark dark:text-neutral-400 uppercase tracking-wider">Data Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark dark:text-neutral-400 uppercase tracking-wider">Shopify Endpoint</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark dark:text-neutral-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-light dark:divide-neutral-700">
              {connectionStatus.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-darkest dark:text-neutral-200">
                    {item.dataType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-neutral-darkest dark:text-neutral-200">
                    {item.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success bg-opacity-10 text-success">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-neutral-darkest dark:text-white mb-3">Shopify API Integration Example</h3>
        <CodeBlock 
          code={`GET /shopify/products

Response:
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "prod_1234567890",
        "title": "Premium Headphones",
        "variants": [...],
        "images": [...],
        "product_type": "Audio"
      },
      {
        "id": "prod_0987654321",
        "title": "Wireless Charging Pad",
        "variants": [...],
        "images": [...],
        "product_type": "Accessories"
      }
    ],
    "pagination": {
      "next_page": "/shopify/products?page=2",
      "previous_page": null,
      "total": 1284
    }
  }
}`}
          language="json"
        />
      </div>
    </div>
  );
}
