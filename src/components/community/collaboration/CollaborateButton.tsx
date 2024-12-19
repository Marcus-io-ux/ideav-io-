import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CollaborationDialog } from "./CollaborationDialog";

interface CollaborateButtonProps {
  currentUserId: string | null;
  ownerId: string;
  postId: string;
}

export const CollaborateButton = ({
  currentUserId,
  ownerId,
  postId,
}: CollaborateButtonProps) => {
  const [isCollaborateOpen, setIsCollaborateOpen] = useState(false);

  if (!currentUserId || currentUserId === ownerId) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsCollaborateOpen(true)}
      >
        <UserPlus className="h-4 w-4" />
        <span>Collaborate</span>
      </Button>

      {isCollaborateOpen && (
        <CollaborationDialog
          isOpen={isCollaborateOpen}
          onClose={() => setIsCollaborateOpen(false)}
          postId={postId}
          ownerId={ownerId}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};