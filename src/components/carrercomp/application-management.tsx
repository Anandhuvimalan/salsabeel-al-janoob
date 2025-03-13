"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Application, Job } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, Download, Trash2, Search, Loader2, Filter, ArrowLeft } from "lucide-react"
import ApplicationDetails from "@/components/carrercomp/application-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ApplicationManagement() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    job: "all",
    status: "all",
    search: "",
  })
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [selectedApplications, setSelectedApplications] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteMode, setDeleteMode] = useState<"single" | "selected" | "all">("single")
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...applications]

    if (filters.job && filters.job !== "all") {
      result = result.filter((app) => app.job_id === Number.parseInt(filters.job))
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((app) => app.status === filters.status)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (app) =>
          app.full_name.toLowerCase().includes(searchTerm) ||
          app.email.toLowerCase().includes(searchTerm) ||
          app.phone.toLowerCase().includes(searchTerm) ||
          new Date(app.created_at).toLocaleDateString().includes(searchTerm) ||
          app.job?.title.toLowerCase().includes(searchTerm),
      )
    }

    setFilteredApplications(result)
    // Reset selection when filters change
    setSelectedApplications([])
    setSelectAll(false)
  }, [filters, applications])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch applications with job details
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*, job:job_id(id, title)")
        .order("created_at", { ascending: false })

      if (applicationsError) throw applicationsError

      // Fetch jobs for filter
      const { data: jobsData, error: jobsError } = await supabase.from("jobs").select("id, title").order("title")

      if (jobsError) throw jobsError

      setApplications(applicationsData || [])
      setFilteredApplications(applicationsData || [])
      setJobs(jobsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = async (applicationId: number, status: string) => {
    try {
      const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId)

      if (error) throw error

      // Update local state
      setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status } : app)))

      toast({
        title: "Status Updated",
        description: "The application status has been updated.",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "reviewed":
        return "blue"
      case "shortlisted":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleSelectApplication = (applicationId: number, checked: boolean) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, applicationId])
    } else {
      setSelectedApplications((prev) => prev.filter((id) => id !== applicationId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedApplications(filteredApplications.map((app) => app.id))
    } else {
      setSelectedApplications([])
    }
  }

  const openDeleteDialog = (mode: "single" | "selected" | "all", applicationId?: number) => {
    setDeleteMode(mode)
    if (applicationId) {
      setApplicationToDelete(applicationId)
    }
    setDeleteDialogOpen(true)
  }

  const deleteResume = async (resumeUrl: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = resumeUrl.split("/")
      const filePath = urlParts[urlParts.length - 1]

      // Delete the file from storage
      const { error } = await supabase.storage.from("applications").remove([filePath])

      if (error) {
        console.error("Error deleting resume:", error)
      }
    } catch (error) {
      console.error("Error parsing resume URL:", error)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      let idsToDelete: number[] = []

      if (deleteMode === "single" && applicationToDelete) {
        idsToDelete = [applicationToDelete]
      } else if (deleteMode === "selected") {
        idsToDelete = selectedApplications
      } else if (deleteMode === "all") {
        idsToDelete = filteredApplications.map((app) => app.id)
      }

      if (idsToDelete.length === 0) {
        throw new Error("No applications selected for deletion")
      }

      // Get the resume URLs for the applications to be deleted
      const { data: appsToDelete } = await supabase.from("applications").select("id, resume_url").in("id", idsToDelete)

      // Delete the applications from the database
      const { error } = await supabase.from("applications").delete().in("id", idsToDelete)

      if (error) throw error

      // Delete the resumes from storage
      if (appsToDelete) {
        for (const app of appsToDelete) {
          await deleteResume(app.resume_url)
        }
      }

      // Update local state
      setApplications(applications.filter((app) => !idsToDelete.includes(app.id)))
      setSelectedApplications([])
      setSelectAll(false)

      toast({
        title: "Applications Deleted",
        description: `Successfully deleted ${idsToDelete.length} application(s).`,
      })
    } catch (error) {
      console.error("Error deleting applications:", error)
      toast({
        title: "Error",
        description: "Failed to delete applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setApplicationToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 space-y-6 bg-zinc-900 text-white">
        <Skeleton className="h-8 w-64 bg-zinc-700" />
        <Skeleton className="h-10 w-full bg-zinc-700" />
        <Skeleton className="h-10 w-full bg-zinc-700" />
        <Skeleton className="h-10 w-full bg-zinc-700" />
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12 bg-zinc-900 text-white">
      {/* Back button with hover effects */}
      <button
        className="mb-6 flex items-center px-2 py-1 text-white/80 hover:text-white bg-transparent transition-colors"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Back to dashboard</span>
      </button>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Application Management</h1>
            <p className="text-white/70 mt-1">Review and manage job applications</p>
          </div>
        </div>

        <Card className="bg-zinc-800 border-zinc-700 shadow-xl text-white">
          <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
            <CardTitle className="text-xl font-semibold text-white">Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-blue-400" />
                  <h2 className="font-semibold text-white">Filters</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-filter" className="text-white/90 font-medium">
                      Filter by Job
                    </Label>
                    <Select value={filters.job} onValueChange={(value) => handleFilterChange("job", value)}>
                      <SelectTrigger id="job-filter" className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="All jobs" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="all">All jobs</SelectItem>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id.toString()}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status-filter" className="text-white/90 font-medium">
                      Filter by Status
                    </Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger id="status-filter" className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-white/90 font-medium">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, phone, date..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="pl-8 bg-zinc-900 border-zinc-700 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-700">
                <div className="text-sm text-white/80">
                  <span className="font-medium">
                    {selectedApplications.length > 0
                      ? `${selectedApplications.length} application(s) selected`
                      : `${filteredApplications.length} application(s) found`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedApplications.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog("selected")}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  )}
                  {filteredApplications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog("all")}
                      className="border-zinc-600 bg-red-700 text-white"
                    >
                      Delete All Filtered
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800 shadow-sm">
                <Table>
                  <TableHeader className="bg-zinc-900">
                    <TableRow className="border-zinc-700 hover:bg-zinc-800">
                      <TableHead className="w-12 text-white/70">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all applications"
                          className="border-zinc-600"
                        />
                      </TableHead>
                      <TableHead className="font-medium text-white/70">Applicant</TableHead>
                      <TableHead className="font-medium text-white/70">Job</TableHead>
                      <TableHead className="font-medium text-white/70">Applied On</TableHead>
                      <TableHead className="font-medium text-white/70">Status</TableHead>
                      <TableHead className="text-right font-medium text-white/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow className="border-zinc-700 hover:bg-zinc-800">
                        <TableCell colSpan={6} className="text-center py-8 text-white/50">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id} className="border-zinc-700 hover:bg-zinc-800/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedApplications.includes(application.id)}
                              onCheckedChange={(checked) => handleSelectApplication(application.id, checked as boolean)}
                              aria-label={`Select application from ${application.full_name}`}
                              className="border-zinc-600"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-white">{application.full_name}</div>
                            <div className="text-sm text-white/70">{application.email}</div>
                            <div className="text-sm text-white/70">{application.phone}</div>
                          </TableCell>
                          <TableCell className="text-white">{application.job?.title || "Unknown Job"}</TableCell>
                          <TableCell className="text-white">
                            {new Date(application.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={application.status}
                              onValueChange={(value) => handleStatusChange(application.id, value)}
                            >
                              <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white">
                                <SelectValue>
                                  <Badge
                                    className={`
                                      ${application.status === "pending" ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : ""}
                                      ${application.status === "reviewed" ? "bg-blue-500 hover:bg-blue-600 text-white border-0" : ""}
                                      ${application.status === "shortlisted" ? "bg-green-500 hover:bg-green-600 text-white border-0" : ""}
                                      ${application.status === "rejected" ? "bg-red-500 hover:bg-red-600 text-white border-0" : ""}
                                    `}
                                  >
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedApplication(application)}
                                className="h-8 w-8 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-blue-400"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(application.resume_url, "_blank")}
                                className="h-8 w-8 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-blue-400"
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download Resume</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openDeleteDialog("single", application.id)}
                                className="h-8 w-8 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {deleteMode === "single"
                ? "Are you sure you want to delete this application? This action cannot be undone."
                : deleteMode === "selected"
                  ? `Are you sure you want to delete ${selectedApplications.length} selected application(s)? This action cannot be undone.`
                  : `Are you sure you want to delete all ${filteredApplications.length} filtered application(s)? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

