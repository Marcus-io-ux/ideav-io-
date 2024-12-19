import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus, UserPlus2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";
import { useToast } from "@/hooks/use-toast";
import { MessageButton } from "./messaging/MessageButton";
import { supabase } from "@/integrations/supabase/client";

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
  const [isCollaborateOpen, setIsCollaborateOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
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

  const handleCollaborate = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send collaboration requests",
        variant: "destructive",
      });
      return;
    }

    await sendCollaborationRequest(postId, ownerId, message);
    
    // Send notification message
    await supabase.from("messages").insert({
      sender_id: currentUserId,
      recipient_id: ownerId,
      content: `New collaboration request for your idea: ${message}`,
      is_read: false,
    });

    setMessage("");
    setIsCollaborateOpen(false);
  };

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
    <>
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
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setIsCollaborateOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Collaborate</span>
        </Button>
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

      <Dialog open={isCollaborateOpen} onOpenChange={setIsCollaborateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Collaborate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Write a message to the idea owner explaining why you'd like to collaborate..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCollaborateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCollaborate}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};