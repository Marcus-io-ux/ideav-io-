import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface IdeaCardActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const IdeaCardActions = ({ isEditing, onSave, onCancel }: IdeaCardActionsProps) => {
  if (!isEditing) return null;

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel
      </Button>
      <Button
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
      >
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
    </div>
  );
};