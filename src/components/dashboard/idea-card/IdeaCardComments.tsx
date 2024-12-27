import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface IdeaCardCommentsProps {
  ideaId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const IdeaCardComments = ({
  ideaId,
  comments,
  onCommentAdded
}: IdeaCardCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment on ideas",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("idea_comments")
        .insert([
          {
            idea_id: ideaId,
            content: newComment.trim(),
          },
        ]);

      if (error) throw error;

      setNewComment("");
      onCommentAdded();
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px]"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim()}
        >
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
            <Avatar>
              <AvatarImage src={comment.profiles.avatar_url} />
              <AvatarFallback>
                {comment.profiles.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{comment.profiles.username}</p>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};