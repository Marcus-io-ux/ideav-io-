import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Dashboard2 from "@/pages/Dashboard2";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Inbox from "@/pages/Inbox";
import Onboarding from "@/pages/Onboarding";
import AboutUs from "@/pages/AboutUs";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Announcements from "@/pages/Announcements";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          )
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
      <Route
        path="/dashboard2"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Community />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
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
        path="/inbox"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Announcements />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};