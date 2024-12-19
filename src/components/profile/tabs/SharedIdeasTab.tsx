import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IdeaCard } from "@/components/community/IdeaCard";
import { SharedIdea, SharedIdeaResponse } from "@/types/shared-idea";

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
          profiles (
            username,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data as SharedIdeaResponse[]).map((post) => ({
        ...post,
        emoji_reactions: post.emoji_reactions as Record<string, number> || {},
        author: {
          id: post.user_id || '',
          name: post.profiles?.username || "Anonymous",
          avatar: post.profiles?.avatar_url,
        }
      }));
    },
  });

  return (
    <div className="space-y-6">
      {sharedIdeas.map((idea) => (
        <IdeaCard
          key={idea.id}
          id={idea.id}
          title={idea.title}
          content={idea.content}
          author={idea.author!}
          likes={idea.likes_count || 0}
          comments={idea.comments_count || 0}
          createdAt={idea.created_at || ""}
          category={idea.category || undefined}
          feedbackType={idea.feedback_type || undefined}
          emojiReactions={idea.emoji_reactions || {}}
          tags={idea.tags || []}
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