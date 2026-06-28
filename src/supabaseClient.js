import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjldqflqenodigfcvahy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGRxZmxxZW5vZGlnZmN2YWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzA3OTIsImV4cCI6MjA5MDEwNjc5Mn0.ZWtfFX1h2jQJ3j1saUFy_KMCFhFLnZf4WEmSjkQA-2s';

export const supabase = createClient(supabaseUrl, supabaseKey);