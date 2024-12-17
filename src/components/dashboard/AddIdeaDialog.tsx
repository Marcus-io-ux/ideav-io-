import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { IdeaForm } from "./IdeaForm";
import { IdeaSuccessState } from "./IdeaSuccessState";
import { IdeaFormData } from "@/types/idea";
import { AddIdeaButton } from "@/components/AddIdeaButton";

interface AddIdeaDialogProps {
  onIdeaSubmit: (idea: IdeaFormData) => void;
}

export const AddIdeaDialog = ({ onIdeaSubmit }: AddIdeaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const [idea, setIdea] = useState<IdeaFormData>({
    title: "",
    content: "",
    tags: [],
    category: "",
    feedbackType: "",
    channel: "",
    isCollaborative: false,
    shareToCommunity: false,
  });
  
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
      setOpen(false);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, redirectCountdown, navigate]);

  const handleIdeaChange = (field: keyof IdeaFormData, value: any) => {
    setIdea(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!idea.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your idea",
        variant: "destructive",
      });
      return;
    }

    if (idea.shareToCommunity && !idea.channel) {
      toast({
        title: "Channel Required",
        description: "Please select a channel to share in the community",
        variant: "destructive",
      });
      return;
    }

    const ideaId = Date.now().toString();
    setSavedIdeaId(ideaId);
    onIdeaSubmit(idea);

    toast({
      title: "Success!",
      description: "Your idea has been saved successfully!",
    });

    setShowSuccess(true);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Saved as draft",
      description: "Your idea has been saved as a draft",
    });
  };

  const resetForm = () => {
    setIdea({
      title: "",
      content: "",
      tags: [],
      category: "",
      feedbackType: "",
      channel: "",
      isCollaborative: false,
      shareToCommunity: false,
    });
    setShowSuccess(false);
    setRedirectCountdown(5);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddIdeaButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Idea</DialogTitle>
        </DialogHeader>
        {!showSuccess ? (
          <IdeaForm
            idea={idea}
            onIdeaChange={handleIdeaChange}
            onCancel={() => setOpen(false)}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
          />
        ) : (
          <IdeaSuccessState
            onViewIdea={() => navigate(`/dashboard?highlight=${savedIdeaId}`)}
            onShareToCommunity={() => setIdea(prev => ({ ...prev, shareToCommunity: true }))}
            onCreateAnother={() => resetForm()}
            onStayHere={() => {
              setShowSuccess(false);
              setRedirectCountdown(5);
            }}
            redirectCountdown={redirectCountdown}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};