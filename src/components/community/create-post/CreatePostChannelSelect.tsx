import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePostChannelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CreatePostChannelSelect = ({ value, onChange }: CreatePostChannelSelectProps) => {
  const channels = [
    { id: "feedback", label: "Share Feedback" },
    { id: "business", label: "Business Ideas" },
    { id: "tech", label: "Tech Projects" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "design", label: "Design Ideas" },
    { id: "apps", label: "App Concepts" },
  ];

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a channel for your idea" />
        </SelectTrigger>
        <SelectContent>
          {channels.map((ch) => (
            <SelectItem key={ch.id} value={ch.id}>
              {ch.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};