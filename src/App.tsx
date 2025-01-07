import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuthState } from "./hooks/useAuthState";
import { AppRoutes } from "./components/routing/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  },
});

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuthState(queryClient);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AppRoutes isAuthenticated={isAuthenticated} />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;