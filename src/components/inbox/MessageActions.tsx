import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessageActionsProps {
  messageId: string;
  onDelete: () => void;
}

export function MessageActions({ messageId, onDelete }: MessageActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      onDelete();
      toast({
        title: "Message deleted",
        description: "The message has been removed from your inbox",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      className="text-destructive hover:text-destructive/90"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}