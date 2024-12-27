import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostCardCommentInputProps {
  postId: string;
  onCommentAdded: () => void;
}

export const PostCardCommentInput = ({ postId, onCommentAdded }: PostCardCommentInputProps) => {
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
          description: "Please sign in to comment on posts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("community_comments")
        .insert([
          {
            post_id: postId,
            user_id: session.user.id,
            content: newComment.trim(),
          },
        ]);

      if (error) throw error;

      setNewComment("");
      onCommentAdded();
      
      toast({
        title: "Success",
        description: "Your comment has been posted.",
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
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[40px] flex-1"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim()}
          size="sm"
        >
          Post
        </Button>
      </div>
    </form>
  );
};