export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rules: {
        Row: {
          id: string
          name: string
          content: string
          author_name: string
          author_contact_url: string
          author_avatar_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          author_name: string
          author_contact_url: string
          author_avatar_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          author_name?: string
          author_contact_url?: string
          author_avatar_url?: string
          created_at?: string
        }
      }
      categories: {
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
      }
      rule_categories: {
        Row: {
          rule_id: string
          category_id: string
        }
        Insert: {
          rule_id: string
          category_id: string
        }
        Update: {
          rule_id?: string
          category_id?: string
        }
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
  }
} 