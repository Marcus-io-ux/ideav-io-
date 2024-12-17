import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stats } from "@/components/dashboard/Stats";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { IdeasList } from "@/components/dashboard/IdeasList";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
}

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: "1",
      title: "Build a Personal Website",
      content: "Create a portfolio website using React and Three.js for 3D animations",
      tags: ["web", "portfolio", "3D"],
      createdAt: new Date("2024-02-20"),
      priority: "high",
      isFavorite: true,
    },
    {
      id: "2",
      title: "Learn Machine Learning",
      content: "Start with Python basics and move on to TensorFlow and PyTorch",
      tags: ["AI", "programming", "learning"],
      createdAt: new Date("2024-02-21"),
      priority: "medium",
      isFavorite: false,
    },
  ]);
  
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

  const handleAddIdea = (newIdeaData: {
    title: string;
    content: string;
    tags: string[];
    shareToCommunity: boolean;
  }) => {
    const idea: Idea = {
      id: Date.now().toString(),
      title: newIdeaData.title,
      content: newIdeaData.content,
      tags: newIdeaData.tags,
      createdAt: new Date(),
      isFavorite: false,
      sharedToCommunity: newIdeaData.shareToCommunity,
    };

    setIdeas([idea, ...ideas]);

    // Save to personal ideas
    const personalIdeas = JSON.parse(localStorage.getItem("personalIdeas") || "[]");
    localStorage.setItem("personalIdeas", JSON.stringify([idea, ...personalIdeas]));

    // If sharing to community, save to community ideas as well
    if (newIdeaData.shareToCommunity) {
      const communityIdeas = JSON.parse(localStorage.getItem("communityIdeas") || "[]");
      localStorage.setItem(
        "communityIdeas",
        JSON.stringify([
          {
            ...idea,
            author: {
              id: "current-user",
              name: "Current User",
              avatar: "/placeholder.svg",
            },
            likes: 0,
            comments: 0,
          },
          ...communityIdeas,
        ])
      );

      toast({
        title: "Idea Shared!",
        description: "Your idea has been saved and shared to the community.",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your idea has been saved.",
      });
    }
  };

  const highPriorityCount = ideas.filter((idea) => idea.priority === "high").length;
  const followersCount = 128;
  const followingCount = 89;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-gray-600">You have {ideas.length} ideas stored</p>
            </div>
            <AddIdeaDialog onIdeaSubmit={handleAddIdea} />
          </div>

          <div className="mb-8">
            <Stats
              totalIdeas={ideas.length}
              highPriorityCount={highPriorityCount}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          </div>

          <IdeasList
            ideas={ideas}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;