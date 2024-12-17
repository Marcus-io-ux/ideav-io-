import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Stats } from "@/components/dashboard/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
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
  
  const [newIdea, setNewIdea] = useState({ title: "", content: "", tags: "" });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

  const handleAddIdea = () => {
    if (!newIdea.title || !newIdea.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      });
      return;
    }

    const idea: Idea = {
      id: Date.now().toString(),
      title: newIdea.title,
      content: newIdea.content,
      tags: newIdea.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      isFavorite: false,
    };

    setIdeas([idea, ...ideas]);
    setNewIdea({ title: "", content: "", tags: "" });
    
    toast({
      title: "Success!",
      description: "Your idea has been saved.",
    });
  };

  const filteredIdeas = ideas.filter(
    (idea) => showFavoritesOnly ? idea.isFavorite : true
  );

  const highPriorityCount = ideas.filter(idea => idea.priority === "high").length;

  // Mock following counts for now
  const followersCount = 128;
  const followingCount = 89;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-gray-600">You have {ideas.length} ideas stored</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <AddIdeaButton onClick={() => {}} />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Idea</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Title"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Describe your idea..."
                    value={newIdea.content}
                    onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                  />
                  <Input
                    placeholder="Tags (comma-separated)"
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                  />
                  <Button onClick={handleAddIdea}>Save Idea</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Row */}
          <div className="mb-8">
            <Stats
              totalIdeas={ideas.length}
              highPriorityCount={highPriorityCount}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          </div>

          {/* Ideas Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Ideas</h3>
              <Button
                variant="ghost"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "text-sm",
                  showFavoritesOnly && "text-primary"
                )}
              >
                {showFavoritesOnly ? "Show All" : "Show Favorites"}
              </Button>
            </div>

            <Tabs defaultValue="recent" className="mb-8">
              <TabsList>
                <TabsTrigger value="recent">Recent Ideas</TabsTrigger>
                <TabsTrigger value="all">All Ideas</TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="grid gap-6">
                  {filteredIdeas.slice(0, 5).map((idea) => (
                    <IdeaCard key={idea.id} {...idea} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="all">
                <div className="grid gap-6">
                  {filteredIdeas.map((idea) => (
                    <IdeaCard key={idea.id} {...idea} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
