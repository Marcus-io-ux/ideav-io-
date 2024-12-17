import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";

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

export function SubscriptionSettings() {
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
        // Fetch available tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from("membership_tiers")
          .select("*")
          .order("price");

        if (tiersError) throw tiersError;

        // Fetch user's current membership
        const { data: membershipData, error: membershipError } = await supabase
          .from("user_memberships")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (membershipError && membershipError.code !== "PGRST116") throw membershipError;

        setTiers(tiersData);
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

  const getCurrentTier = () => {
    if (!currentMembership) return null;
    return tiers.find(tier => tier.id === currentMembership.tier_id);
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

  const currentTier = getCurrentTier();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Manage your subscription and billing information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Current Plan</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{currentTier?.name || 'Free Plan'}</p>
                <p className="text-sm text-muted-foreground">
                  {currentMembership?.status === 'active' ? (
                    <>Active since {formatDate(currentMembership.start_date)}</>
                  ) : (
                    'No active subscription'
                  )}
                </p>
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
        </div>

        {/* Available Plans */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Plans</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.id} className="relative">
                {currentMembership?.tier_id === tier.id && (
                  <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">{tier.name}</h4>
                    <p className="text-2xl font-bold">
                      ${tier.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    <ul className="space-y-2 text-sm">
                      {tier.features?.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={currentMembership?.tier_id === tier.id ? "outline" : "default"}
                    >
                      {currentMembership?.tier_id === tier.id ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          <p className="text-sm text-muted-foreground">
            Securely manage your payment methods and billing information.
          </p>
          <Button variant="outline">Update Payment Method</Button>
        </div>

        {/* Billing History */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing History</h3>
          <p className="text-sm text-muted-foreground">
            View and download your past invoices.
          </p>
          <div className="rounded-lg border">
            <div className="p-4 text-center text-sm text-muted-foreground">
              No billing history available
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}