import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdeaCardContentProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onContentChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const IdeaCardContent = ({
  content,
  isEditing,
  editedContent,
  onContentChange,
  onKeyDown,
  tags,
  onTagsChange,
}: IdeaCardContentProps) => {
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => onContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-[100px]"
            onClick={(e) => e.stopPropagation()}
          />
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};