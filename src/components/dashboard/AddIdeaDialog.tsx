import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IdeaForm } from "./IdeaForm";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export interface AddIdeaDialogProps {
  buttonText?: string;
  onIdeaSubmit: () => void;
}

export function AddIdeaDialog({ buttonText = "Add Idea", onIdeaSubmit }: AddIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [idea, setIdea] = useState({
    title: "",
    content: "",
    channel: "",
    category: "",
    feedbackType: "",
    shareToCommunity: false,
    tags: [],
  });

  const handleIdeaChange = (field: string, value: any) => {
    setIdea(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setOpen(false);
    setIdea({
      title: "",
      content: "",
      channel: "",
      category: "",
      feedbackType: "",
      shareToCommunity: false,
      tags: [],
    });
  };

  const handleSubmitSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    onIdeaSubmit();
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        <IdeaForm 
          idea={idea}
          onIdeaChange={handleIdeaChange}
          onCancel={handleCancel}
          onSaveDraft={() => {
            handleCancel();
          }}
          onSubmit={handleSubmitSuccess}
          titlePlaceholder="Enter your idea title..."
          contentPlaceholder="Describe your idea in detail..."
        />
      </DialogContent>
    </Dialog>
  );
}