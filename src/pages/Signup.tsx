import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";
import { SocialSignup } from "@/components/auth/SocialSignup";
import { Button } from "@/components/ui/button";
import { FAQDialog } from "@/components/auth/FAQDialog";

const Signup = () => {
  const scrollToFAQ = () => {
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-4 py-6 flex justify-end items-center">
        <div className="flex gap-4 items-center">
          <FAQDialog />
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Join Idea Vault Today!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Turn your ideas into action. Save, share, and collaborate with a community of innovators.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <SignupForm />
          <SocialSignup />

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your data is secure and will never be shared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;