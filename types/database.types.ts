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
      users: {
        Row: {
          id: string
          avatar: string | null
          full_name: string
          role: 'Admin' | 'Staff' | 'Manager'
          email: string
          phone: string | null
          start_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      vehicles: {
        Row: {
          id: string
          vin: string
          year: number
          make: string
          model: string
          trim: string | null
          odometer: number
          stock_number: string | null
          condition: 'New' | 'Used' | 'Certified Pre-Owned'
          status: 'Active' | 'Inactive' | 'Sold' | 'Coming Soon'
          purchase_price: number
          retail_price: number
          extra_costs: number
          taxes: number
          image_gallery: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      // Additional tables will be added as needed
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
