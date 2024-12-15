import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    motivation: "",
    goals: "",
    experience: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const questions = [
    {
      id: "motivation",
      title: "What brings you to IdeaVault?",
      description: "Tell us what motivated you to join our platform"
    },
    {
      id: "goals",
      title: "What are your goals?",
      description: "What do you hope to achieve with IdeaVault?"
    },
    {
      id: "experience",
      title: "What's your experience level?",
      description: "Tell us about your background and experience"
    }
  ];

  const currentQuestion = questions[step - 1];

  const handleNext = () => {
    if (!answers[currentQuestion.id as keyof typeof answers]) {
      toast({
        title: "Please answer the question",
        description: "Your input helps us personalize your experience",
        variant: "destructive"
      });
      return;
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Here you would typically save the answers
      console.log("Answers:", answers);
      toast({
        title: "Welcome to IdeaVault!",
        description: "Your account is being set up..."
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {currentQuestion.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center mb-4">
            {currentQuestion.description}
          </p>
          <Textarea
            value={answers[currentQuestion.id as keyof typeof answers]}
            onChange={(e) => 
              setAnswers({
                ...answers,
                [currentQuestion.id]: e.target.value
              })
            }
            className="min-h-[150px]"
            placeholder="Type your answer here..."
          />
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            <div className="text-sm text-gray-500">
              Step {step} of {questions.length}
            </div>
            <Button onClick={handleNext}>
              {step === questions.length ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;