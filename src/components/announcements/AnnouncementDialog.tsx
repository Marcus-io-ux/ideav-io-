import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Lightbulb } from "lucide-react";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: {
    title: string;
    content: string;
    category: "platform_update" | "community_news" | "featured_idea";
    created_at: string;
  } | null;
}

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

export const AnnouncementDialog = ({
  open,
  onOpenChange,
  announcement,
}: AnnouncementDialogProps) => {
  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {categoryIcons[announcement.category]}
              {categoryLabels[announcement.category]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(announcement.created_at), "MMM d, yyyy")}
            </span>
          </div>
          <DialogTitle className="text-2xl">{announcement.title}</DialogTitle>
          <DialogDescription className="mt-4 text-base leading-relaxed">
            {announcement.content}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};