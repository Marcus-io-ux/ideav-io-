import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Share2, Plus } from "lucide-react";

interface IdeaSuccessStateProps {
  onViewIdea: () => void;
  onShareToCommunity: () => void;
  onCreateAnother: () => void;
  onStayHere: () => void;
  redirectCountdown: number;
}

export const IdeaSuccessState = ({
  onViewIdea,
  onShareToCommunity,
  onCreateAnother,
  onStayHere,
  redirectCountdown,
}: IdeaSuccessStateProps) => {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
            <Check className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <h3 className="font-semibold text-lg">Idea Saved Successfully!</h3>
      </div>
      
      <div className="space-y-3">
        <Button onClick={onViewIdea} className="w-full gap-2">
          View Idea <ChevronRight className="h-4 w-4" />
        </Button>
        <Button onClick={onShareToCommunity} variant="outline" className="w-full gap-2">
          Share with Community <Share2 className="h-4 w-4" />
        </Button>
        <Button onClick={onCreateAnother} variant="outline" className="w-full gap-2">
          Create Another Idea <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>Taking you back to dashboard in {redirectCountdown} seconds...</p>
        <Button variant="link" size="sm" onClick={onStayHere}>
          Stay Here
        </Button>
      </div>
    </div>
  );
};