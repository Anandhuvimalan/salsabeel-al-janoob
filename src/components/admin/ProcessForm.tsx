"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, AlertCircle, CheckCircle2, Palette } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"
import { HexColorPicker } from "react-colorful"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

// Predefined color options
const colorOptions = [
  {
    value: "blue",
    from: "from-blue-500",
    to: "to-blue-700",
    hoverFrom: "hover:from-blue-600",
    hoverTo: "hover:to-blue-800",
    label: "Blue",
  },
  {
    value: "purple",
    from: "from-purple-500",
    to: "to-purple-700",
    hoverFrom: "hover:from-purple-600",
    hoverTo: "hover:to-purple-800",
    label: "Purple",
  },
  {
    value: "green",
    from: "from-green-500",
    to: "to-green-700",
    hoverFrom: "hover:from-green-600",
    hoverTo: "hover:to-green-800",
    label: "Green",
  },
  {
    value: "red",
    from: "from-red-500",
    to: "to-red-700",
    hoverFrom: "hover:from-red-600",
    hoverTo: "hover:to-red-800",
    label: "Red",
  },
  {
    value: "yellow",
    from: "from-yellow-500",
    to: "to-yellow-700",
    hoverFrom: "hover:from-yellow-600",
    hoverTo: "hover:to-yellow-800",
    label: "Yellow",
  },
  {
    value: "pink",
    from: "from-pink-500",
    to: "to-pink-700",
    hoverFrom: "hover:from-pink-600",
    hoverTo: "hover:to-pink-800",
    label: "Pink",
  },
  {
    value: "indigo",
    from: "from-indigo-500",
    to: "to-indigo-700",
    hoverFrom: "hover:from-indigo-600",
    hoverTo: "hover:to-indigo-800",
    label: "Indigo",
  },
  {
    value: "teal",
    from: "from-teal-500",
    to: "to-teal-700",
    hoverFrom: "hover:from-teal-600",
    hoverTo: "hover:to-teal-800",
    label: "Teal",
  },
  {
    value: "orange",
    from: "from-orange-500",
    to: "to-orange-700",
    hoverFrom: "hover:from-orange-600",
    hoverTo: "hover:to-orange-800",
    label: "Orange",
  },
  {
    value: "gray",
    from: "from-gray-500",
    to: "to-gray-700",
    hoverFrom: "hover:from-gray-600",
    hoverTo: "hover:to-gray-800",
    label: "Gray",
  },
]

// Convert hex color to tailwind class
const hexToTailwindClass = (hex: string, type: "from" | "to" | "hover:from" | "hover:to") => {
  // Map of hex color ranges to tailwind color classes
  const colorMap: Record<string, string> = {
    "#3B82F6": "blue-500",
    "#2563EB": "blue-600",
    "#1D4ED8": "blue-700",
    "#1E40AF": "blue-800",
    "#8B5CF6": "purple-500",
    "#7C3AED": "purple-600",
    "#6D28D9": "purple-700",
    "#5B21B6": "purple-800",
    "#10B981": "green-500",
    "#059669": "green-600",
    "#047857": "green-700",
    "#065F46": "green-800",
    "#EF4444": "red-500",
    "#DC2626": "red-600",
    "#B91C1C": "red-700",
    "#991B1B": "red-800",
    "#F59E0B": "yellow-500",
    "#D97706": "yellow-600",
    "#B45309": "yellow-700",
    "#92400E": "yellow-800",
    "#EC4899": "pink-500",
    "#DB2777": "pink-600",
    "#BE185D": "pink-700",
    "#9D174D": "pink-800",
    "#6366F1": "indigo-500",
    "#4F46E5": "indigo-600",
    "#4338CA": "indigo-700",
    "#3730A3": "indigo-800",
    "#14B8A6": "teal-500",
    "#0D9488": "teal-600",
    "#0F766E": "teal-700",
    "#115E59": "teal-800",
    "#F97316": "orange-500",
    "#EA580C": "orange-600",
    "#C2410C": "orange-700",
    "#9A3412": "orange-800",
    "#6B7280": "gray-500",
    "#4B5563": "gray-600",
    "#374151": "gray-700",
    "#1F2937": "gray-800",
  }

  // Find the closest color in our map
  let closestColor = "blue-500"
  let minDistance = Number.MAX_VALUE

  // Convert hex to RGB for distance calculation
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  Object.keys(colorMap).forEach((colorHex) => {
    const cr = Number.parseInt(colorHex.slice(1, 3), 16)
    const cg = Number.parseInt(colorHex.slice(3, 5), 16)
    const cb = Number.parseInt(colorHex.slice(5, 7), 16)

    // Calculate color distance using simple Euclidean distance
    const distance = Math.sqrt(Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2))

    if (distance < minDistance) {
      minDistance = distance
      closestColor = colorMap[colorHex]
    }
  })

  return `${type}-${closestColor}`
}

