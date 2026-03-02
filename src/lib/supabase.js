import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://skzdaygdajxdozbrtbty.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremRheWdkYWp4ZG96YnJ0YnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDM5MjIsImV4cCI6MjA4Nzk3OTkyMn0.MeAGHKUlG3ltW2ZJ5igjrP9CGb9A-ww4hMJvUaxxCWs'
export const supabase = createClient(supabaseUrl, supabaseKey)
