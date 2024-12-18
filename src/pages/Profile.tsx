import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MyIdeasTab } from "@/components/profile/tabs/MyIdeasTab";
import { SharedIdeasTab } from "@/components/profile/tabs/SharedIdeasTab";
import { CollaborationsTab } from "@/components/profile/tabs/CollaborationsTab";
import { StatsTab } from "@/components/profile/tabs/StatsTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("my-ideas");

  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const [{ data: profile }, { data: onboardingData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("onboarding_data")
          .select("*")
          .eq("user_id", user.id)
          .single()
      ]);
      
      return {
        ...profile,
        full_name: onboardingData?.full_name,
        is_public: profile?.is_public ?? true
      };
    },
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <ProfileHeader
            username={profileData?.username || ""}
            fullName={profileData?.full_name}
            location={profileData?.location}
            bio={profileData?.bio}
            avatarUrl={profileData?.avatar_url}
            isPublic={profileData?.is_public}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 h-auto p-1">
              <TabsTrigger value="my-ideas" className="px-8 py-2">My Ideas</TabsTrigger>
              <TabsTrigger value="shared" className="px-8 py-2">Shared Ideas</TabsTrigger>
              <TabsTrigger value="collaborations" className="px-8 py-2">Collaborations</TabsTrigger>
              <TabsTrigger value="stats" className="px-8 py-2">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="my-ideas">
              <MyIdeasTab />
            </TabsContent>

            <TabsContent value="shared">
              <SharedIdeasTab />
            </TabsContent>

            <TabsContent value="collaborations">
              <CollaborationsTab />
            </TabsContent>

            <TabsContent value="stats">
              <StatsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;