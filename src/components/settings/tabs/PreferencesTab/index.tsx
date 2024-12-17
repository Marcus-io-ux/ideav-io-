import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ThemeSettings } from "./ThemeSettings";
import { LanguageSettings } from "./LanguageSettings";

export function PreferencesTab() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userSettings } = await supabase
          .from("user_settings")
          .select("theme, language")
          .eq("user_id", user.id)
          .single();

        if (userSettings) {
          setSettings({
            theme: userSettings.theme || "light",
            language: userSettings.language || "en",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load preferences. Please try again.",
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
            theme: settings.theme,
            language: settings.language,
          })
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Settings updated",
          description: "Your preferences have been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ThemeSettings
        theme={settings.theme}
        onThemeChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
      />
      <LanguageSettings
        language={settings.language}
        onLanguageChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
      />
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
    </div>
  );
}