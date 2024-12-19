import { useState, useEffect } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const MyIdeasTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: ideas = [] } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData.user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", sessionData.user.id)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
      }));
    },
  });

  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    if (!user) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel('ideas_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          console.log('Ideas changed, refreshing...');
          await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
          toast({
            title: "Ideas updated",
            description: "Your ideas list has been refreshed",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const filteredIdeas = ideas.filter(
    idea =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIdeaSubmit = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SearchBar onSearch={setSearchQuery} />
        <AddIdeaDialog buttonText="Add New Idea" onIdeaSubmit={handleIdeaSubmit} />
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
    </div>
  );
};