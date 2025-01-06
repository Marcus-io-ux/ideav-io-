import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuthState } from "./hooks/useAuthState";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Inbox from "./pages/Inbox";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
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
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
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
            <Route
              path="/profile"
              element={
                isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/community"
              element={
                isAuthenticated ? <Community /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/inbox"
              element={
                isAuthenticated ? <Inbox /> : <Navigate to="/login" replace />
              }
            />
            {/* Catch all route - redirect to dashboard if authenticated, otherwise to landing */}
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

const App = () => {
  const { isAuthenticated, isLoading } = useAuthState(queryClient);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes isAuthenticated={isAuthenticated} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
