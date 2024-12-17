import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  User, 
  Settings2, 
  CreditCard, 
  Shield, 
  Bell, 
  LogOut 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const sections = [
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              activeSection === section.id && "bg-accent"
            )}
            onClick={() => onSectionChange(section.id)}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </Button>
        ))}
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}