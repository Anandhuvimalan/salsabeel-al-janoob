import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import AdminDashboard from "@/components/carrercomp/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Careers Portal",
  description: "Manage jobs and applications",
}

export default async function AdminPage() {
  // Get counts for dashboard
  const { count: jobsCount } = await supabase.from("jobs").select("*", { count: "exact", head: true })

  const { count: applicationsCount } = await supabase.from("applications").select("*", { count: "exact", head: true })

  const { count: pendingApplicationsCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return (
    <AdminDashboard
      jobsCount={jobsCount || 0}
      applicationsCount={applicationsCount || 0}
      pendingApplicationsCount={pendingApplicationsCount || 0}
    />
  )
}

