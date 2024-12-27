import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { CreatePostHeader } from "./create-post/CreatePostHeader";
import { CreatePostChannelSelect } from "./create-post/CreatePostChannelSelect";
import { CreatePostTags } from "./create-post/CreatePostTags";

interface CreatePostProps {
  selectedChannel: string;
  showOnlyMyPosts: boolean;
  onToggleMyPosts: (show: boolean) => void;
}

export const CreatePost = ({ selectedChannel, showOnlyMyPosts, onToggleMyPosts }: CreatePostProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [channel, setChannel] = useState(selectedChannel);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = async () => {
    if (!postTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

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

      // First create the idea
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .insert([
          {
            title: postTitle,
            content: postContent,
            user_id: user.id,
            tags: tags,
            shared_to_community: true
          }
        ])
        .select()
        .single();

      if (ideaError) throw ideaError;

      // Then create the community post
      const { error: postError } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title: postTitle,
            content: postContent,
            channel: channel,
            tags: tags
          }
        ]);

      if (postError) throw postError;

      // Invalidate both queries to refresh the UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
        queryClient.invalidateQueries({ queryKey: ['my-ideas'] })
      ]);

      setPostTitle("");
      setPostContent("");
      setTags([]);
      setTagInput("");
      
      toast({
        title: "Success",
        description: "Your idea has been shared and saved to your ideas!",
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
    <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
      <CreatePostHeader 
        onPost={handlePost} 
        showOnlyMyPosts={showOnlyMyPosts}
        onToggleMyPosts={onToggleMyPosts}
      />

      <div className="space-y-4">
        <CreatePostChannelSelect 
          value={channel}
          onChange={setChannel}
        />

        <div className="space-y-2">
          <Input
            placeholder="Give your idea a title..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="font-medium"
          />

          <Textarea
            placeholder="Share your latest idea, ask a question, or start a discussion..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <CreatePostTags
          tags={tags}
          tagInput={tagInput}
          onTagInput={handleTagInput}
          onTagInputChange={setTagInput}
          onRemoveTag={removeTag}
        />
      </div>
    </div>
  );
};