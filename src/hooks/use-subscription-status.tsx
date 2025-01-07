import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Get user's active membership with pro tier
        const { data, error } = await supabase
          .from("user_memberships")
          .select("*, membership_tiers(name)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (error) {
          console.error("Error checking subscription status:", error);
          return false;
        }

        // Check if the user has an active pro membership
        return data?.membership_tiers?.name === "pro";
      } catch (error) {
        console.error("Error in subscription check:", error);
        return false;
      }
    },
    // Refresh every minute to ensure status is current
    refetchInterval: 60000,
  });
};