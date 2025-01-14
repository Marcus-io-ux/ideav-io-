import { Loader2 } from "lucide-react";
import { PlanCard } from "./plan/PlanCard";
import { usePlans } from "./plan/usePlans";

export const PlanTab = () => {
  const { currentPlan, availablePlans, isLoading, handleUpgrade, handleCancel } = usePlans();

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
          Choose the perfect plan to capture, develop, and bring your innovative ideas to life
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {availablePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlan?.tier_id === plan.id}
            isLoading={isLoading}
            onUpgrade={handleUpgrade}
            onCancel={currentPlan ? handleCancel : undefined}
          />
        ))}
      </div>
    </div>
  );
};