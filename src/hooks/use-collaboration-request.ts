import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCollaborationRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendCollaborationRequest = async (
    postId: string,
    ownerId: string,
    message: string
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to send collaboration requests",
          variant: "destructive",
        });
        return;
      }

      // Create collaboration request
      const { error: requestError } = await supabase
        .from("collaboration_requests")
        .insert({
          post_id: postId,
          requester_id: user.id,
          owner_id: ownerId,
          message: message,
          status: "pending"
        });

      if (requestError) throw requestError;

      // Create inbox message for the owner
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id: ownerId,
          content: `New collaboration request: ${message}`,
          is_read: false,
          type: 'collaboration_request'
        });

      if (messageError) throw messageError;

      toast({
        title: "Request sent",
        description: "Your collaboration request has been sent successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send collaboration request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendCollaborationRequest,
    isLoading
  };
};