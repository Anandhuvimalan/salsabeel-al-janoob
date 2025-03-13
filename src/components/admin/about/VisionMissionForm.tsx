"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, Minus, CheckCircle2, AlertCircle } from "lucide-react"
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

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type MissionItem = {
  icon: string
  strongText: string
  text: string
}

type VisionMissionData = {
  inline_banner: string
  main_heading: string
  vision_card: {
    icon: string
    title: string
    description: string
  }
  mission_card: {
    icon: string
    title: string
    items: MissionItem[]
  }
}

export default function VisionMissionForm() {
  const [formData, setFormData] = useState<VisionMissionData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("general")

  // Refs for file inputs
  const visionIconRef = useRef<HTMLInputElement>(null)
  const missionIconRef = useRef<HTMLInputElement>(null)
  const missionItemIconRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    fetchData()
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

  const fetchData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("aboutpage_visionmission")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Initialize image previews for existing icons
      const previews: Record<string, string> = {}

      // Vision card icon
      if (data.vision_card.icon) {
        previews["vision_icon"] = getIconUrl(data.vision_card.icon)
      }

      // Mission card icon
      if (data.mission_card.icon) {
        previews["mission_icon"] = getIconUrl(data.mission_card.icon)
      }

      // Mission item icons
      data.mission_card.items.forEach((item: MissionItem, index: number) => {
        if (item.icon) {
          previews[`mission_item_${index}`] = getIconUrl(item.icon)
        }
      })

      setImagePreviews(previews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching vision & mission data:", error)
      setMessage({ text: "Failed to load data. Please refresh the page.", type: "error" })
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
    return supabase.storage.from("aboutpage-visionmission-icons").getPublicUrl(path).data.publicUrl
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return
    setFormData((prev) => updateNestedObject(prev!, path.split("."), value))
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[path]
        return newErrors
      })
    }
  }

  // Function to add a mission item
  const addMissionItem = () => {
    setFormData((prev) => {
      if (!prev) return prev
      const newItem = { icon: "", strongText: "", text: "" }
      return {
        ...prev,
        mission_card: {
          ...prev.mission_card,
          items: [...prev.mission_card.items, newItem],
        },
      }
    })
  }

  // Function to remove a mission item at a given index
  const removeMissionItem = (index: number) => {
    if (!formData) return

    // If there's an icon, mark it for deletion
    const item = formData.mission_card.items[index]
    if (item.icon && !item.icon.startsWith("http") && !item.icon.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, item.icon])
    }

    setFormData((prev) => {
      if (!prev) return prev
      const updatedItems = prev.mission_card.items.filter((_, idx) => idx !== index)
      return {
        ...prev,
        mission_card: {
          ...prev.mission_card,
          items: updatedItems,
        },
      }
    })

    // Clean up any preview
    if (imagePreviews[`mission_item_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`mission_item_${index}`]
      setImagePreviews(newPreviews)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing icon to mark for deletion
    let currentIcon = ""
    if (fieldKey === "vision_icon") {
      currentIcon = formData.vision_card.icon
    } else if (fieldKey === "mission_icon") {
      currentIcon = formData.mission_card.icon
    } else if (fieldKey.startsWith("mission_item_")) {
      const itemIndex = Number.parseInt(fieldKey.split("_")[2])
      currentIcon = formData.mission_card.items[itemIndex].icon
    }

    if (currentIcon && !currentIcon.startsWith("http") && !currentIcon.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentIcon])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [fieldKey]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [fieldKey]: previewUrl,
    }))

    // Clear any errors
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteIcon = (fieldKey: string) => {
    if (!formData) return

    // Get the current icon path
    let iconPath = ""
    if (fieldKey === "vision_icon") {
      iconPath = formData.vision_card.icon
    } else if (fieldKey === "mission_icon") {
      iconPath = formData.mission_card.icon
    } else if (fieldKey.startsWith("mission_item_")) {
      const itemIndex = Number.parseInt(fieldKey.split("_")[2])
      iconPath = formData.mission_card.items[itemIndex].icon
    }

    // If there's a valid icon path that's not a URL, mark it for deletion
    if (iconPath && !iconPath.startsWith("http") && !iconPath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, iconPath])
    }

    // Update formData to clear the icon path
    if (fieldKey === "vision_icon") {
      setFormData((prev) => ({
        ...prev!,
        vision_card: {
          ...prev!.vision_card,
          icon: "",
        },
      }))
    } else if (fieldKey === "mission_icon") {
      setFormData((prev) => ({
        ...prev!,
        mission_card: {
          ...prev!.mission_card,
          icon: "",
        },
      }))
    } else if (fieldKey.startsWith("mission_item_")) {
      const itemIndex = Number.parseInt(fieldKey.split("_")[2])
      setFormData((prev) => {
        if (!prev) return prev
        const updatedItems = [...prev.mission_card.items]
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: "" }
        return {
          ...prev,
          mission_card: {
            ...prev.mission_card,
            items: updatedItems,
          },
        }
      })
    }

    // Remove preview
    if (imagePreviews[fieldKey]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[fieldKey]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[fieldKey]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[fieldKey]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.inline_banner.trim()) newErrors["inline_banner"] = "Inline banner is required"
    if (!formData.main_heading.trim()) newErrors["main_heading"] = "Main heading is required"
    if (!formData.vision_card.title.trim()) newErrors["vision_card.title"] = "Vision title is required"
    if (!formData.vision_card.description.trim())
      newErrors["vision_card.description"] = "Vision description is required"
    if (!formData.mission_card.title.trim()) newErrors["mission_card.title"] = "Mission title is required"
    formData.mission_card.items.forEach((item, idx) => {
      if (!item.strongText.trim()) newErrors[`mission_card.items.${idx}.strongText`] = "Strong text is required"
      if (!item.text.trim()) newErrors[`mission_card.items.${idx}.text`] = "Mission item text is required"
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([fieldKey, file]) => {
      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "svg"
      const fileName = `${fieldKey.replace(/_/g, "-")}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("aboutpage-visionmission-icons")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      return { fieldKey, fileName }
    })

    return Promise.all(uploads)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !validateForm() || !recordId) {
      setMessage({ text: "Please fix the errors in the form", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // First upload all selected files
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedData = JSON.parse(JSON.stringify(formData))

      // Update the data with new file paths
      uploadResults.forEach(({ fieldKey, fileName }) => {
        if (fieldKey === "vision_icon") {
          updatedData.vision_card.icon = fileName
        } else if (fieldKey === "mission_icon") {
          updatedData.mission_card.icon = fileName
        } else if (fieldKey.startsWith("mission_item_")) {
          const itemIndex = Number.parseInt(fieldKey.split("_")[2])
          updatedData.mission_card.items[itemIndex].icon = fileName
        }
      })

      // Update the database
      const { error } = await supabase.from("aboutpage_visionmission").update(updatedData).eq("id", recordId)

      if (error) throw error

      // After successful update, delete all marked files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from("aboutpage-visionmission-icons")
          .remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Vision & Mission section updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchData()
    } catch (error) {
      console.error("Error saving vision & mission data:", error)
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-6 animate-pulse">
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
      {/* Content Tabs */}
      <div className="mb-8">
        <div className="flex justify-center w-full">
          <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg p-1 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "general"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vision")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "vision"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Vision
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mission")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "mission"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Mission
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">General Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inline_banner">Inline Banner</Label>
                <Input
                  id="inline_banner"
                  value={formData.inline_banner}
                  onChange={(e) => handleTextChange("inline_banner", e.target.value)}
                  placeholder="Enter inline banner text"
                  className={cn(
                    inputStyles,
                    errors["inline_banner"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["inline_banner"] && <p className="text-sm text-destructive">{errors["inline_banner"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="main_heading">Main Heading</Label>
                <Input
                  id="main_heading"
                  value={formData.main_heading}
                  onChange={(e) => handleTextChange("main_heading", e.target.value)}
                  placeholder="Enter main heading"
                  className={cn(
                    inputStyles,
                    errors["main_heading"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["main_heading"] && <p className="text-sm text-destructive">{errors["main_heading"]}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Vision Card */}
        {activeTab === "vision" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Vision Card</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vision_card.title">Title</Label>
                <Input
                  id="vision_card.title"
                  value={formData.vision_card.title}
                  onChange={(e) => handleTextChange("vision_card.title", e.target.value)}
                  placeholder="Enter vision title"
                  className={cn(
                    inputStyles,
                    errors["vision_card.title"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["vision_card.title"] && (
                  <p className="text-sm text-destructive">{errors["vision_card.title"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision_card.description">Description</Label>
                <Textarea
                  id="vision_card.description"
                  value={formData.vision_card.description}
                  onChange={(e) => handleTextChange("vision_card.description", e.target.value)}
                  placeholder="Enter vision description"
                  className={cn(
                    inputStyles,
                    errors["vision_card.description"] && "!border-destructive focus-visible:!ring-destructive",
                    "resize-y min-h-[100px] !h-auto",
                  )}
                  style={{ resize: "vertical" }}
                  rows={4}
                />
                {errors["vision_card.description"] && (
                  <p className="text-sm text-destructive">{errors["vision_card.description"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => visionIconRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Icon
                  </Button>
                  <input
                    ref={visionIconRef}
                    type="file"
                    onChange={(e) => handleFileSelect(e, "vision_icon")}
                    className="hidden"
                    accept="image/svg+xml, image/png, image/jpeg"
                  />
                  {(formData.vision_card.icon || selectedFiles["vision_icon"]) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteIcon("vision_icon")}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Icon
                    </Button>
                  )}
                </div>
                {(formData.vision_card.icon || imagePreviews["vision_icon"]) && (
                  <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                    <Image
                      src={imagePreviews["vision_icon"] || getIconUrl(formData.vision_card.icon)}
                      alt="Vision Icon"
                      fill
                      className="object-contain"
                    />
                  </Card>
                )}
                {errors["vision_icon"] && <p className="text-sm text-destructive">{errors["vision_icon"]}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Mission Card */}
        {activeTab === "mission" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Mission Card</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mission_card.title">Title</Label>
                <Input
                  id="mission_card.title"
                  value={formData.mission_card.title}
                  onChange={(e) => handleTextChange("mission_card.title", e.target.value)}
                  placeholder="Enter mission title"
                  className={cn(
                    inputStyles,
                    errors["mission_card.title"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["mission_card.title"] && (
                  <p className="text-sm text-destructive">{errors["mission_card.title"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Top Icon</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => missionIconRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Icon
                  </Button>
                  <input
                    ref={missionIconRef}
                    type="file"
                    onChange={(e) => handleFileSelect(e, "mission_icon")}
                    className="hidden"
                    accept="image/svg+xml, image/png, image/jpeg"
                  />
                  {(formData.mission_card.icon || selectedFiles["mission_icon"]) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteIcon("mission_icon")}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Icon
                    </Button>
                  )}
                </div>
                {(formData.mission_card.icon || imagePreviews["mission_icon"]) && (
                  <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                    <Image
                      src={imagePreviews["mission_icon"] || getIconUrl(formData.mission_card.icon)}
                      alt="Mission Icon"
                      fill
                      className="object-contain"
                    />
                  </Card>
                )}
                {errors["mission_icon"] && <p className="text-sm text-destructive">{errors["mission_icon"]}</p>}
              </div>

              {/* Mission Items */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Mission Items</h3>
                  <Button
                    type="button"
                    onClick={addMissionItem}
                    className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
                  >
                    <Plus className="h-4 w-4" />
                    Add Mission Item
                  </Button>
                </div>
                {formData.mission_card.items.map((item, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Mission Item #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMissionItem(index)}
                        className="gap-2"
                      >
                        <Minus className="h-4 w-4" />
                        Remove Item
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`mission_card.items.${index}.strongText`}>Strong Text</Label>
                        <Input
                          id={`mission_card.items.${index}.strongText`}
                          value={item.strongText}
                          onChange={(e) => handleTextChange(`mission_card.items.${index}.strongText`, e.target.value)}
                          placeholder="Enter strong text"
                          className={cn(
                            inputStyles,
                            errors[`mission_card.items.${index}.strongText`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                          )}
                        />
                        {errors[`mission_card.items.${index}.strongText`] && (
                          <p className="text-sm text-destructive">{errors[`mission_card.items.${index}.strongText`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`mission_card.items.${index}.text`}>Text</Label>
                        <Textarea
                          id={`mission_card.items.${index}.text`}
                          value={item.text}
                          onChange={(e) => handleTextChange(`mission_card.items.${index}.text`, e.target.value)}
                          placeholder="Enter mission item text"
                          className={cn(
                            inputStyles,
                            errors[`mission_card.items.${index}.text`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                            "resize-y min-h-[100px] !h-auto",
                          )}
                          style={{ resize: "vertical" }}
                          rows={3}
                        />
                        {errors[`mission_card.items.${index}.text`] && (
                          <p className="text-sm text-destructive">{errors[`mission_card.items.${index}.text`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => missionItemIconRefs.current[index]?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            Upload Icon
                          </Button>
                          <input
                            ref={(el) => (missionItemIconRefs.current[index] = el)}
                            type="file"
                            onChange={(e) => handleFileSelect(e, `mission_item_${index}`)}
                            className="hidden"
                            accept="image/svg+xml, image/png, image/jpeg"
                          />
                          {(item.icon || selectedFiles[`mission_item_${index}`]) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteIcon(`mission_item_${index}`)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Icon
                            </Button>
                          )}
                        </div>
                        {(item.icon || imagePreviews[`mission_item_${index}`]) && (
                          <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                            <Image
                              src={
                                imagePreviews[`mission_item_${index || "/placeholder.svg"}`] ||
                                getIconUrl(item.icon) ||
                                "/placeholder.svg"
                              }
                              alt="Mission Item Icon"
                              fill
                              className="object-contain"
                            />
                          </Card>
                        )}
                        {errors[`mission_item_${index}`] && (
                          <p className="text-sm text-destructive">{errors[`mission_item_${index}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Message at the bottom */}
        {message.text && (
          <Alert
            variant={message.type === "warning" ? "warning" : message.type === "error" ? "destructive" : "default"}
            className={`mb-6 mt-8 ${message.type === "success" ? "bg-zinc-900/90 border-emerald-600/30" : ""}`}
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
                Update Vision & Mission Section
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
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

