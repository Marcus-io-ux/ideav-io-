import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Brain, Check, FolderOpen, Lock, Phone, Users, Zap, Gauge, BarChart, Loader2 } from "lucide-react";

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
  onCancel?: () => void;
}

export const PlanCard = ({
  plan,
  isCurrentPlan,
  isLoading,
  onUpgrade,
  onCancel,
}: PlanCardProps) => {
  const isPro = plan.name.toLowerCase() === 'pro';
  
  const getFeatureIcon = (feature: string) => {
    const iconMap: Record<string, any> = {
      "Unlimited ideas": Brain,
      "Advanced organization": Zap,
      "Priority support": Lock,
      "Collaboration features": Users,
      "Advanced analytics": Gauge,
      "Custom tags": Check,
      "Create up to 50 ideas": Brain,
      "Basic organization": FolderOpen,
      "Community access": Users,
      "Basic support": Phone,
      "Basic analytics": BarChart,
    };
    return iconMap[feature] || Check;
  };

  return (
    <Card className={`p-8 ${
      isPro 
        ? 'border-2 border-purple-200 shadow-xl hover:shadow-2xl' 
        : 'border border-blue-100 hover:border-blue-200 hover:shadow-lg'
    } bg-white/70 backdrop-blur-sm transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${isPro ? 'text-purple-900' : 'text-blue-900'}`}>
          {plan.name}
        </h3>
        <Award className={`w-6 h-6 ${isPro ? 'text-purple-500' : 'text-blue-500'}`} />
      </div>

      <div className="mb-6">
        <span className={`text-4xl font-bold ${isPro ? 'text-purple-600' : 'text-blue-600'}`}>
          ${plan.price}
        </span>
        <span className={`${isPro ? 'text-purple-600/60' : 'text-blue-600/60'}`}>/month</span>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => {
          const FeatureIcon = getFeatureIcon(feature);
          return (
            <li key={index} className="flex items-center gap-3">
              <FeatureIcon className={`w-5 h-5 ${isPro ? 'text-purple-500' : 'text-blue-500'}`} />
              <span className={`${isPro ? 'text-purple-600/80' : 'text-blue-600/80'}`}>
                {feature}
              </span>
            </li>
          );
        })}
      </ul>

      {isCurrentPlan ? (
        <div className="space-y-3">
          <Button
            className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            disabled={true}
          >
            Current Plan
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          )}
        </div>
      ) : (
        <Button
          className={`w-full py-6 text-lg ${
            isPro
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'border-blue-200 hover:bg-blue-50 text-blue-600'
          }`}
          disabled={isLoading}
          onClick={() => onUpgrade(plan.id)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Upgrade to ${plan.name}`
          )}
        </Button>
      )}
    </Card>
  );
};