import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_memberships")
        .select("*, membership_tiers(name)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        console.error("Error fetching subscription status:", error);
        return false;
      }

      return data?.membership_tiers?.name === "pro";
    },
  });
};