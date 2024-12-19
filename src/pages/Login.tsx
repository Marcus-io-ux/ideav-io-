import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative flex-1 hidden h-full lg:block">
        <div className="absolute inset-0 bg-muted" />
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
          <div className="mt-8">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "rgb(var(--primary))",
                      brandAccent: "rgb(var(--primary))",
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/dashboard`}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email address",
                    password_label: "Password",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;