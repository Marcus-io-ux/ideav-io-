import { Loader2 } from "lucide-react";
import { PlanCard } from "./plan/PlanCard";
import { usePlans } from "./plan/usePlans";

export const PlanTab = () => {
  const { currentPlan, availablePlans, isLoading, handleUpgrade } = usePlans();

  if (!availablePlans) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Plan</h2>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availablePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlan?.tier_id === plan.id}
            isLoading={isLoading}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  );
};