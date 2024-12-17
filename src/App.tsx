import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Onboarding from "./pages/Onboarding";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = true; // Replace with actual auth logic

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated && <NavigationBar />}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/inbox" element={<Index />} />
            <Route path="/tags" element={<Index />} />
            <Route path="/settings" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;