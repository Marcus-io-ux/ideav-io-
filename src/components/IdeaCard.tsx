import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CardHeaderActions } from "@/components/dashboard/CardHeaderActions";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsCurrentlyFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

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
    toast({
      title: "Idea moved to trash",
      description: "You can restore it from the trash tab",
    });
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          title: editedTitle,
          content: editedContent,
        })
        .eq('id', id);

      if (error) throw error;

      setIsEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      
      toast({
        title: "Success",
        description: "Your idea has been updated",
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
    }
  };

  return (
    <Card 
      className={cn(
        "w-full transition-shadow duration-300 animate-fade-in group relative dark:bg-card dark:text-card-foreground dark:border-border",
        "hover:shadow-lg dark:hover:shadow-primary/5",
        isSelected && "border-primary dark:border-primary"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-xl font-semibold"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <CardTitle 
              className="text-xl font-semibold cursor-pointer"
              onClick={handleStartEdit}
            >
              {title}
            </CardTitle>
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
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px]"
            onClick={(e) => e.stopPropagation()}
            onBlur={handleSaveEdit}
          />
        ) : (
          <p 
            className="cursor-pointer"
            onClick={handleStartEdit}
          >
            {content}
          </p>
        )}
        <div className="absolute bottom-4 right-4">
          <CardHeaderActions
            isFavorite={isCurrentlyFavorite}
            onToggleFavorite={handleToggleFavorite}
            onDelete={onDelete ? handleDelete : undefined}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};