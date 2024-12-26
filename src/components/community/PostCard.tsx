import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";
import { CommentList } from "./comments/CommentList";

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  isExpanded: boolean;
  onToggleComments: (postId: string) => void;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostCard = ({
  post,
  currentUserId,
  isExpanded,
  onToggleComments,
  onLike,
  onDelete,
}: PostCardProps) => {
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post.id)}
            className="text-muted-foreground hover:text-destructive self-start md:self-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mb-4">{post.content}</p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-4">
        <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
          <ThumbsUp className="w-4 h-4 mr-2" />
          {post.likes_count || 0}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onToggleComments(post.id)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          {post.comments_count || 0}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <CommentList postId={post.id} />
        </div>
      )}
    </div>
  );
};