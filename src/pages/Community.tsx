import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageSquare, Bookmark, Share, UserPlus, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFollow = (userId: string, userName: string) => {
    setFollowedUsers((prev) => {
      const isFollowing = prev.includes(userId);
      const newFollowedUsers = isFollowing
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing
          ? `You have unfollowed ${userName}`
          : `You are now following ${userName}`,
      });

      return newFollowedUsers;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Ideas</h1>
            <p className="text-gray-600">Explore and share ideas with the community</p>
          </div>
          <Button size="lg" className="gap-2">
            Share Your Idea
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6">
            {SAMPLE_POSTS.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{post.author.name}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleFollow(post.author.id, post.author.name)}
                        >
                          {followedUsers.includes(post.author.id) ? (
                            <UserCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Community;