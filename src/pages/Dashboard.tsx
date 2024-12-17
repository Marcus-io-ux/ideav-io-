import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stats } from "@/components/dashboard/Stats";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { supabase } from "@/integrations/supabase/client";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
}

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

  // Fetch ideas when component mounts
  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setIdeas(data.map(idea => ({
          ...idea,
          created_at: new Date(idea.created_at),
          tags: idea.tags || []
        })));
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

  const handleAddIdea = async (newIdeaData: {
    title: string;
    content: string;
    tags: string[];
    shareToCommunity: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          title: newIdeaData.title,
          content: newIdeaData.content,
          tags: newIdeaData.tags,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newIdea: Idea = {
          ...data,
          created_at: new Date(data.created_at),
          isFavorite: false,
          sharedToCommunity: newIdeaData.shareToCommunity,
        };

        setIdeas([newIdea, ...ideas]);

        // If sharing to community, save to community posts as well
        if (newIdeaData.shareToCommunity) {
          const { error: communityError } = await supabase
            .from('community_posts')
            .insert([{
              title: newIdeaData.title,
              content: newIdeaData.content,
              tags: newIdeaData.tags,
            }]);

          if (communityError) {
            console.error('Error sharing to community:', communityError);
            toast({
              title: "Partial Success",
              description: "Idea saved but failed to share to community.",
              variant: "destructive",
            });
            return;
          }
        }

        toast({
          title: "Success!",
          description: "Your idea has been saved.",
        });
      }
    } catch (error) {
      console.error('Error adding idea:', error);
      toast({
        title: "Error",
        description: "Failed to save idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const highPriorityCount = ideas.filter((idea) => idea.priority === "high").length;
  const followersCount = 128; // This should be fetched from user_follows table
  const followingCount = 89; // This should be fetched from user_follows table

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">You have {ideas.length} ideas stored</p>
            </div>
            <AddIdeaDialog onIdeaSubmit={handleAddIdea} />
          </div>

          <div className="mb-8">
            <Stats
              totalIdeas={ideas.length}
              highPriorityCount={highPriorityCount}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          </div>

          <IdeasList
            ideas={ideas}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;