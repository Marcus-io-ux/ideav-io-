import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardIdea } from "@/types/dashboard";
import { Tables } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";

type IdeaDB = Tables<"ideas">;

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<DashboardIdea[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchIdeas = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch ideas and favorites in parallel, excluding community-shared ideas
      const [ideasResponse, favoritesResponse] = await Promise.all([
        supabase
          .from('ideas')
          .select('*')
          .eq('deleted', false)
          .eq('shared_to_community', false) // Only fetch non-community-shared ideas
          .order('created_at', { ascending: false }),
        supabase
          .from('favorites')
          .select('idea_id')
          .eq('user_id', session.user.id)
          .eq('item_type', 'idea')
      ]);

      if (ideasResponse.error) throw ideasResponse.error;
      if (favoritesResponse.error) throw favoritesResponse.error;

      const favoriteIdeaIds = new Set(favoritesResponse.data.map(f => f.idea_id));

      if (ideasResponse.data) {
        const mappedIdeas: DashboardIdea[] = ideasResponse.data.map((idea: IdeaDB) => ({
          id: idea.id,
          title: idea.title,
          content: idea.content,
          tags: [],
          createdAt: new Date(idea.created_at),
          isFavorite: favoriteIdeaIds.has(idea.id),
          sharedToCommunity: false,
          deleted: idea.deleted || false
        }));
        setIdeas(mappedIdeas);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIdeas = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          deleted: true,
          deleted_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      // Remove the deleted ideas from the local state
      setIdeas(prevIdeas => prevIdeas.filter(idea => !ids.includes(idea.id)));
      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });

      toast({
        title: "Success",
        description: `${ids.length} idea(s) moved to trash`,
      });
    } catch (error) {
      console.error('Error deleting ideas:', error);
      toast({
        title: "Error",
        description: "Failed to delete ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchIdeas();

    // Subscribe to real-time changes for ideas
    const channel = supabase
      .channel('ideas_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        async (payload) => {
          console.log('Real-time update received for ideas:', payload);
          
          // Refresh ideas list when changes occur
          await fetchIdeas();
          
          // Invalidate React Query cache
          await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
          
          // Show toast notification for relevant events
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New idea created",
              description: "Your ideas list has been updated",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Idea updated",
              description: "Changes have been saved",
            });
          }
        }
      )
      .subscribe();

    // Also subscribe to favorites changes
    const favoritesChannel = supabase
      .channel('favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites'
        },
        async () => {
          // Refresh ideas to update favorite status
          await fetchIdeas();
          await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(favoritesChannel);
    };
  }, []);

  return {
    ideas,
    handleDeleteIdeas,
    fetchIdeas
  };
};