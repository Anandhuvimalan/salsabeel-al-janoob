"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Job, JobCategory, ExperienceRange } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import JobForm from "@/components/carrercomp/job-form"
import { ArrowLeft, Plus, Briefcase, FolderTree, Clock, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function JobManagement() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [experienceRanges, setExperienceRanges] = useState<ExperienceRange[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newExperienceName, setNewExperienceName] = useState("")
  const [newExperienceValue, setNewExperienceValue] = useState("")
  const { toast } = useToast()

  // Selection state for each tab
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([])

  // Active tab state
  const [activeTab, setActiveTab] = useState("jobs")

  // Add these state variables after the other state declarations
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null)
  const [editingExperience, setEditingExperience] = useState<ExperienceRange | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Clear selections when changing tabs
  useEffect(() => {
    setSelectedJobs([])
    setSelectedCategories([])
    setSelectedExperiences([])
  }, [activeTab])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch jobs with categories
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*, category:category_id(id, name)")
        .order("created_at", { ascending: false })

      if (jobsError) throw jobsError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("job_categories")
        .select("*")
        .order("name")

      if (categoriesError) throw categoriesError

      // Fetch experience ranges
      const { data: experienceData, error: experienceError } = await supabase
        .from("experience_ranges")
        .select("*")
        .order("value", { ascending: true })

      if (experienceError) throw experienceError

      setJobs(jobsData || [])
      setCategories(categoriesData || [])
      setExperienceRanges(experienceData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowJobForm(true)
  }

  // Add these handler functions for editing categories and experiences
  const handleEditCategory = (category: JobCategory) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setShowCategoryForm(true)
  }

  const handleEditExperience = (experience: ExperienceRange) => {
    setEditingExperience(experience)
    setNewExperienceName(experience.range)
    setNewExperienceValue(experience.value.toString())
    setShowExperienceForm(true)
  }

  // Function to delete related applications first, then delete the job
  const handleDeleteJob = async (jobId: number) => {
    try {
      console.log("Attempting to delete job with ID:", jobId)

      if (!jobId || isNaN(jobId)) {
        throw new Error("Invalid job ID provided")
      }

      // First, delete related applications
      const { error: applicationsError } = await supabase.from("applications").delete().eq("job_id", jobId)

      if (applicationsError) {
        console.error("Error deleting related applications:", JSON.stringify(applicationsError))
        throw applicationsError
      }

      // Now delete the job
      const { error: jobError } = await supabase.from("jobs").delete().eq("id", jobId)

      if (jobError) {
        console.error("Error deleting job:", JSON.stringify(jobError))
        throw jobError
      }

      setJobs(jobs.filter((job) => job.id !== jobId))
      toast({
        title: "Job Deleted",
        description: "The job and its applications have been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error in delete operation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to delete all jobs and their applications
  const handleDeleteAllJobs = async () => {
    try {
      setDeleteLoading(true)

      if (jobs.length === 0) {
        toast({
          title: "No Jobs",
          description: "There are no jobs to delete.",
        })
        return
      }

      console.log("Attempting to delete all jobs and their applications")

      // First, delete all applications
      const { error: applicationsError } = await supabase.from("applications").delete().neq("id", 0) // Delete all applications

      if (applicationsError) {
        console.error("Error deleting all applications:", JSON.stringify(applicationsError))
        throw applicationsError
      }

      // Then delete all jobs
      const { error: jobsError } = await supabase.from("jobs").delete().neq("id", 0)

      if (jobsError) {
        console.error("Error deleting all jobs:", JSON.stringify(jobsError))
        throw jobsError
      }

      setJobs([])
      toast({
        title: "Success",
        description: "All jobs and their applications have been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error in bulk delete:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete all jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Function to delete selected jobs
  const handleDeleteSelectedJobs = async () => {
    try {
      setDeleteLoading(true)

      if (selectedJobs.length === 0) {
        toast({
          title: "No Selection",
          description: "Please select at least one job to delete.",
        })
        return
      }

      console.log("Attempting to delete selected jobs:", selectedJobs)

      // First, delete related applications for selected jobs
      const { error: applicationsError } = await supabase.from("applications").delete().in("job_id", selectedJobs)

      if (applicationsError) {
        console.error("Error deleting related applications:", JSON.stringify(applicationsError))
        throw applicationsError
      }

      // Then delete the selected jobs
      const { error: jobsError } = await supabase.from("jobs").delete().in("id", selectedJobs)

      if (jobsError) {
        console.error("Error deleting selected jobs:", JSON.stringify(jobsError))
        throw jobsError
      }

      setJobs(jobs.filter((job) => !selectedJobs.includes(job.id)))
      setSelectedJobs([])
      toast({
        title: "Success",
        description: `${selectedJobs.length} job(s) and their applications have been deleted successfully.`,
      })
    } catch (error: any) {
      console.error("Error deleting selected jobs:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete selected jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Function to delete selected categories
  const handleDeleteSelectedCategories = async () => {
    try {
      setDeleteLoading(true)

      if (selectedCategories.length === 0) {
        toast({
          title: "No Selection",
          description: "Please select at least one category to delete.",
        })
        return
      }

      console.log("Attempting to delete selected categories:", selectedCategories)

      // Check if any jobs are using these categories
      const { data: relatedJobs, error: checkError } = await supabase
        .from("jobs")
        .select("id, category_id")
        .in("category_id", selectedCategories)

      if (checkError) {
        console.error("Error checking related jobs:", JSON.stringify(checkError))
        throw checkError
      }

      if (relatedJobs && relatedJobs.length > 0) {
        toast({
          title: "Cannot Delete",
          description:
            "Some categories are in use by jobs. Please delete those jobs first or reassign them to different categories.",
          variant: "destructive",
        })
        return
      }

      // Delete the selected categories
      const { error: categoriesError } = await supabase.from("job_categories").delete().in("id", selectedCategories)

      if (categoriesError) {
        console.error("Error deleting selected categories:", JSON.stringify(categoriesError))
        throw categoriesError
      }

      setCategories(categories.filter((category) => !selectedCategories.includes(category.id)))
      setSelectedCategories([])
      toast({
        title: "Success",
        description: `${selectedCategories.length} category/categories have been deleted successfully.`,
      })
    } catch (error: any) {
      console.error("Error deleting selected categories:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete selected categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Function to delete selected experience ranges
  const handleDeleteSelectedExperiences = async () => {
    try {
      setDeleteLoading(true)

      if (selectedExperiences.length === 0) {
        toast({
          title: "No Selection",
          description: "Please select at least one experience range to delete.",
        })
        return
      }

      console.log("Attempting to delete selected experience ranges:", selectedExperiences)

      // Check if any jobs are using these experience ranges
      const { data: relatedJobs, error: checkError } = await supabase
        .from("jobs")
        .select("id, experience_id")
        .in("experience_id", selectedExperiences)

      if (checkError) {
        console.error("Error checking related jobs:", JSON.stringify(checkError))
        throw checkError
      }

      if (relatedJobs && relatedJobs.length > 0) {
        toast({
          title: "Cannot Delete",
          description:
            "Some experience ranges are in use by jobs. Please delete those jobs first or reassign them to different experience ranges.",
          variant: "destructive",
        })
        return
      }

      // Delete the selected experience ranges
      const { error: experiencesError } = await supabase
        .from("experience_ranges")
        .delete()
        .in("id", selectedExperiences)

      if (experiencesError) {
        console.error("Error deleting selected experience ranges:", JSON.stringify(experiencesError))
        throw experiencesError
      }

      setExperienceRanges(experienceRanges.filter((exp) => !selectedExperiences.includes(exp.id)))
      setSelectedExperiences([])
      toast({
        title: "Success",
        description: `${selectedExperiences.length} experience range(s) have been deleted successfully.`,
      })
    } catch (error: any) {
      console.error("Error deleting selected experience ranges:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete selected experience ranges. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleJobFormSubmit = async (formData: any, isEditing: boolean) => {
    try {
      if (isEditing && editingJob) {
        // Update existing job
        const { error } = await supabase.from("jobs").update(formData).eq("id", editingJob.id)

        if (error) throw error

        // Refresh data
        fetchData()
        toast({
          title: "Job Updated",
          description: "The job has been updated successfully.",
        })
      } else {
        // Create new job
        const { error } = await supabase.from("jobs").insert(formData)

        if (error) throw error

        // Refresh data
        fetchData()
        toast({
          title: "Job Created",
          description: "The job has been created successfully.",
        })
      }

      setShowJobForm(false)
      setEditingJob(null)
    } catch (error) {
      console.error("Error saving job:", error)
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the handleAddCategory function to handle editing
  const handleAddCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        toast({
          title: "Error",
          description: "Category name cannot be empty.",
          variant: "destructive",
        })
        return
      }

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("job_categories")
          .update({ name: newCategoryName.trim() })
          .eq("id", editingCategory.id)

        if (error) throw error

        // Update local state
        setCategories(
          categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: newCategoryName.trim() } : cat)),
        )

        toast({
          title: "Success",
          description: "Category updated successfully.",
        })
      } else {
        // Add new category
        const { data, error } = await supabase.from("job_categories").insert({ name: newCategoryName.trim() }).select()

        if (error) throw error

        setCategories([...categories, data[0]])

        toast({
          title: "Success",
          description: "Category added successfully.",
        })
      }

      setNewCategoryName("")
      setShowCategoryForm(false)
      setEditingCategory(null)
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the handleAddExperience function to handle editing
  const handleAddExperience = async () => {
    try {
      if (!newExperienceName.trim()) {
        toast({
          title: "Error",
          description: "Experience name cannot be empty.",
          variant: "destructive",
        })
        return
      }

      if (!newExperienceValue.trim() || isNaN(Number(newExperienceValue))) {
        toast({
          title: "Error",
          description: "Experience value must be a valid number.",
          variant: "destructive",
        })
        return
      }

      const experienceData = {
        range: newExperienceName.trim(),
        value: Number(newExperienceValue),
      }

      if (editingExperience) {
        // Update existing experience range
        const { error } = await supabase.from("experience_ranges").update(experienceData).eq("id", editingExperience.id)

        if (error) {
          console.error("Detailed update error:", JSON.stringify(error))
          throw error
        }

        // Update local state
        setExperienceRanges(
          experienceRanges.map((exp) => (exp.id === editingExperience.id ? { ...exp, ...experienceData } : exp)),
        )

        toast({
          title: "Success",
          description: "Experience range updated successfully.",
        })
      } else {
        // Add new experience range
        const { data, error } = await supabase.from("experience_ranges").insert(experienceData).select()

        if (error) {
          console.error("Detailed insert error:", JSON.stringify(error))
          throw error
        }

        setExperienceRanges([...experienceRanges, data[0]])

        toast({
          title: "Success",
          description: "Experience range added successfully.",
        })
      }

      setNewExperienceName("")
      setNewExperienceValue("")
      setShowExperienceForm(false)
      setEditingExperience(null)
    } catch (error: any) {
      console.error("Error saving experience range:", error)

      let errorMessage = "Failed to save experience range. "

      if (error.code) {
        errorMessage += `Error code: ${error.code}. `
      }

      if (error.message) {
        errorMessage += error.message
      } else {
        errorMessage += "Please check the console for more details."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Toggle selection of a job
  const toggleJobSelection = (jobId: number) => {
    setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  // Toggle selection of a category
  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Toggle selection of an experience range
  const toggleExperienceSelection = (experienceId: number) => {
    setSelectedExperiences((prev) =>
      prev.includes(experienceId) ? prev.filter((id) => id !== experienceId) : [...prev, experienceId],
    )
  }

  // Toggle selection of all jobs
  const toggleAllJobsSelection = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(jobs.map((job) => job.id))
    }
  }

  // Toggle selection of all categories
  const toggleAllCategoriesSelection = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(categories.map((category) => category.id))
    }
  }

  // Toggle selection of all experience ranges
  const toggleAllExperiencesSelection = () => {
    if (selectedExperiences.length === experienceRanges.length) {
      setSelectedExperiences([])
    } else {
      setSelectedExperiences(experienceRanges.map((exp) => exp.id))
    }
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12 bg-zinc-900">
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
            <h1 className="text-3xl font-bold tracking-tight text-white">Job Management</h1>
            <p className="text-white/70 mt-1">Manage job listings, categories, and experience ranges</p>
          </div>
          <div className="flex gap-2">
            {activeTab === "jobs" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                      disabled={selectedJobs.length === 0 || deleteLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{deleteLoading ? "Deleting..." : `Delete Selected (${selectedJobs.length})`}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Jobs</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        Are you sure you want to delete {selectedJobs.length} selected job(s)? This will also delete all
                        related applications. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 text-white border-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDeleteSelectedJobs}
                      >
                        Delete Selected
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setEditingJob(null)
                    setShowJobForm(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Job</span>
                </Button>
              </>
            )}

            {activeTab === "categories" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                      disabled={selectedCategories.length === 0 || deleteLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{deleteLoading ? "Deleting..." : `Delete Selected (${selectedCategories.length})`}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Categories</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        Are you sure you want to delete {selectedCategories.length} selected category/categories?
                        Categories that are in use by jobs cannot be deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 text-white border-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDeleteSelectedCategories}
                      >
                        Delete Selected
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setShowCategoryForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Category</span>
                </Button>
              </>
            )}

            {activeTab === "experience" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                      disabled={selectedExperiences.length === 0 || deleteLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{deleteLoading ? "Deleting..." : `Delete Selected (${selectedExperiences.length})`}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Experience Ranges</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        Are you sure you want to delete {selectedExperiences.length} selected experience range(s)?
                        Experience ranges that are in use by jobs cannot be deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 text-white border-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDeleteSelectedExperiences}
                      >
                        Delete Selected
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setShowExperienceForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Experience</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="bg-zinc-800 border-zinc-700 shadow-xl text-white">
          <Tabs defaultValue="jobs" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-3 p-0 rounded-b-none bg-zinc-900 text-white/90">
              <TabsTrigger
                value="jobs"
                className="flex items-center gap-2 py-3 rounded-b-none text-white/80 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                <Briefcase className="h-4 w-4" />
                <span>Jobs</span>
                {!loading && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {jobs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2 py-3 rounded-b-none text-white/80 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                <FolderTree className="h-4 w-4" />
                <span>Categories</span>
                {!loading && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2 py-3 rounded-b-none text-white/80 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4" />
                <span>Experience</span>
                {!loading && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {experienceRanges.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-6 bg-zinc-800 text-white">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-zinc-700" />
                  <Skeleton className="h-12 w-full bg-zinc-700" />
                  <Skeleton className="h-12 w-full bg-zinc-700" />
                </div>
              ) : (
                <>
                  <TabsContent value="jobs" className="mt-0 text-white">
                    {jobs.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="selectAllJobs"
                              checked={selectedJobs.length === jobs.length && jobs.length > 0}
                              onCheckedChange={toggleAllJobsSelection}
                              className="border-zinc-500 data-[state=checked]:bg-blue-500"
                            />
                            <label
                              htmlFor="selectAllJobs"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Select All
                            </label>
                          </div>
                          {selectedJobs.length > 0 && (
                            <span className="text-sm text-white/70">
                              {selectedJobs.length} of {jobs.length} selected
                            </span>
                          )}
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow className="border-zinc-700 hover:bg-zinc-700/50">
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {jobs.map((job) => (
                              <TableRow key={job.id} className="border-zinc-700 hover:bg-zinc-700/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedJobs.includes(job.id)}
                                    onCheckedChange={() => toggleJobSelection(job.id)}
                                    className="border-zinc-500 data-[state=checked]:bg-blue-500"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{job.title}</TableCell>
                                <TableCell>{job.category?.name || "Uncategorized"}</TableCell>
                                <TableCell>{job.location || "Remote"}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditJob(job)}
                                      className="h-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="h-8"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/70">No jobs found. Create your first job listing.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="categories" className="mt-0 text-white">
                    {categories.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="selectAllCategories"
                              checked={selectedCategories.length === categories.length && categories.length > 0}
                              onCheckedChange={toggleAllCategoriesSelection}
                              className="border-zinc-500 data-[state=checked]:bg-blue-500"
                            />
                            <label
                              htmlFor="selectAllCategories"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Select All
                            </label>
                          </div>
                          {selectedCategories.length > 0 && (
                            <span className="text-sm text-white/70">
                              {selectedCategories.length} of {categories.length} selected
                            </span>
                          )}
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow className="border-zinc-700 hover:bg-zinc-700/50">
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categories.map((category) => (
                              <TableRow key={category.id} className="border-zinc-700 hover:bg-zinc-700/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={() => toggleCategorySelection(category.id)}
                                    className="border-zinc-500 data-[state=checked]:bg-blue-500"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditCategory(category)}
                                      className="h-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => toggleCategorySelection(category.id)}
                                      className="h-8"
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/70">No categories found. Create your first category.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="experience" className="mt-0 text-white">
                    {experienceRanges.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="selectAllExperiences"
                              checked={
                                selectedExperiences.length === experienceRanges.length && experienceRanges.length > 0
                              }
                              onCheckedChange={toggleAllExperiencesSelection}
                              className="border-zinc-500 data-[state=checked]:bg-blue-500"
                            />
                            <label
                              htmlFor="selectAllExperiences"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Select All
                            </label>
                          </div>
                          {selectedExperiences.length > 0 && (
                            <span className="text-sm text-white/70">
                              {selectedExperiences.length} of {experienceRanges.length} selected
                            </span>
                          )}
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow className="border-zinc-700 hover:bg-zinc-700/50">
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {experienceRanges.map((experience) => (
                              <TableRow key={experience.id} className="border-zinc-700 hover:bg-zinc-700/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedExperiences.includes(experience.id)}
                                    onCheckedChange={() => toggleExperienceSelection(experience.id)}
                                    className="border-zinc-500 data-[state=checked]:bg-blue-500"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{experience.range}</TableCell>
                                <TableCell>{experience.value}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditExperience(experience)}
                                      className="h-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => toggleExperienceSelection(experience.id)}
                                      className="h-8"
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/70">No experience ranges found. Create your first experience range.</p>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Job Form Dialog */}
      {showJobForm && (
        <div className="text-white">
          <JobForm
            categories={categories}
            job={editingJob}
            onSubmit={handleJobFormSubmit}
            onCancel={() => {
              setShowJobForm(false)
              setEditingJob(null)
            }}
          />
        </div>
      )}

      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent className="bg-zinc-800 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription className="text-white/70">
              {editingCategory ? "Update the category name." : "Enter a name for the new job category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Engineering, Marketing, Design"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCategoryForm(false)
                setEditingCategory(null)
                setNewCategoryName("")
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-none"
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-600 text-white">
              {editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Form Dialog */}
      <Dialog open={showExperienceForm} onOpenChange={setShowExperienceForm}>
        <DialogContent className="bg-zinc-800 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingExperience ? "Edit Experience Range" : "Add New Experience Range"}</DialogTitle>
            <DialogDescription className="text-white/70">
              {editingExperience
                ? "Update the experience range details."
                : "Enter details for the new experience range."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="experienceName">Experience Name</Label>
              <Input
                id="experienceName"
                placeholder="e.g., Entry Level, Mid-Level, Senior"
                value={newExperienceName}
                onChange={(e) => setNewExperienceName(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experienceValue">Experience Value (for sorting)</Label>
              <Input
                id="experienceValue"
                type="number"
                placeholder="e.g., 1, 2, 3"
                value={newExperienceValue}
                onChange={(e) => setNewExperienceValue(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowExperienceForm(false)
                setEditingExperience(null)
                setNewExperienceName("")
                setNewExperienceValue("")
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-none"
            >
              Cancel
            </Button>
            <Button onClick={handleAddExperience} className="bg-blue-500 hover:bg-blue-600 text-white">
              {editingExperience ? "Update Experience" : "Add Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

