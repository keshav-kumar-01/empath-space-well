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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          id: string
          notes: string | null
          session_type: string
          status: string | null
          therapist_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_type: string
          status?: string | null
          therapist_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_type?: string
          status?: string | null
          therapist_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          published: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          mood: string | null
          title: string
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          title: string
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_bot: boolean
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_bot?: boolean
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_bot?: boolean
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      dream_analysis: {
        Row: {
          ai_interpretation: string | null
          created_at: string
          dream_description: string
          emotions: Json | null
          id: string
          symbols: Json | null
          themes: Json | null
          user_id: string
        }
        Insert: {
          ai_interpretation?: string | null
          created_at?: string
          dream_description: string
          emotions?: Json | null
          id?: string
          symbols?: Json | null
          themes?: Json | null
          user_id: string
        }
        Update: {
          ai_interpretation?: string | null
          created_at?: string
          dream_description?: string
          emotions?: Json | null
          id?: string
          symbols?: Json | null
          themes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      emotion_recognition: {
        Row: {
          analysis_notes: string | null
          confidence_score: number | null
          created_at: string
          detected_emotions: Json
          id: string
          image_url: string | null
          user_id: string
        }
        Insert: {
          analysis_notes?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_emotions?: Json
          id?: string
          image_url?: string | null
          user_id: string
        }
        Update: {
          analysis_notes?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_emotions?: Json
          id?: string
          image_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      group_therapy_participants: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_therapy_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "group_therapy_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      group_therapy_rooms: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          facilitator_id: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          meeting_schedule: string | null
          room_name: string
          therapy_type: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          facilitator_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          meeting_schedule?: string | null
          room_name: string
          therapy_type: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          facilitator_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          meeting_schedule?: string | null
          room_name?: string
          therapy_type?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mental_health_goals: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          reward_points: number | null
          status: string | null
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          reward_points?: number | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          reward_points?: number | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mental_health_insights: {
        Row: {
          created_at: string
          data_points: Json | null
          description: string
          id: string
          insight_type: string
          is_read: boolean | null
          severity_level: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_points?: Json | null
          description: string
          id?: string
          insight_type: string
          is_read?: boolean | null
          severity_level?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_points?: Json | null
          description?: string
          id?: string
          insight_type?: string
          is_read?: boolean | null
          severity_level?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      peer_support_matches: {
        Row: {
          accepted_at: string | null
          compatibility_factors: Json | null
          ended_at: string | null
          id: string
          match_score: number
          matched_at: string
          status: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          accepted_at?: string | null
          compatibility_factors?: Json | null
          ended_at?: string | null
          id?: string
          match_score: number
          matched_at?: string
          status?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          accepted_at?: string | null
          compatibility_factors?: Json | null
          ended_at?: string | null
          id?: string
          match_score?: number
          matched_at?: string
          status?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      psychological_test_results: {
        Row: {
          additional_data: Json | null
          created_at: string
          id: string
          responses: Json
          severity_level: string | null
          test_name: string
          test_type: string
          total_score: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          responses: Json
          severity_level?: string | null
          test_name: string
          test_type: string
          total_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          responses?: Json
          severity_level?: string | null
          test_name?: string
          test_type?: string
          total_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          analytical: number
          answers: Json | null
          created_at: string
          creative: number
          emotional: number
          id: string
          personality_type: string
          social: number
          user_id: string
        }
        Insert: {
          analytical: number
          answers?: Json | null
          created_at?: string
          creative: number
          emotional: number
          id?: string
          personality_type: string
          social: number
          user_id: string
        }
        Update: {
          analytical?: number
          answers?: Json | null
          created_at?: string
          creative?: number
          emotional?: number
          id?: string
          personality_type?: string
          social?: number
          user_id?: string
        }
        Relationships: []
      }
      session_reviews: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          therapist_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          therapist_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          therapist_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_reviews_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          experience: string
          fee: string
          id: string
          languages: string[]
          name: string
          rating: number | null
          session_types: string[] | null
          specialties: string[]
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experience: string
          fee: string
          id?: string
          languages: string[]
          name: string
          rating?: number | null
          session_types?: string[] | null
          specialties: string[]
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experience?: string
          fee?: string
          id?: string
          languages?: string[]
          name?: string
          rating?: number | null
          session_types?: string[] | null
          specialties?: string[]
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_therapy_sessions: {
        Row: {
          ai_response: string | null
          created_at: string
          duration: number
          id: string
          mood_after: number | null
          mood_before: number | null
          session_type: string
          transcript: string | null
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          created_at?: string
          duration: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          session_type: string
          transcript?: string | null
          user_id: string
        }
        Update: {
          ai_response?: string | null
          created_at?: string
          duration?: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          session_type?: string
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wellness_plans: {
        Row: {
          activities: Json
          ai_generated: boolean | null
          created_at: string
          description: string | null
          id: string
          plan_type: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activities?: Json
          ai_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          plan_type: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activities?: Json
          ai_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          plan_type?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_therapist_by_user_id: {
        Args: { _user_id: string }
        Returns: {
          available: boolean
          avatar_url: string
          bio: string
          email: string
          experience: string
          fee: string
          id: string
          languages: string[]
          name: string
          rating: number
          specialties: string[]
          total_reviews: number
        }[]
      }
      get_therapist_id_by_user: {
        Args: { _user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_therapist_user: {
        Args: { _user_id: string }
        Returns: boolean
      }
      user_is_in_room: {
        Args: { room_id_param: string; user_id_param: string }
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
