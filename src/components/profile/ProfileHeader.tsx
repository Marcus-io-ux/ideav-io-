import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profile: {
    username: string;
    avatar_url?: string;
    bio?: string;
    is_public?: boolean;
  };
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.bio && (
                <p className="text-muted-foreground mt-1">{profile.bio}</p>
              )}
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="gap-2"
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Idea
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};