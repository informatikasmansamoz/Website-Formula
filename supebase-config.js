// supabase-config.js
const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';  // Ganti dengan URL projekmu
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Ganti dengan anon key

// Ekspor untuk digunakan di file lain
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);