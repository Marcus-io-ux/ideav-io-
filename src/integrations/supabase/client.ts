import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jetmrooydpvrjvusikgx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldG1yb295ZHB2cmp2dXNpa2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzOTg3NTksImV4cCI6MjA0OTk3NDc1OX0.N0fNF32rnJpwbjj2P5KlqIKLIIi7R3zWdiUpl3x9vtE";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);