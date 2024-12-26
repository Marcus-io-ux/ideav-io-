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

      const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          post:community_posts(
            title,
            content,
            tags
          ),
          requester:profiles!collaboration_requests_requester_id_fkey(
            username,
            avatar_url
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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