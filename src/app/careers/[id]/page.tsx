import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import JobDetails from "@/components/carrercomp/job-details"

interface JobPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { data: job } = await supabase.from("jobs").select("title").eq("id", params.id).single()

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
  const { data: job } = await supabase
    .from("jobs")
    .select("*, category:category_id(id, name)")
    .eq("id", params.id)
    .single()

  if (!job) {
    notFound()
  }

  return <JobDetails job={job} />
}

