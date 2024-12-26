import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreatePostHeaderProps {
  onPost: () => void;
}

export const CreatePostHeader = ({ onPost }: CreatePostHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">What's on your mind?</h2>
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
  );
};