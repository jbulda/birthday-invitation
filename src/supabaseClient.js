import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cpxwhbsoiidrownvngvz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweHdoYnNvaWlkcm93bnZuZ3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjEyNjUsImV4cCI6MjA5MzUzNzI2NX0.aWR2agX4yMObz25e2J7NZ8YfSgP0D4qzJnSkOys9Ycw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)