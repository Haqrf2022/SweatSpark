import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key:
const SUPABASE_URL = 'https://zejntustbuzbfekwdzfn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplam50dXN0YnV6YmZla3dkemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTk5MzgsImV4cCI6MjA2MjIzNTkzOH0.rOvXb8iUyw_hKBZSjXY0d73FlL7Oq-xtEGcgiuTnr-g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
