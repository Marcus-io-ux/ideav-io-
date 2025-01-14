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

  // Find the current plan details
  const currentPlanDetails = availablePlans.find(
    plan => plan.id === currentPlan?.tier_id
  );

  if (!currentPlanDetails) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Subscription Plan</h2>
          <p className="text-muted-foreground">
            You are not currently subscribed to any plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Plan</h2>
        <p className="text-muted-foreground">
          Manage your current subscription plan
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <PlanCard
          key={currentPlanDetails.id}
          plan={currentPlanDetails}
          isCurrentPlan={true}
          isLoading={isLoading}
          onUpgrade={handleUpgrade}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};