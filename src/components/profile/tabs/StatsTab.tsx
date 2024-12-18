import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Brain, Share2, Users, Heart, MessageSquare } from "lucide-react";

export const StatsTab = () => {
  const { data: stats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const [
        { count: totalIdeas },
        { count: sharedIdeas },
        { count: collaborations },
        { count: likes },
        { count: comments }
      ] = await Promise.all([
        supabase
          .from("ideas")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("deleted", false),
        supabase
          .from("community_posts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("collaboration_requests")
          .select("*", { count: "exact", head: true })
          .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
          .eq("status", "accepted"),
        supabase
          .from("community_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("community_comments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      return {
        totalIdeas: totalIdeas.count || 0,
        sharedIdeas: sharedIdeas.count || 0,
        collaborations: collaborations.count || 0,
        likes: likes.count || 0,
        comments: comments.count || 0,
      };
    },
  });

  const statItems = [
    { icon: Brain, label: "Ideas Saved", value: stats?.totalIdeas || 0 },
    { icon: Share2, label: "Ideas Shared", value: stats?.sharedIdeas || 0 },
    { icon: Users, label: "Collaborations", value: stats?.collaborations || 0 },
    { icon: Heart, label: "Likes Given", value: stats?.likes || 0 },
    { icon: MessageSquare, label: "Comments Made", value: stats?.comments || 0 },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};