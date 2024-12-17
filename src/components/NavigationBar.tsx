import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Star, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Ideas", icon: Home, path: "/dashboard" },
    { label: "Favorites", icon: Star, path: "/favorites" },
    { label: "Community", icon: Users, path: "/community" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
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
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => {
                // Add logout logic here
                console.log("Logging out...");
              }}
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