import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus, Star } from "lucide-react";
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
import { MessageButton } from "./messaging/MessageButton";
import { toggleFavorite } from "@/utils/favorites";

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
  isFavorite: boolean;
  onFavoriteChange: (newState: boolean) => void;
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
  isFavorite,
  onFavoriteChange,
}: IdeaCardActionsProps) => {
  const [isCollaborateOpen, setIsCollaborateOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
  const { toast } = useToast();

  const handleCollaborate = async () => {
    await sendCollaborationRequest(postId, ownerId, message);
    setMessage("");
    setIsCollaborateOpen(false);
  };

  const handleToggleFavorite = async () => {
    const newState = await toggleFavorite(postId, 'community_post', currentUserId, isFavorite);
    onFavoriteChange(newState);
    
    toast({
      title: newState ? "Added to favorites" : "Removed from favorites",
      description: `Post has been ${newState ? 'added to' : 'removed from'} your favorites`,
    });
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
          className={`gap-2 ${isFavorite ? "text-yellow-500" : ""}`}
          onClick={handleToggleFavorite}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
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