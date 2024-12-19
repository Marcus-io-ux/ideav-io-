import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRecentIdeas(userId: string | null) {
  return useQuery({
    queryKey: ["recent-ideas", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID provided");

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", userId)
        .eq("deleted", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      return data;
    },
    enabled: !!userId
  });
}