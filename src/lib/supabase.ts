import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  country: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  date: string
  mood: number
  sleep: number
  activity: number
  stress: number
  notes?: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  date: string
  sentiment: 'positive' | 'neutral' | 'negative'
  emotions: string[]
  ai_insights?: string
  audio_url?: string
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  author_name: string
  title: string
  content: string
  category: string
  is_anonymous: boolean
  likes: number
  replies: number
  created_at: string
  updated_at: string
}

export interface CommunityReply {
  id: string
  post_id: string
  user_id: string
  author_name: string
  content: string
  is_anonymous: boolean
  created_at: string
}