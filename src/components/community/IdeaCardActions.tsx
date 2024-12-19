import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MessageButton } from "./messaging/MessageButton";
import { supabase } from "@/integrations/supabase/client";
import { CollaborateButton } from "./collaboration/CollaborateButton";

interface IdeaCardActionsProps {
  postId: string;
  ownerId: string;
  isLiked: boolean;
  likeCount: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  currentUserId: string | null;
  authorName: string;
}

export const IdeaCardActions = ({
  postId,
  ownerId,
  isLiked,
  likeCount,
  comments,
  onLike,
  onComment,
  currentUserId,
  authorName,
}: IdeaCardActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUserId) return;
      
      const { data } = await supabase
        .from('user_follows')
        .select()
        .eq('follower_id', currentUserId)
        .eq('following_id', ownerId)
        .single();
      
      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [currentUserId, ownerId]);

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', ownerId);
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: currentUserId,
            following_id: ownerId,
          });
      }

      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? `You unfollowed ${authorName}` : `You are now following ${authorName}`,
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
        onClick={onLike}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-2" onClick={onComment}>
        <MessageCircle className="h-4 w-4" />
        <span>{comments}</span>
      </Button>
      
      <CollaborateButton
        currentUserId={currentUserId}
        ownerId={ownerId}
        postId={postId}
      />

      {currentUserId && currentUserId !== ownerId && (
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isFollowing ? "text-primary" : ""}`}
          onClick={handleFollow}
        >
          <UserPlus2 className="h-4 w-4" />
          <span>{isFollowing ? "Following" : "Follow"}</span>
        </Button>
      )}
      
      <MessageButton
        currentUserId={currentUserId}
        ownerId={ownerId}
        authorName={authorName}
      />
    </div>
  );
};