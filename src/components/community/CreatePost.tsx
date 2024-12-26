import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title: "New Post",
            content: postContent,
            channel: 'general'
          }
        ]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      setPostContent("");
      toast({
        title: "Success",
        description: "Your idea has been shared with the community!",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">What's on your mind?</h2>
        <Button onClick={handlePost} className="shadow-sm hover:shadow-md transition-all duration-300">
          + Share your idea
        </Button>
      </div>
      <Textarea
        placeholder="Share your latest idea, ask a question, or start a discussion..."
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        className="mb-4"
      />
    </div>
  );
};