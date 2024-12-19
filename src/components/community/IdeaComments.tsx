import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

interface IdeaCommentsProps {
  postId: string;
}

export const IdeaComments = ({ postId }: IdeaCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("community_comments")
      .select(`
        id,
        content,
        created_at,
        user:profiles(username, avatar_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("community_comments").insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewComment("");
    fetchComments();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatar_url} />
              <AvatarFallback>{comment.user.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.user.username}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button onClick={handleSubmitComment}>Post</Button>
      </div>
    </div>
  );
};