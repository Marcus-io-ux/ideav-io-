import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

const Index = () => {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: "1",
      title: "Build a Personal Website",
      content: "Create a portfolio website using React and Three.js for 3D animations",
      tags: ["web", "portfolio", "3D"],
      createdAt: new Date("2024-02-20"),
    },
    {
      id: "2",
      title: "Learn Machine Learning",
      content: "Start with Python basics and move on to TensorFlow and PyTorch",
      tags: ["AI", "programming", "learning"],
      createdAt: new Date("2024-02-21"),
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">IdeaVault</h1>
          <p className="text-gray-600 mb-8">Capture and organize your ideas in one place</p>
          
          <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <SearchBar onSearch={handleSearch} />
            
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
                  <Button onClick={handleAddIdea} className="bg-primary hover:bg-primary-hover">
                    Save Idea
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full max-w-4xl grid gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;