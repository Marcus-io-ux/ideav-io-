import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Stats } from "@/components/dashboard/Stats";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
}

const mockChartData = [
  { name: "Mon", ideas: 4 },
  { name: "Tue", ideas: 3 },
  { name: "Wed", ideas: 2 },
  { name: "Thu", ideas: 6 },
  { name: "Fri", ideas: 4 },
  { name: "Sat", ideas: 3 },
  { name: "Sun", ideas: 5 },
];

const popularTags = ["work", "personal", "urgent", "creative", "goals"];

const Dashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: "1",
      title: "Build a Personal Website",
      content: "Create a portfolio website using React and Three.js for 3D animations",
      tags: ["web", "portfolio", "3D"],
      createdAt: new Date("2024-02-20"),
      priority: "high",
    },
    {
      id: "2",
      title: "Learn Machine Learning",
      content: "Start with Python basics and move on to TensorFlow and PyTorch",
      tags: ["AI", "programming", "learning"],
      createdAt: new Date("2024-02-21"),
      priority: "medium",
    },
  ]);
  
  const [newIdea, setNewIdea] = useState({ title: "", content: "", tags: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

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
    };

    setIdeas([idea, ...ideas]);
    setNewIdea({ title: "", content: "", tags: "" });
    
    toast({
      title: "Success!",
      description: "Your idea has been saved.",
    });
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery) ||
      idea.content.toLowerCase().includes(searchQuery) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  const highPriorityCount = ideas.filter(idea => idea.priority === "high").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
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

          {/* Stats and Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <SearchBar onSearch={handleSearch} />
            </div>
            <Stats
              totalIdeas={ideas.length}
              highPriorityCount={highPriorityCount}
              popularTags={popularTags}
              onTagClick={handleSearch}
            />
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={mockChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="ideas" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Ideas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Ideas</h3>
            <div className="grid gap-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;