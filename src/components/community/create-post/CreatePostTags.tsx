import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CreatePostTagsProps {
  tags: string[];
  tagInput: string;
  onTagInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagInputChange: (value: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const CreatePostTags = ({
  tags,
  tagInput,
  onTagInput,
  onTagInputChange,
  onRemoveTag,
}: CreatePostTagsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Add tags (press Enter or comma to add)"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={onTagInput}
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
              onClick={() => onRemoveTag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};