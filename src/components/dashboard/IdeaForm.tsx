import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X, Tag } from "lucide-react";
import { IdeaFormData } from "@/types/idea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save ideas",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('ideas')
        .insert([
          {
            title: idea.title,
            content: idea.content,
            tags: idea.tags,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });

      toast({
        title: "Success",
        description: "Your idea has been saved",
      });

      onSubmit();
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: "Error",
        description: "Failed to save idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onIdeaChange('tags', tags);
  };

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
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          value={idea.tags.join(', ')}
          onChange={handleTagsChange}
        />
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
        <Button onClick={handleSubmit} className="gap-2">
          <Tag className="h-4 w-4" />
          Save Idea
        </Button>
      </DialogFooter>
    </div>
  );
};