"use client"

import type { JobCategory, ExperienceRange } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface JobFiltersProps {
  categories: JobCategory[]
  experienceRanges: ExperienceRange[]
  locations: string[]
  filters: {
    location: string
    experience: string
    category: string
  }
  onFilterChange: (name: string, value: string) => void
}

export default function JobFilters({
  categories,
  experienceRanges,
  locations,
  filters,
  onFilterChange,
}: JobFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-zinc-200">
          Location
        </Label>
        <Select value={filters.location} onValueChange={(value) => onFilterChange("location", value)}>
          <SelectTrigger id="location" className="bg-zinc-800 border-zinc-700 text-zinc-200">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
            <SelectItem value="all" className="focus:bg-zinc-700 focus:text-white">
              All locations
            </SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location} className="focus:bg-zinc-700 focus:text-white">
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience" className="text-zinc-200">
          Experience
        </Label>
        <Select value={filters.experience} onValueChange={(value) => onFilterChange("experience", value)}>
          <SelectTrigger id="experience" className="bg-zinc-800 border-zinc-700 text-zinc-200">
            <SelectValue placeholder="All experience levels" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
            <SelectItem value="all" className="focus:bg-zinc-700 focus:text-white">
              All experience levels
            </SelectItem>
            {experienceRanges.map((range) => (
              <SelectItem key={range.id} value={range.value.toString()} className="focus:bg-zinc-700 focus:text-white">
                {range.range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-zinc-200">
          Category
        </Label>
        <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
          <SelectTrigger id="category" className="bg-zinc-800 border-zinc-700 text-zinc-200">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
            <SelectItem value="all" className="focus:bg-zinc-700 focus:text-white">
              All categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="focus:bg-zinc-700 focus:text-white"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

