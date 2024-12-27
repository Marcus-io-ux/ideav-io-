import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive, Inbox, Send, Star, Trash } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface FolderCount {
  inbox: number;
  starred: number;
  sent: number;
  archived: number;
  trash: number;
}

interface InboxSidebarProps {
  counts: FolderCount;
  className?: string;
}

export const InboxSidebar = ({ counts, className }: InboxSidebarProps) => {
  const location = useLocation();
  const currentFolder = new URLSearchParams(location.search).get("folder") || "inbox";

  const folders = [
    { 
      label: "Inbox", 
      icon: Inbox, 
      value: "inbox",
      count: counts.inbox 
    },
    { 
      label: "Starred", 
      icon: Star, 
      value: "starred",
      count: counts.starred 
    },
    { 
      label: "Sent", 
      icon: Send, 
      value: "sent",
      count: counts.sent 
    },
    { 
      label: "Archived", 
      icon: Archive, 
      value: "archived",
      count: counts.archived 
    },
    { 
      label: "Trash", 
      icon: Trash, 
      value: "trash",
      count: counts.trash 
    },
  ];

  return (
    <div className={cn("w-64 border-r bg-background p-4 space-y-2", className)}>
      {folders.map((folder) => (
        <Link
          key={folder.value}
          to={`/inbox?folder=${folder.value}`}
          className="w-full"
        >
          <Button
            variant={currentFolder === folder.value ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <folder.icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{folder.label}</span>
            {folder.count > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {folder.count}
              </span>
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
};