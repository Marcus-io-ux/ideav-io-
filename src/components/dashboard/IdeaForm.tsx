import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, X } from "lucide-react";

export interface IdeaFormData {
  title: string;
  content: string;
  channel?: string;
  category?: string;
  feedbackType?: string;
  shareToCommunity?: boolean;
  tags?: string[];
  images?: string[];
}

interface IdeaFormProps {
  initialData?: IdeaFormData;
  onSubmit: (data: IdeaFormData) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
}

export const IdeaForm = ({ initialData, onSubmit, onCancel, onSaveDraft }: IdeaFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('idea-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('idea-images')
        .getPublicUrl(filePath);

      setImages(prev => [...prev, publicUrl]);
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

  const removeImage = (imageUrl: string) => {
    setImages(prev => prev.filter(url => url !== imageUrl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      content,
      images,
      ...initialData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter idea title..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your idea..."
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Idea image ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Label
            htmlFor="image-upload"
            className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-md flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            <Image className="h-8 w-8 text-muted-foreground" />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {onSaveDraft && (
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            Save as Draft
          </Button>
        )}
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Save Idea"}
        </Button>
      </div>
    </form>
  );
};