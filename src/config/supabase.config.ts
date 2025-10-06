import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl ? '✓ Loaded' : '✗ Missing')
console.log('Key:', supabaseKey ? '✓ Loaded' : '✗ Missing')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
console.log('✅ Supabase client created successfully')