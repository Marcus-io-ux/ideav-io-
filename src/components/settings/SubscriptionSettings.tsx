import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Manage your subscription and billing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Subscription management features coming soon.
        </p>
      </CardContent>
    </Card>
  );
}