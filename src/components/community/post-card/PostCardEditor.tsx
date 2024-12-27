import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PostCardEditorProps {
  editedTitle: string;
  editedContent: string;
  editedTags: string[];
  setEditedTitle: (value: string) => void;
  setEditedContent: (value: string) => void;
  handleTagsChange: (value: string) => void;
  handleSaveEdit: () => void;
  setIsEditing: (value: boolean) => void;
}

export const PostCardEditor = ({
  editedTitle,
  editedContent,
  editedTags,
  setEditedTitle,
  setEditedContent,
  handleTagsChange,
  handleSaveEdit,
  setIsEditing,
}: PostCardEditorProps) => {
  return (
    <div className="space-y-4">
      <Input
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Edit title..."
        className="font-semibold text-lg"
      />
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Edit content..."
        className="min-h-[100px]"
      />
      <Input
        value={editedTags.join(', ')}
        onChange={(e) => handleTagsChange(e.target.value)}
        placeholder="Tags (comma-separated)"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button onClick={handleSaveEdit}>Save</Button>
      </div>
    </div>
  );
};