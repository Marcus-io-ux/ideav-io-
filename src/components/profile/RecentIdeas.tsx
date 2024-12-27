import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { IdeaCard } from "@/components/IdeaCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RecentIdeasProps {
  userId: string;
}

export const RecentIdeas = ({ userId }: RecentIdeasProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ideas = [] } = useQuery({
    queryKey: ["recent-ideas", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", userId)
        .eq("deleted", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
      }));
    },
    enabled: !!userId,
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ideas")
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["recent-ideas", userId] });
      
      toast({
        title: "Success",
        description: "Idea moved to trash",
      });
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      });
    }
  };

  if (!ideas.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Ideas</h3>
      <div className="grid gap-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            {...idea}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};