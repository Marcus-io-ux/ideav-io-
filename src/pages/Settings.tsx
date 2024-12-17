import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

type SettingsSection = "profile" | "preferences" | "subscription" | "security" | "notifications";

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/4">
          <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          <div className="space-y-6">
            {activeSection === "profile" && <ProfileSettings />}
            {activeSection === "preferences" && <PreferencesSettings />}
            {activeSection === "subscription" && <SubscriptionSettings />}
            {activeSection === "security" && <SecuritySettings />}
            {activeSection === "notifications" && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}