import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface PostCardHeaderProps {
  post: any;
  currentUserId: string | null;
  onDelete: (postId: string) => void;
  setIsEditing: (value: boolean) => void;
}

export const PostCardHeader = ({ post, currentUserId, onDelete, setIsEditing }: PostCardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={post.profiles?.avatar_url} />
          <AvatarFallback>
            {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.profiles?.username || 'Anonymous'}</h3>
          <p className="text-sm text-muted-foreground">
            Posted {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      {post.user_id === currentUserId && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};