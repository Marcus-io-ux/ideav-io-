import { Textarea } from "@/components/ui/textarea";
import { CardHeaderActions } from "@/components/dashboard/CardHeaderActions";

interface IdeaCardContentProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onContentChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isCurrentlyFavorite: boolean;
  onToggleFavorite: () => void;
}

export const IdeaCardContent = ({
  content,
  isEditing,
  editedContent,
  onContentChange,
  onKeyDown,
  isCurrentlyFavorite,
  onToggleFavorite,
}: IdeaCardContentProps) => {
  return (
    <div className="text-muted-foreground relative">
      {isEditing ? (
        <Textarea
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[100px]"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p>{content}</p>
      )}
      <div className="absolute bottom-4 right-4">
        <CardHeaderActions
          isFavorite={isCurrentlyFavorite}
          onToggleFavorite={onToggleFavorite}
          size="sm"
        />
      </div>
    </div>
  );
};