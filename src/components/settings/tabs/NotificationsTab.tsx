import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const NotificationsTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        email_notifications: formData.get("email_notifications") === "on",
        push_notifications: formData.get("push_notifications") === "on",
      };

      const { error } = await supabase
        .from("user_settings")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <p className="text-muted-foreground">
          Choose how you want to be notified about activity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              name="email_notifications"
              defaultChecked={settings?.email_notifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              name="push_notifications"
              defaultChecked={settings?.push_notifications}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};