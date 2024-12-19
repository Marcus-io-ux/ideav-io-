import { cn } from "@/lib/utils";

interface IdeaBadgeProps {
  type: "category" | "feedback";
  label: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  tech: "bg-[#0EA5E9] text-white",
  design: "bg-[#D946EF] text-white",
  health: "bg-[#8B5CF6] text-white",
  business: "bg-[#F97316] text-white",
  other: "bg-[#7E69AB] text-white",
  default: "bg-[#9b87f5] text-white"
};

const FEEDBACK_COLORS: Record<string, string> = {
  improvement: "bg-[#E5DEFF] text-[#7E69AB]",
  collaboration: "bg-[#FDE1D3] text-[#F97316]",
  feedback: "bg-[#D3E4FD] text-[#0EA5E9]",
  feature: "bg-[#E5FFE5] text-[#16A34A]",
  bug: "bg-[#FFE5E5] text-[#DC2626]",
  default: "bg-[#F2FCE2] text-[#7E69AB]"
};

export const IdeaBadge = ({ type, label }: IdeaBadgeProps) => {
  const colors = type === "category" ? CATEGORY_COLORS : FEEDBACK_COLORS;
  const colorClass = colors[label.toLowerCase()] || colors.default;

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-sm font-medium",
      colorClass
    )}>
      {label}
    </span>
  );
};