import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rehdgdkjbgdbgerwxrsq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaGRnZGtqYmdkYmdlcnd4cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTg4MDgsImV4cCI6MjA2MTY5NDgwOH0.dm9us4-yOLKtIc5v9gKNcAOOu-3JeK7yTZ_SOx2dpvM'

export const supabase = createClient(supabaseUrl, supabaseKey)