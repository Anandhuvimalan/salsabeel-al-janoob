import type { Metadata } from "next"
import JobManagement from "@/components/carrercomp/job-management"

export const metadata: Metadata = {
  title: "Job Management | Admin",
  description: "Manage job listings, categories, and experience ranges",
}

export default function JobManagementPage() {
  return <JobManagement />
}

