import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";

interface PostCardCollaborationProps {
  post: any;
  currentUserId: string | null;
  isCollabDialogOpen: boolean;
  setIsCollabDialogOpen: (value: boolean) => void;
}

export const PostCardCollaboration = ({
  post,
  currentUserId,
  isCollabDialogOpen,
  setIsCollabDialogOpen,
}: PostCardCollaborationProps) => {
  const [collabMessage, setCollabMessage] = useState("");
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCollabRequest = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send collaboration requests",
        variant: "destructive",
      });
      return;
    }

    if (currentUserId === post.user_id) {
      toast({
        title: "Cannot collaborate with yourself",
        description: "You cannot send a collaboration request to your own post",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendCollaborationRequest(post.id, post.user_id, collabMessage);
      setIsCollabDialogOpen(false);
      setCollabMessage("");
      
      toast({
        title: "Request sent successfully",
        description: "Your collaboration request has been sent to the post owner",
      });

      const viewInInbox = window.confirm("Would you like to view your sent request in your inbox?");
      if (viewInInbox) {
        navigate("/inbox");
      }
    } catch (error) {
      toast({
        title: "Error sending request",
        description: "Failed to send collaboration request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isCollabDialogOpen} onOpenChange={setIsCollabDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Collaboration</DialogTitle>
          <DialogDescription>
            Send a message to the author explaining why you'd like to collaborate on this idea.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={collabMessage}
            onChange={(e) => setCollabMessage(e.target.value)}
            placeholder="I'm interested in collaborating because..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCollabDialogOpen(false);
              setCollabMessage("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCollabRequest}
            disabled={!collabMessage.trim() || isLoading}
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};