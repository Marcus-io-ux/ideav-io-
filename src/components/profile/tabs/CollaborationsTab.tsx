import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CollaborationData {
  id: string;
  post_id: string;
  requester_id: string;
  owner_id: string;
  status: string;
  message: string;
  created_at: string;
  community_posts: {
    title: string;
    content: string;
    user: {
      profiles: {
        username: string;
      };
    };
  };
}

export const CollaborationsTab = () => {
  const { data: collaborations } = useQuery<CollaborationData[]>({
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
            content,
            user:user_id (
              profiles (
                username
              )
            )
          )
        `)
        .eq("requester_id", user.id);

      if (error) throw error;
      return data as CollaborationData[];
    },
  });

  if (!collaborations?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collaborations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {collaborations.map((collab) => (
        <div key={collab.id} className="border p-4 rounded-lg">
          <h3 className="font-semibold">{collab.community_posts.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            By {collab.community_posts.user.profiles.username}
          </p>
          <p className="mt-2">{collab.message}</p>
          <div className="mt-2 text-sm">
            <span className={`px-2 py-1 rounded ${
              collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              collab.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};