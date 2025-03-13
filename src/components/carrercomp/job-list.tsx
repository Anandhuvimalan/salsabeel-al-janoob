"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Job, JobCategory, ExperienceRange } from "@/lib/supabase"
import JobCard from "@/components/carrercomp/job-card"
import JobFilters from "@/components/carrercomp/job-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [experienceRanges, setExperienceRanges] = useState<ExperienceRange[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    location: "all",
    experience: "all",
    category: "all",
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch jobs with categories
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*, category:category_id(id, name)")
          .eq("is_active", true)

        if (jobsError) throw jobsError

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase.from("job_categories").select("*")

        if (categoriesError) throw categoriesError

        // Fetch experience ranges
        const { data: experienceData, error: experienceError } = await supabase
          .from("experience_ranges")
          .select("*")
          .order("value", { ascending: true })

        if (experienceError) throw experienceError

        // Extract unique locations
        const uniqueLocations = Array.from(new Set((jobsData || []).map((job) => job.location)))

        setJobs(jobsData || [])
        setFilteredJobs(jobsData || [])
        setCategories(categoriesData || [])
        setExperienceRanges(experienceData || [])
        setLocations(uniqueLocations)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...jobs]

    if (filters.location && filters.location !== "all") {
      result = result.filter((job) => job.location === filters.location)
    }

    if (filters.experience && filters.experience !== "all") {
      const expValue = Number.parseInt(filters.experience)

      if (expValue === 0) {
        // For Fresher (0 years), filter exact match
        result = result.filter((job) => job.experience === 0)
      } else {
        // For other experience levels, filter as a range between this level and the next level
        // First, sort the experience ranges by value
        const sortedRanges = [...experienceRanges].sort((a, b) => a.value - b.value)

        // Find the current range index
        const currentRangeIndex = sortedRanges.findIndex((range) => range.value === expValue)

        if (currentRangeIndex !== -1 && currentRangeIndex < sortedRanges.length - 1) {
          // If there's a next range, filter between current and next
          const nextRangeValue = sortedRanges[currentRangeIndex + 1].value
          result = result.filter((job) => job.experience >= expValue && job.experience < nextRangeValue)
        } else {
          // If it's the highest range, filter for that value and above
          result = result.filter((job) => job.experience >= expValue)
        }
      }
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((job) => job.category_id === Number.parseInt(filters.category))
    }

    setFilteredJobs(result)
  }, [filters, jobs, experienceRanges])

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-1/3 bg-zinc-800" />
          <Skeleton className="h-10 w-full md:w-1/3 bg-zinc-800" />
          <Skeleton className="h-10 w-full md:w-1/3 bg-zinc-800" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 w-full bg-zinc-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <JobFilters
        categories={categories}
        experienceRanges={experienceRanges}
        locations={locations}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-zinc-700 p-8">
          <h3 className="text-lg font-medium text-white">No jobs found</h3>
          <p className="text-zinc-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

