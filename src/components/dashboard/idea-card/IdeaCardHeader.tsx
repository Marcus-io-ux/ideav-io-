import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface IdeaCardHeaderProps {
  title: string;
  createdAt: Date;
  isSelected?: boolean;
  isEditing: boolean;
  editedTitle: string;
  onSelect?: (id: string) => void;
  onTitleChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  id: string;
  isDraft?: boolean;
}

export const IdeaCardHeader = ({
  title,
  createdAt,
  isSelected,
  isEditing,
  editedTitle,
  onSelect,
  onTitleChange,
  onKeyDown,
  id,
  isDraft,
}: IdeaCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2 flex-1">
        {isEditing ? (
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
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {format(createdAt, 'MMM d, yyyy')}
        </span>
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
};