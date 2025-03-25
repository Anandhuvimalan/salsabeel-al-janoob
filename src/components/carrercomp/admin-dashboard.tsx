"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminDashboard() {
  const [jobsCount, setJobsCount] = useState(0)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch jobs count
        const { count: jobsCount, error: jobsError } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })

        if (jobsError) throw jobsError

        // Fetch total applications count
        const { count: applicationsCount, error: applicationsError } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })

        if (applicationsError) throw applicationsError

        // Fetch pending applications count
        const { count: pendingCount, error: pendingError } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        if (pendingError) throw pendingError

        setJobsCount(jobsCount || 0)
        setApplicationsCount(applicationsCount || 0)
        setPendingApplicationsCount(pendingCount || 0)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage jobs and applications</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : jobsCount}</div>
              <p className="text-xs text-muted-foreground">Active job listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : applicationsCount}</div>
              <p className="text-xs text-muted-foreground">Submitted applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : pendingApplicationsCount}</div>
              <p className="text-xs text-muted-foreground">Applications awaiting review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Add, edit, and manage job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p>Manage your job listings, categories, and experience ranges.</p>
                <div>
                  <Link href="/admin/career/jobs">
                    <Button>Manage Jobs</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p>Review, filter, and manage applications from candidates.</p>
                <div>
                  <Link href="/admin/career/applications">
                    <Button>Manage Applications</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

