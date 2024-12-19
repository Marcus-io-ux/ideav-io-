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

  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    handleDeleteIdeas,
    handleRestoreIdeas,
    fetchIdeas
  };
};