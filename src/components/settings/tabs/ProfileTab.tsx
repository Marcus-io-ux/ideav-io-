import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const ProfileTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
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
        first_name: onboardingData?.full_name?.split(' ')[0] || '',
        last_name: onboardingData?.full_name?.split(' ')[1] || '',
      };
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        username: String(formData.get("username") || ""),
        bio: String(formData.get("bio") || ""),
        location: String(formData.get("location") || ""),
      };

      const onboardingUpdates = {
        full_name: `${String(formData.get("first_name") || "")} ${String(formData.get("last_name") || "")}`.trim(),
      };

      const [{ error: profileError }, { error: onboardingError }] = await Promise.all([
        supabase
          .from("profiles")
          .update(updates)
          .eq("user_id", user.id),
        supabase
          .from("onboarding_data")
          .update(onboardingUpdates)
          .eq("user_id", user.id),
      ]);

      if (profileError || onboardingError) throw profileError || onboardingError;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your profile information and how others see you on the platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={profile?.first_name}
              placeholder="Your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={profile?.last_name}
              placeholder="Your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile?.username}
            placeholder="Your username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile?.bio}
            placeholder="Tell us about yourself"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={profile?.location}
            placeholder="Your location"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};