import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IdeaCard as CommunityIdeaCard } from "@/components/community/IdeaCard";

export const SharedIdeasTab = () => {
  const { data: sharedIdeas = [] } = useQuery({
    queryKey: ["shared-ideas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(post => ({
        ...post,
        author: {
          id: post.user_id,
          name: post.profiles?.username || "Anonymous",
          avatar: post.profiles?.avatar_url,
        },
        createdAt: new Date(post.created_at),
      }));
    },
  });

  return (
    <div className="space-y-6">
      {sharedIdeas.map((idea) => (
        <CommunityIdeaCard
          key={idea.id}
          {...idea}
        />
      ))}
      {sharedIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shared ideas yet</p>
        </div>
      )}
    </div>
  );
};