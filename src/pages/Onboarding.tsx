import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Onboarding = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Check if username is available
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        setError("Username is already taken");
        return;
      }

      // Update profile with username
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          username: username,
          username_set: true 
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Welcome to Idea Vault!",
        description: "Let's show you around the dashboard.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to set username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome to Idea Vault!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Choose Your Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a unique username"
                required
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_-]+$"
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <p className="text-sm text-gray-500">
                Username can contain letters, numbers, underscores, and hyphens
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;