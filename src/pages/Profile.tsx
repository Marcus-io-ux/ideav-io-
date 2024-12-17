import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Activity,
  Users,
  Star,
  Clock,
  Share2,
  Lock,
  Unlock,
} from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      return profile;
    },
  });

  const handlePrivacyChange = (checked: boolean) => {
    setIsPublic(checked);
    toast({
      title: `Profile is now ${checked ? "public" : "private"}`,
      description: `Other users ${
        checked ? "can" : "cannot"
      } view your profile and statistics.`,
    });
  };

  const stats = [
    { label: "Total Ideas", value: 42, icon: BarChart },
    { label: "Ideas This Month", value: 12, icon: Activity },
    { label: "Followers", value: 156, icon: Users },
    { label: "Following", value: 89, icon: Users },
    { label: "Favorite Ideas", value: 15, icon: Star },
    { label: "Days Active", value: 60, icon: Clock },
    { label: "Shared Ideas", value: 8, icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <ProfileHeader
            username={profile?.username || ""}
            fullName={profile?.full_name}
            location={profile?.location}
            bio={profile?.bio}
            avatarUrl={profile?.avatar_url}
          />

          <div className="flex items-center space-x-2 mb-6">
            {isPublic ? (
              <Unlock className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-500" />
            )}
            <Switch
              checked={isPublic}
              onCheckedChange={handlePrivacyChange}
              id="profile-privacy"
            />
            <Label htmlFor="profile-privacy">
              {isPublic ? "Public Profile" : "Private Profile"}
            </Label>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Activity Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Activity chart will be implemented here
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;