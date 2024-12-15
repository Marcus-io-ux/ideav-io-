import { createClient } from '@supabase/supabase-js';

// Using mock Supabase client until proper connection is established
export const supabase = createClient(
  'https://mock-supabase-url.com',
  'mock-anon-key'
);