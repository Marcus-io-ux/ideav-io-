import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Settings, Users, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { AnnouncementDialog } from "@/components/announcements/AnnouncementDialog";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { AnnouncementFilters } from "@/components/announcements/AnnouncementFilters";
import { AnnouncementHeader } from "@/components/announcements/AnnouncementHeader";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "platform_update" | "community_news" | "featured_idea";
  is_featured: boolean;
  created_at: string;
};

type CategoryFilter = "all" | "platform_update" | "community_news" | "featured_idea";

export default function Announcements() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    },
  });

  const filteredAnnouncements = announcements.filter((announcement) =>
    selectedCategory === "all" ? true : announcement.category === selectedCategory
  );

  const featuredAnnouncements = announcements.filter((a) => a.is_featured);

  const handleReadMore = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <AnnouncementHeader />
      
      {/* Featured Announcements */}
      {featuredAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Updates</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onReadMore={handleReadMore}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <AnnouncementFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Announcements Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading announcements...</div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No announcements found for this category.
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onReadMore={handleReadMore}
            />
          ))
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center py-8 space-y-4">
        <h3 className="text-xl font-semibold">Have an update or idea to share?</h3>
        <Button asChild size="lg">
          <Link to="/community">Go to Community Page</Link>
        </Button>
      </div>

      {/* Announcement Dialog */}
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}