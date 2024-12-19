import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CollaborationRequest {
  id: string;
  message: string;
  status: string;
  post: {
    title: string;
  };
  requester: {
    id: string;
    user_id: string;
    username: string;
    avatar_url: string;
  };
}

export const CollaborationsTab = () => {
  const { data: collaborations, isLoading } = useQuery({
    queryKey: ["collaborations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collaboration_requests")
        .select(`
          id,
          message,
          status,
          post:community_posts(title),
          requester:profiles!collaboration_requests_requester_id_fkey(
            id,
            user_id,
            username,
            avatar_url
          )
        `);

      if (error) throw error;
      return data as unknown as CollaborationRequest[];
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
              <h3 className="font-semibold">{collab.post.title}</h3>
              <p className="text-sm text-gray-600">{collab.message}</p>
              <p className="text-sm text-gray-500">
                From: {collab.requester.username}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={
                  collab.status === "pending"
                    ? "bg-yellow-100"
                    : collab.status === "accepted"
                    ? "bg-green-100"
                    : "bg-red-100"
                }
              >
                {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {!collaborations?.length && (
        <p className="text-center text-gray-500">No collaboration requests yet</p>
      )}
    </div>
  );
};