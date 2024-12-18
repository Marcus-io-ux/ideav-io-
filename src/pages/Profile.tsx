import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsSection } from "@/components/profile/StatsSection";
import { ActivityGraph } from "@/components/profile/ActivityGraph";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setProfileData(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ProfileHeader profile={profileData} />
      <StatsSection userId={profileData?.user_id} />
      <ActivityGraph userId={profileData?.user_id} />
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => navigate("/dashboard")}
          className="gap-2"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Idea
        </Button>
      </div>
    </div>
  );
};

export default Profile;