import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
  };
  isCurrentPlan: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, isCurrentPlan, onSelect }: PlanCardProps) {
  return (
    <Card className="relative">
      {isCurrentPlan && (
        <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1">
          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <CardContent className="pt-6">
        <div className="space-y-2">
          <h4 className="font-medium">{plan.name}</h4>
          <p className="text-2xl font-bold">
            ${plan.price}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          <ul className="space-y-2 text-sm">
            {plan.features?.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={isCurrentPlan ? "outline" : "default"}
            onClick={onSelect}
          >
            {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}