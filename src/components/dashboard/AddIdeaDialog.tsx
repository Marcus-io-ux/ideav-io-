import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IdeaForm, IdeaFormData } from "./IdeaForm";
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

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmitSuccess = async (data: IdeaFormData) => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    onIdeaSubmit();
    setOpen(false);
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
          onSubmit={handleSubmitSuccess}
          onCancel={handleCancel}
          onSaveDraft={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}