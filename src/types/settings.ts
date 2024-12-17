import { Json } from "@/integrations/supabase/types";

export interface NotificationPreferences {
  collaboration_requests: boolean;
  comments: boolean;
  mentions: boolean;
  updates: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  created_at: string | null;
}

export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_preferences: NotificationPreferences;
}