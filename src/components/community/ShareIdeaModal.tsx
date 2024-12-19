import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tag, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShareIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (idea: {
    title: string;
    content: string;
    channel: string;
    feedbackType: string;
    isCollaborative: boolean;
    tags: string[];
  }) => void;
}

export const ShareIdeaModal = ({ isOpen, onClose, onSubmit }: ShareIdeaModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [isCollaborative, setIsCollaborative] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your idea",
        variant: "destructive",
      });
      return;
    }

    if (!channel) {
      toast({
        title: "Channel Required",
        description: "Please select a channel for your idea",
        variant: "destructive",
      });
      return;
    }

    // Create tags array with feedback type
    const tags = feedbackType ? [feedbackType] : [];

    onSubmit({
      title,
      content,
      channel,
      feedbackType,
      isCollaborative,
      tags,
    });

    setTitle("");
    setContent("");
    setChannel("");
    setFeedbackType("");
    setIsCollaborative(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Share Your Idea</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your big idea?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              placeholder="Add details or context to your idea..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-full bg-background border-2">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="general-ideas">General Ideas</SelectItem>
                  <SelectItem value="startups-business">Startups & Business</SelectItem>
                  <SelectItem value="tech-innovation">Tech & Innovation</SelectItem>
                  <SelectItem value="lifestyle-wellness">Lifestyle & Wellness</SelectItem>
                  <SelectItem value="design-creativity">Design & Creativity</SelectItem>
                  <SelectItem value="apps-tech-tools">Apps & Tech Tools</SelectItem>
                  <SelectItem value="user-feedback">User Feedback</SelectItem>
                  <SelectItem value="collaboration">Collaboration Corner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="w-full bg-background border-2">
                  <SelectValue placeholder="What feedback?" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="improvement">Ideas for improvement</SelectItem>
                  <SelectItem value="collaboration">Looking for collaborators</SelectItem>
                  <SelectItem value="feedback">General feedback</SelectItem>
                  <SelectItem value="feature">Feature request</SelectItem>
                  <SelectItem value="bug">Bug report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Saved as draft",
                  description: "Your idea has been saved as a draft",
                });
              }}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
          </div>
          <Button onClick={handleSubmit} className="gap-2">
            <Tag className="h-4 w-4" />
            Post to Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};