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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_tabs: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          is_system: boolean
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse_intervention: string
          created_at: string
          email: string
          email_facturation: string | null
          id: string
          mobile: string
          nom: string | null
          prenom: string | null
          raison_sociale: string | null
          updated_at: string
        }
        Insert: {
          adresse_intervention: string
          created_at?: string
          email: string
          email_facturation?: string | null
          id?: string
          mobile: string
          nom?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          updated_at?: string
        }
        Update: {
          adresse_intervention?: string
          created_at?: string
          email?: string
          email_facturation?: string | null
          id?: string
          mobile?: string
          nom?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      devis: {
        Row: {
          assurance: string | null
          category: string | null
          client_email: string
          created_at: string
          different_intervention_address: boolean
          hauteur_cm: number | null
          id: string
          intervention_adresse: string | null
          intervention_code_postal: string | null
          intervention_ville: string | null
          largeur_cm: number | null
          motif: string | null
          motif_other: string | null
          notes: string | null
          object: string
          pdf_url: string | null
          photo_url: string | null
          price_details: Json | null
          price_subtotal: number | null
          price_total: number | null
          price_tva: number | null
          price_tva_rate: number | null
          property: string | null
          property_other: string | null
          quantite: number
          quote_number: string | null
          service_type: string
          source: string | null
          status: string
          subcategory: string | null
          updated_at: string
          validated_at: string | null
          validation_ip: string | null
          validation_token: string | null
          vitrage: string | null
        }
        Insert: {
          assurance?: string | null
          category?: string | null
          client_email: string
          created_at?: string
          different_intervention_address?: boolean
          hauteur_cm?: number | null
          id?: string
          intervention_adresse?: string | null
          intervention_code_postal?: string | null
          intervention_ville?: string | null
          largeur_cm?: number | null
          motif?: string | null
          motif_other?: string | null
          notes?: string | null
          object: string
          pdf_url?: string | null
          photo_url?: string | null
          price_details?: Json | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          price_tva_rate?: number | null
          property?: string | null
          property_other?: string | null
          quantite?: number
          quote_number?: string | null
          service_type: string
          source?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string
          validated_at?: string | null
          validation_ip?: string | null
          validation_token?: string | null
          vitrage?: string | null
        }
        Update: {
          assurance?: string | null
          category?: string | null
          client_email?: string
          created_at?: string
          different_intervention_address?: boolean
          hauteur_cm?: number | null
          id?: string
          intervention_adresse?: string | null
          intervention_code_postal?: string | null
          intervention_ville?: string | null
          largeur_cm?: number | null
          motif?: string | null
          motif_other?: string | null
          notes?: string | null
          object?: string
          pdf_url?: string | null
          photo_url?: string | null
          price_details?: Json | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          price_tva_rate?: number | null
          property?: string | null
          property_other?: string | null
          quantite?: number
          quote_number?: string | null
          service_type?: string
          source?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string
          validated_at?: string | null
          validation_ip?: string | null
          validation_token?: string | null
          vitrage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_email_fkey"
            columns: ["client_email"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["email"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          description: string | null
          html_content: string
          id: string
          is_active: boolean
          key: string
          name: string
          subject: string
          updated_at: string
          variables: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean
          key: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      emails_sent: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string
          devis_id: string | null
          error_message: string | null
          html_content: string
          id: string
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          sendgrid_message_id: string | null
          sent_at: string
          status: string
          subject: string
          template_key: string
          updated_at: string
          variables_data: Json | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          devis_id?: string | null
          error_message?: string | null
          html_content: string
          id?: string
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          sendgrid_message_id?: string | null
          sent_at?: string
          status?: string
          subject: string
          template_key: string
          updated_at?: string
          variables_data?: Json | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          devis_id?: string | null
          error_message?: string | null
          html_content?: string
          id?: string
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sendgrid_message_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
          template_key?: string
          updated_at?: string
          variables_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_sent_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      gmail_credentials: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_email: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string
          user_email: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      motif_descriptions: {
        Row: {
          created_at: string
          description: string
          id: string
          motif: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          motif: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          motif?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          rule_key: string
          rule_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          rule_key: string
          rule_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          rule_key?: string
          rule_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      check_client_exists: {
        Args: { _email: string; _mobile: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
