"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Save, CheckCircle2, AlertCircle, Upload, Trash2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type MemorialData = {
  id: number
  full_message: string
  title: string
  name: string
  years: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export default function MemorialForm() {
  const [formData, setFormData] = useState<MemorialData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [oldImagePath, setOldImagePath] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("content")

  // Ref for the image file input
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Clean up object URL when component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  async function fetchData() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("aboutpage_memorial")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      // Store the original image path for potential deletion later
      if (data.image.src && !data.image.src.startsWith("http") && !data.image.src.startsWith("/")) {
        setOldImagePath(data.image.src)

        // Get the public URL for display
        data.image.src = supabase.storage.from("aboutpage-memorial-images").getPublicUrl(data.image.src).data.publicUrl
      }

      setFormData(data)
    } catch (error) {
      console.error("Error fetching memorial data:", error)
      setMessage({ text: "Failed to load memorial data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof MemorialData, value: string) => {
    if (!formData) return
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleImageAltChange = (value: string) => {
    if (!formData) return
    setFormData({
      ...formData,
      image: {
        ...formData.image,
        alt: value,
      },
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setMessage({ text: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.", type: "error" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setMessage({ text: "File size exceeds 5MB limit.", type: "error" })
      return
    }

    // Store the file for later upload
    setSelectedFile(file)

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)

    // Clean up previous preview if exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setImagePreview(previewUrl)

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = () => {
    // If we have a selected file that hasn't been uploaded yet
    if (selectedFile) {
      setSelectedFile(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }
    }
    // Otherwise, we'll mark the existing image for deletion
    else if (formData) {
      setFormData({
        ...formData,
        image: {
          ...formData.image,
          src: "",
        },
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // First, handle image upload if there's a new file
      let imagePath = ""
      if (selectedFile) {
        // Generate a unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExt = selectedFile.name.split(".").pop() || "jpg"
        const fileName = `memorial-${timestamp}-${randomString}.${fileExt}`

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("aboutpage-memorial-images")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: selectedFile.type,
          })

        if (uploadError) throw uploadError

        imagePath = fileName
      } else if (oldImagePath && formData.image.src) {
        // If there's an existing image and we're not replacing it, keep the original path
        imagePath = oldImagePath
      }

      // Prepare the data for update
      const updatedData = {
        full_message: formData.full_message,
        title: formData.title,
        name: formData.name,
        years: formData.years,
        image: {
          ...formData.image,
          src: imagePath,
        },
      }

      // Update the database
      const { error } = await supabase.from("aboutpage_memorial").update(updatedData).eq("id", formData.id)

      if (error) throw error

      // If we uploaded a new image and there was an old one, delete the old one
      if (selectedFile && oldImagePath) {
        const { error: deleteError } = await supabase.storage.from("aboutpage-memorial-images").remove([oldImagePath])

        if (deleteError) {
          console.error("Error deleting old image:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Memorial section updated successfully!", type: "success" })
      setSelectedFile(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }
      await fetchData()
    } catch (error) {
      console.error("Error saving memorial data:", error)
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
              onClick={() => setActiveTab("content")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "content"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "image"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Image
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Memorial Content</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter title"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="full_message">Full Message</Label>
                <Textarea
                  id="full_message"
                  value={formData.full_message}
                  onChange={(e) => handleChange("full_message", e.target.value)}
                  placeholder="Enter full message"
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter name"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="years">Years</Label>
                <Input
                  id="years"
                  value={formData.years}
                  onChange={(e) => handleChange("years", e.target.value)}
                  placeholder="Enter years (e.g. 1950 - 2023)"
                  className={inputStyles}
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Memorial Image</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="image.alt">Image Alt Text</Label>
                <Input
                  id="image.alt"
                  value={formData.image.alt}
                  onChange={(e) => handleImageAltChange(e.target.value)}
                  placeholder="Enter image alt text"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label>Memorial Image</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    {formData.image.src || imagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  {(formData.image.src || imagePreview) && (
                    <Button type="button" variant="destructive" size="sm" onClick={handleDeleteImage} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>

                {(formData.image.src || imagePreview) && (
                  <div className={`mt-4 relative h-64 w-48 overflow-hidden rounded-lg ${cardStyles}`}>
                    <Image
                      src={imagePreview || formData.image.src}
                      alt={formData.image.alt || "Memorial Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
                Update Memorial
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

