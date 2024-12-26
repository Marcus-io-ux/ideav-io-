import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Settings, LogOut, Menu, Bell, User, Users, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { label: "My Ideas", icon: Home, path: "/dashboard" },
    { label: "Community", icon: Users, path: "/community" },
    { label: "Inbox", icon: Inbox, path: "/inbox" },
    { label: "Announcements", icon: Bell, path: "/announcements" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hover:opacity-80 transition-opacity"
            >
              IdeaVault
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-primary border-b-2 border-primary -mb-[1px] pb-4"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="flex flex-col space-y-4 py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 px-2 py-1.5 text-sm font-medium rounded-md",
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-2 py-1.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="hidden md:flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};