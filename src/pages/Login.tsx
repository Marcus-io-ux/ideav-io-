import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { FAQDialog } from "@/components/auth/FAQDialog";
import { useEffect } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in successfully:', session.user.id);
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication error:', error);
    
    let errorMessage = 'An error occurred during authentication.';
    
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'Email not confirmed':
          errorMessage = 'Please verify your email address before signing in.';
          break;
        case 'User not found':
          errorMessage = 'No account found with these credentials.';
          break;
        default:
          errorMessage = error.message;
      }
    }

    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <AuthLogo />
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`
                    }
                  });
                  if (error) throw error;
                } catch (error) {
                  handleAuthError(error as AuthError);
                }
              }}
            >
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`
                    }
                  });
                  if (error) throw error;
                } catch (error) {
                  handleAuthError(error as AuthError);
                }
              }}
            >
              Continue with Google
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <FAQDialog />
        </div>
      </div>
    </div>
  );
};

export default Login;