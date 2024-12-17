import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Tables } from "@/integrations/supabase/types";

type IdeaDB = Tables<"ideas">;

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userName, setUserName] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dailyQuote] = useState("The best way to predict the future is to create it.");
  const { toast } = useToast();

  useEffect(() => {
    fetchIdeas();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: profile, error } = await supabase
        .from('onboarding_data')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('onboarding_data')
          .insert([{ 
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'User'
          }])
          .select('full_name')
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserName("User");
    }
  };

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

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto p-8">
        <div className="space-y-8">
          <PageHeader
            title={`Welcome back, ${userName}!`}
            description={`"${dailyQuote}"`}
          />
          <div className="space-y-8">
            <h3 className="text-lg font-semibold">Your Ideas</h3>
            <div className="mt-8">
              <IdeasList
                ideas={ideas}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={handleToggleFavorites}
                onEditIdea={handleEditIdea}
                onDeleteIdeas={handleDeleteIdeas}
                onRestoreIdeas={handleRestoreIdeas}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
