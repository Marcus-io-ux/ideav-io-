import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardIdea } from "@/types/dashboard";
import { Tables } from "@/integrations/supabase/types";

type IdeaDB = Tables<"ideas">;

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<DashboardIdea[]>([]);
  const { toast } = useToast();

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const mappedIdeas: DashboardIdea[] = data.map((idea: IdeaDB) => ({
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

      toast({
        title: "Success",
        description: `${ids.length} idea(s) deleted`,
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
  }, []);

  return {
    ideas,
    handleDeleteIdeas,
    fetchIdeas
  };
};