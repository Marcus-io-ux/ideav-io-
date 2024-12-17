import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AddIdeaDialogProps {
  onIdeaSubmit: (idea: {
    title: string;
    content: string;
    tags: string[];
    shareToCommunity: boolean;
  }) => void;
}

export const AddIdeaDialog = ({ onIdeaSubmit }: AddIdeaDialogProps) => {
  const [newIdea, setNewIdea] = useState({
    title: "",
    content: "",
    tags: "",
    shareToCommunity: false,
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newIdea.title || !newIdea.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      });
      return;
    }

    onIdeaSubmit({
      ...newIdea,
      tags: newIdea.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
    });

    setNewIdea({ title: "", content: "", tags: "", shareToCommunity: false });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddIdeaButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};