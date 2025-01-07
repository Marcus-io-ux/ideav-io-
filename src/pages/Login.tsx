import { Link, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('Successfully signed in');
        // If user came from pricing, redirect them back there
        if (from === '/pricing') {
          navigate('/pricing');
        } else {
          navigate('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Signed out');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
        // Check for any auth errors
        supabase.auth.getSession().then(({ error }) => {
          if (error) {
            toast({
              title: "Error",
              description: getErrorMessage(error),
              variant: "destructive",
            });
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from, toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
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
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
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
                    brand: "rgb(59, 130, 246)",
                    brandAccent: "rgb(99, 102, 241)",
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}${from}`}
          />

          <p className="mt-4 text-center text-xs text-gray-500">
            Your data is secure and will never be shared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;