import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Lightbulb, Rocket, Users, Heart, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}

const StatCard = ({ icon, label, value, description }: StatCardProps) => (
  <Card className="p-4 flex items-start space-x-4">
    <div className="p-2 bg-primary/10 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </Card>
);

export const StatsSection = ({ userId }: { userId: string }) => {
  const { data: stats } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => {
      const [
        { count: ideasCount },
        { count: sharedCount },
        { count: collaborationsCount },
        { count: likesCount },
        { count: commentsCount }
      ] = await Promise.all([
        supabase
          .from("ideas")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("deleted", false),
        supabase
          .from("community_posts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("collaboration_requests")
          .select("*", { count: "exact", head: true })
          .or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
          .eq("status", "accepted"),
        supabase
          .from("community_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("community_comments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);

      return {
        ideas: ideasCount || 0,
        shared: sharedCount || 0,
        collaborations: collaborationsCount || 0,
        likes: likesCount || 0,
        comments: commentsCount || 0,
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={<Lightbulb className="h-6 w-6 text-primary" />}
        label="Ideas Saved"
        value={stats?.ideas || 0}
        description="Ideas in Your Vault"
      />
      <StatCard
        icon={<Rocket className="h-6 w-6 text-primary" />}
        label="Ideas Shared"
        value={stats?.shared || 0}
        description="Ideas Shared with Community"
      />
      <StatCard
        icon={<Users className="h-6 w-6 text-primary" />}
        label="Collaborations"
        value={stats?.collaborations || 0}
        description="Active Collaborations"
      />
      <StatCard
        icon={<Heart className="h-6 w-6 text-primary" />}
        label="Likes Received"
        value={stats?.likes || 0}
        description="Total Likes on Your Ideas"
      />
      <StatCard
        icon={<MessageSquare className="h-6 w-6 text-primary" />}
        label="Comments Made"
        value={stats?.comments || 0}
        description="Comments Contributed"
      />
    </div>
  );
};