import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePlans = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentPlan } = useQuery({
    queryKey: ["user-membership"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*, membership_tiers(*)")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: availablePlans } = useQuery({
    queryKey: ["membership-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_tiers")
        .select("*")
        .order("price");
      
      if (error) throw error;
      
      const defaultFeatures = {
        free: [
          "Create up to 50 ideas",
          "Basic organization",
          "Community access",
          "Basic support"
        ],
        pro: [
          "Unlimited ideas",
          "Advanced organization",
          "Priority support",
          "Collaboration features",
          "Custom tags",
          "Advanced analytics",
          "Early access to new features",
          "No ads"
        ]
      };

      return data?.filter(plan => 
        plan.name.toLowerCase() === 'free' || 
        plan.name.toLowerCase() === 'pro'
      ).map(plan => ({
        ...plan,
        features: plan.name.toLowerCase() === 'pro' 
          ? defaultFeatures.pro 
          : defaultFeatures.free
      })) || [];
    },
  });

  const handleUpgrade = async (tierId: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("user_memberships")
        .upsert({
          user_id: user.id,
          tier_id: tierId,
          status: "active",
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["user-membership"] });
      await queryClient.invalidateQueries({ queryKey: ["subscription-status"] });

      toast({
        title: "Plan updated",
        description: "Your subscription plan has been updated successfully.",
      });
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPlan,
    availablePlans,
    isLoading,
    handleUpgrade,
  };
};