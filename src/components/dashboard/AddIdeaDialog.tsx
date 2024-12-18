import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IdeaForm } from "./IdeaForm";
import { useState } from "react";

export interface AddIdeaDialogProps {
  buttonText?: string;
  onIdeaSubmit: () => void;
}

export function AddIdeaDialog({ buttonText = "Add Idea", onIdeaSubmit }: AddIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [idea, setIdea] = useState({
    title: "",
    content: "",
    channel: "",
    category: "",
    feedbackType: "",
    shareToCommunity: false,
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
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
            // Implement draft saving logic here
            handleCancel();
          }}
          onSubmit={() => {
            onIdeaSubmit();
            handleCancel();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}