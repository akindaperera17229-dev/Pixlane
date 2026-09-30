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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          host_id: string
          name: string
          description: string | null
          event_date: string | null
          code: string
          is_active: boolean
          photo_limit: number
          video_limit?: number
          plan?: string | null
          theme_template?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          host_id: string
          name: string
          description?: string | null
          event_date?: string | null
          code: string
          is_active?: boolean
          photo_limit?: number
          video_limit?: number
          plan?: string | null
          theme_template?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          name?: string
          description?: string | null
          event_date?: string | null
          code?: string
          is_active?: boolean
          photo_limit?: number
          video_limit?: number
          plan?: string | null
          theme_template?: string | null
          created_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          event_id: string
          uploader_name: string
          file_url: string
          file_path: string
          file_size: number
          media_type?: string | null // 'photo' | 'video'
          uploaded_at: string
        }
        Insert: {
          id?: string
          event_id: string
          uploader_name: string
          file_url: string
          file_path: string
          file_size: number
          media_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          uploader_name?: string
          file_url?: string
          file_path?: string
          file_size?: number
          media_type?: string | null
          uploaded_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
