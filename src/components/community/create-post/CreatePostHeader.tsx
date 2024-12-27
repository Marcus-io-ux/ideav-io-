import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreatePostHeaderProps {
  onPost?: () => void;
  showOnlyMyPosts: boolean;
  onToggleMyPosts: (value: boolean) => void;
}

export const CreatePostHeader = ({ onPost, showOnlyMyPosts, onToggleMyPosts }: CreatePostHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 items-center">
      <h2 className="text-xl font-semibold whitespace-nowrap">What's on your mind?</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-my-posts"
            checked={showOnlyMyPosts}
            onCheckedChange={onToggleMyPosts}
          />
          <Label htmlFor="show-my-posts">Show only my posts</Label>
        </div>
      </div>
    </div>
  );
};