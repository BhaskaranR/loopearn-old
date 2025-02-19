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
      apps: {
        Row: {
          app_id: string
          business_id: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          settings: Json | null
        }
        Insert: {
          app_id: string
          business_id?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          settings?: Json | null
        }
        Update: {
          app_id?: string
          business_id?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "apps_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integrations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      business: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          billing_cycle_start: number | null
          business_currency: string | null
          business_description: string | null
          business_email: string | null
          business_image: string | null
          business_meta: Json | null
          business_name: string
          business_phone: string | null
          business_url: string | null
          category: string | null
          city: string | null
          contact_name: string | null
          country: string | null
          created_at: string | null
          document_classification: boolean | null
          id: string
          invoice_prefix: string | null
          payment_failed_at: string | null
          payout_method_id: string | null
          payouts_enabled: boolean | null
          plan: string | null
          postal_code: string | null
          referral_code: string | null
          shopify_store_id: string | null
          slug: string | null
          state: string | null
          stripe_connect_id: string | null
          stripe_id: string | null
          tags: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          billing_cycle_start?: number | null
          business_currency?: string | null
          business_description?: string | null
          business_email?: string | null
          business_image?: string | null
          business_meta?: Json | null
          business_name: string
          business_phone?: string | null
          business_url?: string | null
          category?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          document_classification?: boolean | null
          id?: string
          invoice_prefix?: string | null
          payment_failed_at?: string | null
          payout_method_id?: string | null
          payouts_enabled?: boolean | null
          plan?: string | null
          postal_code?: string | null
          referral_code?: string | null
          shopify_store_id?: string | null
          slug?: string | null
          state?: string | null
          stripe_connect_id?: string | null
          stripe_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          billing_cycle_start?: number | null
          business_currency?: string | null
          business_description?: string | null
          business_email?: string | null
          business_image?: string | null
          business_meta?: Json | null
          business_name?: string
          business_phone?: string | null
          business_url?: string | null
          category?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          document_classification?: boolean | null
          id?: string
          invoice_prefix?: string | null
          payment_failed_at?: string | null
          payout_method_id?: string | null
          payouts_enabled?: boolean | null
          plan?: string | null
          postal_code?: string | null
          referral_code?: string | null
          shopify_store_id?: string | null
          slug?: string | null
          state?: string | null
          stripe_connect_id?: string | null
          stripe_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      business_social_accounts: {
        Row: {
          access_token: string | null
          business_id: string | null
          created_at: string | null
          display_name: string | null
          follower_count: number | null
          following_count: number | null
          id: string
          instance_url: string | null
          is_connected: boolean | null
          metadata: Json | null
          platform: Database["public"]["Enums"]["social_platform_type"]
          platform_user_id: string | null
          profile_image_url: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          access_token?: string | null
          business_id?: string | null
          created_at?: string | null
          display_name?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instance_url?: string | null
          is_connected?: boolean | null
          metadata?: Json | null
          platform: Database["public"]["Enums"]["social_platform_type"]
          platform_user_id?: string | null
          profile_image_url?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          access_token?: string | null
          business_id?: string | null
          created_at?: string | null
          display_name?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instance_url?: string | null
          is_connected?: boolean | null
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["social_platform_type"]
          platform_user_id?: string | null
          profile_image_url?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_social_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
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
      campaign_action_rewards: {
        Row: {
          action_details: string | null
          action_type: string
          campaign_id: string | null
          coupon_code: string | null
          created_at: string | null
          icon_url: string | null
          id: string
          minimum_purchase_amount: number | null
          redirection_button_link: string | null
          redirection_button_text: string | null
          reward_type: string
          reward_unit: string | null
          reward_value: number | null
          uses_per_customer: number | null
        }
        Insert: {
          action_details?: string | null
          action_type: string
          campaign_id?: string | null
          coupon_code?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          minimum_purchase_amount?: number | null
          redirection_button_link?: string | null
          redirection_button_text?: string | null
          reward_type: string
          reward_unit?: string | null
          reward_value?: number | null
          uses_per_customer?: number | null
        }
        Update: {
          action_details?: string | null
          action_type?: string
          campaign_id?: string | null
          coupon_code?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          minimum_purchase_amount?: number | null
          redirection_button_link?: string | null
          redirection_button_text?: string | null
          reward_type?: string
          reward_unit?: string | null
          reward_value?: number | null
          uses_per_customer?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_action_rewards_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          business_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          expires_after: number | null
          id: string
          is_live_on_marketplace: boolean | null
          is_repeatable: boolean | null
          max_achievement: number | null
          min_tier: number | null
          name: string
          start_date: string
          status: string | null
          type: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          expires_after?: number | null
          id?: string
          is_live_on_marketplace?: boolean | null
          is_repeatable?: boolean | null
          max_achievement?: number | null
          min_tier?: number | null
          name: string
          start_date: string
          status?: string | null
          type: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          expires_after?: number | null
          id?: string
          is_live_on_marketplace?: boolean | null
          is_repeatable?: boolean | null
          max_achievement?: number | null
          min_tier?: number | null
          name?: string
          start_date?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          categoryid: number
          categoryname: string
        }
        Insert: {
          categoryid?: number
          categoryname: string
        }
        Update: {
          categoryid?: number
          categoryname?: string
        }
        Relationships: []
      }
      coupon_configurations: {
        Row: {
          auto_generate: boolean | null
          business_id: string | null
          created_at: string | null
          discount_value: number | null
          expiry_days: number | null
          global_usage_limit: number | null
          id: string
          min_order_value: number | null
          per_user_limit: number | null
          prefix: string | null
          reward_type: string
          updated_at: string | null
        }
        Insert: {
          auto_generate?: boolean | null
          business_id?: string | null
          created_at?: string | null
          discount_value?: number | null
          expiry_days?: number | null
          global_usage_limit?: number | null
          id?: string
          min_order_value?: number | null
          per_user_limit?: number | null
          prefix?: string | null
          reward_type: string
          updated_at?: string | null
        }
        Update: {
          auto_generate?: boolean | null
          business_id?: string | null
          created_at?: string | null
          discount_value?: number | null
          expiry_days?: number | null
          global_usage_limit?: number | null
          id?: string
          min_order_value?: number | null
          per_user_limit?: number | null
          prefix?: string | null
          reward_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_configurations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          business_id: string | null
          coupon_id: string | null
          customer_id: string | null
          id: string
          redeemed_at: string | null
          redeemed_by_user: string | null
        }
        Insert: {
          business_id?: string | null
          coupon_id?: string | null
          customer_id?: string | null
          id?: string
          redeemed_at?: string | null
          redeemed_by_user?: string | null
        }
        Update: {
          business_id?: string | null
          coupon_id?: string | null
          customer_id?: string | null
          id?: string
          redeemed_at?: string | null
          redeemed_by_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: true
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          business_id: string | null
          code: string
          coupon_config_id: string | null
          created_at: string | null
          customer_id: string | null
          expiry_date: string | null
          id: string
          is_redeemed: boolean | null
          issued_at: string | null
          order_id: string | null
          qr_code: string | null
          redeemed_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          code: string
          coupon_config_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          expiry_date?: string | null
          id?: string
          is_redeemed?: boolean | null
          issued_at?: string | null
          order_id?: string | null
          qr_code?: string | null
          redeemed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          code?: string
          coupon_config_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          expiry_date?: string | null
          id?: string
          is_redeemed?: boolean | null
          issued_at?: string | null
          order_id?: string | null
          qr_code?: string | null
          redeemed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_coupon_config_id_fkey"
            columns: ["coupon_config_id"]
            isOneToOne: false
            referencedRelation: "coupon_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_action_progress: {
        Row: {
          action_type: string
          campaign_action_reward_id: string | null
          campaign_id: string | null
          completed: boolean | null
          completed_at: string | null
          customer_id: string | null
          id: string
        }
        Insert: {
          action_type: string
          campaign_action_reward_id?: string | null
          campaign_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          customer_id?: string | null
          id?: string
        }
        Update: {
          action_type?: string
          campaign_action_reward_id?: string | null
          campaign_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_action_progress_campaign_action_reward_id_fkey"
            columns: ["campaign_action_reward_id"]
            isOneToOne: false
            referencedRelation: "campaign_action_rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_action_progress_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_action_progress_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_progress: {
        Row: {
          created_at: string | null
          current_tier: number | null
          customer_id: string | null
          id: string
          points_balance: number | null
          tier_id: string | null
          total_referrals: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_tier?: number | null
          customer_id?: string | null
          id?: string
          points_balance?: number | null
          tier_id?: string | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_tier?: number | null
          customer_id?: string | null
          id?: string
          points_balance?: number | null
          tier_id?: string | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_progress_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_progress_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          business_id: string | null
          created_at: string | null
          custom: Json | null
          date_of_birth: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          mobile: string | null
          primary_customer_id: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          custom?: Json | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          primary_customer_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          custom?: Json | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          primary_customer_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_primary_customer_id_fkey"
            columns: ["primary_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          customer_id: string | null
          event_name: string
          event_properties: Json | null
          id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          event_name: string
          event_properties?: Json | null
          id?: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          event_name?: string
          event_properties?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      points_configuration: {
        Row: {
          all_products_eligible: boolean | null
          business_id: string | null
          collection_based_earning_enabled: boolean | null
          collection_ids: string[] | null
          created_at: string | null
          currency: string | null
          customer_tier: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          points_expiry_days: number | null
          points_expiry_enabled: boolean | null
          points_per_currency: number | null
          updated_at: string | null
        }
        Insert: {
          all_products_eligible?: boolean | null
          business_id?: string | null
          collection_based_earning_enabled?: boolean | null
          collection_ids?: string[] | null
          created_at?: string | null
          currency?: string | null
          customer_tier?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          points_expiry_days?: number | null
          points_expiry_enabled?: boolean | null
          points_per_currency?: number | null
          updated_at?: string | null
        }
        Update: {
          all_products_eligible?: boolean | null
          business_id?: string | null
          collection_based_earning_enabled?: boolean | null
          collection_ids?: string[] | null
          created_at?: string | null
          currency?: string | null
          customer_tier?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          points_expiry_days?: number | null
          points_expiry_enabled?: boolean | null
          points_per_currency?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_configuration_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          categoryid: number
          subcategoryid: number
          subcategoryname: string
        }
        Insert: {
          categoryid: number
          subcategoryid?: number
          subcategoryname: string
        }
        Update: {
          categoryid?: number
          subcategoryid?: number
          subcategoryname?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_categoryid_fkey"
            columns: ["categoryid"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["categoryid"]
          },
        ]
      }
      tiers: {
        Row: {
          benefits: Json | null
          business_id: string | null
          created_at: string | null
          id: string
          min_spending: number
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          min_spending: number
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          min_spending?: number
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tiers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
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
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          business_id: string | null
          city: string | null
          country: string | null
          full_name: string | null
          id: string
          locale: string | null
          metadata: Json | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          phone: string | null
          postal_code: string | null
          referral_code: string | null
          source: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: Json | null
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          business_id?: string | null
          city?: string | null
          country?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          metadata?: Json | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          phone?: string | null
          postal_code?: string | null
          referral_code?: string | null
          source?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: Json | null
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          business_id?: string | null
          city?: string | null
          country?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          metadata?: Json | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          phone?: string | null
          postal_code?: string | null
          referral_code?: string | null
          source?: string | null
          state?: string | null
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
              slug: string
            }
            Returns: string
          }
        | {
            Args: {
              business_name: string
              slug: string
              business_email: string
            }
            Returns: string
          }
      create_campaign: {
        Args: {
          campaign_data: Json
          reward_data: Json
        }
        Returns: {
          business_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          expires_after: number | null
          id: string
          is_live_on_marketplace: boolean | null
          is_repeatable: boolean | null
          max_achievement: number | null
          min_tier: number | null
          name: string
          start_date: string
          status: string | null
          type: string
          updated_at: string | null
          visibility: string | null
        }
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      generate_hmac: {
        Args: {
          secret_key: string
          message: string
        }
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customer_tier: {
        Args: {
          customer_uuid: string
        }
        Returns: number
      }
      get_jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_points_configuration:
        | {
            Args: {
              p_business_id: string
            }
            Returns: {
              all_products_eligible: boolean | null
              business_id: string | null
              collection_based_earning_enabled: boolean | null
              collection_ids: string[] | null
              created_at: string | null
              currency: string | null
              customer_tier: string | null
              id: string
              is_active: boolean | null
              metadata: Json | null
              points_expiry_days: number | null
              points_expiry_enabled: boolean | null
              points_per_currency: number | null
              updated_at: string | null
            }
          }
        | {
            Args: {
              p_business_id: string
              p_customer_tier: string
            }
            Returns: {
              all_products_eligible: boolean | null
              business_id: string | null
              collection_based_earning_enabled: boolean | null
              collection_ids: string[] | null
              created_at: string | null
              currency: string | null
              customer_tier: string | null
              id: string
              is_active: boolean | null
              metadata: Json | null
              points_expiry_days: number | null
              points_expiry_enabled: boolean | null
              points_per_currency: number | null
              updated_at: string | null
            }
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
      get_user_role_in_business: {
        Args: {
          p_business_id: string
        }
        Returns: string
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
      is_social_account_connected: {
        Args: {
          p_business_id: string
          p_platform: Database["public"]["Enums"]["social_platform_type"]
        }
        Returns: boolean
      }
      is_user_in_business: {
        Args: {
          p_business_id: string
        }
        Returns: boolean
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
      update_campaign: {
        Args: {
          campaign_id: string
          campaign_data: Json
          reward_data: Json
        }
        Returns: {
          business_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          expires_after: number | null
          id: string
          is_live_on_marketplace: boolean | null
          is_repeatable: boolean | null
          max_achievement: number | null
          min_tier: number | null
          name: string
          start_date: string
          status: string | null
          type: string
          updated_at: string | null
          visibility: string | null
        }
      }
    }
    Enums: {
      kyc_status: "pending" | "verified" | "rejected"
      onboarding_status: "pending" | "complete"
      profile_status: "pending" | "incomplete" | "complete"
      social_platform_type:
        | "instagram"
        | "facebook"
        | "twitter"
        | "tiktok"
        | "threads"
        | "linkedin"
        | "youtube"
        | "bluesky"
        | "mastodon"
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
