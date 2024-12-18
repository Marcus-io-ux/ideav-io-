import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight, Info, User, Users, SkipForward } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OnboardingStep = "username" | "tutorial-ideas" | "tutorial-community" | "complete";

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("username");
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setIsUsernameAvailable(false);
        return;
      }

      setIsChecking(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      setIsUsernameAvailable(!data);
      setIsChecking(false);
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleUsernameSubmit = async () => {
    if (!isUsernameAvailable || username.length < 3) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ 
          username: username,
          username_set: true 
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setCurrentStep("tutorial-ideas");
    } catch (error) {
      console.error("Error setting username:", error);
      toast({
        title: "Error",
        description: "Failed to set username. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkipTutorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ tutorial_completed: true })
        .eq("user_id", user.id);

      if (error) throw error;

      navigate("/dashboard");
    } catch (error) {
      console.error("Error skipping tutorial:", error);
      toast({
        title: "Error",
        description: "Failed to skip tutorial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTutorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ tutorial_completed: true })
        .eq("user_id", user.id);

      if (error) throw error;

      setCurrentStep("complete");
    } catch (error) {
      console.error("Error completing tutorial:", error);
      toast({
        title: "Error",
        description: "Failed to complete tutorial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "username":
        return (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Idea Vault!</h1>
              <p className="text-gray-600">Let's set up your profile to get started.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Choose Your Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a unique username"
                  className={`w-full ${!isUsernameAvailable ? 'border-red-500' : ''}`}
                />
                {username.length > 0 && (
                  <p className={`text-sm ${isUsernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                    {isChecking 
                      ? "Checking availability..." 
                      : isUsernameAvailable 
                        ? "Username is available!" 
                        : "This username is not available"}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleUsernameSubmit}
                disabled={!isUsernameAvailable || username.length < 3 || isChecking}
                className="w-full"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "tutorial-ideas":
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Your Idea Vault</h2>
              <p className="text-gray-600">
                This is where you can store your private ideas. Click 'Add New Idea' to get started.
              </p>
            </div>
            <div className="space-x-4">
              <Button onClick={() => setCurrentStep("tutorial-community")}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleSkipTutorial}>
                Skip Tutorial <SkipForward className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "tutorial-community":
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Community Ideas</h2>
              <p className="text-gray-600">
                Explore ideas shared by others. Engage by liking, commenting, or collaborating.
              </p>
            </div>
            <div className="space-x-4">
              <Button onClick={handleCompleteTutorial}>
                Complete Tutorial <Check className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleSkipTutorial}>
                Skip Tutorial <SkipForward className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">You're all set!</h2>
              <p className="text-gray-600">
                Start saving and sharing your ideas now.
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {renderStep()}
        {currentStep !== "username" && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                {["username", "tutorial-ideas", "tutorial-community", "complete"].map((step, index) => (
                  <span
                    key={step}
                    className={`inline-block w-2 h-2 rounded-full ${
                      ["username", "tutorial-ideas", "tutorial-community", "complete"].indexOf(currentStep) >= index
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <Info className="inline-block h-4 w-4 mr-1" />
                {currentStep === "complete" ? "Tutorial completed!" : "Tutorial in progress..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};