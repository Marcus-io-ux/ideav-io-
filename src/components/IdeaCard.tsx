import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CardHeaderActions } from "@/components/dashboard/CardHeaderActions";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isFavorite?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const IdeaCard = ({ 
  id,
  title, 
  content, 
  createdAt, 
  isFavorite = false,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite 
}: IdeaCardProps) => {
  const { toast } = useToast();

  const handleToggleFavorite = () => {
    onToggleFavorite?.(id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Idea removed from your favorites" : "Idea added to your favorites",
    });
  };

  const handleDelete = () => {
    onDelete?.(id);
    toast({
      title: "Idea moved to trash",
      description: "You can restore it from the trash tab",
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleCardClick = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "w-full hover:shadow-lg transition-shadow duration-300 animate-fade-in group bg-white/50 backdrop-blur-sm border border-primary/10",
        isSelected && "border-primary ring-2 ring-primary/20",
        onEdit && "cursor-pointer hover:bg-primary/5"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-primary">
            {title}
          </CardTitle>
          <CardHeaderActions
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onDelete={onDelete ? handleDelete : undefined}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(id)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="text-secondary-foreground/80">
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};