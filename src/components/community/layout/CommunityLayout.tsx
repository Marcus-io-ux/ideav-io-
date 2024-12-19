import { useState } from "react";
import { CommunityChannels } from "./CommunityChannels";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface CommunityLayoutProps {
  children: React.ReactNode;
}

export const CommunityLayout = ({ children }: CommunityLayoutProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <CommunityChannels onChannelSelect={() => setIsMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-64 border-r border-border">
        <CommunityChannels />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};