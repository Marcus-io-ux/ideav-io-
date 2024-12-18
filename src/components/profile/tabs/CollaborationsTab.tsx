import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CollaborationsTab() {
  const { data: collaborations, isLoading } = useQuery({
    queryKey: ['collaborations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          post:community_posts(*),
          requester:profiles(
            id,
            user_id,
            username,
            avatar_url
          )
        `)
        .eq('requester.user_id', 'collaboration_requests.requester_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {collaborations?.map((collab) => (
        <Card key={collab.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{collab.post?.title}</h3>
              <p className="text-sm text-muted-foreground">
                Requested by: {collab.requester?.username}
              </p>
              <p className="mt-2">{collab.message}</p>
            </div>
            <div className="space-x-2">
              {collab.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    onClick={() => {
                      // Handle accept
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Handle decline
                    }}
                  >
                    Decline
                  </Button>
                </>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                Status: {collab.status}
              </div>
            </div>
          </div>
        </Card>
      ))}
      {collaborations?.length === 0 && (
        <p className="text-center text-muted-foreground">
          No collaboration requests yet
        </p>
      )}
    </div>
  );
}