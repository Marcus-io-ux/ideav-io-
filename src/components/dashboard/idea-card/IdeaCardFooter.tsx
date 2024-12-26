import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface IdeaCardFooterProps {
  isCurrentlyFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete?: () => void;
}

export const IdeaCardFooter = ({
  isCurrentlyFavorite,
  onToggleFavorite,
  onDelete,
}: IdeaCardFooterProps) => {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          isCurrentlyFavorite ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Star className={cn("h-4 w-4", isCurrentlyFavorite && "fill-current")} />
      </Button>
      
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Idea</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this idea? This action can be undone from the trash.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};