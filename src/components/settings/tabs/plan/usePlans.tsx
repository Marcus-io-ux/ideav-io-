import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePlans = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: currentPlan } = useQuery({
    queryKey: ["user-membership"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*, membership_tiers(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data && data.length > 0 ? data[0] : null;
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
          "Basic support",
          "Basic analytics"
        ],
        pro: [
          "Unlimited ideas",
          "Advanced organization",
          "Priority support",
          "Collaboration features",
          "Advanced analytics",
          "Custom tags"
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

      const { error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId: user.id,
          email: user.email,
          returnUrl: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirecting to checkout...",
      });
    } catch (error: any) {
      console.error("Error upgrading plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade plan",
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