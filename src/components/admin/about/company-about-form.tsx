"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, Trash2, Save, RefreshCw, Plus, Minus, AlertCircle, CheckCircle2 } from "lucide-react"
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

type CompanyAboutData = {
  left_column: {
    intro: {
      title: string
      description: string
    }
    founder: {
      title: string
      descriptionBefore: string
      founderName: string
      descriptionAfter: string
    }
    growth: {
      title: string
      description: string
    }
    timeline: Array<{
      label: string
      value?: string
      title?: string
      subtitle?: string
    }>
  }
  right_column: {
    globalExpansion: {
      title: string
      description: string
    }
    imageBlock: {
      image: {
        src: string
        alt: string
      }
    }
    legacy: {
      title: string
      description: string
    }
  }
}

export default function CompanyAboutForm() {
  const [formData, setFormData] = useState<CompanyAboutData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("left")
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const fetchData = async () => {
    setIsLoading(true)
    setImagesToDelete([]) // Reset images to delete when fetching new data
    try {
      const { data: companyData, error } = await supabase
        .from("aboutpage_company")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(companyData.id)

      // Set image preview if there's an image
      if (companyData.right_column.imageBlock.image.src) {
        setImagePreview(getImageUrl(companyData.right_column.imageBlock.image.src))
      }

      setFormData(companyData)
    } catch (error) {
      console.error("Error fetching company data:", error)
      setMessage({ text: "Failed to load data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        left_column: {
          intro: {
            title: "Our Story",
            description: "Learn about our journey and mission.",
          },
          founder: {
            title: "Our Founder",
            descriptionBefore: "Founded by",
            founderName: "John Doe",
            descriptionAfter: "in 2010.",
          },
          growth: {
            title: "Growth & Expansion",
            description: "Our company has grown significantly over the years.",
          },
          timeline: [
            { label: "2010", value: "Company Founded" },
            { label: "2015", value: "International Expansion" },
            { label: "2020", value: "Market Leadership" },
          ],
        },
        right_column: {
          globalExpansion: {
            title: "Global Reach",
            description: "We operate in multiple countries around the world.",
          },
          imageBlock: {
            image: {
              src: "",
              alt: "Company headquarters",
            },
          },
          legacy: {
            title: "Our Legacy",
            description: "Building a lasting impact in the industry.",
          },
        },
      })
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
    return supabase.storage.from("aboutpage-company-images").getPublicUrl(path).data.publicUrl
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return

    setFormData((prev) => {
      if (!prev) return prev
      const keys = path.split(".")
      const lastKey = keys.pop()!

      // Create a deep copy of the object
      const newData = JSON.parse(JSON.stringify(prev))

      // Navigate to the correct object
      let current = newData
      for (const key of keys) {
        current = current[key]
      }

      // Update the value
      current[lastKey] = value

      return newData
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

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

    // Check if there's an existing image to mark for deletion
    const currentImage = formData.right_column.imageBlock.image.src
    if (currentImage && !currentImage.startsWith("http") && !currentImage.startsWith("/")) {
      setImagesToDelete((prev) => [...prev, currentImage])
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
    if (!formData) return

    // If there's an existing image in storage (not a URL), mark it for deletion
    const currentImage = formData.right_column.imageBlock.image.src
    if (currentImage && !currentImage.startsWith("http") && !currentImage.startsWith("/")) {
      setImagesToDelete((prev) => [...prev, currentImage])
    }

    // Update form data to clear the image
    setFormData({
      ...formData,
      right_column: {
        ...formData.right_column,
        imageBlock: {
          ...formData.right_column.imageBlock,
          image: {
            ...formData.right_column.imageBlock.image,
            src: "",
          },
        },
      },
    })

    // Clean up preview URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleTimelineChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev

      // Create a deep copy of the object
      const newData = JSON.parse(JSON.stringify(prev))

      // Update the specific timeline item
      newData.left_column.timeline[index][field] = value

      return newData
    })
  }

  const addTimelineItem = () => {
    setFormData((prev) => {
      if (!prev) return prev

      // Create a deep copy of the object
      const newData = JSON.parse(JSON.stringify(prev))

      // Add a new timeline item
      newData.left_column.timeline.push({ label: "New Item", value: "" })

      return newData
    })
  }

  const removeTimelineItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev

      // Create a deep copy of the object
      const newData = JSON.parse(JSON.stringify(prev))

      // Remove the timeline item at the specified index
      newData.left_column.timeline.splice(index, 1)

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Create a copy of the form data to prepare for saving
      const dataToSave = JSON.parse(JSON.stringify(formData))

      // First, handle image upload if there's a new file
      if (selectedFile) {
        // Generate a unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExt = selectedFile.name.split(".").pop() || "jpg"
        const fileName = `company-about-${timestamp}-${randomString}.${fileExt}`

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("aboutpage-company-images")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: selectedFile.type,
          })

        if (uploadError) throw uploadError

        // Update the image path in the data to save
        dataToSave.right_column.imageBlock.image.src = fileName
      }

      // Update the database
      const { error } = await supabase.from("aboutpage_company").update(dataToSave).eq("id", recordId)

      if (error) throw error

      // After successful update, delete old images
      if (imagesToDelete.length > 0) {
        try {
          const { error: deleteError } = await supabase.storage.from("aboutpage-company-images").remove(imagesToDelete)

          if (deleteError) {
            console.error("Error deleting old images:", deleteError)
            // Continue with the save process even if deletion fails
          }
        } catch (deleteError) {
          console.error("Error in deletion process:", deleteError)
          // Continue with the save process even if deletion fails
        }
      }

      setMessage({ text: "Company information saved successfully!", type: "success" })
      setSelectedFile(null)
      setImagesToDelete([])
      await fetchData()
    } catch (error) {
      console.error("Error saving company data:", error)
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
              onClick={() => setActiveTab("left")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "left"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Company Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("right")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "right"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Global & Image
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Left Column Content */}
        {activeTab === "left" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Company Story</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="left_column.intro.title">Intro Title</Label>
                <Input
                  id="left_column.intro.title"
                  value={formData.left_column.intro.title}
                  onChange={(e) => handleTextChange("left_column.intro.title", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.intro.description">Intro Description</Label>
                <Textarea
                  id="left_column.intro.description"
                  value={formData.left_column.intro.description}
                  onChange={(e) => handleTextChange("left_column.intro.description", e.target.value)}
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.founder.title">Founder Title</Label>
                <Input
                  id="left_column.founder.title"
                  value={formData.left_column.founder.title}
                  onChange={(e) => handleTextChange("left_column.founder.title", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.founder.descriptionBefore">Founder Description Before</Label>
                <Input
                  id="left_column.founder.descriptionBefore"
                  value={formData.left_column.founder.descriptionBefore}
                  onChange={(e) => handleTextChange("left_column.founder.descriptionBefore", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.founder.founderName">Founder Name</Label>
                <Input
                  id="left_column.founder.founderName"
                  value={formData.left_column.founder.founderName}
                  onChange={(e) => handleTextChange("left_column.founder.founderName", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.founder.descriptionAfter">Founder Description After</Label>
                <Input
                  id="left_column.founder.descriptionAfter"
                  value={formData.left_column.founder.descriptionAfter}
                  onChange={(e) => handleTextChange("left_column.founder.descriptionAfter", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.growth.title">Growth Title</Label>
                <Input
                  id="left_column.growth.title"
                  value={formData.left_column.growth.title}
                  onChange={(e) => handleTextChange("left_column.growth.title", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="left_column.growth.description">Growth Description</Label>
                <Textarea
                  id="left_column.growth.description"
                  value={formData.left_column.growth.description}
                  onChange={(e) => handleTextChange("left_column.growth.description", e.target.value)}
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Timeline Items</Label>
                  <Button
                    type="button"
                    onClick={addTimelineItem}
                    className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                {formData.left_column.timeline.map((item, index) => (
                  <div key={index} className={`space-y-4 p-4 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Timeline Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTimelineItem(index)}
                        className="gap-2"
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(e) => handleTimelineChange(index, "label", e.target.value)}
                        className={inputStyles}
                      />
                    </div>
                    {item.value !== undefined ? (
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={item.value}
                          onChange={(e) => handleTimelineChange(index, "value", e.target.value)}
                          className={inputStyles}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title || ""}
                            onChange={(e) => handleTimelineChange(index, "title", e.target.value)}
                            className={inputStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={item.subtitle || ""}
                            onChange={(e) => handleTimelineChange(index, "subtitle", e.target.value)}
                            className={inputStyles}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Column Content */}
        {activeTab === "right" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Global & Image</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="right_column.globalExpansion.title">Global Expansion Title</Label>
                <Input
                  id="right_column.globalExpansion.title"
                  value={formData.right_column.globalExpansion.title}
                  onChange={(e) => handleTextChange("right_column.globalExpansion.title", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="right_column.globalExpansion.description">Global Expansion Description</Label>
                <Textarea
                  id="right_column.globalExpansion.description"
                  value={formData.right_column.globalExpansion.description}
                  onChange={(e) => handleTextChange("right_column.globalExpansion.description", e.target.value)}
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="right_column.imageBlock.image.src">Company Image</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    {formData.right_column.imageBlock.image.src ? "Change Image" : "Upload Image"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  {(formData.right_column.imageBlock.image.src || selectedFile) && (
                    <Button type="button" variant="destructive" size="sm" onClick={handleDeleteImage} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
                {(formData.right_column.imageBlock.image.src || imagePreview) && (
                  <Card className={`mt-4 overflow-hidden aspect-video relative ${cardStyles}`}>
                    <Image
                      src={imagePreview || getImageUrl(formData.right_column.imageBlock.image.src)}
                      alt={formData.right_column.imageBlock.image.alt || "Company image"}
                      fill
                      className="object-cover"
                    />
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="right_column.imageBlock.image.alt">Image Alt Text</Label>
                <Input
                  id="right_column.imageBlock.image.alt"
                  value={formData.right_column.imageBlock.image.alt}
                  onChange={(e) => handleTextChange("right_column.imageBlock.image.alt", e.target.value)}
                  placeholder="Enter alt text for accessibility"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="right_column.legacy.title">Legacy Title</Label>
                <Input
                  id="right_column.legacy.title"
                  value={formData.right_column.legacy.title}
                  onChange={(e) => handleTextChange("right_column.legacy.title", e.target.value)}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="right_column.legacy.description">Legacy Description</Label>
                <Textarea
                  id="right_column.legacy.description"
                  value={formData.right_column.legacy.description}
                  onChange={(e) => handleTextChange("right_column.legacy.description", e.target.value)}
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
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
                Update Company About
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

