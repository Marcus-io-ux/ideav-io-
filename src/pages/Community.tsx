import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Search, TrendingUp, Clock, Users, Filter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    // Implement post creation logic here
    toast({
      title: "Post created",
      description: "Your idea has been shared with the community!",
    });
    setPostContent("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to the IdeaVault Community!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Share your ideas, collaborate with like-minded innovators, and get valuable feedback to refine your vision.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">Post an Idea</Button>
          <Button size="lg" variant="outline">Join a Discussion</Button>
          <Button size="lg" variant="outline">Explore Trending Ideas</Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">My Posts</Button>
              <Button variant="ghost" className="w-full justify-start">My Saved Ideas</Button>
              <Button variant="ghost" className="w-full justify-start">Explore Topics</Button>
              <Button variant="ghost" className="w-full justify-start">Popular Users</Button>
            </nav>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Community Stats</h3>
            <div className="space-y-2">
              <p>100,000+ ideas shared</p>
              <p>10,000+ collaborations formed</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-6 space-y-6">
          {/* Post Creation */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">What's on your mind?</h2>
            <Textarea
              placeholder="Share your latest idea, ask a question, or start a discussion..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Attach Files</Button>
                <Button variant="outline" size="sm">Add Tags</Button>
                <Button variant="outline" size="sm">Tag Users</Button>
              </div>
              <Button onClick={handlePost}>Post</Button>
            </div>
          </div>

          {/* Feed Tabs */}
          <Tabs defaultValue="trending">
            <TabsList className="w-full">
              <TabsTrigger value="trending" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="newest" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Newest
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Collaborative
              </TabsTrigger>
            </TabsList>

            {/* Example Post Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm mt-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Posted 2 hours ago</p>
                </div>
              </div>
              <p className="mb-4">
                Looking for feedback on my new app idea! It's a platform that helps people track their creative projects...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">#Innovation</Badge>
                <Badge variant="secondary">#FeedbackNeeded</Badge>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </Tabs>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search ideas, users, or topics..." />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Achievements</h3>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                🌟 Idea Contributor
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🤝 Top Collaborator
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🏗️ Community Builder
              </Badge>
            </div>
          </div>
        </aside>
      </div>

      {/* Call to Action */}
      <section className="text-center mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4">Start Sharing Your Ideas Today!</h2>
        <div className="flex justify-center gap-4">
          <Button size="lg">Join the Conversation</Button>
          <Button size="lg" variant="outline">Share Your First Idea</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 pt-8">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline">Community Guidelines</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Community;