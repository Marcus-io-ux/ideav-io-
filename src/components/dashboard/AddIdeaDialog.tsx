import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IdeaForm } from "./IdeaForm";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
    // Invalidate and refetch ideas query to show new idea immediately
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    onIdeaSubmit();
    handleCancel();
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
            handleCancel();
          }}
          onSubmit={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}