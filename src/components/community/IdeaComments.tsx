import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  created_at: string;
}

interface CommentResponse {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface IdeaCommentsProps {
  postId: string;
  onCommentAdded: () => void;
}

export const IdeaComments = ({
  postId,
  onCommentAdded
}: IdeaCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        user:profiles!community_comments_user_id_fkey (
          username,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    if (data) {
      const typedData = data as CommentResponse[];
      setComments(typedData.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        author: {
          name: comment.user?.username || 'Anonymous',
          avatar: comment.user?.avatar_url || undefined
        }
      })));
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel('public:community_comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('community_comments')
        .insert([
          {
            content: newComment,
            post_id: postId,
            user_id: session.user.id
          }
        ]);

      if (error) throw error;

      setNewComment("");
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="max-h-48 overflow-y-auto space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{comment.author.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1 ml-8">{comment.content}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          className="flex-1"
        />
        <Button onClick={handleAddComment} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};