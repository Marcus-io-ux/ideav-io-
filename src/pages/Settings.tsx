import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { PreferencesTab } from "@/components/settings/tabs/PreferencesTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { PlanTab } from "@/components/settings/tabs/PlanTab";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your IdeaVault experience
          </p>
        </div>

        <Card className="mt-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none px-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
            </TabsList>

            <div className="p-6">
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
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Settings;