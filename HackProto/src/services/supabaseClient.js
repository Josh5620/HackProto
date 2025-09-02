import { createClient } from '@supabase/supabase-js'

const supabaseURL = 'https://dbgomhevkclimkonkckd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZ29taGV2a2NsaW1rb25rY2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTY5MDIsImV4cCI6MjA3MjIzMjkwMn0.u19QLOrXr8nW4jYEIj5pF68jyxZ1UlDekJz5pkYwnxM'

export const supabaseClient = createClient(supabaseURL, supabaseAnonKey)
