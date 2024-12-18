import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddIdeaButton } from "@/components/AddIdeaButton";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

export const MyIdeasTab = () => {
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ideas = [] } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
      }));
    },
  });

  const filteredIdeas = ideas.filter(
    idea =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SearchBar onSearch={setSearchQuery} />
        <AddIdeaButton onClick={() => setShowAddIdea(true)} />
      </div>

      <div className="grid gap-6">
        {filteredIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            {...idea}
          />
        ))}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No ideas found</p>
          </div>
        )}
      </div>

      {showAddIdea && (
        <AddIdeaDialog onIdeaSubmit={() => setShowAddIdea(false)} />
      )}
    </div>
  );
};