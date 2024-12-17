import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { IdeaCard } from "@/components/community/IdeaCard";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
}

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: "1",
    title: "Building a Personal Portfolio Website",
    content: "I'm thinking of creating a unique portfolio website using Three.js for interactive 3D elements. Would love to get some feedback on this approach.",
    author: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
    },
    likes: 24,
    comments: 8,
    tags: ["web-dev", "portfolio", "3D"],
    createdAt: new Date("2024-02-25"),
  },
  {
    id: "2",
    title: "Mobile App for Local Events",
    content: "Working on an app that helps people discover local events and meetups. Looking for ideas on making the discovery process more intuitive.",
    author: {
      id: "user2",
      name: "Mike Ross",
      avatar: "/placeholder.svg",
    },
    likes: 15,
    comments: 5,
    tags: ["mobile", "events", "local"],
    createdAt: new Date("2024-02-24"),
  },
];

const Community = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();

  const handleIdeaSubmit = (idea: {
    title: string;
    content: string;
    category: string;
    feedbackType: string;
    isCollaborative: boolean;
  }) => {
    // In a real app, this would make an API call to save the idea
    const newIdea: CommunityPost = {
      id: Date.now().toString(),
      title: idea.title,
      content: idea.content,
      author: {
        id: "current-user",
        name: "Current User",
        avatar: "/placeholder.svg",
      },
      likes: 0,
      comments: 0,
      tags: [idea.category, idea.feedbackType],
      createdAt: new Date(),
    };

    // Add the new idea to the list (in a real app, this would be handled by a state management solution)
    SAMPLE_POSTS.unshift(newIdea);

    toast({
      title: "Idea shared!",
      description: "Your idea has been shared with the community",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto">
          <NavigationMenu className="py-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link to="/community" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Latest Ideas</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse the most recent project ideas from the community
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/community?filter=trending" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Trending</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          See what ideas are gaining traction in the community
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link to="/community?category=web" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Web Development</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Projects focused on web technologies and frameworks
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/community?category=mobile" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Mobile Apps</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Mobile application ideas and concepts
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Ideas</h1>
            <p className="text-gray-600">Explore and share ideas with the community</p>
          </div>
          <Button
            size="lg"
            onClick={() => setIsShareModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary-hover text-white"
          >
            <Plus className="h-5 w-5" />
            Share Your Idea
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6">
            {SAMPLE_POSTS.map((post) => (
              <IdeaCard key={post.id} {...post} />
            ))}
          </div>
        </ScrollArea>
      </div>

      <ShareIdeaModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleIdeaSubmit}
      />
    </div>
  );
};

export default Community;
