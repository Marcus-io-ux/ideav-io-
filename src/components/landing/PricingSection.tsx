import { Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const PricingSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  // Check if user is already subscribed
  const { data: isSubscribed } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('user_memberships')
        .select('*, membership_tiers(name)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      return data?.membership_tiers?.name === 'pro';
    },
  });

  const handleUpgradeClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
      
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    // If already subscribed, show message
    if (isSubscribed) {
      toast({
        title: "Already Subscribed",
        description: "You are already subscribed to the Pro plan.",
      });
      return;
    }

    setShowSubscribeDialog(true);
  };

  const handleSubscribeConfirm = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login', { state: { from: '/pricing' } });
        return;
      }

      console.log('Creating checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId: user.id,
          email: user.email,
          returnUrl: window.location.origin + '/dashboard'
        }
      });

      if (error) {
        console.error('Checkout session error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 pricing-section">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
          Choose Your Plan. Start Building Today.
        </h2>
        <p className="text-xl text-blue-600/80 max-w-3xl mx-auto">
          Save your ideas for free or unlock powerful tools to share, collaborate, and bring your ideas to life.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        {/* Starter Plan */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-blue-900">Starter</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">$0</span>
            <span className="text-blue-600/60">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              "Save up to 10 personal ideas",
              "Access your private vault",
              "Browse and explore community ideas",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg border-blue-200 hover:bg-blue-50 text-blue-600"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Best Value</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-blue-900">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">$10</span>
            <span className="text-blue-600/60">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              "Unlimited personal idea storage",
              "Share ideas with the community for feedback",
              "Collaborate with up to 5 users per idea",
              "Priority support for Pro members",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
            onClick={handleUpgradeClick}
          >
            {isSubscribed ? 'Already Subscribed' : 'Upgrade to Pro'}
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center space-y-4">
        <p className="text-blue-600/80">No credit card required for Starter Plan • Upgrade anytime, risk-free</p>
        <div className="max-w-2xl mx-auto bg-blue-50/50 backdrop-blur-sm p-6 rounded-lg">
          <p className="text-blue-600/90 italic">
            "Pro helped me collaborate and launch my ideas faster than ever!"
          </p>
          <p className="text-blue-600/70 mt-2">– Michael, Innovator</p>
        </div>
      </div>

      <AlertDialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Subscribe to IdeaVault Pro</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to upgrade to our Pro plan for $10/month. Get ready to unlock unlimited storage, community sharing, and collaboration features!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubscribeConfirm}>
              Subscribe Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};