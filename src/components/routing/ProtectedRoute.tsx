import { Navigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  requiresSubscription?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ 
  isAuthenticated, 
  requiresSubscription = true, // Changed default to true since all routes require subscription now
  children 
}: ProtectedRouteProps) => {
  const { data: isSubscribed, isLoading } = useSubscriptionStatus();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresSubscription && !isLoading && !isSubscribed) {
    toast({
      title: "Subscription Required",
      description: "Please subscribe to access this feature",
      variant: "destructive",
    });
    return <Navigate to="/pricing" replace />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return <>{children}</>;
};