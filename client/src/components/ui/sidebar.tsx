import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Home, ShoppingBag, Users, BarChart2, Settings, UserCircle, HelpCircle, Bot } from "../icons";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Products",
      href: "/products",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      title: "API Docs",
      href: "/api-docs",
      icon: HelpCircle,
    },
    {
      title: "Chatbot Demo",
      href: "/chatbot-demo",
      icon: Bot,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className={cn("flex flex-col w-64 bg-white dark:bg-neutral-900 shadow-md", className)} {...props}>
      <div className="flex items-center justify-center h-16 px-4 bg-primary text-white">
        <span className="text-xl font-semibold">RecommendAPI</span>
      </div>
      
      <div className="flex flex-col flex-grow px-4 pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                  isActive 
                    ? "text-primary bg-neutral-lightest dark:bg-neutral-800" 
                    : "text-neutral-darkest dark:text-neutral-300 hover:text-primary hover:bg-neutral-lightest dark:hover:bg-neutral-800"
                )}
              >
                <item.icon className={cn(
                  "mr-3",
                  isActive 
                    ? "text-primary" 
                    : "text-neutral-dark dark:text-neutral-400"
                )} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-neutral-light dark:border-neutral-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserCircle className="h-8 w-8 text-neutral-dark dark:text-neutral-400 rounded-full" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-darkest dark:text-neutral-200">Admin User</p>
            <p className="text-xs font-medium text-neutral dark:text-neutral-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
