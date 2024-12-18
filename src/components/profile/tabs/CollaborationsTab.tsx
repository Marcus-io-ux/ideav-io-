import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export const CollaborationsTab = () => {
  const { data: collaborations = [] } = useQuery({
    queryKey: ["collaborations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("collaboration_requests")
        .select(`
          *,
          community_posts (
            title,
            content
          ),
          profiles:owner_id (
            username
          )
        `)
        .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
              <span>Collaborating with {collab.profiles?.username}</span>
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