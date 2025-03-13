"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

interface HeroData {
  background: {
    image: string
    alt: string
  }
  content: {
    badge: string
    mainTitle: string
    highlightText: string
    description: string
    button: {
      text: string
      link: string
    }
  }
}

export default function AboutHeroForm() {
  const [formData, setFormData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("content")
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetchHeroData()
  }, [])

  // Clean up object URL when component unmounts
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

  const fetchHeroData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("aboutpage_hero")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Set image preview if there's an image
      if (data.background.image) {
        setImagePreview(getImageUrl(data.background.image))
      }

      setFormData(data)
    } catch (err: any) {
      console.error("Error fetching hero data:", err)
      setMessage({ text: "Failed to load hero data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        background: {
          image: "",
          alt: "About page hero background",
        },
        content: {
          badge: "ABOUT US",
          mainTitle: "Our Story and",
          highlightText: "Mission",
          description:
            "Learn about our journey, values, and the mission that drives us to deliver exceptional solutions for our clients.",
          button: {
            text: "Learn More",
            link: "#mission",
          },
        },
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
    return supabase.storage.from("aboutpage-hero-images").getPublicUrl(path).data.publicUrl
  }

  const handleChange = (field: string, value: string) => {
    if (!formData) return

    // Handle nested fields
    const fields = field.split(".")
    if (fields.length === 1) {
      setFormData({ ...formData, [field]: value })
    } else if (fields.length === 2) {
      setFormData({
        ...formData,
        [fields[0]]: {
          ...formData[fields[0] as keyof HeroData],
          [fields[1]]: value,
        },
      })
    } else if (fields.length === 3) {
      setFormData({
        ...formData,
        [fields[0]]: {
          ...formData[fields[0] as keyof HeroData],
          [fields[1]]: {
            ...formData[fields[0] as keyof HeroData][fields[1] as any],
            [fields[2]]: value,
          },
        },
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Clean up previous preview URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedFile(file)
    setImagePreview(previewUrl)

    // Update alt text if it's empty
    if (formData && !formData.background.alt) {
      handleChange("background.alt", file.name.split(".")[0] || "About page hero background")
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = () => {
    if (!formData) return

    // If there's an existing image in storage (not a URL), mark it for deletion
    if (
      formData.background.image &&
      !formData.background.image.startsWith("http") &&
      !formData.background.image.startsWith("/")
    ) {
      setImageToDelete(formData.background.image)
    }

    // Clean up preview URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedFile(null)
    setImagePreview(null)
    handleChange("background.image", "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      let backgroundImagePath = formData.background.image

      // Upload new image if selected
      if (selectedFile) {
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExt = selectedFile.name.split(".").pop() || "jpg"
        const fileName = `about-hero-${timestamp}-${randomString}.${fileExt}`

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("aboutpage-hero-images")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) throw uploadError

        backgroundImagePath = fileName
      }

      // Delete old image if it was marked for deletion
      if (imageToDelete) {
        try {
          await supabase.storage.from("aboutpage-hero-images").remove([imageToDelete])
          console.log("Deleted old image:", imageToDelete)
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError)
          // Continue with the save process even if deletion fails
        }
      }

      // Prepare data for update
      const updatedData = {
        ...formData,
        background: {
          ...formData.background,
          image: backgroundImagePath,
        },
      }

      // Update or insert data
      let result
      if (recordId) {
        const { error } = await supabase.from("aboutpage_hero").update(updatedData).eq("id", recordId)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("aboutpage_hero").insert(updatedData).select()

        if (error) throw error
        if (data && data.length > 0) {
          setRecordId(data[0].id)
        }
      }

      setMessage({ text: "Hero section updated successfully!", type: "success" })
      setSelectedFile(null)
      setImageToDelete(null) // Reset the image to delete
      await fetchHeroData()
    } catch (err: any) {
      console.error("Error saving hero data:", err)
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
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

  if (!formData) return null

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
              onClick={() => setActiveTab("background")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "background"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Background
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Hero Content</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content.badge">Badge Text</Label>
                <Input
                  id="content.badge"
                  value={formData.content.badge}
                  onChange={(e) => handleChange("content.badge", e.target.value)}
                  placeholder="Enter badge text"
                  className={inputStyles}
                />
                <p className="text-xs text-muted-foreground">This text appears in a small badge above the main title</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content.mainTitle">Main Title</Label>
                <Input
                  id="content.mainTitle"
                  value={formData.content.mainTitle}
                  onChange={(e) => handleChange("content.mainTitle", e.target.value)}
                  placeholder="Enter main title"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content.highlightText">Highlighted Text</Label>
                <Input
                  id="content.highlightText"
                  value={formData.content.highlightText}
                  onChange={(e) => handleChange("content.highlightText", e.target.value)}
                  placeholder="Enter highlighted text"
                  className={inputStyles}
                />
                <p className="text-xs text-muted-foreground">This text will be highlighted with an underline effect</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content.description">Description</Label>
                <Textarea
                  id="content.description"
                  value={formData.content.description}
                  onChange={(e) => handleChange("content.description", e.target.value)}
                  placeholder="Enter description"
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content.button.text">Button Text</Label>
                  <Input
                    id="content.button.text"
                    value={formData.content.button.text}
                    onChange={(e) => handleChange("content.button.text", e.target.value)}
                    placeholder="Enter button text"
                    className={inputStyles}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content.button.link">Button Link</Label>
                  <Input
                    id="content.button.link"
                    value={formData.content.button.link}
                    onChange={(e) => handleChange("content.button.link", e.target.value)}
                    placeholder="Enter button link"
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Background Tab */}
        {activeTab === "background" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Background Image</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="background.image">Hero Background</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden aspect-video w-full max-w-2xl">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt={formData.background.alt || "Background preview"}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleDeleteImage}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed !border-white/10 rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <h4 className="text-lg font-medium">No image selected</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a background image for your hero section
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                        >
                          <Upload className="h-4 w-4" />
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background.alt">Alt Text</Label>
                <Input
                  id="background.alt"
                  value={formData.background.alt}
                  onChange={(e) => handleChange("background.alt", e.target.value)}
                  placeholder="Enter alt text for accessibility"
                  className={inputStyles}
                />
                <p className="text-xs text-muted-foreground">Describe the image for screen readers and accessibility</p>
              </div>
            </div>
          </div>
        )}

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
                Update Hero Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchHeroData}
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

