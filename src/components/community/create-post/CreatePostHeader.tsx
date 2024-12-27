import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreatePostHeaderProps {
  onPost: () => void;
  showOnlyMyPosts: boolean;
  onToggleMyPosts: (show: boolean) => void;
}

export const CreatePostHeader = ({ onPost, showOnlyMyPosts, onToggleMyPosts }: CreatePostHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <h2 className="text-xl font-semibold whitespace-nowrap text-center sm:text-left">What's on your mind?</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-my-posts"
            checked={showOnlyMyPosts}
            onCheckedChange={onToggleMyPosts}
          />
          <Label htmlFor="show-my-posts">Show only my shared ideas</Label>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onPost} 
                className="shadow-sm hover:shadow-md transition-all duration-300"
              >
                Share Your Idea
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to share your idea with the community and save it to your ideas!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};