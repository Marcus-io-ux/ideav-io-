import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FollowersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
}

export function FollowersDialog({
  isOpen,
  onClose,
  userId,
  type,
}: FollowersDialogProps) {
  const { data: users } = useQuery({
    queryKey: ["followers", type, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_follows")
        .select(`
          ${type === "followers" ? "follower:follower_id(*)" : "following:following_id(*)"},
          profiles!user_follows_${type === "followers" ? "follower" : "following"}_id_fkey(*)
        `)
        .eq(type === "followers" ? "following_id" : "follower_id", userId);

      return data || [];
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {users?.map((user: any) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profiles?.avatar_url} />
                <AvatarFallback>
                  {user.profiles?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.profiles?.username}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}