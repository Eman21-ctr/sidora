import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://thsbtwmrmoruksntzuyi.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoc2J0d21ybW9ydWtzbnR6dXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMjA0OTYsImV4cCI6MjEwNTY5NjQ5Nn0.QSXSUzpzs8BbGDqptWbhNtXz1HaneixVyn55n0cyWrs';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (typeof rawUrl === 'string' && rawUrl.trim() && !rawUrl.includes('placeholder')) 
  ? rawUrl.trim() 
  : FALLBACK_SUPABASE_URL;

const supabaseAnonKey = (typeof rawKey === 'string' && rawKey.trim() && !rawKey.includes('placeholder')) 
  ? rawKey.trim() 
  : FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


