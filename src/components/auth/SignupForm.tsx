import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { AuthLogo } from "./AuthLogo";
import { SignupFormInputs } from "./SignupFormInputs";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: signupError } = await supabase.from("signup_data").insert([
          {
            user_id: authData.user.id,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            terms_accepted: formData.termsAccepted,
            signup_provider: "email",
          },
        ]);

        if (signupError) throw signupError;

        toast({
          title: "Success!",
          description: "Your account has been created. Please check your email to verify your account.",
        });
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthLogo />
      
      <form onSubmit={handleSignup} className="space-y-6">
        <SignupFormInputs formData={formData} setFormData={setFormData} />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, termsAccepted: checked as boolean })
            }
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading || !formData.termsAccepted}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
};