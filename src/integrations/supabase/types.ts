export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collaboration_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          owner_id: string | null
          post_id: string | null
          requester_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          owner_id?: string | null
          post_id?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          owner_id?: string | null
          post_id?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_requests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string | null
          channel: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          emoji_reactions: Json | null
          feedback_type: string | null
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          emoji_reactions?: Json | null
          feedback_type?: string | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          emoji_reactions?: Json | null
          feedback_type?: string | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string | null
          item_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          item_type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          item_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string
          rating: number | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          rating?: number | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          rating?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          content: string
          created_at: string | null
          deleted: boolean | null
          deleted_at: string | null
          id: string
          images: string[] | null
          is_draft: boolean | null
          shared_to_community: boolean | null
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted?: boolean | null
          deleted_at?: string | null
          id?: string
          images?: string[] | null
          is_draft?: boolean | null
          shared_to_community?: boolean | null
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted?: boolean | null
          deleted_at?: string | null
          id?: string
          images?: string[] | null
          is_draft?: boolean | null
          shared_to_community?: boolean | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          parent_id: string | null
          recipient_id: string | null
          sender_id: string | null
          thread_id: string | null
          title: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          parent_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          thread_id?: string | null
          title?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          parent_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          thread_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      onboarding_data: {
        Row: {
          completed_at: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          occupation: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          occupation?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          occupation?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          location: string | null
          tutorial_completed: boolean | null
          user_id: string | null
          username: string | null
          username_set: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          tutorial_completed?: boolean | null
          user_id?: string | null
          username?: string | null
          username_set?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          tutorial_completed?: boolean | null
          user_id?: string | null
          username?: string | null
          username_set?: boolean | null
        }
        Relationships: []
      }
      signup_data: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          signup_provider: string | null
          terms_accepted: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          signup_provider?: string | null
          terms_accepted?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          signup_provider?: string | null
          terms_accepted?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_memberships: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          tier_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tier_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tier_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          badges: Json | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_idea_date: string | null
          points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          badges?: Json | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_idea_date?: string | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          badges?: Json | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_idea_date?: string | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          id: string
          last_seen: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_seen?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_seen?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_settings: {
        Row: {
          completed_tour: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          font_size: string | null
          id: string
          language: string | null
          last_password_update: string | null
          notification_preferences: Json | null
          profile_visibility: string | null
          push_notifications: boolean | null
          theme: string | null
          user_id: string | null
        }
        Insert: {
          completed_tour?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          font_size?: string | null
          id?: string
          language?: string | null
          last_password_update?: string | null
          notification_preferences?: Json | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          user_id?: string | null
        }
        Update: {
          completed_tour?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          font_size?: string | null
          id?: string
          language?: string | null
          last_password_update?: string | null
          notification_preferences?: Json | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_collaboration_status: {
        Args: {
          request_id: string
          new_status: string
        }
        Returns: {
          created_at: string | null
          id: string
          message: string | null
          owner_id: string | null
          post_id: string | null
          requester_id: string | null
          status: string | null
          updated_at: string | null
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
