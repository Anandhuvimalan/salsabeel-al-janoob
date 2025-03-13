"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, Minus, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type AboutSectionData = {
  id?: string
  hero: {
    title: {
      highlight: string
      subtitle: string
    }
    description: string[]
    button: {
      text: string
    }
    image: {
      src: string
      alt: string
    }
    imageOverlay: {
      text: string
      icon: string
    }
  }
  achievements: {
    value: number
    suffix: string
    label: string
    color: string
  }[]
  values: {
    title: string
    items: {
      icon: string
      title: string
      description: string
      iconColor: string
    }[]
    image: {
      src: string
      alt: string
    }
  }
}

export default function AboutSectionForm() {
  const [formData, setFormData] = useState<AboutSectionData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("hero")

  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const heroIconFileInputRef = useRef<HTMLInputElement>(null)
  const valuesFileInputRef = useRef<HTMLInputElement>(null)
  const valueIconFileInputRefs = useRef<Record<string, HTMLInputElement>>({})

  useEffect(() => {
    fetchAboutData()
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

  const fetchAboutData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from("about_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      // Initialize image previews for existing images
      const previews: Record<string, string> = {}

      // Hero image
      if (data.hero.image.src) {
        previews["hero.image"] = getImageUrl(data.hero.image.src)
      }

      // Hero overlay icon
      if (data.hero.imageOverlay.icon) {
        previews["hero.imageOverlay.icon"] = getImageUrl(data.hero.imageOverlay.icon)
      }

      // Values image
      if (data.values.image.src) {
        previews["values.image"] = getImageUrl(data.values.image.src)
      }

      // Value item icons
      data.values.items.forEach((item, index) => {
        if (item.icon) {
          previews[`values.items.${index}.icon`] = getImageUrl(item.icon)
        }
      })

      setImagePreviews(previews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching about data:", error)
      setMessage({ text: "Failed to load about section data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get public URL for images
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("about-section-images").getPublicUrl(path).data.publicUrl
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return

    setFormData((prev) => ({
      ...prev!,
      ...updateNestedObject(prev!, path.split("."), value),
    }))

    // Clear error for this field if it exists
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[path]
        return newErrors
      })
    }
  }

  const handleAchievementChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev
      const updated = [...prev.achievements]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, achievements: updated }
    })

    // Clear error for this field if it exists
    const errorKey = `achievements.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addAchievement = () => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        achievements: [
          ...prev.achievements,
          { value: 0, suffix: "+", label: "New Achievement", color: "text-blue-600" },
        ],
      }
    })
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index),
      }
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldPath]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [fieldPath]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing file at this path that needs to be marked for deletion
    if (formData) {
      const keys = fieldPath.split(".")
      let current: any = formData

      // Navigate to the correct object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) break
        current = current[keys[i]]
      }

      // Get the last key and check if there's an existing file
      const lastKey = keys[keys.length - 1]
      let existingPath = ""

      if (lastKey === "image" && current.image) {
        existingPath = current.image.src
      } else if (current[lastKey]) {
        existingPath = current[lastKey]
      }

      // If there's an existing file path and it's not a URL, mark it for deletion
      if (existingPath && !existingPath.startsWith("http") && !existingPath.startsWith("/")) {
        setFilesToDelete((prev) => [...prev, existingPath])
      }
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [fieldPath]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [fieldPath]: previewUrl,
    }))

    // Clear any errors
    if (errors[fieldPath]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldPath]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = async (fieldPath: string) => {
    if (!formData) return

    // Get the current image path from formData
    const keys = fieldPath.split(".")
    let current: any = formData
    for (const key of keys.slice(0, -1)) {
      current = current[key]
    }

    const imagePath = current[keys[keys.length - 1]].src

    // If there's a valid image path that's not a URL, mark it for deletion
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, imagePath])
    }

    // Update form data to clear the path
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ...updateNestedObject(prev, fieldPath.split("."), { src: "", alt: current[keys[keys.length - 1]].alt }),
      }
    })

    // Remove preview
    setImagePreviews((prev) => {
      const newPreviews = { ...prev }
      delete newPreviews[fieldPath]
      return newPreviews
    })
  }

  const handleDeleteIcon = async (fieldPath: string) => {
    if (!formData) return

    // Get the current icon path from formData
    const keys = fieldPath.split(".")
    let current: any = formData
    for (const key of keys.slice(0, -1)) {
      current = current[key]
    }

    const iconPath = current[keys[keys.length - 1]]

    // If there's no icon or it's a URL starting with http or /, just clear the path
    if (!iconPath || iconPath.startsWith("http") || iconPath.startsWith("/")) {
      // Just update the form data to clear the path
      setFormData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          ...updateNestedObject(prev, fieldPath.split("."), ""),
        }
      })

      // Remove preview
      setImagePreviews((prev) => {
        const newPreviews = { ...prev }
        delete newPreviews[fieldPath]
        return newPreviews
      })

      return
    }

    // Mark the icon for deletion
    setFilesToDelete((prev) => [...prev, iconPath])

    // Update form data
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ...updateNestedObject(prev, fieldPath.split("."), ""),
      }
    })

    // Remove preview
    setImagePreviews((prev) => {
      const newPreviews = { ...prev }
      delete newPreviews[fieldPath]
      return newPreviews
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData) return false

    // Hero Section Validation
    if (!formData.hero.title.highlight.trim()) newErrors["hero.title.highlight"] = "Highlighted title is required"
    if (!formData.hero.title.subtitle.trim()) newErrors["hero.title.subtitle"] = "Subtitle is required"

    // Check if hero image is present in formData or selectedFiles
    if (!formData.hero.image.src && !selectedFiles["hero.image"]) {
      newErrors["hero.image"] = "Hero image is required"
    }

    formData.hero.description.forEach((para, index) => {
      if (!para.trim()) newErrors[`hero.description.${index}`] = "Description paragraph is required"
    })

    // Achievements Validation
    formData.achievements.forEach((achievement, index) => {
      if (!achievement.label.trim()) newErrors[`achievements.${index}.label`] = "Label is required"
      if (isNaN(achievement.value)) newErrors[`achievements.${index}.value`] = "Value must be a number"
    })

    // Values Validation
    if (!formData.values.title.trim()) newErrors["values.title"] = "Values title is required"
    formData.values.items.forEach((item, index) => {
      if (!item.title.trim()) newErrors[`values.items.${index}.title`] = "Value title is required"
      if (!item.description.trim()) newErrors[`values.items.${index}.description`] = "Value description is required"
    })

    // Check if values image is present in formData or selectedFiles
    if (!formData.values.image.src && !selectedFiles["values.image"]) {
      newErrors["values.image"] = "Values image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([fieldPath, file]) => {
      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("about-section-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type, // Explicitly set content type for SVG files
      })

      if (uploadError) throw uploadError

      return { fieldPath, fileName }
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
      // First upload all selected files
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedData = { ...formData }

      // Update the data with new file paths
      uploadResults.forEach(({ fieldPath, fileName }) => {
        const keys = fieldPath.split(".")
        let current: any = updatedData

        // Navigate to the correct object
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }

        // Update the path
        const lastKey = keys[keys.length - 1]
        if (lastKey === "image") {
          current.image.src = fileName
        } else {
          current[lastKey] = fileName
        }
      })

      // Save the updated data to Supabase
      const { error } = await supabase.from("about_section").upsert({
        id: formData.id,
        hero: updatedData.hero,
        achievements: updatedData.achievements,
        values: updatedData.values,
      })

      if (error) throw error

      // After successful update, delete all marked files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("about-section-images").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "About section updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([]) // Clear the files to delete list
      await fetchAboutData()
    } catch (error) {
      console.error("Error saving about data:", error)
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-6 bg-background">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-32 w-full bg-white/5" />
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
      {/* Content Tabs */}
      <div className="mb-8">
        <div className="flex justify-center w-full">
          <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg p-1 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("hero")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "hero"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Hero
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "achievements"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Achievements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("values")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "values"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Core Values
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        {activeTab === "hero" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Hero Section</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero.title.highlight" className="flex items-center gap-1">
                    Highlighted Title <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="hero.title.highlight"
                    value={formData.hero.title.highlight}
                    onChange={(e) => handleTextChange("hero.title.highlight", e.target.value)}
                    className={cn(
                      inputStyles,
                      errors["hero.title.highlight"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                    placeholder="Enter highlighted title"
                  />
                  {errors["hero.title.highlight"] && (
                    <p className="text-sm text-destructive">{errors["hero.title.highlight"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero.title.subtitle" className="flex items-center gap-1">
                    Subtitle <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="hero.title.subtitle"
                    value={formData.hero.title.subtitle}
                    onChange={(e) => handleTextChange("hero.title.subtitle", e.target.value)}
                    className={cn(
                      inputStyles,
                      errors["hero.title.subtitle"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                    placeholder="Enter subtitle"
                  />
                  {errors["hero.title.subtitle"] && (
                    <p className="text-sm text-destructive">{errors["hero.title.subtitle"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Description <span className="text-destructive ml-1">*</span>
                  </Label>
                  {formData.hero.description.map((para, index) => (
                    <div key={index} className="mb-4">
                      <Textarea
                        value={para}
                        onChange={(e) => handleTextChange(`hero.description.${index}`, e.target.value)}
                        className={cn(
                          inputStyles,
                          errors[`hero.description.${index}`] && "!border-destructive focus-visible:!ring-destructive",
                          "min-h-[100px]",
                        )}
                        rows={3}
                        placeholder="Enter description paragraph"
                        style={{
                          resize: "vertical",
                          minHeight: "100px",
                          height: "auto",
                          overflow: "hidden",
                        }}
                        onInput={(e) => {
                          // Auto-resize the textarea based on content
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = "auto"
                          target.style.height = `${target.scrollHeight}px`
                        }}
                      />
                      {errors[`hero.description.${index}`] && (
                        <p className="text-sm text-destructive">{errors[`hero.description.${index}`]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero.button.text">Button Text</Label>
                  <Input
                    id="hero.button.text"
                    value={formData.hero.button.text}
                    onChange={(e) => handleTextChange("hero.button.text", e.target.value)}
                    placeholder="Enter button text"
                    className={inputStyles}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero.image" className="flex items-center gap-1">
                    Hero Image <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => heroFileInputRef.current?.click()}
                      className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      ref={heroFileInputRef}
                      id="hero.image"
                      type="file"
                      onChange={(e) => handleFileSelect(e, "hero.image")}
                      className="hidden"
                      accept="image/*"
                    />
                    {(formData.hero.image.src || selectedFiles["hero.image"]) && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage("hero.image")}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Image
                      </Button>
                    )}
                  </div>
                  {errors["hero.image"] && <p className="text-sm text-destructive">{errors["hero.image"]}</p>}

                  {(formData.hero.image.src || imagePreviews["hero.image"]) && (
                    <Card className={`mt-4 overflow-hidden aspect-video relative ${cardStyles}`}>
                      <Image
                        src={imagePreviews["hero.image"] || getImageUrl(formData.hero.image.src)}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                      />
                    </Card>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero.imageOverlay.icon">Overlay Icon</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => heroIconFileInputRef.current?.click()}
                      className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      ref={heroIconFileInputRef}
                      id="hero.imageOverlay.icon"
                      type="file"
                      onChange={(e) => handleFileSelect(e, "hero.imageOverlay.icon")}
                      className="hidden"
                      accept="image/svg+xml, image/png, image/jpeg"
                    />
                    {(formData.hero.imageOverlay.icon || selectedFiles["hero.imageOverlay.icon"]) && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteIcon("hero.imageOverlay.icon")}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Icon
                      </Button>
                    )}
                  </div>

                  {(formData.hero.imageOverlay.icon || imagePreviews["hero.imageOverlay.icon"]) && (
                    <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                      <Image
                        src={imagePreviews["hero.imageOverlay.icon"] || getImageUrl(formData.hero.imageOverlay.icon)}
                        alt="Icon preview"
                        fill
                        className="object-contain"
                      />
                    </Card>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero.imageOverlay.text">Overlay Text</Label>
                  <Input
                    id="hero.imageOverlay.text"
                    value={formData.hero.imageOverlay.text}
                    onChange={(e) => handleTextChange("hero.imageOverlay.text", e.target.value)}
                    placeholder="Enter overlay text"
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeTab === "achievements" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Achievements</h2>

            {formData.achievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No achievements added yet. Click the "Add Achievement" button to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Achievement #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="gap-2"
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`achievements.${index}.label`} className="flex items-center gap-1">
                          Label <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id={`achievements.${index}.label`}
                          value={achievement.label}
                          onChange={(e) => handleAchievementChange(index, "label", e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`achievements.${index}.label`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                          )}
                          placeholder="Enter achievement label"
                        />
                        {errors[`achievements.${index}.label`] && (
                          <p className="text-sm text-destructive">{errors[`achievements.${index}.label`]}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`achievements.${index}.value`} className="flex items-center gap-1">
                            Value <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id={`achievements.${index}.value`}
                            type="number"
                            value={achievement.value}
                            onChange={(e) =>
                              handleAchievementChange(index, "value", Number.parseInt(e.target.value) || 0)
                            }
                            className={cn(
                              inputStyles,
                              errors[`achievements.${index}.value`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                            )}
                            placeholder="Enter value"
                          />
                          {errors[`achievements.${index}.value`] && (
                            <p className="text-sm text-destructive">{errors[`achievements.${index}.value`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`achievements.${index}.suffix`}>Suffix</Label>
                          <Select
                            value={achievement.suffix}
                            onValueChange={(value) => handleAchievementChange(index, "suffix", value)}
                          >
                            <SelectTrigger id={`achievements.${index}.suffix`} className={inputStyles}>
                              <SelectValue placeholder="Select suffix" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+">+</SelectItem>
                              <SelectItem value="%">%</SelectItem>
                              <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`achievements.${index}.color`}>Color Class</Label>
                        <Select
                          value={achievement.color}
                          onValueChange={(value) => handleAchievementChange(index, "color", value)}
                        >
                          <SelectTrigger id={`achievements.${index}.color`} className={inputStyles}>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-blue-600">Blue</SelectItem>
                            <SelectItem value="text-teal-600">Teal</SelectItem>
                            <SelectItem value="text-purple-600">Purple</SelectItem>
                            <SelectItem value="text-orange-600">Orange</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                type="button"
                onClick={addAchievement}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Achievement
              </Button>
            </div>
          </div>
        )}

        {/* Values Section */}
        {activeTab === "values" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Core Values</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="values.title" className="flex items-center gap-1">
                    Section Title <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="values.title"
                    value={formData.values.title}
                    onChange={(e) => handleTextChange("values.title", e.target.value)}
                    className={cn(
                      inputStyles,
                      errors["values.title"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                    placeholder="Enter section title"
                  />
                  {errors["values.title"] && <p className="text-sm text-destructive">{errors["values.title"]}</p>}
                </div>

                {formData.values.items.map((item, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`values.items.${index}.title`} className="flex items-center gap-1">
                          Title <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id={`values.items.${index}.title`}
                          value={item.title}
                          onChange={(e) => handleTextChange(`values.items.${index}.title`, e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`values.items.${index}.title`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                          )}
                          placeholder="Enter value title"
                        />
                        {errors[`values.items.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`values.items.${index}.title`]}</p>
                        )}
                      </div>

                      {/* Replace the entire values.items.${index}.description textarea section with this: */}
                      <div className="space-y-2">
                        <Label htmlFor={`values.items.${index}.description`} className="flex items-center gap-1">
                          Description <span className="text-destructive ml-1">*</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            id={`values.items.${index}.description`}
                            value={item.description}
                            onChange={(e) => handleTextChange(`values.items.${index}.description`, e.target.value)}
                            className={cn(
                              inputStyles,
                              errors[`values.items.${index}.description`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                              "min-h-[100px]",
                            )}
                            rows={3}
                            placeholder="Enter value description"
                            style={{
                              resize: "vertical",
                              minHeight: "100px",
                              height: "auto",
                              overflow: "hidden",
                            }}
                            onInput={(e) => {
                              // Auto-resize the textarea based on content
                              const target = e.target as HTMLTextAreaElement
                              target.style.height = "auto"
                              target.style.height = `${target.scrollHeight}px`
                            }}
                          />
                        </div>
                        {errors[`values.items.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`values.items.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`values.items.${index}.icon`}>Value Icon</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`value-icon-input-${index}`)?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            Upload Icon
                          </Button>
                          <input
                            id={`value-icon-input-${index}`}
                            type="file"
                            onChange={(e) => handleFileSelect(e, `values.items.${index}.icon`)}
                            className="hidden"
                            accept="image/svg+xml, image/png, image/jpeg"
                          />
                          {(item.icon || selectedFiles[`values.items.${index}.icon`]) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteIcon(`values.items.${index}.icon`)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Icon
                            </Button>
                          )}
                        </div>
                        {(item.icon || imagePreviews[`values.items.${index}.icon`]) && (
                          <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                            <Image
                              src={
                                imagePreviews[`values.items.${index || "/placeholder.svg"}.icon`] ||
                                getImageUrl(item.icon)
                              }
                              alt="Value icon preview"
                              fill
                              className="object-contain"
                            />
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="values.image" className="flex items-center gap-1">
                    Values Image <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => valuesFileInputRef.current?.click()}
                      className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      ref={valuesFileInputRef}
                      id="values.image"
                      type="file"
                      onChange={(e) => handleFileSelect(e, "values.image")}
                      className="hidden"
                      accept="image/*"
                    />
                    {(formData.values.image.src || selectedFiles["values.image"]) && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage("values.image")}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Image
                      </Button>
                    )}
                  </div>
                  {errors["values.image"] && <p className="text-sm text-destructive">{errors["values.image"]}</p>}

                  {(formData.values.image.src || imagePreviews["values.image"]) && (
                    <Card className={`mt-4 overflow-hidden aspect-video relative ${cardStyles}`}>
                      <Image
                        src={imagePreviews["values.image"] || getImageUrl(formData.values.image.src)}
                        alt="Values preview"
                        fill
                        className="object-cover"
                      />
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
                Update About Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchAboutData}
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

// Helper function to update nested objects
function updateNestedObject(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value
  const [current, ...rest] = path
  const index = Number(current)
  if (!isNaN(index)) {
    // Current path is a numeric index, so treat obj as an array.
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

