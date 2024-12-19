import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface IdeaCardTagsProps {
  tags: string[];
  isEditing?: boolean;
  onTagsChange?: (value: string) => void;
}

export const IdeaCardTags = ({ tags, isEditing, onTagsChange }: IdeaCardTagsProps) => {
  if (!tags || tags.length === 0 && !isEditing) return null;

  if (isEditing) {
    return (
      <Input
        placeholder="Enter tags separated by commas"
        value={tags.join(', ')}
        onChange={(e) => onTagsChange?.(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mt-2"
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-1 px-2 py-1",
            "bg-secondary/50 text-secondary-foreground",
            "rounded-full text-sm"
          )}
        >
          <Tag className="h-3 w-3" />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
};