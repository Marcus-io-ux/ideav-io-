import { useState, useEffect } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { CommunityIdeaCard } from "@/components/community/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BaseIdea {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isFavorite: boolean;
}

interface RegularIdea extends BaseIdea {
  type: 'idea';
}

interface CommunityIdea extends BaseIdea {
  type: 'community_post';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  tags: string[];
}

type Idea = RegularIdea | CommunityIdea;

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

      // Get all favorites for the user
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('idea_id, item_type')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (!favorites || favorites.length === 0) {
        setIdeas([]);
        return;
      }

      // Separate IDs by type
      const regularIdeaIds = favorites
        .filter(fav => fav.item_type === 'idea')
        .map(fav => fav.idea_id);
      
      const communityPostIds = favorites
        .filter(fav => fav.item_type === 'community_post')
        .map(fav => fav.idea_id);

      // Fetch regular ideas
      const regularIdeasPromise = regularIdeaIds.length > 0
        ? supabase
            .from('ideas')
            .select('*')
            .in('id', regularIdeaIds)
            .eq('deleted', false)
        : Promise.resolve({ data: [] });

      // Fetch community posts
      const communityPostsPromise = communityPostIds.length > 0
        ? supabase
            .from('community_posts')
            .select(`
              *,
              author:profiles(username, avatar_url)
            `)
            .in('id', communityPostIds)
        : Promise.resolve({ data: [] });

      const [
        { data: regularIdeasData, error: regularIdeasError },
        { data: communityPostsData, error: communityPostsError }
      ] = await Promise.all([regularIdeasPromise, communityPostsPromise]);

      if (regularIdeasError) throw regularIdeasError;
      if (communityPostsError) throw communityPostsError;

      // Format regular ideas
      const formattedRegularIdeas: RegularIdea[] = (regularIdeasData || []).map(idea => ({
        id: idea.id,
        title: idea.title,
        content: idea.content,
        createdAt: new Date(idea.created_at),
        isFavorite: true,
        type: 'idea'
      }));

      // Format community posts
      const formattedCommunityPosts: CommunityIdea[] = (communityPostsData || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: new Date(post.created_at),
        isFavorite: true,
        type: 'community_post',
        author: {
          id: post.user_id,
          name: post.author?.username || 'Anonymous',
          avatar: post.author?.avatar_url
        },
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        tags: post.tags || []
      }));

      // Combine all ideas
      setIdeas([...formattedRegularIdeas, ...formattedCommunityPosts]);
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
            Favorite Ideas
          </h1>
          <p className="text-muted-foreground text-lg">
            Your collection of saved inspirations
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid gap-6">
          {filteredIdeas.map((idea) => (
            idea.type === 'idea' ? (
              <IdeaCard key={idea.id} {...idea} />
            ) : (
              <CommunityIdeaCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                content={idea.content}
                author={idea.author}
                likes={idea.likes}
                comments={idea.comments}
                tags={idea.tags}
                createdAt={idea.createdAt}
                emojiReactions={{}}
              />
            )
          ))}
          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No favorite ideas found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;