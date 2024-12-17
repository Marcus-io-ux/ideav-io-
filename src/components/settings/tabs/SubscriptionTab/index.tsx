import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { PlanCard } from "./PlanCard";

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface UserMembership {
  tier_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
}

export function SubscriptionTab() {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: tiersData, error: tiersError } = await supabase
          .from("membership_tiers")
          .select("*")
          .order("price");

        if (tiersError) throw tiersError;

        const transformedTiers = tiersData.map(tier => ({
          ...tier,
          features: Array.isArray(tier.features) ? tier.features : []
        }));

        const { data: membershipData, error: membershipError } = await supabase
          .from("user_memberships")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (membershipError && membershipError.code !== "PGRST116") throw membershipError;

        setTiers(transformedTiers);
        setCurrentMembership(membershipData);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {tiers.find(t => t.id === currentMembership?.tier_id)?.name || 'Free Plan'}
                </h3>
                {currentMembership?.start_date && (
                  <p className="text-sm text-muted-foreground">
                    Active since {formatDate(currentMembership.start_date)}
                  </p>
                )}
              </div>
              <Badge variant={currentMembership?.status === 'active' ? 'default' : 'secondary'}>
                {currentMembership?.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {currentMembership?.end_date && (
              <p className="text-sm text-muted-foreground">
                Renews on {formatDate(currentMembership.end_date)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Plans</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <PlanCard
              key={tier.id}
              plan={tier}
              isCurrentPlan={currentMembership?.tier_id === tier.id}
              onSelect={() => {
                // Handle plan selection
                toast({
                  title: "Coming Soon",
                  description: "Plan upgrades will be available soon.",
                });
              }}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Securely manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Update Payment Method</Button>
        </CardContent>
      </Card>
    </div>
  );
}