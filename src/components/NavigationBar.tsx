import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Inbox, Settings, LogOut, UserCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const NavigationBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Ideas", icon: Home, path: "/dashboard" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
    { label: "Community", icon: Users, path: "/community" },
    { label: "Inbox", icon: Inbox, path: "/inbox" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex justify-between items-center">
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
                <Button variant="ghost" size="icon">
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
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Profile and Logout Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  console.log("Profile clicked");
                }}
              >
                <UserCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="hidden md:flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => {
                  console.log("Logging out...");
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};