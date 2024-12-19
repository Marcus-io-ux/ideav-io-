import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X, Tag, ImagePlus } from "lucide-react";
import { IdeaFormData } from "@/types/idea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('idea-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('idea-images')
        .getPublicUrl(filePath);

      onIdeaChange('images', [...(idea.images || []), publicUrl]);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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
            images: idea.images,
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
      <div className="space-y-2">
        <Label htmlFor="image">Add Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="cursor-pointer"
        />
        {idea.images && idea.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {idea.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Idea image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}
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
        <Button onClick={handleSubmit} className="gap-2" disabled={uploading}>
          <Tag className="h-4 w-4" />
          Save Idea
        </Button>
      </DialogFooter>
    </div>
  );
};