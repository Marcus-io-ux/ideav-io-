import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const PlanTab = () => {
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

      return data?.map(plan => ({
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

  if (!availablePlans) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Plan</h2>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availablePlans.map((plan) => (
          <Card key={plan.id} className={`p-6 ${plan.name.toLowerCase() === 'pro' ? 'border-primary' : ''}`}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.name.toLowerCase() === 'pro' && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold">${plan.price}<span className="text-sm text-muted-foreground">/month</span></p>
              </div>
              
              <div className="space-y-2">
                {plan.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant={currentPlan?.tier_id === plan.id ? "secondary" : "default"}
                disabled={isLoading || currentPlan?.tier_id === plan.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  currentPlan?.tier_id === plan.id ? "Current Plan" : "Upgrade"
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};