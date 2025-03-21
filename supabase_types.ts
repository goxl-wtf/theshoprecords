export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_time: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_time?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_time?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string | null
          discogs_url: string | null
          id: string
          product_id: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          discogs_url?: string | null
          id?: string
          product_id: string
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          discogs_url?: string | null
          id?: string
          product_id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      import_logs: {
        Row: {
          created_at: string | null
          end_time: string
          failed_items: number
          id: string
          start_time: string
          successful_items: number
          total_items: number
          username: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          failed_items: number
          id?: string
          start_time: string
          successful_items: number
          total_items: number
          username: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          failed_items?: number
          id?: string
          start_time?: string
          successful_items?: number
          total_items?: number
          username?: string
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          listing_id: string
          position: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id: string
          position?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id?: string
          position?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing_images_listing_id"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_tags: {
        Row: {
          listing_id: string
          tag_id: string
        }
        Insert: {
          listing_id: string
          tag_id: string
        }
        Update: {
          listing_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_tags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          additional_info: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          international_shipping: boolean | null
          local_pickup: boolean | null
          media_condition: string
          price: number
          product_id: string
          quantity: number
          seller_id: string
          shipping_price: number | null
          sleeve_condition: string
          status: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          international_shipping?: boolean | null
          local_pickup?: boolean | null
          media_condition: string
          price: number
          product_id: string
          quantity?: number
          seller_id: string
          shipping_price?: number | null
          sleeve_condition: string
          status?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          international_shipping?: boolean | null
          local_pickup?: boolean | null
          media_condition?: string
          price?: number
          product_id?: string
          quantity?: number
          seller_id?: string
          shipping_price?: number | null
          sleeve_condition?: string
          status?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_listings_seller_id"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          message_text: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          message_text: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_text?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          payment_method: string | null
          shipping_address: string | null
          shipping_method: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_address?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          payment_method?: string | null
          shipping_address?: string | null
          shipping_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_address?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          payment_method?: string | null
          shipping_address?: string | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_genres: {
        Row: {
          created_at: string | null
          genre_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          genre_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          genre_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_genres_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_styles: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          style_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          style_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          style_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_styles_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_styles_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artist: string
          barcode: string | null
          community_have: number | null
          community_want: number | null
          country: string | null
          created_at: string | null
          description: string
          discogs_id: number
          discogs_url: string | null
          format: string | null
          id: string
          label: string | null
          notes: string | null
          release_title: string | null
          search_vector: unknown | null
          title: string
          updated_at: string | null
          year: number | null
          youtube_embed_url: string | null
          youtube_featured_track: string | null
          youtube_last_updated: string | null
          youtube_thumbnail_url: string | null
          youtube_track_position: string | null
          youtube_track_reason: string | null
          youtube_video_id: string | null
          youtube_video_title: string | null
          youtube_video_url: string | null
          youtube_view_count: number | null
        }
        Insert: {
          artist: string
          barcode?: string | null
          community_have?: number | null
          community_want?: number | null
          country?: string | null
          created_at?: string | null
          description: string
          discogs_id: number
          discogs_url?: string | null
          format?: string | null
          id?: string
          label?: string | null
          notes?: string | null
          release_title?: string | null
          search_vector?: unknown | null
          title: string
          updated_at?: string | null
          year?: number | null
          youtube_embed_url?: string | null
          youtube_featured_track?: string | null
          youtube_last_updated?: string | null
          youtube_thumbnail_url?: string | null
          youtube_track_position?: string | null
          youtube_track_reason?: string | null
          youtube_video_id?: string | null
          youtube_video_title?: string | null
          youtube_video_url?: string | null
          youtube_view_count?: number | null
        }
        Update: {
          artist?: string
          barcode?: string | null
          community_have?: number | null
          community_want?: number | null
          country?: string | null
          created_at?: string | null
          description?: string
          discogs_id?: number
          discogs_url?: string | null
          format?: string | null
          id?: string
          label?: string | null
          notes?: string | null
          release_title?: string | null
          search_vector?: unknown | null
          title?: string
          updated_at?: string | null
          year?: number | null
          youtube_embed_url?: string | null
          youtube_featured_track?: string | null
          youtube_last_updated?: string | null
          youtube_thumbnail_url?: string | null
          youtube_track_position?: string | null
          youtube_track_reason?: string | null
          youtube_video_id?: string | null
          youtube_video_title?: string | null
          youtube_video_url?: string | null
          youtube_view_count?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          order_item_id: string
          product_id: string
          rating: number
          review_text: string | null
          reviewer_id: string
          seller_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_item_id: string
          product_id: string
          rating: number
          review_text?: string | null
          reviewer_id: string
          seller_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_item_id?: string
          product_id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_orders: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string
          id: string
          items: Json | null
          parent_order_id: string
          seller_id: string
          shipping_address: Json
          shipping_cost: number | null
          shipping_option: string | null
          status: string | null
          subtotal: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name: string
          id?: string
          items?: Json | null
          parent_order_id: string
          seller_id: string
          shipping_address: Json
          shipping_cost?: number | null
          shipping_option?: string | null
          status?: string | null
          subtotal: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          items?: Json | null
          parent_order_id?: string
          seller_id?: string
          shipping_address?: Json
          shipping_cost?: number | null
          shipping_option?: string | null
          status?: string | null
          subtotal?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_seller_orders_parent_order_id"
            columns: ["parent_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_seller_orders_seller_id"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          average_rating: number | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          payment_details: Json | null
          payment_methods: Json | null
          return_policy: string | null
          shipping_policy: string | null
          store_name: string
          stripe_account_id: string | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          payment_details?: Json | null
          payment_methods?: Json | null
          return_policy?: string | null
          shipping_policy?: string | null
          store_name: string
          stripe_account_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_rating?: number | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          payment_details?: Json | null
          payment_methods?: Json | null
          return_policy?: string | null
          shipping_policy?: string | null
          store_name?: string
          stripe_account_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_stats: {
        Row: {
          avg_shipping_time: number | null
          last_calculated: string | null
          monthly_sales: Json | null
          seller_id: string
          total_sales: number | null
        }
        Insert: {
          avg_shipping_time?: number | null
          last_calculated?: string | null
          monthly_sales?: Json | null
          seller_id: string
          total_sales?: number | null
        }
        Update: {
          avg_shipping_time?: number | null
          last_calculated?: string | null
          monthly_sales?: Json | null
          seller_id?: string
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_stats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      styles: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          created_at: string | null
          duration: string | null
          id: string
          position: string
          product_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          duration?: string | null
          id?: string
          position: string
          product_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          duration?: string | null
          id?: string
          position?: string
          product_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          is_seller: boolean | null
          join_date: string | null
          last_login: string | null
          location: string | null
          seller_rating: number | null
          username: string
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          is_seller?: boolean | null
          join_date?: string | null
          last_login?: string | null
          location?: string | null
          seller_rating?: number | null
          username: string
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_seller?: boolean | null
          join_date?: string | null
          last_login?: string | null
          location?: string | null
          seller_rating?: number | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

