import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";
import { SocialSignup } from "@/components/auth/SocialSignup";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Lightbulb className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Join Idea Vault Today!</h2>
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