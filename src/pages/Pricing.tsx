import { useQuery } from "@tanstack/react-query";
import { fetchPricingPlans } from "@/lib/api";
import { PricingPlan } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

const Pricing = () => {
  const { data: plans, isLoading } = useQuery<PricingPlan[]>({
    queryKey: ['pricing'],
    queryFn: fetchPricingPlans,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans?.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.planName}</CardTitle>
              <div className="text-3xl font-bold">${plan.price}<span className="text-sm text-gray-500">/{plan.billingCycle}</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.featuresIncluded.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6">Choose {plan.planName}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;