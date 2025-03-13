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

type ValueItem = {
  icon: string
  title: string
  description: string
}

type ValuesData = {
  banner: string
  section_heading: string
  values: ValueItem[]
}

export default function ValuesSectionForm() {
  const [formData, setFormData] = useState<ValuesData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])

  // Refs for file input elements for icon uploads
  const iconFileRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetchValuesData()
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

  const fetchValuesData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("aboutpage_values")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Initialize image previews for existing icons
      const previews: Record<string, string> = {}
      data.values.forEach((value: ValueItem, index: number) => {
        if (value.icon) {
          previews[`value_${index}`] = getIconUrl(value.icon)
        }
      })

      setImagePreviews(previews)
      setFormData({
        banner: data.banner,
        section_heading: data.section_heading,
        values: data.values,
      })
    } catch (error) {
      console.error("Error fetching values data:", error)
      setMessage({ text: "Failed to load values data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        banner: "OUR VALUES",
        section_heading: "What We Stand For",
        values: [
          {
            icon: "",
            title: "Integrity",
            description: "We believe in honesty and transparency in all our dealings.",
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
    return supabase.storage.from("aboutpage-values-icons").getPublicUrl(path).data.publicUrl
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

  const addValue = () => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        values: [...prev.values, { icon: "", title: "New Value", description: "" }],
      }
    })
  }

  const removeValue = (index: number) => {
    if (!formData) return

    // If there's an icon, mark it for deletion
    const value = formData.values[index]
    if (value.icon && !value.icon.startsWith("http") && !value.icon.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, value.icon])
    }

    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        values: prev.values.filter((_, i) => i !== index),
      }
    })

    // Clean up any preview
    if (imagePreviews[`value_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`value_${index}`]
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
        [`values.${index}.icon`]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [`values.${index}.icon`]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing icon to mark for deletion
    const currentIcon = formData.values[index].icon
    if (currentIcon && !currentIcon.startsWith("http") && !currentIcon.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentIcon])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [`value_${index}`]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [`value_${index}`]: previewUrl,
    }))

    // Clear any errors
    if (errors[`values.${index}.icon`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`values.${index}.icon`]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteIcon = (index: number) => {
    if (!formData) return

    // Mark the icon for deletion if it's stored in Supabase
    const iconPath = formData.values[index].icon
    if (iconPath && !iconPath.startsWith("http") && !iconPath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, iconPath])
    }

    // Update value in formData
    const updatedValues = [...formData.values]
    updatedValues[index] = { ...updatedValues[index], icon: "" }
    setFormData({ ...formData, values: updatedValues })

    // Remove preview
    if (imagePreviews[`value_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`value_${index}`]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[`value_${index}`]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[`value_${index}`]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.banner.trim()) newErrors["banner"] = "Banner is required"
    if (!formData.section_heading.trim()) newErrors["section_heading"] = "Section heading is required"
    formData.values.forEach((value, index) => {
      if (!value.title.trim()) newErrors[`values.${index}.title`] = "Title is required"
      if (!value.description.trim()) newErrors[`values.${index}.description`] = "Description is required"
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([key, file]) => {
      // Extract index from key format "value_{index}"
      const index = Number.parseInt(key.split("_")[1])

      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "svg"
      const fileName = `value-${index}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("aboutpage-values-icons").upload(fileName, file, {
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
      // First upload all selected files
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedValues = [...formData.values]

      // Update the values with new icon paths
      uploadResults.forEach(({ index, fileName }) => {
        updatedValues[index] = { ...updatedValues[index], icon: fileName }
      })

      // Update the database
      let result
      if (recordId) {
        // Update existing record
        const { error } = await supabase
          .from("aboutpage_values")
          .update({
            banner: formData.banner,
            section_heading: formData.section_heading,
            values: updatedValues,
          })
          .eq("id", recordId)

        if (error) throw error
      } else {
        // Insert new record if none exists
        const { data, error } = await supabase
          .from("aboutpage_values")
          .insert({
            banner: formData.banner,
            section_heading: formData.section_heading,
            values: updatedValues,
          })
          .select()

        if (error) throw error
        if (data && data.length > 0) {
          setRecordId(data[0].id)
        }
      }

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        try {
          const { error: deleteError } = await supabase.storage.from("aboutpage-values-icons").remove(filesToDelete)

          if (deleteError) {
            console.error("Error deleting old files:", deleteError)
            // Continue with the save process even if deletion fails
          }
        } catch (deleteError) {
          console.error("Error in deletion process:", deleteError)
          // Continue with the save process even if deletion fails
        }
      }

      setMessage({ text: "Values section updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchValuesData()
    } catch (error) {
      console.error("Error saving values data:", error)
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
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
          <h2 className="text-xl font-semibold">Section Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner">Banner</Label>
              <Input
                id="banner"
                value={formData.banner}
                onChange={(e) => handleTextChange("banner", e.target.value)}
                placeholder="Enter banner text"
                className={cn(inputStyles, errors["banner"] && "!border-destructive focus-visible:!ring-destructive")}
              />
              {errors["banner"] && <p className="text-sm text-destructive">{errors["banner"]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="section_heading">Section Heading</Label>
              <Input
                id="section_heading"
                value={formData.section_heading}
                onChange={(e) => handleTextChange("section_heading", e.target.value)}
                placeholder="Enter section heading"
                className={cn(
                  inputStyles,
                  errors["section_heading"] && "!border-destructive focus-visible:!ring-destructive",
                )}
              />
              {errors["section_heading"] && <p className="text-sm text-destructive">{errors["section_heading"]}</p>}
            </div>
          </div>
        </div>

        <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Values</h2>
            <Button
              type="button"
              onClick={addValue}
              className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
            >
              <Plus className="h-4 w-4" />
              Add Value
            </Button>
          </div>

          {formData.values.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
              No values added yet. Click "Add Value" to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.values.map((value, index) => (
                <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Value #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeValue(index)}
                      className="gap-2"
                    >
                      <Minus className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`values.${index}.title`}>Title</Label>
                      <Input
                        id={`values.${index}.title`}
                        value={value.title}
                        onChange={(e) => handleTextChange(`values.${index}.title`, e.target.value)}
                        placeholder="Enter value title"
                        className={cn(
                          inputStyles,
                          errors[`values.${index}.title`] && "!border-destructive focus-visible:!ring-destructive",
                        )}
                      />
                      {errors[`values.${index}.title`] && (
                        <p className="text-sm text-destructive">{errors[`values.${index}.title`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`values.${index}.description`}>Description</Label>
                      <Textarea
                        id={`values.${index}.description`}
                        value={value.description}
                        onChange={(e) => handleTextChange(`values.${index}.description`, e.target.value)}
                        placeholder="Enter value description"
                        className={cn(
                          inputStyles,
                          errors[`values.${index}.description`] &&
                            "!border-destructive focus-visible:!ring-destructive",
                          "resize-y min-h-[100px] !h-auto",
                        )}
                        style={{ resize: "vertical" }}
                        rows={3}
                      />
                      {errors[`values.${index}.description`] && (
                        <p className="text-sm text-destructive">{errors[`values.${index}.description`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => iconFileRefs.current[index]?.click()}
                          className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                        >
                          <Upload className="h-4 w-4" />
                          {value.icon ? "Change Icon" : "Upload Icon"}
                        </Button>
                        <input
                          ref={(el) => (iconFileRefs.current[index] = el)}
                          type="file"
                          onChange={(e) => handleFileSelect(e, index)}
                          className="hidden"
                          accept="image/svg+xml, image/png, image/jpeg"
                        />
                        {(value.icon || selectedFiles[`value_${index}`]) && (
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
                      {(value.icon || imagePreviews[`value_${index}`]) && (
                        <Card className={`mt-4 overflow-hidden w-16 h-16 relative p-2 ${cardStyles}`}>
                          <Image
                            src={imagePreviews[`value_${index || "/placeholder.svg"}`] || getIconUrl(value.icon)}
                            alt="Icon preview"
                            fill
                            className="object-contain"
                          />
                        </Card>
                      )}
                      {errors[`values.${index}.icon`] && (
                        <p className="text-sm text-destructive">{errors[`values.${index}.icon`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
                Update Values Section
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={fetchValuesData}
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

