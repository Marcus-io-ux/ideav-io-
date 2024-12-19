import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface IdeaCardTitleProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  onTitleChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isDraft?: boolean;
}

export const IdeaCardTitle = ({
  title,
  isEditing,
  editedTitle,
  onTitleChange,
  onKeyDown,
  isDraft
}: IdeaCardTitleProps) => {
  return isEditing ? (
    <Input
      value={editedTitle}
      onChange={(e) => onTitleChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="text-xl font-semibold"
      onClick={(e) => e.stopPropagation()}
    />
  ) : (
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      {isDraft && (
        <Badge variant="outline" className="text-muted-foreground">
          Draft
        </Badge>
      )}
    </div>
  );
};