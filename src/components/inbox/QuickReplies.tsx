import { Button } from "@/components/ui/button";

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
}

export const QuickReplies = ({ onSelect }: QuickRepliesProps) => {
  const quickReplies = [
    "Thanks for your input!",
    "Let's set up a time to discuss further.",
    "I'll get back to you soon.",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {quickReplies.map((quickReply) => (
        <Button
          key={quickReply}
          variant="secondary"
          size="sm"
          onClick={() => onSelect(quickReply)}
        >
          {quickReply}
        </Button>
      ))}
    </div>
  );
};