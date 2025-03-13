"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, Trash2, Save, RefreshCw, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type Testimonial = {
  name: string
  role: string
  img: string
  alt: string
  text: string
}

type TestimonialsData = {
  header: {
    banner: string
    title: string
    subheading: string
  }
  columns: {
    column1: Testimonial[]
    column2: Testimonial[]
    column3: Testimonial[]
  }
}

export default function TestimonialsForm() {
  const [formData, setFormData] = useState<TestimonialsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("header")

  // Refs for file inputs for each column testimonial image
  const testimonialImageRefs = {
    column1: useRef<(HTMLInputElement | null)[]>([]),
    column2: useRef<(HTMLInputElement | null)[]>([]),
    column3: useRef<(HTMLInputElement | null)[]>([]),
  }

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

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("aboutpage_testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Initialize image previews for existing testimonial images
      const previews: Record<string, string> = {}

      // Process column1
      data.columns.column1.forEach((testimonial: Testimonial, index: number) => {
        if (testimonial.img) {
          previews[`column1_${index}`] = getImageUrl(testimonial.img)
        }
      })

      // Process column2
      data.columns.column2.forEach((testimonial: Testimonial, index: number) => {
        if (testimonial.img) {
          previews[`column2_${index}`] = getImageUrl(testimonial.img)
        }
      })

      // Process column3
      data.columns.column3.forEach((testimonial: Testimonial, index: number) => {
        if (testimonial.img) {
          previews[`column3_${index}`] = getImageUrl(testimonial.img)
        }
      })

      setImagePreviews(previews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching testimonials data:", error)
      setMessage({ text: "Failed to load testimonials data. Please refresh the page.", type: "error" })
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
    return supabase.storage.from("aboutpage-testimonials-images").getPublicUrl(path).data.publicUrl
  }

  // Update nested field using dot notation
  const handleFieldChange = (path: string, value: string) => {
    if (!formData) return
    const keys = path.split(".")
    setFormData((prev) => {
      if (!prev) return prev
      const updated: any = { ...prev }
      let obj = updated
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return updated
    })
  }

  const handleTestimonialChange = (
    column: "column1" | "column2" | "column3",
    index: number,
    field: keyof Testimonial,
    value: string,
  ) => {
    if (!formData) return
    setFormData((prev) => {
      if (!prev) return prev
      const updatedColumn = [...prev.columns[column]]
      updatedColumn[index] = { ...updatedColumn[index], [field]: value }
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: updatedColumn,
        },
      }
    })
  }

  const addTestimonial = (column: "column1" | "column2" | "column3") => {
    if (!formData) return
    const newTestimonial: Testimonial = {
      name: "",
      role: "",
      img: "",
      alt: "",
      text: "",
    }
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: [...prev.columns[column], newTestimonial],
        },
      }
    })
  }

  const removeTestimonial = (column: "column1" | "column2" | "column3", index: number) => {
    if (!formData) return

    // If there's an image, mark it for deletion
    const testimonial = formData.columns[column][index]
    if (testimonial.img && !testimonial.img.startsWith("http") && !testimonial.img.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, testimonial.img])
    }

    setFormData((prev) => {
      if (!prev) return prev
      const updatedColumn = prev.columns[column].filter((_, i) => i !== index)
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: updatedColumn,
        },
      }
    })

    // Clean up any preview
    if (imagePreviews[`${column}_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`${column}_${index}`]
      setImagePreviews(newPreviews)
    }
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: "column1" | "column2" | "column3",
    index: number,
  ) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setMessage({
        text: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
        type: "error",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setMessage({
        text: "File size exceeds 5MB limit.",
        type: "error",
      })
      return
    }

    // Check if there's an existing image to mark for deletion
    const currentImage = formData.columns[column][index].img
    if (currentImage && !currentImage.startsWith("http") && !currentImage.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentImage])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [`${column}_${index}`]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [`${column}_${index}`]: previewUrl,
    }))

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = (column: "column1" | "column2" | "column3", index: number) => {
    if (!formData) return

    // Mark the image for deletion if it's stored in Supabase
    const imagePath = formData.columns[column][index].img
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, imagePath])
    }

    // Update testimonial in formData
    const updatedColumns = { ...formData.columns }
    updatedColumns[column][index] = {
      ...updatedColumns[column][index],
      img: "",
    }
    setFormData({ ...formData, columns: updatedColumns })

    // Remove preview
    if (imagePreviews[`${column}_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`${column}_${index}`]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[`${column}_${index}`]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[`${column}_${index}`]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([key, file]) => {
      // Extract column and index from key format "column{n}_{index}"
      const [column, indexStr] = key.split("_")
      const index = Number.parseInt(indexStr)

      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `testimonial-${column}-${index}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("aboutpage-testimonials-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      return { column, index, fileName }
    })

    return Promise.all(uploads)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !recordId) {
      setMessage({ text: "Missing data. Please refresh the page.", type: "error" })
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
      uploadResults.forEach(({ column, index, fileName }) => {
        updatedData.columns[column][index].img = fileName
      })

      // Update the database
      const { error } = await supabase
        .from("aboutpage_testimonials")
        .update({
          header: updatedData.header,
          columns: updatedData.columns,
        })
        .eq("id", recordId)

      if (error) throw error

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from("aboutpage-testimonials-images")
          .remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Testimonials updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchData()
    } catch (error) {
      console.error("Error saving testimonials data:", error)
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="space-y-6 animate-pulse">
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
          </div>
        </div>
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
              onClick={() => setActiveTab("header")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "header"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Header
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("column1")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "column1"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Column 1
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("column2")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "column2"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Column 2
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("column3")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "column3"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Column 3
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        {activeTab === "header" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Testimonials Header</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="header.banner">Banner</Label>
                <Input
                  id="header.banner"
                  value={formData.header.banner}
                  onChange={(e) => handleFieldChange("header.banner", e.target.value)}
                  placeholder="Enter banner text"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="header.title">Title</Label>
                <Input
                  id="header.title"
                  value={formData.header.title}
                  onChange={(e) => handleFieldChange("header.title", e.target.value)}
                  placeholder="Enter title"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="header.subheading">Subheading</Label>
                <Textarea
                  id="header.subheading"
                  value={formData.header.subheading}
                  onChange={(e) => handleFieldChange("header.subheading", e.target.value)}
                  placeholder="Enter subheading"
                  rows={3}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Column 1 Testimonials */}
        {activeTab === "column1" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Column 1 Testimonials</h2>
              <Button
                type="button"
                onClick={() => addTestimonial("column1")}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>

            <div className="space-y-4">
              {formData.columns.column1.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-md">
                  No testimonials added yet. Click "Add Testimonial" to get started.
                </div>
              ) : (
                formData.columns.column1.map((testimonial, index) => (
                  <div key={index} className={`space-y-4 p-4 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Testimonial #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestimonial("column1", index)}
                        className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column1-${index}-name`}>Name</Label>
                          <Input
                            id={`column1-${index}-name`}
                            value={testimonial.name}
                            onChange={(e) => handleTestimonialChange("column1", index, "name", e.target.value)}
                            placeholder="Enter name"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column1-${index}-role`}>Role</Label>
                          <Input
                            id={`column1-${index}-role`}
                            value={testimonial.role}
                            onChange={(e) => handleTestimonialChange("column1", index, "role", e.target.value)}
                            placeholder="Enter role"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column1-${index}-text`}>Testimonial Text</Label>
                          <Textarea
                            id={`column1-${index}-text`}
                            value={testimonial.text}
                            onChange={(e) => handleTestimonialChange("column1", index, "text", e.target.value)}
                            placeholder="Enter testimonial text"
                            rows={3}
                            className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                            style={{ resize: "vertical" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column1-${index}-alt`}>Image Alt Text</Label>
                          <Input
                            id={`column1-${index}-alt`}
                            value={testimonial.alt}
                            onChange={(e) => handleTestimonialChange("column1", index, "alt", e.target.value)}
                            placeholder="Enter alt text"
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image</Label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => testimonialImageRefs.column1.current[index]?.click()}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Upload className="h-4 w-4" />
                              {testimonial.img ? "Change Image" : "Upload Image"}
                            </Button>
                            <input
                              ref={(el) => (testimonialImageRefs.column1.current[index] = el)}
                              type="file"
                              onChange={(e) => handleFileSelect(e, "column1", index)}
                              className="hidden"
                              accept="image/*"
                            />
                            {(testimonial.img || selectedFiles[`column1_${index}`]) && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage("column1", index)}
                                className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Image
                              </Button>
                            )}
                          </div>

                          {(testimonial.img || imagePreviews[`column1_${index}`]) && (
                            <Card className={`mt-4 overflow-hidden aspect-square relative ${cardStyles}`}>
                              <Image
                                src={
                                  imagePreviews[`column1_${index || "/placeholder.svg"}`] ||
                                  getImageUrl(testimonial.img)
                                }
                                alt={testimonial.alt || "Testimonial image"}
                                fill
                                className="object-cover"
                              />
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Column 2 Testimonials */}
        {activeTab === "column2" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Column 2 Testimonials</h2>
              <Button
                type="button"
                onClick={() => addTestimonial("column2")}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>

            <div className="space-y-4">
              {formData.columns.column2.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-md">
                  No testimonials added yet. Click "Add Testimonial" to get started.
                </div>
              ) : (
                formData.columns.column2.map((testimonial, index) => (
                  <div key={index} className={`space-y-4 p-4 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Testimonial #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestimonial("column2", index)}
                        className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column2-${index}-name`}>Name</Label>
                          <Input
                            id={`column2-${index}-name`}
                            value={testimonial.name}
                            onChange={(e) => handleTestimonialChange("column2", index, "name", e.target.value)}
                            placeholder="Enter name"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column2-${index}-role`}>Role</Label>
                          <Input
                            id={`column2-${index}-role`}
                            value={testimonial.role}
                            onChange={(e) => handleTestimonialChange("column2", index, "role", e.target.value)}
                            placeholder="Enter role"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column2-${index}-text`}>Testimonial Text</Label>
                          <Textarea
                            id={`column2-${index}-text`}
                            value={testimonial.text}
                            onChange={(e) => handleTestimonialChange("column2", index, "text", e.target.value)}
                            placeholder="Enter testimonial text"
                            rows={3}
                            className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                            style={{ resize: "vertical" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column2-${index}-alt`}>Image Alt Text</Label>
                          <Input
                            id={`column2-${index}-alt`}
                            value={testimonial.alt}
                            onChange={(e) => handleTestimonialChange("column2", index, "alt", e.target.value)}
                            placeholder="Enter alt text"
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image</Label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => testimonialImageRefs.column2.current[index]?.click()}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Upload className="h-4 w-4" />
                              {testimonial.img ? "Change Image" : "Upload Image"}
                            </Button>
                            <input
                              ref={(el) => (testimonialImageRefs.column2.current[index] = el)}
                              type="file"
                              onChange={(e) => handleFileSelect(e, "column2", index)}
                              className="hidden"
                              accept="image/*"
                            />
                            {(testimonial.img || selectedFiles[`column2_${index}`]) && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage("column2", index)}
                                className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Image
                              </Button>
                            )}
                          </div>

                          {(testimonial.img || imagePreviews[`column2_${index}`]) && (
                            <Card className={`mt-4 overflow-hidden aspect-square relative ${cardStyles}`}>
                              <Image
                                src={
                                  imagePreviews[`column2_${index || "/placeholder.svg"}`] ||
                                  getImageUrl(testimonial.img)
                                }
                                alt={testimonial.alt || "Testimonial image"}
                                fill
                                className="object-cover"
                              />
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Column 3 Testimonials */}
        {activeTab === "column3" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Column 3 Testimonials</h2>
              <Button
                type="button"
                onClick={() => addTestimonial("column3")}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>

            <div className="space-y-4">
              {formData.columns.column3.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-md">
                  No testimonials added yet. Click "Add Testimonial" to get started.
                </div>
              ) : (
                formData.columns.column3.map((testimonial, index) => (
                  <div key={index} className={`space-y-4 p-4 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Testimonial #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestimonial("column3", index)}
                        className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column3-${index}-name`}>Name</Label>
                          <Input
                            id={`column3-${index}-name`}
                            value={testimonial.name}
                            onChange={(e) => handleTestimonialChange("column3", index, "name", e.target.value)}
                            placeholder="Enter name"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column3-${index}-role`}>Role</Label>
                          <Input
                            id={`column3-${index}-role`}
                            value={testimonial.role}
                            onChange={(e) => handleTestimonialChange("column3", index, "role", e.target.value)}
                            placeholder="Enter role"
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`column3-${index}-text`}>Testimonial Text</Label>
                          <Textarea
                            id={`column3-${index}-text`}
                            value={testimonial.text}
                            onChange={(e) => handleTestimonialChange("column3", index, "text", e.target.value)}
                            placeholder="Enter testimonial text"
                            rows={3}
                            className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                            style={{ resize: "vertical" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`column3-${index}-alt`}>Image Alt Text</Label>
                          <Input
                            id={`column3-${index}-alt`}
                            value={testimonial.alt}
                            onChange={(e) => handleTestimonialChange("column3", index, "alt", e.target.value)}
                            placeholder="Enter alt text"
                            className={inputStyles}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Image</Label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => testimonialImageRefs.column3.current[index]?.click()}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Upload className="h-4 w-4" />
                              {testimonial.img ? "Change Image" : "Upload Image"}
                            </Button>
                            <input
                              ref={(el) => (testimonialImageRefs.column3.current[index] = el)}
                              type="file"
                              onChange={(e) => handleFileSelect(e, "column3", index)}
                              className="hidden"
                              accept="image/*"
                            />
                            {(testimonial.img || selectedFiles[`column3_${index}`]) && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage("column3", index)}
                                className="bg-red-900/30 hover:bg-red-900/50 text-white border-0"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Image
                              </Button>
                            )}
                          </div>

                          {(testimonial.img || imagePreviews[`column3_${index}`]) && (
                            <Card className={`mt-4 overflow-hidden aspect-square relative ${cardStyles}`}>
                              <Image
                                src={
                                  imagePreviews[`column3_${index || "/placeholder.svg"}`] ||
                                  getImageUrl(testimonial.img)
                                }
                                alt={testimonial.alt || "Testimonial image"}
                                fill
                                className="object-cover"
                              />
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Actions and Status Message */}
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
                Update Testimonials
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
      </form>
    </div>
  )
}

