"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Save, CheckCircle2, AlertCircle, Upload, Trash2, Plus } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div>
      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Testimonials Header</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header.banner">Banner</Label>
              <Input
                id="header.banner"
                value={formData.header.banner}
                onChange={(e) => handleFieldChange("header.banner", e.target.value)}
                placeholder="Enter banner text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header.title">Title</Label>
              <Input
                id="header.title"
                value={formData.header.title}
                onChange={(e) => handleFieldChange("header.title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header.subheading">Subheading</Label>
              <Input
                id="header.subheading"
                value={formData.header.subheading}
                onChange={(e) => handleFieldChange("header.subheading", e.target.value)}
                placeholder="Enter subheading"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Columns */}
        {(["column1", "column2", "column3"] as const).map((column) => (
          <div key={column} className="p-6 border rounded-lg bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{column.replace("column", "Column ")} Testimonials</h2>
              <Button type="button" onClick={() => addTestimonial(column)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>

            {formData.columns[column].length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No testimonials added yet. Click "Add Testimonial" to get started.
              </div>
            ) : (
              formData.columns[column].map((testimonial, index) => (
                <div key={index} className="p-4 border rounded-lg mb-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Testimonial #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTestimonial(column, index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${column}-${index}-name`}>Name</Label>
                        <Input
                          id={`${column}-${index}-name`}
                          value={testimonial.name}
                          onChange={(e) => handleTestimonialChange(column, index, "name", e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${column}-${index}-role`}>Role</Label>
                        <Input
                          id={`${column}-${index}-role`}
                          value={testimonial.role}
                          onChange={(e) => handleTestimonialChange(column, index, "role", e.target.value)}
                          placeholder="Enter role"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${column}-${index}-alt`}>Alt Text</Label>
                        <Input
                          id={`${column}-${index}-alt`}
                          value={testimonial.alt}
                          onChange={(e) => handleTestimonialChange(column, index, "alt", e.target.value)}
                          placeholder="Enter alt text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${column}-${index}-text`}>Testimonial Text</Label>
                        <Textarea
                          id={`${column}-${index}-text`}
                          value={testimonial.text}
                          onChange={(e) => handleTestimonialChange(column, index, "text", e.target.value)}
                          placeholder="Enter testimonial text"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Image Preview Section */}
                    <div className="space-y-3">
                      <Label>Image</Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => testimonialImageRefs[column].current[index]?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
                        <input
                          ref={(el) => (testimonialImageRefs[column].current[index] = el)}
                          type="file"
                          onChange={(e) => handleFileSelect(e, column, index)}
                          className="hidden"
                          accept="image/*"
                        />
                        {(testimonial.img || selectedFiles[`${column}_${index}`]) && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(column, index)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove Image
                          </Button>
                        )}
                      </div>

                      {(testimonial.img || imagePreviews[`${column}_${index}`]) && (
                        <Card className="mt-4 overflow-hidden w-32 h-32 relative">
                          <Image
                            src={
                              imagePreviews[`${column || "/placeholder.svg"}_${index}`] || getImageUrl(testimonial.img)
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
              ))
            )}
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={fetchData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

