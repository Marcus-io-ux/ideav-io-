import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NotificationToggle } from "./NotificationToggle";

interface NotificationPreferences {
  collaboration_requests: boolean;
  comments: boolean;
  mentions: boolean;
  updates: boolean;
}

export function NotificationsTab() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    notification_preferences: {
      collaboration_requests: true,
      comments: true,
      mentions: true,
      updates: true,
    } as NotificationPreferences,
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
          const notificationPrefs = typeof userSettings.notification_preferences === 'object'
            ? userSettings.notification_preferences as NotificationPreferences
            : {
              collaboration_requests: true,
              comments: true,
              mentions: true,
              updates: true,
            };

          setSettings({
            email_notifications: userSettings.email_notifications,
            push_notifications: userSettings.push_notifications,
            notification_preferences: notificationPrefs,
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
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <NotificationToggle
            id="email_notifications"
            label="Email Notifications"
            description="Receive notifications via email"
            checked={settings.email_notifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, email_notifications: checked }))
            }
          />

          <NotificationToggle
            id="push_notifications"
            label="Push Notifications"
            description="Receive notifications in your browser"
            checked={settings.push_notifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, push_notifications: checked }))
            }
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <div className="space-y-4">
            <NotificationToggle
              id="collaboration_requests"
              label="Collaboration Requests"
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

            <NotificationToggle
              id="comments"
              label="Comments on Your Ideas"
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

            <NotificationToggle
              id="mentions"
              label="Mentions"
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

            <NotificationToggle
              id="updates"
              label="Platform Updates"
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