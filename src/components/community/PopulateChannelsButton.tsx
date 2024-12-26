import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const PopulateChannelsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePopulate = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/populate-channels`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to populate channels');

      await queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      
      toast({
        title: "Success",
        description: "Channels have been populated with bot-generated content!",
      });
    } catch (error) {
      console.error('Error populating channels:', error);
      toast({
        title: "Error",
        description: "Failed to populate channels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePopulate} 
      disabled={isLoading}
      className="ml-2"
    >
      {isLoading ? "Populating..." : "Add Bot Ideas"}
    </Button>
  );
};