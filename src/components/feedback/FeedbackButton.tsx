import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackButtonProps {
  onClick: () => void;
}

export const FeedbackButton = ({ onClick }: FeedbackButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 gap-2 shadow-lg hover:scale-105 transition-transform"
    >
      <MessageSquarePlus className="h-4 w-4" />
      User Feedback
    </Button>
  );
};