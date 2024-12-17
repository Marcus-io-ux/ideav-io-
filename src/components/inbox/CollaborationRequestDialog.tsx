import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";

interface CollaborationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
}

export const CollaborationRequestDialog = ({
  open,
  onOpenChange,
  recipientId,
  recipientName,
}: CollaborationRequestDialogProps) => {
  const [message, setMessage] = useState(
    `I'd love to collaborate on your idea. Let's work together!`
  );
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
  const { toast } = useToast();

  const handleSendRequest = async () => {
    try {
      await sendCollaborationRequest("", recipientId, message);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send collaboration request",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collaborate with {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Write your collaboration message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendRequest} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};