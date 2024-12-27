import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseIdeaCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  isDraft: boolean;
  sharedToCommunity?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const useIdeaCard = ({
  id,
  title,
  content,
  tags,
  isFavorite,
  isDraft,
  sharedToCommunity = false,
  onToggleFavorite,
}: UseIdeaCardProps) => {
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

  const handleSaveEdit = async () => {
    try {
      // First update the idea
      const { error: ideaError } = await supabase
        .from('ideas')
        .update({
          title: editedTitle,
          content: editedContent,
          tags: editedTags,
          is_draft: isDraft
        })
        .eq('id', id);

      if (ideaError) throw ideaError;

      // If the idea is shared to community, update the community post
      if (sharedToCommunity) {
        const { error: communityError } = await supabase
          .from('community_posts')
          .update({
            title: editedTitle,
            content: editedContent,
            tags: editedTags,
          })
          .match({
            title: title,
            content: content,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (communityError) {
          console.error('Error updating community post:', communityError);
          toast({
            title: "Warning",
            description: "Your idea was updated but there was an error updating the community post.",
            variant: "destructive",
          });
        }
      }

      setIsEditing(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-ideas"] }),
        queryClient.invalidateQueries({ queryKey: ["community-posts"] })
      ]);
      
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

  return {
    isCurrentlyFavorite,
    isEditing,
    editedTitle,
    editedContent,
    editedTags,
    setIsEditing,
    setEditedTitle,
    setEditedContent,
    setEditedTags,
    handleToggleFavorite,
    handleSaveEdit,
    handleKeyDown,
  };
};