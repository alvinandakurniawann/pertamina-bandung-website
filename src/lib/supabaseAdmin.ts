import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRole = process.env.SUPABASE_SERVICE_ROLE as string

export const supabaseAdmin = url && serviceRole ? createClient(url, serviceRole) : undefined






