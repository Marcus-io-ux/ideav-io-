import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface FollowersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

export function FollowersDialog({
  isOpen,
  onClose,
  userId,
  type,
}: FollowersDialogProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_follows")
          .select(`
            ${type === "followers" 
              ? "follower:profiles!user_follows_follower_id_fkey(*)" 
              : "following:profiles!user_follows_following_id_fkey(*)"
            }
          `)
          .eq(type === "followers" ? "following_id" : "follower_id", userId);

        if (error) throw error;

        const profiles = data?.map(item => 
          type === "followers" 
            ? (item.follower as Profile)
            : (item.following as Profile)
        ) || [];

        setUsers(profiles);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No {type} yet
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}