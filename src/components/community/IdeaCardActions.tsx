import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageButton } from "./messaging/MessageButton";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
  const { toast } = useToast();

  const handleCollaborate = async () => {
    await sendCollaborationRequest(postId, ownerId, message);
    setMessage("");
    setIsCollaborateOpen(false);
  };

  const handleToggleFavorite = async () => {
    if (!currentUserId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to favorite posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: currentUserId, idea_id: postId });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Post has been added to your favorites",
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .match({ user_id: currentUserId, idea_id: postId });

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Post has been removed from your favorites",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
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
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isFavorite ? "text-yellow-500" : ""}`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          <span>Favorite</span>
        </Button>
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