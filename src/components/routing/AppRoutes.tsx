import { Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "./ProtectedRoute";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import AboutUs from "@/pages/AboutUs";
import Onboarding from "@/pages/Onboarding";
import Settings from "@/pages/Settings";
import Announcements from "@/pages/Announcements";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import Community from "@/pages/Community";
import Inbox from "@/pages/Inbox";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Set up session handling
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Clear any auth data from localStorage
        localStorage.removeItem('supabase.auth.token');
      }
    });

    // Initialize session
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
      }
    };

    initSession();
  }, [toast]);

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    toast({
      title: "Error",
      description: "An error occurred. Please try again later.",
      variant: "destructive",
    });
  });

  return (
    <>
      {isAuthenticated && <NavigationBar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiresSubscription>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiresSubscription>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiresSubscription>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};