const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Using secret key for backend ops

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Secret Key in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
