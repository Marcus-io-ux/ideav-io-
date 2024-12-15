import { createClient } from '@supabase/supabase-js';

// Provide default values for development
const supabaseUrl = 'https://your-project.supabase.co' || '';
const supabaseAnonKey = 'your-anon-key' || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);