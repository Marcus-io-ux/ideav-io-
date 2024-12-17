import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
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
        </Card>
      </Tabs>
    </div>
  );
};

export default Settings;