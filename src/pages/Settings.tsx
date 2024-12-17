import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { PlanTab } from "@/components/settings/tabs/PlanTab";
import { PageHeader } from "@/components/ui/page-header";

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences"
        />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <Card className="p-6">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="plan">
              <PlanTab />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;