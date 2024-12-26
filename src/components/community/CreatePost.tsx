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
import { Tag, Hash, MessageSquare, Rss, Github, Twitter, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const channels = [
    { id: "general", icon: Hash, label: "General" },
    { id: "discussions", icon: MessageSquare, label: "Discussions" },
    { id: "announcements", icon: Rss, label: "Announcements" },
    { id: "github", icon: Github, label: "GitHub" },
    { id: "twitter", icon: Twitter, label: "Twitter" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
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

      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title: "New Post",
            content: postContent,
            channel: selectedChannel,
            tags: tags
          }
        ]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      setPostContent("");
      setTags([]);
      setTagInput("");
      toast({
        title: "Success",
        description: "Your idea has been shared! Let's see what the community thinks.",
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
              <p>Click to share your idea with the community and get feedback!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedChannel(channel.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {channel.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};