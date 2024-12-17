import { Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-blue-50 pricing-section">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Choose Your Plan. Start Building Today.</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Save your ideas for free or unlock powerful tools to share, collaborate, and bring your ideas to life.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Starter Plan */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Starter</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              "Save up to 10 personal ideas",
              "Access your private vault",
              "Browse and explore community ideas",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full py-6 text-lg hover:bg-blue-50"
            >
              Start for Free
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Best Value</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">$10</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              "Unlimited personal idea storage",
              "Share ideas with the community for feedback",
              "Collaborate with up to 5 users per idea",
              "Priority support for Pro members",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup?plan=pro">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="mt-12 text-center space-y-4">
        <p className="text-gray-600">No credit card required for Starter Plan • Upgrade anytime, risk-free</p>
        <div className="max-w-2xl mx-auto bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700 italic">
            "Pro helped me collaborate and launch my idea faster than ever!"
          </p>
          <p className="text-gray-600 mt-2">– Sarah, Innovator</p>
        </div>
      </div>
    </section>
  );
};
