import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { DirectMessageDialog } from "../DirectMessageDialog";

interface MessageButtonProps {
  currentUserId: string | null;
  ownerId: string;
  authorName: string;
}

export const MessageButton = ({ currentUserId, ownerId, authorName }: MessageButtonProps) => {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  if (!currentUserId || currentUserId === ownerId) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsMessageDialogOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Message</span>
      </Button>

      <DirectMessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        recipientId={ownerId}
        recipientName={authorName}
      />
    </>
  );
};