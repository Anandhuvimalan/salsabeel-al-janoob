import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type JobCategory = {
  id: number
  name: string
  created_at: string
}

export type ExperienceRange = {
  id: number
  range: string
  value: number
  created_at: string
}

export type Job = {
  id: number
  title: string
  location: string
  is_remote: boolean
  experience: number
  description: string
  requirements: string
  responsibilities: string
  category_id: number
  is_active: boolean
  created_at: string
  category?: JobCategory
}

export type Application = {
  id: number
  job_id: number
  full_name: string
  email: string
  phone: string
  location: string
  current_company?: string
  experience?: number
  notice_period?: number
  current_ctc?: number
  expected_ctc?: number
  additional_info?: string
  resume_url: string
  status: "pending" | "reviewed" | "shortlisted" | "rejected"
  created_at: string
  job?: Job
}

