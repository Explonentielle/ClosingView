export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          initials: string
          name: string
          niche: string
          total_amount: number | null
          type: string[] | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          initials: string
          name: string
          niche: string
          total_amount?: number | null
          type?: string[] | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          initials?: string
          name?: string
          niche?: string
          total_amount?: number | null
          type?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      closes: {
        Row: {
          client_id: string | null
          close_date: string | null
          closed_at_round: string | null
          collected_amount: number
          contracted_amount: number
          created_at: string | null
          entry_id: string | null
          id: string
          installments: number | null
          offer_id: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          close_date?: string | null
          closed_at_round?: string | null
          collected_amount: number
          contracted_amount: number
          created_at?: string | null
          entry_id?: string | null
          id?: string
          installments?: number | null
          offer_id?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          close_date?: string | null
          closed_at_round?: string | null
          collected_amount?: number
          contracted_amount?: number
          created_at?: string | null
          entry_id?: string | null
          id?: string
          installments?: number | null
          offer_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "closes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closes_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "daily_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closes_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          cash: number | null
          closes: number | null
          content: string
          created_at: string
          id: string
          taux: number | null
          user_id: string
        }
        Insert: {
          cash?: number | null
          closes?: number | null
          content: string
          created_at?: string
          id?: string
          taux?: number | null
          user_id: string
        }
        Update: {
          cash?: number | null
          closes?: number | null
          content?: string
          created_at?: string
          id?: string
          taux?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_entries: {
        Row: {
          client_id: string | null
          closes_count: number | null
          created_at: string | null
          entry_date: string
          id: string
          r1_done: number | null
          r1_planned: number | null
          r2_done: number | null
          r2_planned: number | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          closes_count?: number | null
          created_at?: string | null
          entry_date?: string
          id?: string
          r1_done?: number | null
          r1_planned?: number | null
          r2_done?: number | null
          r2_planned?: number | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          closes_count?: number | null
          created_at?: string | null
          entry_date?: string
          id?: string
          r1_done?: number | null
          r1_planned?: number | null
          r2_done?: number | null
          r2_planned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          amount: number
          client_id: string
          commission_rate: number
          created_at: string | null
          id: string
          max_installments: number | null
          name: string
          user_id: string
        }
        Insert: {
          amount: number
          client_id: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          max_installments?: number | null
          name: string
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          max_installments?: number | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          close_score: number | null
          created_at: string | null
          display_name: string | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          is_online: boolean | null
          is_premium: boolean | null
          last_name: string
          last_seen: string | null
          niche: string | null
          onboarding_done: boolean
          phone: string | null
          premium_until: string | null
          region: string | null
          streak: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          target_cash_monthly: number
          target_closes_monthly: number
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          close_score?: number | null
          created_at?: string | null
          display_name?: string | null
          email: string
          experience_years?: number | null
          first_name?: string
          id: string
          is_online?: boolean | null
          is_premium?: boolean | null
          last_name?: string
          last_seen?: string | null
          niche?: string | null
          onboarding_done?: boolean
          phone?: string | null
          premium_until?: string | null
          region?: string | null
          streak?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          target_cash_monthly?: number
          target_closes_monthly?: number
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          close_score?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          is_online?: boolean | null
          is_premium?: boolean | null
          last_name?: string
          last_seen?: string | null
          niche?: string | null
          onboarding_done?: boolean
          phone?: string | null
          premium_until?: string | null
          region?: string | null
          streak?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          target_cash_monthly?: number
          target_closes_monthly?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_leaderboard: {
        Args: { period?: string }
        Returns: {
          assiduite: number
          city: string
          close_score: number
          display_name: string
          first_name: string
          id: string
          last_name: string
          leaderboard_score: number
          streak: number
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
