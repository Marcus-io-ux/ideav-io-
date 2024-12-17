import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus, MessageSquare } from "lucide-react";
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
import { DirectMessageDialog } from "./DirectMessageDialog";

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
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();

  const handleCollaborate = async () => {
    await sendCollaborationRequest(postId, ownerId, message);
    setMessage("");
    setIsCollaborateOpen(false);
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
            className="gap-2"
            onClick={() => setIsMessageDialogOpen(true)}
            title="Send direct message"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Message</span>
          </Button>
        )}
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

      <DirectMessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        recipientId={ownerId}
        recipientName={authorName}
      />
    </>
  );
};