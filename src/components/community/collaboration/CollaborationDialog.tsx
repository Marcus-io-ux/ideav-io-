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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .insert({
          post_id: postId,
          requester_id: currentUserId,
          owner_id: ownerId,
          message: message.trim(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collaboration request sent successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      toast({
        title: "Error",
        description: "Failed to send collaboration request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};