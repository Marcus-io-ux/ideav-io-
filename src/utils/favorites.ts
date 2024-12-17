import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const toggleFavorite = async (
  itemId: string,
  itemType: 'idea' | 'community_post',
  userId: string | null,
  isFavorite: boolean
) => {
  if (!userId) {
    toast({
      title: "Please sign in",
      description: "You need to be signed in to favorite posts",
      variant: "destructive",
    });
    return false;
  }

  try {
    if (!isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, idea_id: itemId, item_type: itemType });

      if (error) throw error;
      return true;
    } else {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: userId, idea_id: itemId, item_type: itemType });

      if (error) throw error;
      return false;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    toast({
      title: "Error",
      description: "Failed to update favorites",
      variant: "destructive",
    });
    return isFavorite;
  }
};