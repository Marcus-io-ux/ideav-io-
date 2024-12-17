import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Settings, Users, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "platform_update" | "community_news" | "featured_idea";
  is_featured: boolean;
  created_at: string;
};

type CategoryFilter = "all" | "platform_update" | "community_news" | "featured_idea";

const categoryIcons = {
  platform_update: <Settings className="h-4 w-4" />,
  community_news: <Users className="h-4 w-4" />,
  featured_idea: <Lightbulb className="h-4 w-4" />,
};

const categoryLabels = {
  platform_update: "Platform Update",
  community_news: "Community News",
  featured_idea: "Featured Idea",
};

export default function Announcements() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

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

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
          Stay Updated with Idea Vault
        </h1>
        <p className="text-muted-foreground text-lg">
          All the latest platform updates, featured ideas, and community highlights in one place.
        </p>
      </div>

      {/* Featured Announcements */}
      {featuredAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Updates</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-2 border-primary/20 bg-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {categoryIcons[announcement.category]}
                      {categoryLabels[announcement.category]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(announcement.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{announcement.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          All Updates
        </Button>
        <Button
          variant={selectedCategory === "platform_update" ? "default" : "outline"}
          onClick={() => setSelectedCategory("platform_update")}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Platform Updates
        </Button>
        <Button
          variant={selectedCategory === "community_news" ? "default" : "outline"}
          onClick={() => setSelectedCategory("community_news")}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Community News
        </Button>
        <Button
          variant={selectedCategory === "featured_idea" ? "default" : "outline"}
          onClick={() => setSelectedCategory("featured_idea")}
          className="flex items-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Featured Ideas
        </Button>
      </div>

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
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categoryIcons[announcement.category]}
                    {categoryLabels[announcement.category]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(announcement.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mt-2">{announcement.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{announcement.content}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="ml-auto">
                  Read More
                </Button>
              </CardFooter>
            </Card>
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
    </div>
  );
}