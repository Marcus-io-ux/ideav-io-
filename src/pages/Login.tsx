import { Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { FAQDialog } from "@/components/auth/FAQDialog";
import { useEffect } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('Successfully signed in');
      } else if (event === 'SIGNED_OUT') {
        console.log('Successfully signed out');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
    });

    // Set up error handling for sign-in attempts
    const handleSignInError = (error: AuthError) => {
      toast({
        title: "Authentication Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    };

    // Subscribe to auth state changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'Email not confirmed':
          return 'Please verify your email address before signing in.';
        case 'User not found':
          return 'No user found with these credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          IdeaVault
        </Link>
        <div className="flex gap-4 items-center">
          <FAQDialog />
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <AuthLogo />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your journey with IdeaVault.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "rgb(59, 130, 246)", // primary blue color
                    brandAccent: "rgb(99, 102, 241)", // hover color
                  },
                },
              },
              className: {
                container: "space-y-4",
                button: "w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full transition-colors",
                input: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                label: "block text-sm font-medium text-gray-700 mb-1",
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
          />

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
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

export default Login;