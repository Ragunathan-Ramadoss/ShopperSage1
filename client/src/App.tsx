import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ApiDocs from "@/pages/ApiDocs";
import ChatbotDemo from "@/pages/ChatbotDemo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/chatbot-demo" component={ChatbotDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
