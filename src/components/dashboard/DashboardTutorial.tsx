import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

export const DashboardTutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const steps = [
    {
      title: "Your Idea Vault",
      description: "This is where you can store your private ideas. Click 'Add New Idea' to get started.",
      target: ".add-idea-button"
    },
    {
      title: "Community Ideas",
      description: "Explore ideas shared by others. Engage by liking, commenting, or collaborating.",
      target: ".community-section"
    }
  ];

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ tutorial_completed: true })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error updating tutorial status:", error);
    }
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSkip();
      toast({
        title: "Tutorial completed!",
        description: "You're all set to start using Idea Vault.",
      });
    }
  };

  if (!isVisible) return null;

  const currentTutorialStep = steps[currentStep - 1];

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200 animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={handleSkip}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="space-y-3">
        <h3 className="font-semibold">{currentTutorialStep.title}</h3>
        <p className="text-sm text-gray-600">{currentTutorialStep.description}</p>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip Tutorial
          </Button>
          <Button size="sm" onClick={handleNext}>
            {currentStep === steps.length ? "Finish" : "Next"}
          </Button>
        </div>
        <div className="flex gap-1 justify-center mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-4 rounded-full ${
                index + 1 === currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};