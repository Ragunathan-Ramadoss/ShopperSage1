import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Users, ThumbsUp, TrendingUp } from "./icons";

export function DashboardStats() {
  // Mock stats for UI demonstration
  const stats = [
    {
      title: "Total Products",
      value: "1,284",
      icon: ShoppingCart,
      bgColor: "bg-primary-light bg-opacity-20",
      iconColor: "text-primary",
    },
    {
      title: "Active Customers",
      value: "3,672",
      icon: Users,
      bgColor: "bg-secondary-light bg-opacity-20",
      iconColor: "text-secondary",
    },
    {
      title: "Recommendation Clicks",
      value: "8,941",
      icon: ThumbsUp,
      bgColor: "bg-success bg-opacity-20",
      iconColor: "text-success",
    },
    {
      title: "Conversion Rate",
      value: "18.6%",
      icon: TrendingUp,
      bgColor: "bg-info bg-opacity-20",
      iconColor: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-neutral-dark dark:text-neutral-400">{stat.title}</p>
              <p className="text-2xl font-semibold text-neutral-darkest dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
