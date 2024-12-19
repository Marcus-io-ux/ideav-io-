import { Tag } from "lucide-react";

interface IdeaCardTagsProps {
  tags: string[];
}

export const IdeaCardTags = ({ tags }: IdeaCardTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
        >
          <Tag className="h-3 w-3" />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
};