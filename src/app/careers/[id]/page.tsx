import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import JobDetails from "@/components/carrercomp/job-details"

interface JobPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  // Await the entire params object first
  const resolvedParams = await params
  const { id } = resolvedParams

  const { data: job } = await supabase.from("jobs").select("title").eq("id", id).single()

  if (!job) {
    return {
      title: "Job Not Found",
    }
  }

  return {
    title: `${job.title} | Careers`,
    description: `Apply for the ${job.title} position`,
  }
}

export default async function JobPage({ params }: JobPageProps) {
  // Also update here for consistency
  const resolvedParams = await params
  const { id } = resolvedParams

  const { data: job } = await supabase.from("jobs").select("*, category:category_id(id, name)").eq("id", id).single()

  if (!job) {
    notFound()
  }

  return <JobDetails job={job} />
}

