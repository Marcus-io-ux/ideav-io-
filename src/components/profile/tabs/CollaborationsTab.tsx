import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface CollaborationData {
  id: string;
  community_posts: {
    title: string;
    content: string;
  } | null;
  owner_profile: {
    username: string | null;
  } | null;
}

export const CollaborationsTab = () => {
  const { data: collaborations = [] } = useQuery<CollaborationData[]>({
    queryKey: ["collaborations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("collaboration_requests")
        .select(`
          id,
          community_posts (
            title,
            content
          ),
          owner_profile:profiles!collaboration_requests_owner_id_fkey (
            username
          )
        `)
        .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (error) throw error;

      // Transform the data to match our interface
      const typedData = (data || []).map(item => ({
        id: item.id,
        community_posts: item.community_posts,
        owner_profile: {
          username: item.owner_profile?.username || null
        }
      }));

      return typedData;
    },
  });

  return (
    <div className="space-y-6">
      {collaborations.map((collab) => (
        <Card key={collab.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              {collab.community_posts?.title}
            </CardTitle>
            <Badge variant="outline" className="ml-2">
              Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Collaborating with {collab.owner_profile?.username || "Anonymous"}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      {collaborations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No active collaborations</p>
        </div>
      )}
    </div>
  );
};