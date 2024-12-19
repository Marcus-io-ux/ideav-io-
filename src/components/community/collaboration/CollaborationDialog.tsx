import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";

interface CollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  ownerId: string;
  currentUserId: string;
}

export const CollaborationDialog = ({
  isOpen,
  onClose,
  postId,
  ownerId,
  currentUserId,
}: CollaborationDialogProps) => {
  const [message, setMessage] = useState("");
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();

  const handleCollaborate = async () => {
    if (!message.trim()) return;
    
    await sendCollaborationRequest(postId, ownerId, message);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose}>
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
  );
};