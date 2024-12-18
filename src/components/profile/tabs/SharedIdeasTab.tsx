import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IdeaCard as CommunityIdeaCard } from "@/components/community/IdeaCard";

interface SharedIdea {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  channel: string;
  emoji_reactions: Record<string, number>;
  category?: string;
  feedback_type?: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const SharedIdeasTab = () => {
  const { data: sharedIdeas = [] } = useQuery<SharedIdea[]>({
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
      return data.map(idea => ({
        ...idea,
        emoji_reactions: idea.emoji_reactions as Record<string, number> || {},
      }));
    },
  });

  return (
    <div className="space-y-6">
      {sharedIdeas.map((idea) => (
        <CommunityIdeaCard
          key={idea.id}
          id={idea.id}
          title={idea.title}
          content={idea.content}
          author={{
            id: idea.user_id,
            name: idea.profiles?.username || "Anonymous",
            avatar: idea.profiles?.avatar_url || undefined,
          }}
          likes={idea.likes_count}
          comments={idea.comments_count}
          tags={idea.tags || []}
          category={idea.category}
          feedbackType={idea.feedback_type}
          createdAt={new Date(idea.created_at)}
          emojiReactions={idea.emoji_reactions}
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