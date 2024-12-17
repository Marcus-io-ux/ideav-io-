import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stats } from "@/components/dashboard/Stats";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { supabase } from "@/integrations/supabase/client";

// Database type from Supabase
interface IdeaDB {
  id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string;
  deleted: boolean | null;
  deleted_at: string | null;
}

// Frontend type for the UI
interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

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
        const mappedIdeas: Idea[] = data.map((idea: IdeaDB) => ({
          id: idea.id,
          title: idea.title,
          content: idea.content,
          tags: [],
          createdAt: new Date(idea.created_at),
          isFavorite: false,
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
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newIdea: Idea = {
          id: data.id,
          title: data.title,
          content: data.content,
          tags: newIdeaData.tags,
          createdAt: new Date(data.created_at),
          isFavorite: false,
          sharedToCommunity: newIdeaData.shareToCommunity,
          deleted: false
        };

        setIdeas([newIdea, ...ideas]);

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

  const handleEditIdea = async (id: string) => {
    // This will be implemented in the next iteration
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon!",
    });
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

      setIdeas(ideas.map(idea => 
        ids.includes(idea.id) 
          ? { ...idea, deleted: true }
          : idea
      ));

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

  const handleRestoreIdeas = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          deleted: false,
          deleted_at: null
        })
        .in('id', ids);

      if (error) throw error;

      setIdeas(ideas.map(idea => 
        ids.includes(idea.id) 
          ? { ...idea, deleted: false }
          : idea
      ));

      toast({
        title: "Success",
        description: `${ids.length} idea(s) restored`,
      });
    } catch (error) {
      console.error('Error restoring ideas:', error);
      toast({
        title: "Error",
        description: "Failed to restore ideas. Please try again.",
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
              <p className="text-gray-600">You have {ideas.filter(i => !i.deleted).length} ideas stored</p>
            </div>
            <AddIdeaDialog onIdeaSubmit={handleAddIdea} />
          </div>

          <div className="mb-8">
            <Stats
              totalIdeas={ideas.filter(i => !i.deleted).length}
              highPriorityCount={highPriorityCount}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          </div>

          <IdeasList
            ideas={ideas}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            onEditIdea={handleEditIdea}
            onDeleteIdeas={handleDeleteIdeas}
            onRestoreIdeas={handleRestoreIdeas}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;