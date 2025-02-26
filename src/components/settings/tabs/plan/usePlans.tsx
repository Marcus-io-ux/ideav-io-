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
        .in('name', ['basic', 'pro'])
        .order("price");
      
      if (error) throw error;
      
      const planFeatures = {
        basic: [
          "Save up to 50 ideas in your personal vault",
          "Categorize and sort your ideas using folders and tags",
          "Participate in community discussions",
          "Mobile-friendly dashboard access",
          "Basic analytics and monthly metrics"
        ],
        pro: [
          "Unlimited idea storage",
          "Advanced AI-powered organization",
          "Priority community features",
          "24/7 priority support",
          "Advanced analytics & insights",
          "Custom tags & categories",
          "Advanced idea validation tools",
          "Priority feature access"
        ]
      };

      return data?.map(plan => ({
        ...plan,
        features: planFeatures[plan.name.toLowerCase() as keyof typeof planFeatures] || []
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

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error, status } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId: user.id }
      });

      if (error) {
        if (status === 404) {
          toast({
            title: "Notice",
            description: "You don't have an active subscription to cancel",
          });
          return;
        }
        throw error;
      }

      // Invalidate the membership query to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["user-membership"] });

      toast({
        title: "Success",
        description: "Your subscription has been cancelled",
      });
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
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
    handleCancel,
  };
};