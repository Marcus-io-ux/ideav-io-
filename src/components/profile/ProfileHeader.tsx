import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

interface ProfileHeaderProps {
  profile: {
    username: string;
    avatar_url?: string;
    bio?: string;
    is_public?: boolean;
  };
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
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
            <AddIdeaDialog onIdeaSubmit={() => {}} />
          </div>
        </div>
      </div>
    </Card>
  );
};