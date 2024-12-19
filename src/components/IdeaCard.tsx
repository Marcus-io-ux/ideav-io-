import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IdeaCardHeader } from "@/components/dashboard/idea-card/IdeaCardHeader";
import { IdeaCardContent } from "@/components/dashboard/idea-card/IdeaCardContent";
import { IdeaCardActions } from "@/components/dashboard/idea-card/IdeaCardActions";
import { IdeaCardMetadata } from "@/components/dashboard/idea-card/IdeaCardMetadata";
import { IdeaCardTitle } from "@/components/dashboard/idea-card/IdeaCardTitle";
import { IdeaCardSelection } from "@/components/dashboard/idea-card/IdeaCardSelection";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isFavorite?: boolean;
  isSelected?: boolean;
  isDraft?: boolean;
  tags?: string[];
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
  isDraft = false,
  tags = [],
  onSelect,
  onDelete,
  onToggleFavorite 
}: IdeaCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTags, setEditedTags] = useState(tags);

  useEffect(() => {
    setIsCurrentlyFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggleFavorite = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to favorite ideas",
          variant: "destructive",
        });
        return;
      }

      if (!isCurrentlyFavorite) {
        const { data: existingFavorite } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', session.user.id)
          .eq('idea_id', id)
          .eq('item_type', 'idea')
          .maybeSingle();

        if (existingFavorite) {
          setIsCurrentlyFavorite(true);
          onToggleFavorite?.(id);
          return;
        }

        const { error } = await supabase
          .from('favorites')
          .insert([
            { user_id: session.user.id, idea_id: id, item_type: 'idea' }
          ]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: session.user.id, idea_id: id, item_type: 'idea' });

        if (error) throw error;
      }

      setIsCurrentlyFavorite(!isCurrentlyFavorite);
      onToggleFavorite?.(id);
      
      toast({
        title: isCurrentlyFavorite ? "Removed from favorites" : "Added to favorites",
        description: isCurrentlyFavorite ? "Idea removed from your favorites" : "Idea added to your favorites",
      });
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          title: editedTitle,
          content: editedContent,
          tags: editedTags,
          is_draft: isDraft
        })
        .eq('id', id);

      if (error) throw error;

      setIsEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      
      toast({
        title: "Success",
        description: isDraft ? "Draft saved successfully" : "Your idea has been updated",
      });
    } catch (error) {
      console.error('Error updating idea:', error);
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
      setEditedContent(content);
      setEditedTags(tags);
    }
  };

  return (
    <Card 
      className={cn(
        "w-full transition-shadow duration-300 animate-fade-in group relative dark:bg-card dark:text-card-foreground dark:border-border cursor-pointer",
        "hover:shadow-lg dark:hover:shadow-primary/5",
        isSelected && "border-primary dark:border-primary",
        isDraft && "border-dashed"
      )}
      onClick={() => setIsEditing(true)}
    >
      <CardHeader>
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2 flex-1">
            <IdeaCardTitle
              title={title}
              isEditing={isEditing}
              editedTitle={editedTitle}
              onTitleChange={setEditedTitle}
              onKeyDown={handleKeyDown}
              isDraft={isDraft}
            />
          </div>
          <div className="flex items-center gap-4">
            <IdeaCardMetadata createdAt={createdAt} />
            <IdeaCardSelection
              isSelected={isSelected}
              onSelect={onSelect}
              id={id}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pb-16">
        <IdeaCardContent
          content={content}
          isEditing={isEditing}
          editedContent={editedContent}
          onContentChange={setEditedContent}
          onKeyDown={handleKeyDown}
          tags={editedTags}
          onTagsChange={setEditedTags}
        />
        
        <div className="absolute bottom-0 right-0 left-0 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
            >
              <Heart className={cn("h-4 w-4", isCurrentlyFavorite && "fill-current text-primary")} />
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
                    <Trash2 className="h-4 w-4" />
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
                        handleDelete();
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
          
          {isEditing && (
            <IdeaCardActions
              isEditing={isEditing}
              onSave={handleSaveEdit}
              onCancel={() => {
                setIsEditing(false);
                setEditedTitle(title);
                setEditedContent(content);
                setEditedTags(tags);
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};