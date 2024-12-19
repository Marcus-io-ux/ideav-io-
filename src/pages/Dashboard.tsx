import { useState } from "react";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useIdeas } from "@/hooks/use-ideas";

const Dashboard = () => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [dailyQuote] = useState("The best way to predict the future is to create it.");
  const { userName } = useUserProfile();
  const { ideas, handleDeleteIdeas, handleRestoreIdeas } = useIdeas();

  const handleEditIdea = async (id: string) => {
    // This will be implemented in a future update
    console.log("Edit idea:", id);
  };

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
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
            <IdeasList
              ideas={ideas}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={handleToggleFavorites}
              onEditIdea={handleEditIdea}
              onDeleteIdeas={handleDeleteIdeas}
              onRestoreIdeas={handleRestoreIdeas}
            />
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
