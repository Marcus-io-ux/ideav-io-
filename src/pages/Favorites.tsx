import { useState, useEffect } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isFavorite: boolean;
}

const Favorites = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('idea_id')
        .eq('user_id', user.id)
        .eq('item_type', 'idea');

      if (favoritesError) throw favoritesError;

      if (!favorites || favorites.length === 0) {
        setIdeas([]);
        return;
      }

      const ideaIds = favorites.map(fav => fav.idea_id);
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .in('id', ideaIds)
        .eq('deleted', false);

      if (ideasError) throw ideasError;

      const formattedIdeas = ideasData?.map(idea => ({
        id: idea.id,
        title: idea.title,
        content: idea.content,
        createdAt: new Date(idea.created_at),
        isFavorite: true
      })) || [];

      setIdeas(formattedIdeas);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery) ||
      idea.content.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                Favorite Ideas
              </h1>
              <p className="text-secondary mt-2">
                You have {filteredIdeas.length} favorite ideas
              </p>
            </div>
          </div>

          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="grid gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                {...idea}
              />
            ))}
            {filteredIdeas.length === 0 && (
              <div className="text-center py-12 bg-accent rounded-lg shadow-sm">
                <p className="text-secondary">No favorite ideas found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;