import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite: boolean;
}

const Favorites = () => {
  // Mock data - in a real app, this would come from your backend
  const [ideas] = useState<Idea[]>([
    {
      id: "1",
      title: "Build a Personal Website",
      content: "Create a portfolio website using React and Three.js for 3D animations",
      tags: ["web", "portfolio", "3D"],
      createdAt: new Date("2024-02-20"),
      isFavorite: true,
    },
    {
      id: "2",
      title: "Learn Machine Learning",
      content: "Start with Python basics and move on to TensorFlow and PyTorch",
      tags: ["AI", "programming", "learning"],
      createdAt: new Date("2024-02-21"),
      isFavorite: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.isFavorite &&
      (idea.title.toLowerCase().includes(searchQuery) ||
        idea.content.toLowerCase().includes(searchQuery) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery)))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Favorite Ideas</h1>
              <p className="text-gray-600">
                You have {filteredIdeas.length} favorite ideas
              </p>
            </div>
          </div>

          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="grid gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                title={idea.title}
                content={idea.content}
                createdAt={idea.createdAt}
                isFavorite={idea.isFavorite}
              />
            ))}
            {filteredIdeas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No favorite ideas found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;