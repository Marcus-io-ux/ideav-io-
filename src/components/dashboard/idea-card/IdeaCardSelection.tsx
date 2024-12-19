import { Checkbox } from "@/components/ui/checkbox";

interface IdeaCardSelectionProps {
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  id: string;
}

export const IdeaCardSelection = ({ isSelected, onSelect, id }: IdeaCardSelectionProps) => {
  if (!onSelect) return null;
  
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={() => onSelect(id)}
      onClick={(e) => e.stopPropagation()}
    />
  );
};