import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Get user's active memberships with pro tier
        const { data, error } = await supabase
          .from("user_memberships")
          .select("*, membership_tiers(name)")
          .eq("user_id", user.id)
          .eq("status", "active");

        if (error) {
          console.error("Error checking subscription status:", error);
          return false;
        }

        // Check if any of the active memberships is a pro membership
        return data?.some(membership => membership.membership_tiers?.name?.toLowerCase() === "pro") ?? false;
      } catch (error) {
        console.error("Error in subscription check:", error);
        return false;
      }
    },
    // Refresh every minute to ensure status is current
    refetchInterval: 60000,
  });
};