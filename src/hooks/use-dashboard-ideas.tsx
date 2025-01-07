import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useDashboardIdeas = (showFavorites: boolean, showDrafts: boolean) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["my-ideas", showFavorites, showDrafts],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/login');
          return [];
        }

        if (!session?.user) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return [];
        }

        const { data: ideas, error: ideasError } = await supabase
          .from("ideas")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("deleted", false)
          .eq("is_draft", showDrafts)
          .order("created_at", { ascending: false });

        if (ideasError) {
          console.error('Error fetching ideas:', ideasError);
          toast({
            title: "Error loading ideas",
            description: ideasError.message,
            variant: "destructive",
          });
          throw ideasError;
        }

        if (showFavorites) {
          const { data: favorites, error: favoritesError } = await supabase
            .from("favorites")
            .select("idea_id")
            .eq("user_id", session.user.id)
            .eq("item_type", "idea");

          if (favoritesError) {
            console.error('Error fetching favorites:', favoritesError);
            toast({
              title: "Error loading favorites",
              description: favoritesError.message,
              variant: "destructive",
            });
            throw favoritesError;
          }

          const favoriteIdeaIds = new Set(favorites?.map(f => f.idea_id) || []);
          return ideas
            .filter(idea => favoriteIdeaIds.has(idea.id))
            .map(idea => ({
              ...idea,
              createdAt: new Date(idea.created_at),
              isFavorite: true
            }));
        }

        const { data: favorites, error: favoritesError } = await supabase
          .from("favorites")
          .select("idea_id")
          .eq("user_id", session.user.id)
          .eq("item_type", "idea");

        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
          toast({
            title: "Error loading favorites",
            description: favoritesError.message,
            variant: "destructive",
          });
          throw favoritesError;
        }

        const favoriteIdeaIds = new Set(favorites?.map(f => f.idea_id) || []);

        return ideas.map(idea => ({
          ...idea,
          createdAt: new Date(idea.created_at),
          isFavorite: favoriteIdeaIds.has(idea.id)
        }));
      } catch (error: any) {
        console.error('Error in query function:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load ideas",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};