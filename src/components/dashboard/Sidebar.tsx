import { Home, Star, Tag, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Here you would typically clear any auth state
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-8">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-500">john@example.com</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
          <Home className="mr-2 h-4 w-4" /> Ideas
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Star className="mr-2 h-4 w-4" /> Favorites
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Tag className="mr-2 h-4 w-4" /> Tags
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/community")}>
          <Users className="mr-2 h-4 w-4" /> Community
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </nav>
    </div>
  );
};