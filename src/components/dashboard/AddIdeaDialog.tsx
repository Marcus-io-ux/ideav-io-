import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IdeaForm } from "./IdeaForm";

export interface AddIdeaDialogProps {
  buttonText?: string;
  onIdeaSubmit: () => void;
}

export function AddIdeaDialog({ buttonText = "Add Idea", onIdeaSubmit }: AddIdeaDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        <IdeaForm onSubmit={onIdeaSubmit} />
      </DialogContent>
    </Dialog>
  );
}