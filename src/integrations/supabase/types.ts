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
      candidatures: {
        Row: {
          code_postal: string | null
          cooptation: string | null
          created_at: string
          email: string
          entreprise: string | null
          id: string
          linkedin: string | null
          nom: string
          photo_fetched_at: string | null
          photo_source: string | null
          photo_url: string | null
          poste: string
          prenom: string
          reviewed_at: string | null
          reviewed_by: string | null
          secteur: string | null
          statut: Database["public"]["Enums"]["candidature_status"]
          telephone: string | null
        }
        Insert: {
          code_postal?: string | null
          cooptation?: string | null
          created_at?: string
          email: string
          entreprise?: string | null
          id?: string
          linkedin?: string | null
          nom: string
          photo_fetched_at?: string | null
          photo_source?: string | null
          photo_url?: string | null
          poste: string
          prenom: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          secteur?: string | null
          statut?: Database["public"]["Enums"]["candidature_status"]
          telephone?: string | null
        }
        Update: {
          code_postal?: string | null
          cooptation?: string | null
          created_at?: string
          email?: string
          entreprise?: string | null
          id?: string
          linkedin?: string | null
          nom?: string
          photo_fetched_at?: string | null
          photo_source?: string | null
          photo_url?: string | null
          poste?: string
          prenom?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          secteur?: string | null
          statut?: Database["public"]["Enums"]["candidature_status"]
          telephone?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          amount_paid: number | null
          created_at: string
          event_id: string
          guest_email: string | null
          guest_nom: string | null
          guest_prenom: string | null
          id: string
          is_guest: boolean
          paid_at: string | null
          statut: Database["public"]["Enums"]["registration_status"]
          stripe_payment_id: string | null
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          event_id: string
          guest_email?: string | null
          guest_nom?: string | null
          guest_prenom?: string | null
          id?: string
          is_guest?: boolean
          paid_at?: string | null
          statut?: Database["public"]["Enums"]["registration_status"]
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          event_id?: string
          guest_email?: string | null
          guest_nom?: string | null
          guest_prenom?: string | null
          id?: string
          is_guest?: boolean
          paid_at?: string | null
          statut?: Database["public"]["Enums"]["registration_status"]
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacite: number | null
          created_at: string
          date: string
          description: string | null
          format: Database["public"]["Enums"]["event_format"]
          gallery: Json
          heure: string | null
          id: string
          image_url: string | null
          is_open_to_all: boolean
          lieu: string | null
          prix: number | null
          recap: string | null
          slug: string | null
          speakers: Json | null
          statut: Database["public"]["Enums"]["event_status"]
          titre: string
          updated_at: string
          ville: string | null
        }
        Insert: {
          capacite?: number | null
          created_at?: string
          date: string
          description?: string | null
          format?: Database["public"]["Enums"]["event_format"]
          gallery?: Json
          heure?: string | null
          id?: string
          image_url?: string | null
          is_open_to_all?: boolean
          lieu?: string | null
          prix?: number | null
          recap?: string | null
          slug?: string | null
          speakers?: Json | null
          statut?: Database["public"]["Enums"]["event_status"]
          titre: string
          updated_at?: string
          ville?: string | null
        }
        Update: {
          capacite?: number | null
          created_at?: string
          date?: string
          description?: string | null
          format?: Database["public"]["Enums"]["event_format"]
          gallery?: Json
          heure?: string | null
          id?: string
          image_url?: string | null
          is_open_to_all?: boolean
          lieu?: string | null
          prix?: number | null
          recap?: string | null
          slug?: string | null
          speakers?: Json | null
          statut?: Database["public"]["Enums"]["event_status"]
          titre?: string
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          code_postal: string | null
          created_at: string
          email: string
          entreprise: string | null
          id: string
          linkedin: string | null
          nom: string
          photo_url: string | null
          poste: string | null
          prenom: string
          secteur: string | null
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          bio?: string | null
          code_postal?: string | null
          created_at?: string
          email: string
          entreprise?: string | null
          id: string
          linkedin?: string | null
          nom: string
          photo_url?: string | null
          poste?: string | null
          prenom: string
          secteur?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          bio?: string | null
          code_postal?: string | null
          created_at?: string
          email?: string
          entreprise?: string | null
          id?: string
          linkedin?: string | null
          nom?: string
          photo_url?: string | null
          poste?: string | null
          prenom?: string
          secteur?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          access: Database["public"]["Enums"]["resource_access"]
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          published_at: string | null
          titre: string
          type: Database["public"]["Enums"]["resource_type"]
          url: string | null
        }
        Insert: {
          access?: Database["public"]["Enums"]["resource_access"]
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          titre: string
          type?: Database["public"]["Enums"]["resource_type"]
          url?: string | null
        }
        Update: {
          access?: Database["public"]["Enums"]["resource_access"]
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          titre?: string
          type?: Database["public"]["Enums"]["resource_type"]
          url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_member: { Args: { _email: string }; Returns: boolean }
      is_registered_to_event: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
      candidature_status: "pending" | "approved" | "rejected"
      event_format: "after_proche" | "diner" | "workshop" | "autre"
      event_status: "draft" | "published" | "past"
      registration_status: "registered" | "paid" | "cancelled"
      resource_access: "public" | "members"
      resource_type: "etude" | "synthese" | "podcast" | "newsletter" | "autre"
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
    Enums: {
      app_role: ["admin", "member"],
      candidature_status: ["pending", "approved", "rejected"],
      event_format: ["after_proche", "diner", "workshop", "autre"],
      event_status: ["draft", "published", "past"],
      registration_status: ["registered", "paid", "cancelled"],
      resource_access: ["public", "members"],
      resource_type: ["etude", "synthese", "podcast", "newsletter", "autre"],
    },
  },
} as const
