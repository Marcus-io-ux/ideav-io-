import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { PlanTab } from "@/components/settings/tabs/PlanTab";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
          Settings
        </h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 bg-accent/50 p-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <Card className="p-6 border-primary/10 bg-background/50 backdrop-blur-sm">
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