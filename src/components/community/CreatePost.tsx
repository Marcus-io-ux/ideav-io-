import { useState } from "react";
import { CreatePostHeader } from "./create-post/CreatePostHeader";
import { CreatePostTags } from "./create-post/CreatePostTags";
import { CreatePostChannelSelect } from "./create-post/CreatePostChannelSelect";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreatePostProps {
  selectedChannel: string;
  showOnlyMyPosts: boolean;
  onToggleMyPosts: (show: boolean) => void;
}

export const CreatePost = ({ selectedChannel, showOnlyMyPosts, onToggleMyPosts }: CreatePostProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (!title.trim() || !content.trim()) {
        toast({
          title: "Missing fields",
          description: "Please fill in both title and content",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            title,
            content,
            tags,
            channel: selectedChannel,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      // Update ideas table to mark as shared
      await supabase
        .from('ideas')
        .update({ shared_to_community: true })
        .match({
          title,
          content,
          user_id: user.id,
        });

      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");

      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });

      toast({
        title: "Success",
        description: "Your idea has been shared with the community!",
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share your idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <CreatePostHeader onPost={handlePost} />
        <div className="flex items-center space-x-2">
          <Switch
            id="show-my-posts"
            checked={showOnlyMyPosts}
            onCheckedChange={onToggleMyPosts}
          />
          <Label htmlFor="show-my-posts">Show only my shared ideas</Label>
        </div>
      </div>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />
      
      <Textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />

      <CreatePostTags
        tags={tags}
        tagInput={tagInput}
        onTagInput={handleTagInput}
        onTagInputChange={setTagInput}
        onRemoveTag={removeTag}
      />

      <CreatePostChannelSelect
        selectedChannel={selectedChannel}
      />
    </div>
  );
};