type ProcessSection = {
  heading: string
  description: string
  buttonLink: string
  buttonText: string
}

type ProcessStep = {
  title: string
  description: string
  iconSrc: string
  hoverFrom: string
  hoverTo: string
  iconFrom: string
  iconTo: string
}

type ProcessData = {
  section: ProcessSection
  steps: ProcessStep[]
}

export default function ProcessForm() {
  const [formData, setFormData] = useState<ProcessData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [showFromPicker, setShowFromPicker] = useState<number | null>(null)
  const [showToPicker, setShowToPicker] = useState<number | null>(null)
  const [customColors, setCustomColors] = useState<Record<string, string>>({})

  // Refs for file inputs (for step icon uploads)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetchProcessData()
  }, [])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [imagePreviews])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchProcessData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("process_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Initialize image previews for existing icons
      const previews: Record<string, string> = {}
      data.steps.forEach((step: ProcessStep, index: number) => {
        if (step.iconSrc) {
          previews[`step_${index}`] = getIconUrl(step.iconSrc)
        }
      })

      setImagePreviews(previews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching process data:", error)
      setMessage({ text: "Failed to load process data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        section: {
          heading: "Our Work Process",
          description: "We follow a streamlined process to ensure quality results for every project.",
          buttonText: "Get Started",
          buttonLink: "/contact",
        },
        steps: [
          {
            title: "Step 1",
            description: "Initial consultation and project planning",
            iconSrc: "",
            hoverFrom: "hover:from-blue-600",
            hoverTo: "hover:to-blue-800",
            iconFrom: "from-blue-500",
            iconTo: "to-blue-700",
          },
        ],
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get public URL for icons
  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("process-icons").getPublicUrl(path).data.publicUrl
  }

  // Helper function to update nested objects/arrays without losing array type.
  function updateNestedObject(obj: any, path: string[], value: any): any {
    if (path.length === 0) return value
    const [current, ...rest] = path
    const index = Number(current)
    if (!isNaN(index)) {
      const newArr = Array.isArray(obj) ? [...obj] : []
      newArr[index] = updateNestedObject(newArr[index], rest, value)
      return newArr
    } else {
      return {
        ...obj,
        [current]: updateNestedObject(obj ? obj[current] : undefined, rest, value),
      }
    }
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return
    setFormData((prev) => updateNestedObject(prev, path.split("."), value))

    // Clear error for this field if it exists
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[path]
        return newErrors
      })
    }
  }

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    if (!formData) return
    const updatedSteps = [...formData.steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setFormData({ ...formData, steps: updatedSteps })

    // Clear error for this field if it exists
    const errorKey = `steps.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleColorChange = (index: number, colorValue: string) => {
    if (!formData) return

    const selectedColor = colorOptions.find((color) => color.value === colorValue)
    if (!selectedColor) return

    const updatedSteps = [...formData.steps]
    updatedSteps[index] = {
      ...updatedSteps[index],
      iconFrom: selectedColor.from,
      iconTo: selectedColor.to,
      hoverFrom: selectedColor.hoverFrom,
      hoverTo: selectedColor.hoverTo,
    }

    setFormData({ ...formData, steps: updatedSteps })
  }

  const getCurrentColorValue = (step: ProcessStep) => {
    // Try to find a matching color preset
    const match = colorOptions.find(
      (color) =>
        step.iconFrom === color.from &&
        step.iconTo === color.to &&
        step.hoverFrom === color.hoverFrom &&
        step.hoverTo === color.hoverTo,
    )

    return match ? match.value : "custom"
  }

  const addStep = () => {
    if (!formData) return
    const newStep: ProcessStep = {
      title: "New Step",
      description: "",
      iconSrc: "",
      hoverFrom: "hover:from-blue-600",
      hoverTo: "hover:to-blue-800",
      iconFrom: "from-blue-500",
      iconTo: "to-blue-700",
    }
    setFormData({ ...formData, steps: [...formData.steps, newStep] })
  }

  const removeStep = (index: number) => {
    if (!formData) return

    // If there's an icon, mark it for deletion
    const step = formData.steps[index]
    if (step.iconSrc && !step.iconSrc.startsWith("http") && !step.iconSrc.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, step.iconSrc])
    }

    const updatedSteps = formData.steps.filter((_, i) => i !== index)
    setFormData({ ...formData, steps: updatedSteps })

    // Clean up any preview
    if (imagePreviews[`step_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`step_${index}`]
      setImagePreviews(newPreviews)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [`steps.${index}.iconSrc`]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [`steps.${index}.iconSrc`]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing icon to mark for deletion
    const currentIcon = formData.steps[index].iconSrc
    if (currentIcon && !currentIcon.startsWith("http") && !currentIcon.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentIcon])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [`step_${index}`]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [`step_${index}`]: previewUrl,
    }))

    // Clear any errors
    if (errors[`steps.${index}.iconSrc`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`steps.${index}.iconSrc`]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteIcon = (index: number) => {
    if (!formData) return

    // Mark the icon for deletion if it's stored in Supabase
    const iconPath = formData.steps[index].iconSrc
    if (iconPath && !iconPath.startsWith("http") && !iconPath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, iconPath])
    }

    // Update step in formData
    const updatedSteps = [...formData.steps]
    updatedSteps[index] = { ...updatedSteps[index], iconSrc: "" }
    setFormData({ ...formData, steps: updatedSteps })

    // Remove preview
    if (imagePreviews[`step_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`step_${index}`]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[`step_${index}`]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[`step_${index}`]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.section.heading.trim()) {
      newErrors["section.heading"] = "Heading is required"
    }
    if (!formData.section.description.trim()) {
      newErrors["section.description"] = "Description is required"
    }
    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`steps.${index}.title`] = "Title is required"
      }
      if (!step.description.trim()) {
        newErrors[`steps.${index}.description`] = "Description is required"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([key, file]) => {
      // Extract index from key format "step_{index}"
      const index = Number.parseInt(key.split("_")[1])

      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `step-${index}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("process-icons").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

      if (uploadError) throw uploadError

      return { index, fileName }
    })

    return Promise.all(uploads)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !validateForm()) {
      setMessage({ text: "Please fix the errors in the form", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Upload new icons first
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedSteps = [...formData.steps]

      // Update the steps with new icon paths
      uploadResults.forEach(({ index, fileName }) => {
        updatedSteps[index] = { ...updatedSteps[index], iconSrc: fileName }
      })

      // Update the database
      const { error } = await supabase
        .from("process_section")
        .update({
          section: formData.section,
          steps: updatedSteps,
        })
        .eq("id", recordId)

      if (error) throw error

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("process-icons").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Process section updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchProcessData()
    } catch (error) {
      console.error("Error saving process data:", error)
      setMessage({ text: "Failed to save process data. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCustomColorChange = (index: number, type: "from" | "to", color: string) => {
    if (!formData) return

    setCustomColors((prev) => ({
      ...prev,
      [`${index}-${type}`]: color,
    }))

    const updatedSteps = [...formData.steps]

    if (type === "from") {
      updatedSteps[index] = {
        ...updatedSteps[index],
        iconFrom: hexToTailwindClass(color, "from"),
        hoverFrom: hexToTailwindClass(color, "hover:from"),
      }
    } else {
      updatedSteps[index] = {
        ...updatedSteps[index],
        iconTo: hexToTailwindClass(color, "to"),
        hoverTo: hexToTailwindClass(color, "hover:to"),
      }
    }

    setFormData({ ...formData, steps: updatedSteps })
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-40 w-full bg-white/5" />
        <Skeleton className="h-40 w-full bg-white/5" />
      </div>
    )
  }

  return (
    <div>
      {message.text && (
        <Alert
          variant={message.type === "warning" ? "warning" : message.type === "error" ? "destructive" : "default"}
          className={`mb-6 ${message.type === "success" ? "bg-zinc-900/90 border-emerald-600/30" : ""}`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 !text-emerald-400" />
          ) : message.type === "warning" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className={message.type === "success" ? "text-emerald-400" : ""}>
            {message.type === "success" ? "Success" : message.type === "warning" ? "Warning" : "Error"}
          </AlertTitle>
          <AlertDescription className={message.type === "success" ? "text-emerald-300/90" : ""}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Details */}
        <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
          <h2 className="text-xl font-semibold">Section Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section.heading" className="flex items-center gap-1">
                Heading <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="section.heading"
                value={formData.section.heading}
                onChange={(e) => handleTextChange("section.heading", e.target.value)}
                className={cn(
                  inputStyles,
                  errors["section.heading"] && "!border-destructive focus-visible:!ring-destructive",
                )}
                placeholder="Enter section heading"
              />
              {errors["section.heading"] && <p className="text-sm text-destructive">{errors["section.heading"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section.description" className="flex items-center gap-1">
                Description <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="section.description"
                value={formData.section.description}
                onChange={(e) => handleTextChange("section.description", e.target.value)}
                className={cn(
                  inputStyles,
                  errors["section.description"] && "!border-destructive focus-visible:!ring-destructive",
                  "resize-y min-h-[100px] !h-auto",
                )}
                style={{ resize: "vertical" }}
                rows={3}
                placeholder="Enter section description"
              />
              {errors["section.description"] && (
                <p className="text-sm text-destructive">{errors["section.description"]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section.buttonText">Button Text</Label>
              <Input
                id="section.buttonText"
                value={formData.section.buttonText}
                onChange={(e) => handleTextChange("section.buttonText", e.target.value)}
                className={inputStyles}
                placeholder="Enter button text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section.buttonLink">Button Link</Label>
              <Input
                id="section.buttonLink"
                value={formData.section.buttonLink}
                onChange={(e) => handleTextChange("section.buttonLink", e.target.value)}
                className={inputStyles}
                placeholder="Enter button link URL"
              />
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
          <h2 className="text-xl font-semibold">Process Steps</h2>

          {formData.steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
              No steps added yet. Click the "Add Step" button to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.steps.map((step, index) => (
                <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Step #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.title`} className="flex items-center gap-1">
                          Title <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id={`steps.${index}.title`}
                          value={step.title}
                          onChange={(e) => handleStepChange(index, "title", e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`steps.${index}.title`] && "!border-destructive focus-visible:!ring-destructive",
                          )}
                          placeholder="Enter step title"
                        />
                        {errors[`steps.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`steps.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.description`} className="flex items-center gap-1">
                          Description <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Textarea
                          id={`steps.${index}.description`}
                          value={step.description}
                          onChange={(e) => handleStepChange(index, "description", e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`steps.${index}.description`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                            "resize-y min-h-[100px] !h-auto",
                          )}
                          style={{ resize: "vertical" }}
                          rows={3}
                          placeholder="Enter step description"
                        />
                        {errors[`steps.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`steps.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.iconSrc`}>Icon</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            id={`steps.${index}.iconSrc`}
                            type="file"
                            onChange={(e) => handleFileSelect(e, index)}
                            className="hidden"
                            accept="image/*"
                          />
                          {(step.iconSrc || selectedFiles[`step_${index}`]) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteIcon(index)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Icon
                            </Button>
                          )}
                        </div>
                        {errors[`steps.${index}.iconSrc`] && (
                          <p className="text-sm text-destructive">{errors[`steps.${index}.iconSrc`]}</p>
                        )}

                        {(step.iconSrc || imagePreviews[`step_${index}`]) && (
                          <Card className={`mt-4 overflow-hidden w-16 h-16 relative ${cardStyles}`}>
                            <Image
                              src={imagePreviews[`step_${index || "/placeholder.svg"}`] || getIconUrl(step.iconSrc)}
                              alt="Step icon"
                              fill
                              className="object-contain p-2"
                            />
                          </Card>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Color Selector */}
                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.color`} className="flex items-center">
                          Color Scheme <Palette className="h-4 w-4 ml-1 text-muted-foreground" />
                        </Label>

                        <div className="grid grid-cols-1 gap-4">
                          {/* Color Scheme Selector */}
                          <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-md">
                            {colorOptions.map((option) => (
                              <div
                                key={option.value}
                                onClick={() => handleColorChange(index, option.value)}
                                className={`w-8 h-8 rounded-md cursor-pointer transition-all duration-200 hover:scale-110 ${
                                  getCurrentColorValue(step) === option.value
                                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                                    : "border border-white/10"
                                }`}
                              >
                                <div
                                  className={`w-full h-full rounded-md bg-gradient-to-r ${option.from} ${option.to}`}
                                />
                              </div>
                            ))}

                            {/* Custom color option */}
                            <div
                              onClick={() => {
                                setShowFromPicker(showFromPicker === index ? null : index)
                                // Initialize custom colors with current gradient colors if not already set
                                if (!customColors[`${index}-from`] && !customColors[`${index}-to`]) {
                                  // Extract color values from current classes if possible
                                  const fromClass = step.iconFrom.split("-")
                                  const toClass = step.iconTo.split("-")

                                  setCustomColors((prev) => ({
                                    ...prev,
                                    [`${index}-from`]: "#3B82F6", // Default blue if can't extract
                                    [`${index}-to`]: "#1D4ED8", // Default darker blue if can't extract
                                  }))
                                }
                              }}
                              className={`w-8 h-8 rounded-md cursor-pointer transition-all duration-200 hover:scale-110 ${
                                getCurrentColorValue(step) === "custom"
                                  ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                                  : "border border-white/10"
                              }`}
                            >
                              <div className="w-full h-full rounded-md bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                                <Palette className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Preview of selected gradient */}
                          <div
                            className={`h-6 w-full rounded-md bg-gradient-to-r ${step.iconFrom} ${step.iconTo}`}
                          ></div>
                        </div>

                        {/* Custom Color Picker (shown if custom is selected) */}
                        {showFromPicker === index && (
                          <div className="relative z-10 mt-2">
                            <div className="absolute bg-background border border-white/10 p-4 rounded-md shadow-lg">
                              <div className="mb-3 text-sm font-medium">Custom Gradient</div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label className="text-xs mb-1 block">From Color</Label>
                                  <HexColorPicker
                                    color={customColors[`${index}-from`] || "#3B82F6"}
                                    onChange={(color) => handleCustomColorChange(index, "from", color)}
                                  />
                                  <div className="mt-1 px-2 py-1 bg-black/30 rounded text-xs text-center">
                                    {customColors[`${index}-from`] || "#3B82F6"}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-xs mb-1 block">To Color</Label>
                                  <HexColorPicker
                                    color={customColors[`${index}-to`] || "#1D4ED8"}
                                    onChange={(color) => handleCustomColorChange(index, "to", color)}
                                  />
                                  <div className="mt-1 px-2 py-1 bg-black/30 rounded text-xs text-center">
                                    {customColors[`${index}-to`] || "#1D4ED8"}
                                  </div>
                                </div>
                              </div>

                              <div className="mb-2">
                                <Label className="text-xs mb-1 block">Preview</Label>
                                <div
                                  className={`h-8 w-full rounded-md bg-gradient-to-r ${step.iconFrom} ${step.iconTo}`}
                                ></div>
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowFromPicker(null)}
                                  className={buttonStyles}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Step button at the bottom right */}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={addStep}
              className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
            >
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Process Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchProcessData}
            disabled={isSaving}
            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

