import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { ApiOverview } from "@/components/ApiOverview";
import { CrossSellSection } from "@/components/CrossSellSection";
import { UpSellSection } from "@/components/UpSellSection";
import { ShopifyIntegration } from "@/components/ShopifyIntegration";
import { ChatbotExamples } from "@/components/ChatbotExamples";
import { ImplementationSettings } from "@/components/ImplementationSettings";
import { Button } from "@/components/ui/button";
import { Menu, BellRing, HelpCircle } from "@/components/icons";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
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
                    eCommerce Chatbot Recommendation API
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
          {/* Overview Cards */}
          <DashboardStats />

          {/* API Documentation */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
              <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">API Documentation</h2>
            </div>
            <div className="px-6 py-5">
              {/* API Tabs */}
              <div className="border-b border-neutral-light dark:border-neutral-700">
                <nav className="flex -mb-px">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "overview" 
                        ? "tab-active text-primary dark:text-primary" 
                        : "text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "endpoints" 
                        ? "tab-active text-primary dark:text-primary" 
                        : "text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setActiveTab("endpoints")}
                  >
                    Endpoints
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "auth" 
                        ? "tab-active text-primary dark:text-primary" 
                        : "text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setActiveTab("auth")}
                  >
                    Authentication
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "limits" 
                        ? "tab-active text-primary dark:text-primary" 
                        : "text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setActiveTab("limits")}
                  >
                    Rate Limits
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "errors" 
                        ? "tab-active text-primary dark:text-primary" 
                        : "text-neutral-dark dark:text-neutral-400 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setActiveTab("errors")}
                  >
                    Errors
                  </button>
                </nav>
              </div>

              {/* API Content */}
              <ApiOverview />
            </div>
          </div>

          {/* API Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cross-Selling Logic */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
                <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">Cross-Selling Logic</h2>
              </div>
              <CrossSellSection />
            </div>

            {/* Upselling Logic */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
                <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">Upselling Logic</h2>
              </div>
              <UpSellSection />
            </div>
          </div>

          {/* Shopify Integration */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
              <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">Shopify Integration</h2>
            </div>
            <ShopifyIntegration />
          </div>

          {/* Chatbot Display Examples */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
              <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">Chatbot UI Integration</h2>
            </div>
            <ChatbotExamples />
          </div>

          {/* Implementation Settings */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-neutral-700">
              <h2 className="text-lg font-medium text-neutral-darkest dark:text-white">Implementation Settings</h2>
            </div>
            <ImplementationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
