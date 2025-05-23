import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, BellRing, HelpCircle } from "@/components/icons";
import { useState } from "react";
import ChatbotPrototype from "@/components/ChatbotPrototype";

export default function ChatbotDemo() {
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
                    Chatbot Demo
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-darkest dark:text-white mb-2">eCommerce Chatbot Prototype</h1>
            <p className="text-neutral-dark dark:text-neutral-300 mb-4">
              This is a functional prototype of an AI-powered shopping assistant that demonstrates key features including:
            </p>
            <ul className="list-disc pl-5 mb-6 text-neutral-dark dark:text-neutral-300 space-y-1">
              <li>Personalized product recommendations</li>
              <li>Cross-selling and upselling</li>
              <li>"Pick up where you left off" functionality</li>
              <li>Order tracking and status updates</li>
              <li>Return and refund assistance</li>
              <li>Natural language processing (simulated)</li>
            </ul>
            <p className="text-neutral-dark dark:text-neutral-300 mb-6">
              Try interacting with the chatbot below by typing messages or clicking the suggestion buttons.
              You can ask about products, check order status, or request help with returns.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <ChatbotPrototype />
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-darkest dark:text-white mb-4">Integration Instructions</h2>
            <p className="text-neutral-dark dark:text-neutral-300 mb-4">
              This chatbot can be easily integrated with your existing eCommerce platform 
              using our recommendation engine API. Here's how:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-darkest dark:text-white mb-2">1. API Configuration</h3>
                <p className="text-neutral-dark dark:text-neutral-300">
                  Set up our API with your Shopify store to enable product and customer data access.
                  This allows the chatbot to make personalized recommendations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-darkest dark:text-white mb-2">2. Widget Installation</h3>
                <p className="text-neutral-dark dark:text-neutral-300">
                  Add our lightweight JavaScript widget to your website with a simple code snippet.
                  The chatbot will appear as a floating button in the corner of your site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-darkest dark:text-white mb-2">3. Customization</h3>
                <p className="text-neutral-dark dark:text-neutral-300">
                  Customize the appearance, tone, and behavior of the chatbot to match your brand identity.
                  You can also configure which recommendation strategies to prioritize.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}