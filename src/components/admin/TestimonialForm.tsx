"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
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

interface TestimonialItem {
  name: string
  title: string
  message: string
  image: string
}

interface TestimonialData {
  section: {
    heading: string
    descriptions: string[]
  }
  testimonials: TestimonialItem[]
}

export default function TestimonialForm() {
  const [data, setData] = useState<TestimonialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("section")

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    setLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data: testimonialData, error } = await supabase
        .from("testimonials_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(testimonialData.id)

      // Initialize image previews for existing images
      const previews: Record<string, string> = {}
      testimonialData.testimonials.forEach((testimonial: TestimonialItem, index: number) => {
        if (testimonial.image) {
          previews[`testimonial_${index}`] = getImageUrl(testimonial.image)
        }
      })

      setImagePreviews(previews)
      setData(testimonialData)
      setMessage({ text: "", type: "" })
    } catch (err) {
      console.error("Error fetching testimonial data:", err)
      setMessage({
        text: "Failed to load testimonial data. Please refresh the page.",
        type: "error",
      })

      // Initialize with default data if fetch fails
      setData({
        section: {
          heading: "What Our Clients Say",
          descriptions: ["Hear from our satisfied clients about their experience working with us."],
        },
        testimonials: [
          {
            name: "John Doe",
            title: "CEO, Example Company",
            message: "Working with this team has been an amazing experience. They delivered beyond our expectations.",
            image: "",
          },
        ],
      })
    } finally {
      setLoading(false)
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
    return supabase.storage.from("testimonial-images").getPublicUrl(path).data.publicUrl
  }

  // Helper to update nested state
  const updateNestedState = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value
    const [current, ...rest] = path
    const index = Number(current)
    if (!isNaN(index)) {
      const newArr = Array.isArray(obj) ? [...obj] : []
      newArr[index] = updateNestedState(newArr[index], rest, value)
      return newArr
    }
    return {
      ...obj,
      [current]: updateNestedState(obj ? obj[current] : undefined, rest, value),
    }
  }

  const handleChange = (path: string, value: string) => {
    if (!data) return
    setData((prev) => updateNestedState(prev, path.split("."), value))
  }

  const handleTestimonialChange = (index: number, field: keyof TestimonialItem, value: string) => {
    if (!data) return
    const testimonials = [...data.testimonials]
    testimonials[index] = { ...testimonials[index], [field]: value }
    setData({ ...data, testimonials })
  }

  const addTestimonial = () => {
    if (!data) return
    const newTestimonial: TestimonialItem = {
      name: "New Client",
      title: "Position, Company",
      message: "Enter testimonial message here.",
      image: "",
    }
    setData({ ...data, testimonials: [...data.testimonials, newTestimonial] })
  }

  const removeTestimonial = (index: number) => {
    if (!data) return

    // If there's an image, mark it for deletion
    const testimonial = data.testimonials[index]
    if (testimonial.image && !testimonial.image.startsWith("http") && !testimonial.image.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, testimonial.image])
    }

    const testimonials = data.testimonials.filter((_, i) => i !== index)
    setData({ ...data, testimonials })

    // Clean up any preview
    if (imagePreviews[`testimonial_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`testimonial_${index}`]
      setImagePreviews(newPreviews)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || !e.target.files[0] || !data) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setMessage({
        text: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF.",
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
    const currentImage = data.testimonials[index].image
    if (currentImage && !currentImage.startsWith("http") && !currentImage.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentImage])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [`testimonial_${index}`]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [`testimonial_${index}`]: previewUrl,
    }))

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = (index: number) => {
    if (!data) return
    setIsDeletingImage(true)

    // Mark the image for deletion if it's stored in Supabase
    const imagePath = data.testimonials[index].image
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, imagePath])
    }

    // Update testimonial in data
    const testimonials = [...data.testimonials]
    testimonials[index] = { ...testimonials[index], image: "" }
    setData({ ...data, testimonials })

    // Remove preview
    if (imagePreviews[`testimonial_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`testimonial_${index}`]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[`testimonial_${index}`]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[`testimonial_${index}`]
      setSelectedFiles(newSelectedFiles)
    }

    setIsDeletingImage(false)
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([key, file]) => {
      // Extract index from key format "testimonial_{index}"
      const index = Number.parseInt(key.split("_")[1])

      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `testimonial-${index}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("testimonial-images").upload(fileName, file, {
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
    if (!data) return

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Upload new images first
      const uploadResults = await uploadFiles()

      // Create a copy of the data to update with new file paths
      const updatedData = { ...data }

      // Update the testimonials with new image paths
      uploadResults.forEach(({ index, fileName }) => {
        updatedData.testimonials[index].image = fileName
      })

      // Update the database
      let result
      if (recordId) {
        // Update existing record
        const { error } = await supabase
          .from("testimonials_section")
          .update({
            section: updatedData.section,
            testimonials: updatedData.testimonials,
          })
          .eq("id", recordId)

        if (error) throw error
      } else {
        // Insert new record if none exists
        const { data: newData, error } = await supabase
          .from("testimonials_section")
          .insert({
            section: updatedData.section,
            testimonials: updatedData.testimonials,
          })
          .select()

        if (error) throw error
        if (newData && newData.length > 0) {
          setRecordId(newData[0].id)
        }
      }

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("testimonial-images").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({
        text: "Testimonials updated successfully!",
        type: "success",
      })
      setSelectedFiles({})
      setFilesToDelete([])
      // Don't immediately fetch data as it might reset the message
      // await fetchData()
    } catch (err) {
      console.error("Error saving testimonial data:", err)
      setMessage({
        text: "Failed to save changes. Please try again.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
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
              onClick={() => setActiveTab("section")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "section"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Section Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("testimonials")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "testimonials"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Testimonials
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Details */}
        {activeTab === "section" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Section Details</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="section.heading" className="flex items-center gap-1">
                  Heading <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="section.heading"
                  value={data.section.heading}
                  onChange={(e) => handleChange("section.heading", e.target.value)}
                  className={inputStyles}
                  placeholder="Enter section heading"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Description <span className="text-destructive ml-1">*</span>
                </Label>
                {data.section.descriptions.map((desc, idx) => (
                  <Textarea
                    key={idx}
                    value={desc}
                    onChange={(e) => handleChange(`section.descriptions.${idx}`, e.target.value)}
                    className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                    style={{ resize: "vertical" }}
                    rows={3}
                    placeholder={`Description ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {activeTab === "testimonials" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Testimonials</h2>
            </div>

            {data.testimonials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No testimonials added yet. Click the "Add Testimonial" button to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {data.testimonials.map((testimonial, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Testimonial #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestimonial(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`testimonial.${index}.name`} className="flex items-center gap-1">
                            Name <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id={`testimonial.${index}.name`}
                            value={testimonial.name}
                            onChange={(e) => handleTestimonialChange(index, "name", e.target.value)}
                            className={inputStyles}
                            placeholder="Enter name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`testimonial.${index}.title`} className="flex items-center gap-1">
                            Title <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id={`testimonial.${index}.title`}
                            value={testimonial.title}
                            onChange={(e) => handleTestimonialChange(index, "title", e.target.value)}
                            className={inputStyles}
                            placeholder="Enter title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`testimonial.${index}.message`} className="flex items-center gap-1">
                            Message <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea
                            id={`testimonial.${index}.message`}
                            value={testimonial.message}
                            onChange={(e) => handleTestimonialChange(index, "message", e.target.value)}
                            className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                            style={{ resize: "vertical" }}
                            rows={3}
                            placeholder="Enter message"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-1">Profile Image</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            {testimonial.image ? "Change" : "Upload"}
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            type="file"
                            onChange={(e) => handleFileSelect(e, index)}
                            className="hidden"
                            accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
                          />
                          {(testimonial.image || selectedFiles[`testimonial_${index}`]) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteImage(index)}
                              disabled={isDeletingImage}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Image
                            </Button>
                          )}
                        </div>
                        {(testimonial.image || imagePreviews[`testimonial_${index}`]) && (
                          <Card className={`mt-4 overflow-hidden w-40 h-40 relative ${cardStyles}`}>
                            <Image
                              src={
                                imagePreviews[`testimonial_${index || "/placeholder.svg"}`] ||
                                getImageUrl(testimonial.image)
                              }
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Testimonial button at the bottom right */}
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                onClick={addTestimonial}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
          </div>
        )}

        {message.text && (
          <Alert
            variant={message.type === "warning" ? "warning" : message.type === "error" ? "destructive" : "default"}
            className={`mb-6 ${message.type === "success" ? "bg-zinc-900/90 border-emerald-600/30" : ""} `}
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
      </form>
    </div>
  )
}

