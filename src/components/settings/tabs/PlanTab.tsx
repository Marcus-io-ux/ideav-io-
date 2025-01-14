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
          Choose the perfect plan to capture, develop, and bring your innovative ideas to life
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

      <div className="mt-12 text-center">
        <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-purple-100">
          <p className="text-purple-600/90 italic text-lg">
            "IdeaVault Pro transformed how I manage my creative projects. The collaboration features and AI-powered insights have been game-changing for my business!"
          </p>
          <p className="text-purple-600/70 mt-2">– Sarah Chen, Product Designer</p>
        </div>
      </div>
    </div>
  );
};