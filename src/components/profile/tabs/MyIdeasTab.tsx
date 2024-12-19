import { useState, useEffect } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IdeaForm } from "@/components/dashboard/IdeaForm";

export const MyIdeasTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIdea, setEditingIdea] = useState<any>(null);
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
    const { data: { subscription } } = supabase.auth.getUser();
    if (!subscription) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel('ideas_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
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

  const handleEditIdea = (id: string) => {
    const ideaToEdit = ideas.find(idea => idea.id === id);
    if (ideaToEdit) {
      setEditingIdea({
        ...ideaToEdit,
        tags: ideaToEdit.tags || [],
      });
    }
  };

  const handleUpdateIdea = async () => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          title: editingIdea.title,
          content: editingIdea.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingIdea.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your idea has been updated",
      });

      setEditingIdea(null);
      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    } catch (error) {
      console.error('Error updating idea:', error);
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            onEdit={handleEditIdea}
          />
        ))}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No ideas found</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingIdea} onOpenChange={() => setEditingIdea(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
          </DialogHeader>
          {editingIdea && (
            <IdeaForm
              idea={editingIdea}
              onIdeaChange={(field, value) => setEditingIdea(prev => ({ ...prev, [field]: value }))}
              onCancel={() => setEditingIdea(null)}
              onSaveDraft={() => {}}
              onSubmit={handleUpdateIdea}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};