import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated && <NavigationBar />}
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Landing />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/community"
              element={
                isAuthenticated ? <Community /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/onboarding"
              element={
                isAuthenticated ? (
                  <Onboarding />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/inbox"
              element={
                isAuthenticated ? <Inbox /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/favorites"
              element={
                isAuthenticated ? <Favorites /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/tags"
              element={
                isAuthenticated ? <Index /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/announcements"
              element={
                isAuthenticated ? (
                  <Announcements />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
