import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface PostCardActionsProps {
  currentUserId: string | null;
  post: any;
  setIsCollabDialogOpen: (value: boolean) => void;
}

export const PostCardActions = ({ currentUserId, post, setIsCollabDialogOpen }: PostCardActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsCollabDialogOpen(true)}
        className="text-primary hover:text-primary/80"
        disabled={post.user_id === currentUserId}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Collaborate
      </Button>
    </div>
  );
};