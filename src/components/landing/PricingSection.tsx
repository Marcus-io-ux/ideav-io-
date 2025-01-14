import { Check, Award, Sparkles, Zap, Brain, Users, Lock, Gauge, FolderOpen, FileTemplate, Bell, Phone, BarChart } from "lucide-react";
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

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId: user.id,
          email: user.email,
          returnUrl: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;

      if (data?.url) {
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
    <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Transform Your Ideas into Reality
        </h2>
        <p className="text-xl text-blue-600/80 max-w-3xl mx-auto">
          Choose the perfect plan to capture, develop, and bring your innovative ideas to life
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        {/* Basic Plan */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-blue-900">Basic</h3>
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">$19.99</span>
            <span className="text-blue-600/60">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              { icon: Brain, text: "Save up to 100 ideas in your personal vault" },
              { icon: FolderOpen, text: "Categorize and sort your ideas using folders and tags" },
              { icon: FileTemplate, text: "Access a limited library of pre-designed templates" },
              { icon: Users, text: "Participate in community discussions" },
              { icon: Bell, text: "Daily reminders to revisit and refine ideas" },
              { icon: Phone, text: "Mobile-friendly dashboard access" },
              { icon: BarChart, text: "Basic analytics and monthly metrics" }
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3">
                <feature.icon className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600/80">{feature.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg border-blue-200 hover:bg-blue-50 text-blue-600"
            >
              Start Creating Today
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Most Popular</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-purple-900">Pro</h3>
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-purple-600">$49.99</span>
            <span className="text-purple-600/60">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              { icon: Brain, text: "Unlimited idea storage" },
              { icon: Zap, text: "Advanced AI-powered organization" },
              { icon: Users, text: "Priority community features" },
              { icon: Lock, text: "24/7 priority support" },
              { icon: Gauge, text: "Advanced analytics & insights" },
              { icon: Check, text: "Custom tags & categories" },
              { icon: Check, text: "Team collaboration suite" },
              { icon: Check, text: "API access for integration" },
              { icon: Check, text: "Custom workflow automation" },
              { icon: Check, text: "Advanced idea validation tools" },
              { icon: Check, text: "Priority feature access" }
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3">
                <feature.icon className="w-5 h-5 text-purple-500" />
                <span className="text-purple-600/80">{feature.text}</span>
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
            onClick={handleUpgradeClick}
          >
            {isSubscribed ? "Already Subscribed" : "Upgrade to Pro"}
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-purple-100">
          <p className="text-purple-600/90 italic text-lg">
            "IdeaVault Pro transformed how I manage my creative projects. The collaboration features and AI-powered insights have been game-changing for my business!"
          </p>
          <p className="text-purple-600/70 mt-2">– Sarah Chen, Product Designer</p>
        </div>
      </div>

      <AlertDialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to IdeaVault Pro</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to upgrade to our Pro plan for $49.99/month. Get ready to unlock unlimited storage, advanced collaboration features, and priority support!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubscribeConfirm}>
              Confirm Upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
