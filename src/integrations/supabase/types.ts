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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_tabs: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          job_id: string
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          technician_id: string
          type: Database["public"]["Enums"]["appointment_type"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          technician_id: string
          type: Database["public"]["Enums"]["appointment_type"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          technician_id?: string
          type?: Database["public"]["Enums"]["appointment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line: string | null
          city: string | null
          civilite: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          country: string | null
          created_at: string
          email: string
          email_facturation: string | null
          id: string
          latitude: number | null
          longitude: number | null
          mobile: string
          nom: string | null
          phone: string | null
          postal_code: string | null
          prenom: string | null
          raison_sociale: string | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          civilite?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          country?: string | null
          created_at?: string
          email: string
          email_facturation?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mobile: string
          nom?: string | null
          phone?: string | null
          postal_code?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          civilite?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          country?: string | null
          created_at?: string
          email?: string
          email_facturation?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mobile?: string
          nom?: string | null
          phone?: string | null
          postal_code?: string | null
          prenom?: string | null
          raison_sociale?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          description: string | null
          html_content: string
          id: string
          is_active: boolean | null
          key: string
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          key: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          key?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      emails_sent: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string
          error_message: string | null
          external_message_id: string | null
          html_content: string
          id: string
          opened_at: string | null
          quote_id: string | null
          recipient_email: string
          recipient_name: string | null
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
          error_message?: string | null
          external_message_id?: string | null
          html_content: string
          id?: string
          opened_at?: string | null
          quote_id?: string | null
          recipient_email: string
          recipient_name?: string | null
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
          error_message?: string | null
          external_message_id?: string | null
          html_content?: string
          id?: string
          opened_at?: string | null
          quote_id?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string
          status?: string
          subject?: string
          template_key?: string
          updated_at?: string
          variables_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_sent_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          id: string
          invoice_number: string
          job_id: string
          paid_at: string | null
          pdf_url: string | null
          sent_at: string | null
          status: string
          subtotal: number
          total: number
          tva: number
          tva_rate: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          invoice_number: string
          job_id: string
          paid_at?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal: number
          total: number
          tva: number
          tva_rate: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          invoice_number?: string
          job_id?: string
          paid_at?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          tva?: number
          tva_rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          job_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          job_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_notes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          job_id: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          storage_path: string
          taken_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          job_id: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          storage_path: string
          taken_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          job_id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          storage_path?: string
          taken_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          accepted_at: string | null
          assigned_at: string | null
          balance_amount: number | null
          balance_collected_at: string | null
          balance_paid: boolean | null
          client_id: string
          closed_at: string | null
          created_at: string
          deposit_amount: number | null
          deposit_collected_at: string | null
          deposit_paid: boolean | null
          diagnostic_at: string | null
          discount_percent: number | null
          discount_reason: string | null
          id: string
          installation_completed_at: string | null
          intervention_address: string | null
          intervention_city: string | null
          intervention_latitude: number | null
          intervention_longitude: number | null
          intervention_postal_code: string | null
          job_number: string
          materials_ordered_at: string | null
          notes: string | null
          quote_id: string
          status: Database["public"]["Enums"]["job_status"]
          technician_id: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string | null
          balance_amount?: number | null
          balance_collected_at?: string | null
          balance_paid?: boolean | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_collected_at?: string | null
          deposit_paid?: boolean | null
          diagnostic_at?: string | null
          discount_percent?: number | null
          discount_reason?: string | null
          id?: string
          installation_completed_at?: string | null
          intervention_address?: string | null
          intervention_city?: string | null
          intervention_latitude?: number | null
          intervention_longitude?: number | null
          intervention_postal_code?: string | null
          job_number: string
          materials_ordered_at?: string | null
          notes?: string | null
          quote_id: string
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string | null
          balance_amount?: number | null
          balance_collected_at?: string | null
          balance_paid?: boolean | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_collected_at?: string | null
          deposit_paid?: boolean | null
          diagnostic_at?: string | null
          discount_percent?: number | null
          discount_reason?: string | null
          id?: string
          installation_completed_at?: string | null
          intervention_address?: string | null
          intervention_city?: string | null
          intervention_latitude?: number | null
          intervention_longitude?: number | null
          intervention_postal_code?: string | null
          job_number?: string
          materials_ordered_at?: string | null
          notes?: string | null
          quote_id?: string
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          client_id: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          converted_quote_id: string | null
          created_at: string
          demand_type: string | null
          id: string
          notes: string | null
          postal_code: string | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          qualified_by: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          urgency_level: number | null
        }
        Insert: {
          city?: string | null
          client_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          converted_quote_id?: string | null
          created_at?: string
          demand_type?: string | null
          id?: string
          notes?: string | null
          postal_code?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          qualified_by?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          urgency_level?: number | null
        }
        Update: {
          city?: string | null
          client_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          converted_quote_id?: string | null
          created_at?: string
          demand_type?: string | null
          id?: string
          notes?: string | null
          postal_code?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          qualified_by?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          urgency_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_quote_id_fkey"
            columns: ["converted_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          id: string
          read_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          recipient_user_id: string | null
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          collected_at: string | null
          collected_by: string | null
          created_at: string
          external_reference: string | null
          id: string
          job_id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          collected_at?: string | null
          collected_by?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          job_id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          collected_at?: string | null
          collected_by?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          job_id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
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
      quote_items: {
        Row: {
          category: string | null
          created_at: string
          description: string
          hauteur_cm: number | null
          id: string
          largeur_cm: number | null
          photo_url: string | null
          price_details: Json | null
          price_subtotal: number | null
          price_total: number | null
          price_tva: number | null
          quantite: number
          quote_id: string
          sort_order: number
          subcategory: string | null
          unit_price: number | null
          updated_at: string
          vitrage: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          hauteur_cm?: number | null
          id?: string
          largeur_cm?: number | null
          photo_url?: string | null
          price_details?: Json | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          quantite?: number
          quote_id: string
          sort_order?: number
          subcategory?: string | null
          unit_price?: number | null
          updated_at?: string
          vitrage?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          hauteur_cm?: number | null
          id?: string
          largeur_cm?: number | null
          photo_url?: string | null
          price_details?: Json | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          quantite?: number
          quote_id?: string
          sort_order?: number
          subcategory?: string | null
          unit_price?: number | null
          updated_at?: string
          vitrage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_versions: {
        Row: {
          created_at: string
          created_by: string | null
          disclaimer: string | null
          id: string
          items_snapshot: Json
          pdf_url: string | null
          pricing_snapshot: Json
          quote_id: string
          revision_reason: string | null
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          disclaimer?: string | null
          id?: string
          items_snapshot: Json
          pdf_url?: string | null
          pricing_snapshot: Json
          quote_id: string
          revision_reason?: string | null
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          disclaimer?: string | null
          id?: string
          items_snapshot?: Json
          pdf_url?: string | null
          pricing_snapshot?: Json
          quote_id?: string
          revision_reason?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_versions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          assurance: string | null
          client_id: string
          created_at: string
          created_by: string | null
          current_version: number
          disclaimer: string | null
          id: string
          intervention_address: string | null
          intervention_city: string | null
          intervention_latitude: number | null
          intervention_longitude: number | null
          intervention_postal_code: string | null
          lead_id: string | null
          motif: string | null
          motif_other: string | null
          notes: string | null
          pdf_url: string | null
          photo_url: string | null
          price_subtotal: number | null
          price_total: number | null
          price_tva: number | null
          price_tva_rate: number | null
          property_other: string | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          quote_number: string
          service_type: string
          source: Database["public"]["Enums"]["lead_source"] | null
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
          validated_at: string | null
          validation_ip: string | null
          validation_token: string | null
        }
        Insert: {
          assurance?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          current_version?: number
          disclaimer?: string | null
          id?: string
          intervention_address?: string | null
          intervention_city?: string | null
          intervention_latitude?: number | null
          intervention_longitude?: number | null
          intervention_postal_code?: string | null
          lead_id?: string | null
          motif?: string | null
          motif_other?: string | null
          notes?: string | null
          pdf_url?: string | null
          photo_url?: string | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          price_tva_rate?: number | null
          property_other?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          quote_number: string
          service_type?: string
          source?: Database["public"]["Enums"]["lead_source"] | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          validated_at?: string | null
          validation_ip?: string | null
          validation_token?: string | null
        }
        Update: {
          assurance?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          current_version?: number
          disclaimer?: string | null
          id?: string
          intervention_address?: string | null
          intervention_city?: string | null
          intervention_latitude?: number | null
          intervention_longitude?: number | null
          intervention_postal_code?: string | null
          lead_id?: string | null
          motif?: string | null
          motif_other?: string | null
          notes?: string | null
          pdf_url?: string | null
          photo_url?: string | null
          price_subtotal?: number | null
          price_total?: number | null
          price_tva?: number | null
          price_tva_rate?: number | null
          property_other?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          quote_number?: string
          service_type?: string
          source?: Database["public"]["Enums"]["lead_source"] | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          validated_at?: string | null
          validation_ip?: string | null
          validation_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_zones: {
        Row: {
          created_at: string
          department: string
          id: string
          is_primary: boolean | null
          postal_codes: string[] | null
          technician_id: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          is_primary?: boolean | null
          postal_codes?: string[] | null
          technician_id: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          is_primary?: boolean | null
          postal_codes?: string[] | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_zones_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          address_line: string | null
          certifications: string[] | null
          city: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          latitude: number | null
          longitude: number | null
          max_discount_percent: number | null
          on_call_night: boolean | null
          on_call_weekend: boolean | null
          payment_methods:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone: string
          postal_code: string | null
          rating: number | null
          skill_level: string | null
          status: string
          total_jobs: number | null
          updated_at: string
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          address_line?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          latitude?: number | null
          longitude?: number | null
          max_discount_percent?: number | null
          on_call_night?: boolean | null
          on_call_weekend?: boolean | null
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone: string
          postal_code?: string | null
          rating?: number | null
          skill_level?: string | null
          status?: string
          total_jobs?: number | null
          updated_at?: string
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          address_line?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          latitude?: number | null
          longitude?: number | null
          max_discount_percent?: number | null
          on_call_night?: boolean | null
          on_call_weekend?: boolean | null
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          phone?: string
          postal_code?: string | null
          rating?: number | null
          skill_level?: string | null
          status?: string
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
          vehicle_type?: string | null
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
      get_technician_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_operator: { Args: never; Returns: boolean }
      is_technician: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      upsert_client: {
        Args: {
          _address_line?: string
          _city?: string
          _civilite?: string
          _email: string
          _email_facturation?: string
          _mobile: string
          _nom: string
          _postal_code?: string
          _prenom?: string
          _raison_sociale?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "operator" | "technician"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type: "diagnostic" | "installation"
      client_type: "individual" | "professional"
      job_status:
        | "assigned"
        | "accepted"
        | "diagnostic_scheduled"
        | "diagnostic_done"
        | "deposit_collected"
        | "materials_ordered"
        | "installation_scheduled"
        | "installation_done"
        | "balance_collected"
        | "closed"
        | "cancelled"
      lead_source:
        | "phone"
        | "website_form"
        | "online_quote"
        | "google_business"
        | "referral"
        | "other"
      lead_status: "new" | "qualified" | "converted" | "lost"
      notification_channel: "email" | "sms" | "in_app"
      payment_method: "sumup" | "card" | "check" | "cash" | "transfer"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_type: "deposit" | "balance" | "full"
      photo_type: "before" | "after" | "measurement" | "other"
      property_type: "house" | "apartment" | "office" | "shop" | "other"
      quote_status:
        | "draft"
        | "sent"
        | "validated"
        | "accepted"
        | "rejected"
        | "expired"
        | "revised"
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
      app_role: ["super_admin", "admin", "operator", "technician"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: ["diagnostic", "installation"],
      client_type: ["individual", "professional"],
      job_status: [
        "assigned",
        "accepted",
        "diagnostic_scheduled",
        "diagnostic_done",
        "deposit_collected",
        "materials_ordered",
        "installation_scheduled",
        "installation_done",
        "balance_collected",
        "closed",
        "cancelled",
      ],
      lead_source: [
        "phone",
        "website_form",
        "online_quote",
        "google_business",
        "referral",
        "other",
      ],
      lead_status: ["new", "qualified", "converted", "lost"],
      notification_channel: ["email", "sms", "in_app"],
      payment_method: ["sumup", "card", "check", "cash", "transfer"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      payment_type: ["deposit", "balance", "full"],
      photo_type: ["before", "after", "measurement", "other"],
      property_type: ["house", "apartment", "office", "shop", "other"],
      quote_status: [
        "draft",
        "sent",
        "validated",
        "accepted",
        "rejected",
        "expired",
        "revised",
      ],
    },
  },
} as const
