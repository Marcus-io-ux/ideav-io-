import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X, Tag } from "lucide-react";
import { IdeaFormData } from "@/types/idea";

interface IdeaFormProps {
  idea: IdeaFormData;
  onIdeaChange: (field: keyof IdeaFormData, value: any) => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export const IdeaForm = ({
  idea,
  onIdeaChange,
  onCancel,
  onSaveDraft,
  onSubmit,
}: IdeaFormProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What's your big idea?"
          value={idea.title}
          onChange={(e) => onIdeaChange("title", e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          placeholder="Add details or context to your idea..."
          value={idea.content}
          onChange={(e) => onIdeaChange("content", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <Select 
            value={idea.channel} 
            onValueChange={(value) => onIdeaChange("channel", value)}
          >
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
          <Select 
            value={idea.category} 
            onValueChange={(value) => onIdeaChange("category", value)}
          >
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
        <Select 
          value={idea.feedbackType} 
          onValueChange={(value) => onIdeaChange("feedbackType", value)}
        >
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
      <div className="flex items-center space-x-2">
        <Switch
          id="share-community"
          checked={idea.shareToCommunity}
          onCheckedChange={(checked) => onIdeaChange("shareToCommunity", checked)}
        />
        <Label htmlFor="share-community">Share with Community</Label>
      </div>
      <DialogFooter className="flex justify-between sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
        <Button onClick={onSubmit} className="gap-2">
          <Tag className="h-4 w-4" />
          Save Idea
        </Button>
      </DialogFooter>
    </div>
  );
};