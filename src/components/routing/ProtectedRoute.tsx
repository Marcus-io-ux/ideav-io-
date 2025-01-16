import { Navigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  requiresSubscription?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ 
  isAuthenticated, 
  requiresSubscription = false,
  children 
}: ProtectedRouteProps) => {
  const { data: isSubscribed } = useSubscriptionStatus();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresSubscription && !isSubscribed) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};