import { IdeaCard } from "@/components/IdeaCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface FavoritesTabProps {
  ideas: any[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FavoritesTab = ({
  ideas,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}: FavoritesTabProps) => {
  const { toast } = useToast();

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('idea_id')
        .eq('user_id', user.id)
        .eq('item_type', 'idea');

      if (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load favorites. Please try again.",
          variant: "destructive",
        });
        return [];
      }

      return favorites.map(f => f.idea_id);
    },
  });

  // Filter ideas to show only favorites that aren't deleted
  const favoriteIdeas = ideas.filter(idea => 
    !idea.deleted && favoriteIds.includes(idea.id)
  );

  // Subscribe to changes in favorites
  useEffect(() => {
    const channel = supabase
      .channel('favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
        },
        () => {
          // Invalidate the favorites query to refresh the data
          // This will be handled by the queryClient
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div className="grid gap-6 mt-6">
      {favoriteIdeas.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No favorite ideas yet.</p>
          <p className="text-sm mt-2">Star your favorite ideas to see them here!</p>
        </div>
      ) : (
        favoriteIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            {...idea}
            isFavorite={true}
            isSelected={selectedIds.includes(idea.id)}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};