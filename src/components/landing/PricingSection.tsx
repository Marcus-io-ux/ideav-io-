import { Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PricingSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpgradeClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          user,
          priceId: 'your_stripe_price_id', // Replace with your actual Stripe price ID
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
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
              Start for Free
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
            Upgrade to Pro
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
    </section>
  );
};
