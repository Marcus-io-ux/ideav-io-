import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { SubscriptionTab } from "@/components/settings/tabs/SubscriptionTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";

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
            {activeSection === "profile" && <ProfileTab />}
            {activeSection === "preferences" && <PreferencesTab />}
            {activeSection === "subscription" && <SubscriptionTab />}
            {activeSection === "security" && <SecurityTab />}
            {activeSection === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}