import { PageHeader } from "@/components/ui/page-header";

interface DashboardHeaderProps {
  userName: string;
  dailyQuote: string;
}

export const DashboardHeader = ({ userName, dailyQuote }: DashboardHeaderProps) => {
  return (
    <PageHeader
      title={`Welcome back, ${userName}!`}
      description={`"${dailyQuote}"`}
    />
  );
};