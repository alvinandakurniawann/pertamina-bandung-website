import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Region {
  id: string
  name: string
  color: string
  spbu_count: number
  spbe_count: number
  created_at?: string
  updated_at?: string
}

export interface Location {
  id: string
  region_id: string
  name: string
  type: 'SPBU' | 'SPBE'
  address: string
  services: string[]
  hours: string
  phone: string
  created_at?: string
  updated_at?: string
}






