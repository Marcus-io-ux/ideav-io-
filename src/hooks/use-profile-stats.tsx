import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfileStats(userId: string | null) {
  return useQuery({
    queryKey: ["profile-stats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID provided");

      const [
        { count: ideasCount },
        { count: collaborationsCount },
        { count: followersCount },
        { count: followingCount }
      ] = await Promise.all([
        supabase
          .from("ideas")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("deleted", false),
        supabase
          .from("collaboration_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "accepted")
          .or(`requester_id.eq.${userId},owner_id.eq.${userId}`),
        supabase
          .from("user_follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId),
        supabase
          .from("user_follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId)
      ]);

      return {
        ideas: ideasCount || 0,
        collaborations: collaborationsCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0
      };
    },
    enabled: !!userId
  });
}