import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Settings, LogOut, Menu, Bell, User, Users, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";

export const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { data: isSubscribed } = useSubscriptionStatus();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/index");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFreeNavItems = () => [
    { label: "My Ideas", icon: Home, path: "/dashboard" },
    { label: "Announcements", icon: Bell, path: "/announcements" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const getProNavItems = () => [
    ...getFreeNavItems(),
    { label: "Community", icon: Users, path: "/community" },
    { label: "Inbox", icon: Inbox, path: "/inbox" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const navItems = isSubscribed ? getProNavItems() : getFreeNavItems();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 md:h-16 items-center px-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hover:opacity-80 transition-opacity"
            >
              IdeaVault
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 lg:space-x-6">
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link 
                      to="/" 
                      className="text-xl font-bold text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      IdeaVault
                    </Link>
                  </div>
                  <nav className="flex-1 overflow-y-auto">
                    <div className="flex flex-col p-4 space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-2 px-2 py-2 text-sm font-medium rounded-md",
                            location.pathname === item.path
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:bg-accent"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <div className="p-4 border-t mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Logout Button */}
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