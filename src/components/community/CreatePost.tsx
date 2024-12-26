import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreatePostProps {
  selectedChannel: string;
}

export const CreatePost = ({ selectedChannel }: CreatePostProps) => {
  const [postContent, setPostContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [channel, setChannel] = useState(selectedChannel);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const channels = [
    { id: "general", label: "General Ideas" },
    { id: "business", label: "Startups & Business" },
    { id: "tech", label: "Tech & Innovation" },
    { id: "lifestyle", label: "Lifestyle & Wellness" },
    { id: "design", label: "Design & Creativity" },
    { id: "apps", label: "Apps & Tech Tools" },
  ];

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
            title: "Community Post",
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
            title: "New Post",
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">What's on your mind?</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handlePost} 
                className="shadow-sm hover:shadow-md transition-all duration-300"
              >
                Share Your Idea
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to share your idea with the community and save it to your ideas!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((ch) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {ch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Share your latest idea, ask a question, or start a discussion..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="mb-4 min-h-[100px]"
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Add tags (press Enter or comma to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              className="flex-1"
            />
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};