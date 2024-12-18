import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Upload, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface ProfileHeaderProps {
  username: string;
  fullName?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: Date;
}

export const ProfileHeader = ({
  username,
  fullName,
  location,
  bio,
  avatarUrl,
  createdAt = new Date(),
}: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEditProfile = () => {
    setIsEditing(true);
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available soon!",
    });
  };

  const handleAvatarUpload = async () => {
    toast({
      title: "Coming Soon",
      description: "Avatar upload will be available soon!",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : (
              <AvatarFallback className="text-2xl">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <button
            onClick={handleAvatarUpload}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <Upload className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{fullName || username}</h1>
              <p className="text-muted-foreground">@{username}</p>
              
              <div className="flex items-center gap-4 mt-2">
                {location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(createdAt, 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleEditProfile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          {bio && <p className="mt-4 text-sm">{bio}</p>}
        </div>
      </div>
    </Card>
  );
};