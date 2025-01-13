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
      business: {
        Row: {
          avatar_url: string | null
          business_currency: string | null
          business_email: string | null
          business_image: string | null
          business_meta: Json | null
          business_name: string
          business_phone: string | null
          business_url: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          document_classification: boolean | null
          id: string
          postal_code: string | null
          referral_code: string | null
          slug: string | null
          state: string | null
          street_address: string | null
          stripe_connect_id: string | null
          stripe_id: string | null
          tags: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          business_currency?: string | null
          business_email?: string | null
          business_image?: string | null
          business_meta?: Json | null
          business_name: string
          business_phone?: string | null
          business_url?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_classification?: boolean | null
          id?: string
          postal_code?: string | null
          referral_code?: string | null
          slug?: string | null
          state?: string | null
          street_address?: string | null
          stripe_connect_id?: string | null
          stripe_id?: string | null
          tags?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          business_currency?: string | null
          business_email?: string | null
          business_image?: string | null
          business_meta?: Json | null
          business_name?: string
          business_phone?: string | null
          business_url?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_classification?: boolean | null
          id?: string
          postal_code?: string | null
          referral_code?: string | null
          slug?: string | null
          state?: string | null
          street_address?: string | null
          stripe_connect_id?: string | null
          stripe_id?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      business_users: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invites: {
        Row: {
          business_id: string | null
          code: string | null
          created_at: string
          email: string | null
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["teamRoles"] | null
        }
        Insert: {
          business_id?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["teamRoles"] | null
        }
        Update: {
          business_id?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["teamRoles"] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: Json | null
          avatar_url: string | null
          business_id: string | null
          full_name: string | null
          id: string
          locale: string | null
          metadata: Json | null
          phone: string | null
          referral_code: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          business_id?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          metadata?: Json | null
          phone?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          business_id?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          metadata?: Json | null
          phone?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_business:
        | {
            Args: {
              business_name: string
            }
            Returns: string
          }
        | {
            Args: {
              business_name: string
              industry: string
            }
            Returns: string
          }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_id_by_email: {
        Args: {
          user_email: string
        }
        Returns: string
      }
      get_user_referrals: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["user_referral"][]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      nanoid: {
        Args: {
          size?: number
          alphabet?: string
          additionalbytesfactor?: number
        }
        Returns: string
      }
      nanoid_optimized: {
        Args: {
          size: number
          alphabet: string
          mask: number
          step: number
        }
        Returns: string
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      kyc_status: "pending" | "verified" | "rejected"
      profile_status: "pending" | "incomplete" | "complete"
      teamRoles: "owner" | "member"
      user_status: "ONLINE" | "OFFLINE"
    }
    CompositeTypes: {
      user_referral: {
        email: string | null
      }
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
