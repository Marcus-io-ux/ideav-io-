import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { CollaborationRequestCard } from "@/components/inbox/CollaborationRequestCard";

const Inbox = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['collaboration-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the collaboration requests with post data
      const { data: collaborationRequests, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          post:community_posts(
            title,
            content,
            tags
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaboration requests:', error);
        throw error;
      }

      // Then fetch the requester profiles separately
      const requestsWithProfiles = await Promise.all(
        (collaborationRequests || []).map(async (request) => {
          const { data: requesterProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('user_id', request.requester_id)
            .maybeSingle();

          return {
            ...request,
            requester: requesterProfile
          };
        })
      );

      return requestsWithProfiles;
    }
  });

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <PageHeader
        title="Inbox"
        description="Manage your collaboration requests and messages"
      />

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div>Loading requests...</div>
        ) : requests?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No collaboration requests yet
          </div>
        ) : (
          requests?.map((request) => (
            <CollaborationRequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;