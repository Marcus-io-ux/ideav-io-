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
    { id: "general", label: "General Ideas" },
    { id: "business", label: "Startups & Business" },
    { id: "tech", label: "Tech & Innovation" },
    { id: "lifestyle", label: "Lifestyle & Wellness" },
    { id: "design", label: "Design & Creativity" },
    { id: "apps", label: "Apps & Tech Tools" },
  ];

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a channel" />
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