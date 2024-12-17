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

  return (
    <Card 
      className={cn(
        "w-full hover:shadow-lg transition-shadow duration-300 animate-fade-in",
        isSelected && "border-primary"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardHeaderActions
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onEdit={onEdit ? () => onEdit(id) : undefined}
            onDelete={onDelete ? handleDelete : undefined}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(id)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{content}</p>
      </CardContent>
    </Card>
  );
};