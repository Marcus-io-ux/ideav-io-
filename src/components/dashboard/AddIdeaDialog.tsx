import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Check, Share2, Plus, ChevronRight } from "lucide-react";

interface AddIdeaDialogProps {
  onIdeaSubmit: (idea: {
    title: string;
    content: string;
    tags: string[];
    shareToCommunity: boolean;
  }) => void;
}

export const AddIdeaDialog = ({ onIdeaSubmit }: AddIdeaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: "",
    content: "",
    tags: "",
    shareToCommunity: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSuccess && redirectCountdown === 0) {
      navigate("/dashboard");
      setOpen(false); // Close the dialog when redirecting
    }
    return () => clearTimeout(timer);
  }, [showSuccess, redirectCountdown, navigate]);

  const handleSubmit = () => {
    if (!newIdea.title || !newIdea.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      });
      return;
    }

    const ideaId = Date.now().toString();
    setSavedIdeaId(ideaId);
    
    onIdeaSubmit({
      ...newIdea,
      tags: newIdea.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
    });

    toast({
      title: "Success!",
      description: "Your idea has been saved successfully!",
      action: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
        </div>
      ),
    });

    setShowSuccess(true);
    setNewIdea({ title: "", content: "", tags: "", shareToCommunity: false });
    setOpen(false); // Close the dialog after successful submission
  };

  const handleViewIdea = () => {
    navigate(`/dashboard?highlight=${savedIdeaId}`);
    setOpen(false);
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setRedirectCountdown(5);
  };

  const handleStayHere = () => {
    setShowSuccess(false);
    setRedirectCountdown(5);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddIdeaButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        {!showSuccess ? (
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Title"
              value={newIdea.title}
              onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              className="w-full"
            />
            <Textarea
              placeholder="Describe your idea..."
              value={newIdea.content}
              onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
              className="min-h-[100px]"
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={newIdea.tags}
              onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="share-to-community"
                checked={newIdea.shareToCommunity}
                onCheckedChange={(checked) =>
                  setNewIdea({ ...newIdea, shareToCommunity: checked })
                }
              />
              <Label htmlFor="share-to-community">Share to Community</Label>
            </div>
            <Button onClick={handleSubmit}>Save Idea</Button>
          </div>
        ) : (
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
              <Button onClick={handleViewIdea} className="w-full gap-2">
                View Idea <ChevronRight className="h-4 w-4" />
              </Button>
              {!newIdea.shareToCommunity && (
                <Button onClick={() => setNewIdea({ ...newIdea, shareToCommunity: true })} variant="outline" className="w-full gap-2">
                  Share with Community <Share2 className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={handleCreateAnother} variant="outline" className="w-full gap-2">
                Create Another Idea <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Taking you back to dashboard in {redirectCountdown} seconds...</p>
              <Button variant="link" size="sm" onClick={handleStayHere}>
                Stay Here
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};