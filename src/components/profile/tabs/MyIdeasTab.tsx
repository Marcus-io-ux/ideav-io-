import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { SearchBar } from "@/components/SearchBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IdeaForm } from "@/components/dashboard/IdeaForm";
import { IdeaFormData } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface Idea extends Omit<IdeaFormData, 'tags'> {
  id: string;
  created_at: string;
  user_id: string;
  deleted: boolean;
  deleted_at: string;
  createdAt: Date;
  tags: string[];
}

export const MyIdeasTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: ideas = [] } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
        tags: [], // Initialize empty tags array since it's not in the database
      }));
    },
  });

  const handleEditIdea = (id: string) => {
    const ideaToEdit = ideas.find(idea => idea.id === id);
    if (ideaToEdit) {
      setEditingIdea(ideaToEdit);
    }
  };

  const handleUpdateIdea = async () => {
    if (!editingIdea) return;

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

  const handleDeleteAllIdeas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All ideas have been permanently deleted",
      });

      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    } catch (error) {
      console.error('Error deleting all ideas:', error);
      toast({
        title: "Error",
        description: "Failed to delete ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredIdeas = ideas.filter(
    idea =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SearchBar 
          value={searchQuery}
          onSearch={setSearchQuery}
        />
        <div className="flex items-center gap-4">
          <AddIdeaDialog buttonText="Add New Idea" onIdeaSubmit={async () => {
            await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
          }} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete All Ideas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Ideas?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your ideas, including those in trash.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllIdeas} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
              onIdeaChange={(field, value) => setEditingIdea(prev => prev ? { ...prev, [field]: value } : null)}
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