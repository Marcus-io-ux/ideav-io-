import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Get user's active memberships ordered by creation date
        const { data, error } = await supabase
          .from("user_memberships")
          .select("*, membership_tiers(name)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error checking subscription status:", error);
          return false;
        }

        // Check if the most recent active membership is pro
        return data && data.length > 0 && 
          data[0].membership_tiers?.name?.toLowerCase() === "pro";
      } catch (error) {
        console.error("Error in subscription check:", error);
        return false;
      }
    },
    // Refresh every minute to ensure status is current
    refetchInterval: 60000,
  });
};