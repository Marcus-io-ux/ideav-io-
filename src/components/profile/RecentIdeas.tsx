import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { IdeaCard } from "@/components/IdeaCard";
import { supabase } from "@/integrations/supabase/client";

interface RecentIdeasProps {
  userId: string;
}

export const RecentIdeas = ({ userId }: RecentIdeasProps) => {
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
          />
        ))}
      </div>
    </div>
  );
};