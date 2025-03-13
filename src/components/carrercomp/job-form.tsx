"use client"

import type React from "react"

import { useState } from "react"
import type { Job, JobCategory } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface JobFormProps {
  job: Job | null
  categories: JobCategory[]
  onSubmit: (formData: any, isEditing: boolean) => void
  onCancel: () => void
}

export default function JobForm({ job, categories, onSubmit, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    location: job?.location || "",
    is_remote: job?.is_remote || false,
    experience: job?.experience?.toString() || "0",
    description: job?.description || "",
    requirements: job?.requirements || "",
    responsibilities: job?.responsibilities || "",
    category_id: job?.category_id?.toString() || "",
    is_active: job?.is_active ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      experience: Number.parseInt(formData.experience),
      category_id: formData.category_id ? Number.parseInt(formData.category_id) : null,
    }

    onSubmit(processedData, !!job)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-800 text-white border border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">{job ? "Edit Job" : "Add New Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Job Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-white">Category</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleSelectChange("category_id", value)}
              >
                <SelectTrigger id="category_id" className="bg-zinc-700 text-white border-zinc-600">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className="focus:bg-zinc-700 focus:text-white">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-white">Experience (years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
                className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_remote"
                checked={formData.is_remote}
                onCheckedChange={(checked) => handleSwitchChange("is_remote", checked)}
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="is_remote" className="text-white">Remote Position</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="is_active" className="text-white">Active Listing</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities" className="text-white">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={5}
              required
              className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-white">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={5}
              required
              className="bg-zinc-700 text-white border-zinc-600 focus:border-blue-500 placeholder:text-zinc-400"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-zinc-600 text-black hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {job ? "Update Job" : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}