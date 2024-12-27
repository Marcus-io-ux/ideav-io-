import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Lightbulb } from "lucide-react";
import { format } from "date-fns";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    category: "platform_update" | "community_news" | "featured_idea";
    created_at: string;
  };
  onReadMore: (announcement: any) => void;
  featured?: boolean;
}

const categoryIcons = {
  platform_update: <Settings className="h-4 w-4" />,
  community_news: <Users className="h-4 w-4" />,
  featured_idea: <Lightbulb className="h-4 w-4" />,
};

const categoryStyles = {
  platform_update: "bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20",
  community_news: "bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20",
  featured_idea: "bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20",
};

const categoryLabels = {
  platform_update: "Platform Update",
  community_news: "Community News",
  featured_idea: "Featured Idea",
};

export const AnnouncementCard = ({ announcement, onReadMore, featured }: AnnouncementCardProps) => {
  return (
    <Card className={featured ? "border-2 border-primary/20 bg-accent" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 font-medium ${categoryStyles[announcement.category]}`}
          >
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
        <p className="text-muted-foreground line-clamp-3">{announcement.content}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="ml-auto"
          onClick={() => onReadMore(announcement)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};