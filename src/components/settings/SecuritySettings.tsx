import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Privacy</CardTitle>
        <CardDescription>
          Manage your account security and privacy settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Security and privacy settings coming soon.
        </p>
      </CardContent>
    </Card>
  );
}