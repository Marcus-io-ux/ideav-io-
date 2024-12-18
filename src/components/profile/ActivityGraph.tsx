import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format } from "date-fns";

export const ActivityGraph = ({ userId }: { userId: string }) => {
  const { data: activityData } = useQuery({
    queryKey: ["user-activity", userId],
    queryFn: async () => {
      const startDate = subMonths(startOfMonth(new Date()), 5);
      
      const { data } = await supabase
        .from("ideas")
        .select("created_at")
        .eq("user_id", userId)
        .eq("deleted", false)
        .gte("created_at", startDate.toISOString());

      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const month = subMonths(new Date(), i);
        const monthStr = format(month, "MMM");
        const count = data?.filter(idea => 
          format(new Date(idea.created_at), "MMM") === monthStr
        ).length || 0;
        
        return {
          month: monthStr,
          ideas: count,
        };
      }).reverse();

      return monthlyData;
    },
  });

  if (!activityData?.some(d => d.ideas > 0)) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Ideas Created Over Time</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ideas" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};