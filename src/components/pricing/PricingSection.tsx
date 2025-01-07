import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Access to basic idea tracking tools",
        "5 active idea slots",
        "Community access",
        "Basic support",
      ],
      buttonText: "Get Started for Free",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      description: "Best for serious ideators",
      features: [
        "Unlimited idea slots",
        "Advanced collaboration tools",
        "Analytics dashboard",
        "File attachments",
        "Priority support",
        "Custom categories",
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
  ];

  return (
    <section className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start for free or unlock all features with our Pro plan. No hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.isPopular
                  ? "border-primary shadow-lg scale-105 md:scale-110"
                  : "border-border shadow-sm"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4" /> Best Value
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.isPopular ? "bg-primary hover:bg-primary-hover" : ""
                }`}
                variant={plan.isPopular ? "default" : "outline"}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};