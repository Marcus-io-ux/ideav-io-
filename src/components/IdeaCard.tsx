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
import { IdeaCardFooter } from "@/components/dashboard/idea-card/IdeaCardFooter";
import { IdeaCardTags } from "@/components/dashboard/idea-card/IdeaCardTags";

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
  const [editedTags, setEditedTags] = useState<string[]>(tags);

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

  const handleTagsChange = (value: string) => {
    const newTags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedTags(newTags);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-2">
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
          <div className="flex items-center gap-2 md:gap-4">
            <IdeaCardMetadata createdAt={createdAt} />
            <IdeaCardSelection
              isSelected={isSelected}
              onSelect={onSelect}
              id={id}
            />
          </div>
        </div>
        <IdeaCardTags 
          tags={isEditing ? editedTags : tags}
          isEditing={isEditing}
          onTagsChange={handleTagsChange}
        />
      </CardHeader>
      <CardContent className="relative pb-16">
        <IdeaCardContent
          content={content}
          isEditing={isEditing}
          editedContent={editedContent}
          onContentChange={setEditedContent}
          onKeyDown={handleKeyDown}
        />
        
        <IdeaCardFooter
          isCurrentlyFavorite={isCurrentlyFavorite}
          onToggleFavorite={handleToggleFavorite}
          onDelete={onDelete ? handleDelete : undefined}
        />
        
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
      </CardContent>
    </Card>
  );
};