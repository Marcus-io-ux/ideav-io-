import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddIdeaButtonProps {
  onClick: () => void;
}

export const AddIdeaButton = ({ onClick }: AddIdeaButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Plus className="mr-2" size={20} />
      Add Idea
    </Button>
  );
};