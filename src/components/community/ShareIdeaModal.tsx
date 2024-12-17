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
    category: string;
    feedbackType: string;
    channel: string;
    isCollaborative: boolean;
  }) => void;
}

export const ShareIdeaModal = ({ isOpen, onClose, onSubmit }: ShareIdeaModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [channel, setChannel] = useState("");
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

    onSubmit({
      title,
      content,
      category,
      feedbackType,
      channel,
      isCollaborative,
    });

    // Reset form
    setTitle("");
    setContent("");
    setCategory("");
    setFeedbackType("");
    setChannel("");
    setIsCollaborative(false);
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedbackType">Feedback Type</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue placeholder="What feedback?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="improvement">Ideas for improvement</SelectItem>
                <SelectItem value="collaboration">Looking for collaborators</SelectItem>
                <SelectItem value="feedback">General feedback</SelectItem>
              </SelectContent>
            </Select>
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