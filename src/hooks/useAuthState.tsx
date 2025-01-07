import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useAuthState = (queryClient: QueryClient) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          handleAuthError(error);
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        // Verify the session is still valid
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("User verification error:", userError);
          handleAuthError(userError);
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        handleAuthError(error as Error);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    const handleAuthError = (error: any) => {
      if (error.message?.includes('session_not_found') || error.message?.includes('JWT')) {
        // Clear the invalid session
        supabase.auth.signOut();
        queryClient.clear();
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        setIsAuthenticated(false);
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed successfully');
        setIsAuthenticated(true);
      } else if (event === 'USER_UPDATED' && session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast, navigate]);

  return { isAuthenticated, isLoading };
};