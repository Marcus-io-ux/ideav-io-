import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    notification_preferences: {
      collaboration_requests: true,
      comments: true,
      mentions: true,
      updates: true,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userSettings } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (userSettings) {
          setSettings({
            email_notifications: userSettings.email_notifications,
            push_notifications: userSettings.push_notifications,
            notification_preferences: userSettings.notification_preferences || {
              collaboration_requests: true,
              comments: true,
              mentions: true,
              updates: true,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from("user_settings")
          .update({
            email_notifications: settings.email_notifications,
            push_notifications: settings.push_notifications,
            notification_preferences: settings.notification_preferences,
          })
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Settings updated",
          description: "Your notification settings have been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, email_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              id="push_notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, push_notifications: checked }))
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="collaboration_requests">Collaboration Requests</Label>
              <Switch
                id="collaboration_requests"
                checked={settings.notification_preferences.collaboration_requests}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notification_preferences: {
                      ...prev.notification_preferences,
                      collaboration_requests: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="comments">Comments on Your Ideas</Label>
              <Switch
                id="comments"
                checked={settings.notification_preferences.comments}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notification_preferences: {
                      ...prev.notification_preferences,
                      comments: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mentions">Mentions</Label>
              <Switch
                id="mentions"
                checked={settings.notification_preferences.mentions}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notification_preferences: {
                      ...prev.notification_preferences,
                      mentions: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="updates">Platform Updates</Label>
              <Switch
                id="updates"
                checked={settings.notification_preferences.updates}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notification_preferences: {
                      ...prev.notification_preferences,
                      updates: checked,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}