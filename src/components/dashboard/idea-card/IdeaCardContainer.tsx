import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IdeaCardContainerProps {
  isSelected: boolean;
  isDraft: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const IdeaCardContainer = ({
  isSelected,
  isDraft,
  onClick,
  children,
}: IdeaCardContainerProps) => {
  return (
    <Card 
      className={cn(
        "w-full transition-shadow duration-300 animate-fade-in group relative dark:bg-card dark:text-card-foreground dark:border-border cursor-pointer",
        "hover:shadow-lg dark:hover:shadow-primary/5",
        isSelected && "border-primary dark:border-primary",
        isDraft && "border-dashed"
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};