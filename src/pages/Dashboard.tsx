import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [dailyQuote] = useState("The best way to predict the future is to create it.");
  const { userName } = useUserProfile();

  const handleIdeaSubmit = () => {
    // This will be implemented in a future update
    console.log("Idea submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto p-8">
        <div className="space-y-8">
          <PageHeader
            title={`Welcome back, ${userName}!`}
            description={`"${dailyQuote}"`}
          />
          <div className="mt-8">
            <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
          </div>
        </div>
      </div>
      <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <DashboardTutorial />
    </div>
  );
};

export default Dashboard;