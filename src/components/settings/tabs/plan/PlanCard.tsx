import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  isCurrentPlan: boolean;
  isLoading: boolean;
  onUpgrade: (tierId: string) => void;
}

export const PlanCard = ({
  plan,
  isCurrentPlan,
  isLoading,
  onUpgrade,
}: PlanCardProps) => {
  const isPro = plan.name.toLowerCase() === 'pro';

  return (
    <Card className={`p-6 ${isPro ? 'border-primary' : ''}`}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            {isPro && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <p className="text-2xl font-bold">${plan.price}<span className="text-sm text-muted-foreground">/month</span></p>
        </div>
        
        <div className="space-y-2">
          {plan.features?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "secondary" : "default"}
          disabled={isLoading || isCurrentPlan}
          onClick={() => onUpgrade(plan.id)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            isCurrentPlan ? "Current Plan" : "Upgrade"
          )}
        </Button>
      </div>
    </Card>
  );
};