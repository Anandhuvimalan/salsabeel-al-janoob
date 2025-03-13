"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { RefreshCw, Save, AlertCircle, CheckCircle2, Plus, Trash2, Replace, Database, ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Add this CSS class at the top of the file, right after the imports
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30"

// Define proper types for better type safety
interface AnimationSettings {
  cycleDuration: number
  animationDuration: number
  initialRevealDelay: number
}

interface ImageData {
  src: string
  alt: string
}

interface FormDataType {
  id?: string
  tag: string
  title: string
  highlighted_title: string
  description: string
  button_name: string
  button_link: string
  animation_settings: AnimationSettings
  images: ImageData[]
}

interface SelectedImage {
  file: File
  alt: string
  preview: string
  replacingIndex?: number
}

interface Message {
  text: string
  type: "success" | "error" | "warning" | ""
}

interface FormErrors {
  [key: string]: string
}

export default function HeroSectionForm() {
  const initialFormState: FormDataType = {
    tag: "GLOBAL SOLUTIONS",
    title: "Your Gateway to the",
    highlighted_title: "International Market",
    description:
      "Our specialized import and export solutions connect your business with global opportunities. Experience seamless trade and unparalleled service.",
    button_name: "Get in Touch",
    button_link: "/contact",
    animation_settings: {
      cycleDuration: 3000,
      animationDuration: 1500,
      initialRevealDelay: 2000,
    },
    images: [],
  }

  const [formData, setFormData] = useState<FormDataType>(initialFormState)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [message, setMessage] = useState<Message>({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [connectionError, setConnectionError] = useState(false)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("content")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dataFetchedRef = useRef(false)

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview))
    }
  }, [selectedImages])

  // Update the fetchHeroData function to properly fetch from the hero_sections table
  const fetchHeroData = useCallback(async () => {
    // Prevent multiple fetches if we've already loaded data
    if (dataFetchedRef.current) return

    setIsLoading(true)

    try {
      console.log("Fetching hero data...")

      // Simple query to get the first hero section without using .single()
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      if (!data || data.length === 0) {
        // No data found, use initial state
        console.log("No hero section found, using default values")
        setFormData(initialFormState)
      } else {
        console.log("Hero data fetched successfully")

        // Ensure images is an array
        const processedData = {
          ...data[0],
          images: Array.isArray(data[0].images) ? data[0].images : [],
        }

        setFormData(processedData)
      }

      setErrors({})
      setConnectionError(false)
      // Reset image tracking states
      setSelectedImages([])
      setImagesToDelete([])
    } catch (error) {
      console.error("Error fetching hero data:", error)
      setMessage({ text: "Failed to load data. Please refresh.", type: "error" })
      setConnectionError(true)
      // Use initial state as fallback
      setFormData(initialFormState)
    } finally {
      dataFetchedRef.current = true
      setIsLoading(false)
    }
  }, [initialFormState])

  // Only fetch data once on initial load
  useEffect(() => {
    if (!dataFetchedRef.current) {
      fetchHeroData()
    }
  }, [fetchHeroData, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("animation.")) {
      const animationField = name.split(".")[1] as keyof AnimationSettings
      setFormData((prev) => ({
        ...prev,
        animation_settings: {
          ...prev.animation_settings,
          [animationField]: Number(value) || 0, // Ensure it's always a number
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const maxSize = 5 * 1024 * 1024 // 5MB
    const files = Array.from(e.target.files)

    const newImages = files.reduce<SelectedImage[]>((acc, file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: `${file.name} has an invalid file type`, type: "error" })
        return acc
      }

      if (file.size > maxSize) {
        setMessage({ text: `${file.name} exceeds the maximum size of 5MB`, type: "error" })
        return acc
      }

      // Create a preview URL for the image
      const preview = URL.createObjectURL(file)

      // If replacing an existing image, mark it for replacement
      const newImage: SelectedImage = {
        file,
        alt: file.name.split(".")[0] || "", // Use filename as default alt text
        preview,
        replacingIndex: replacingIndex !== null ? replacingIndex : undefined,
      }

      // If replacing an image, track the old image URL for deletion
      if (replacingIndex !== null && formData.images && formData.images[replacingIndex]) {
        const oldImageUrl = formData.images[replacingIndex].src
        // Extract the filename from the URL to delete from storage later
        const urlParts = oldImageUrl.split("/")
        const filename = urlParts[urlParts.length - 1]

        // Add to images to delete list
        if (filename) {
          setImagesToDelete((prev) => [...prev, filename])
        }
      }

      acc.push(newImage)
      return acc
    }, [])

    if (newImages.length > 0) {
      setSelectedImages((prev) => [...prev, ...newImages])
      // Clear the replacing index after handling
      setReplacingIndex(null)
    }

    // Reset the input value to allow selecting the same file again
    if (e.target.value) e.target.value = ""
  }

  const handleAltTextChange = (index: number, value: string, isExisting: boolean) => {
    if (isExisting) {
      setFormData((prev) => {
        const newImages = [...(prev.images || [])]
        newImages[index] = { ...newImages[index], alt: value }
        return { ...prev, images: newImages }
      })
    } else {
      setSelectedImages((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], alt: value }
        return updated
      })
    }
  }

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      // Get the image URL to track for deletion
      const imageToDelete = formData.images[index]
      if (imageToDelete && imageToDelete.src) {
        // Extract the filename from the URL
        const urlParts = imageToDelete.src.split("/")
        const filename = urlParts[urlParts.length - 1]

        // Add to images to delete list
        if (filename) {
          setImagesToDelete((prev) => [...prev, filename])
        }
      }

      // Remove from formData
      setFormData((prev) => {
        const newImages = [...(prev.images || [])]
        newImages.splice(index, 1)
        return { ...prev, images: newImages }
      })
    } else {
      // For new images, just remove from selectedImages
      setSelectedImages((prev) => {
        const imageToRemove = prev[index]
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(imageToRemove.preview)
        return prev.filter((_, i) => i !== index)
      })
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.button_name.trim()) newErrors.buttonName = "Button text is required"
    if (!formData.button_link.trim()) newErrors.buttonLink = "Button link is required"

    // URL validation for button link
    if (
      formData.button_link.trim() &&
      !formData.button_link.startsWith("/") &&
      !formData.button_link.startsWith("http")
    ) {
      newErrors.buttonLink = "Button link must be a valid URL or path"
    }

    // Image validation
    const totalImages = (formData.images?.length || 0) + selectedImages.length
    if (totalImages < 1) {
      newErrors.images = "At least one image is required"
    }

    // Animation settings validation
    const { cycleDuration, animationDuration, initialRevealDelay } = formData.animation_settings
    if (cycleDuration <= 0) newErrors["animation.cycleDuration"] = "Must be greater than 0"
    if (animationDuration <= 0) newErrors["animation.animationDuration"] = "Must be greater than 0"
    if (initialRevealDelay < 0) newErrors["animation.initialRevealDelay"] = "Cannot be negative"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const deleteOldImages = async () => {
    if (imagesToDelete.length === 0) return

    try {
      for (const filename of imagesToDelete) {
        const { error } = await supabase.storage.from("hero-images").remove([filename])
        if (error) {
          console.error(`Error deleting image ${filename}:`, error)
        }
      }
      console.log(`Successfully deleted ${imagesToDelete.length} images`)
    } catch (error) {
      console.error("Error deleting old images:", error)
    }
  }

  const uploadImages = async (): Promise<ImageData[]> => {
    if (!selectedImages.length) return []

    const uploadedImages: ImageData[] = []

    for (const image of selectedImages) {
      try {
        const fileExt = image.file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from("hero-images").upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) {
          console.error(`Error uploading image ${image.file.name}:`, uploadError)
          throw new Error(`Error uploading image: ${uploadError.message}`)
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("hero-images").getPublicUrl(filePath)

        uploadedImages.push({
          src: publicUrl,
          alt: image.alt,
        })
      } catch (error) {
        console.error("Error in image upload:", error)
        throw error
      }
    }

    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // Check if we can connect to Supabase
      if (connectionError) {
        throw new Error("Cannot save while disconnected from the database")
      }

      // Step 1: Delete old images that were marked for removal
      await deleteOldImages()

      // Step 2: Upload new images
      const uploadedImages = await uploadImages()

      // Step 3: Organize images - place replacement images in their correct positions
      let finalImages = [...formData.images] // Start with existing images

      // Process uploaded images and place them in the correct positions
      let regularImageCount = 0
      for (let i = 0; i < selectedImages.length; i++) {
        const selectedImage = selectedImages[i]
        const uploadedImage = uploadedImages[i]

        if (uploadedImage) {
          if (selectedImage.replacingIndex !== undefined) {
            // This is a replacement image - insert at the specific position
            const position = selectedImage.replacingIndex
            // If position is beyond array length, extend the array
            while (finalImages.length <= position) {
              finalImages.push({ src: "", alt: "" })
            }
            finalImages[position] = uploadedImage
          } else {
            // This is a regular new image - add to the end
            finalImages.push(uploadedImage)
            regularImageCount++
          }
        }
      }

      // Remove any empty placeholder images that might have been added
      finalImages = finalImages.filter((img) => img.src !== "")

      // Step 4: Save to Supabase
      const heroData = {
        ...formData,
        images: finalImages,
      }

      let result

      if (formData.id) {
        // Update existing record
        const { data, error } = await supabase.from("hero_sections").update(heroData).eq("id", formData.id).select()

        if (error) throw error

        // Check if data exists and has at least one row
        if (data && data.length > 0) {
          result = data[0]
        } else {
          throw new Error("No data returned after update")
        }
      } else {
        // First check if any records exist
        const { count, error: countError } = await supabase.from("hero_sections").count()

        if (countError) throw countError

        if (count && count > 0) {
          // Records exist, get the first one and update it
          const { data: existingData, error: fetchError } = await supabase
            .from("hero_sections")
            .select("id")
            .order("created_at", { ascending: false })
            .limit(1)

          if (fetchError) throw fetchError

          if (existingData && existingData.length > 0) {
            const existingId = existingData[0].id

            const { data, error } = await supabase.from("hero_sections").update(heroData).eq("id", existingId).select()

            if (error) throw error

            if (data && data.length > 0) {
              result = data[0]
            } else {
              throw new Error("No data returned after update")
            }
          }
        } else {
          // No records exist, insert a new one
          const { data, error } = await supabase.from("hero_sections").insert(heroData).select()

          if (error) throw error

          if (data && data.length > 0) {
            result = data[0]
          } else {
            throw new Error("No data returned after insert")
          }
        }
      }

      setMessage({ text: "Hero section saved successfully!", type: "success" })
      setSelectedImages([])
      setImagesToDelete([])

      // Update form data with the saved data
      if (result) {
        setFormData({
          ...result,
          images: Array.isArray(result.images) ? result.images : [],
        })
      }
    } catch (error) {
      console.error("Error saving form:", error)
      setMessage({ text: `Save failed: ${error instanceof Error ? error.message : "Unknown error"}`, type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-background rounded-md w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 bg-background rounded-md w-1/4"></div>
            <div className="h-10 bg-background rounded-md w-full"></div>
            <div className="h-4 bg-background rounded-md w-1/4"></div>
            <div className="h-10 bg-background rounded-md w-full"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-background rounded-md w-1/4"></div>
            <div className="h-24 bg-background rounded-md w-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-background rounded-md w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-40 bg-background rounded-md"></div>
            <div className="h-40 bg-background rounded-md"></div>
            <div className="h-40 bg-background rounded-md"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {connectionError && (
        <Alert variant="destructive" className="mb-6">
          <Database className="h-4 w-4" />
          <AlertTitle>Database Connection Issue</AlertTitle>
          <AlertDescription>
            Unable to connect to the database. You can still edit the form, but changes won't be saved.
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchHeroData}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
                onClick={() => setActiveTab("button")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "button"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                Button & Animation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "images"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                Images
              </button>
            </div>
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tag" className="text-sm font-medium">
                  Tag Line
                </label>
                <Input
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="Enter a tag line"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium flex items-center">
                  Title <span className="text-destructive ml-1">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a title"
                  className={cn(inputStyles, errors.title && "!border-destructive focus-visible:!ring-destructive")}
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="highlighted_title" className="text-sm font-medium">
                  Highlighted Title
                </label>
                <Input
                  id="highlighted_title"
                  name="highlighted_title"
                  value={formData.highlighted_title}
                  onChange={handleChange}
                  placeholder="Enter highlighted part of the title"
                  className={inputStyles}
                />
                <p className="text-muted-foreground text-xs">
                  This part of the title will be highlighted with accent color
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium flex items-center">
                  Description <span className="text-destructive ml-1">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a description"
                  rows={4}
                  className={cn(
                    inputStyles,
                    errors.description && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Button & Animation Tab */}
        {activeTab === "button" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="button_name" className="text-sm font-medium flex items-center">
                    Button Text <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    id="button_name"
                    name="button_name"
                    value={formData.button_name}
                    onChange={handleChange}
                    placeholder="Enter button text"
                    className={cn(
                      inputStyles,
                      errors.buttonName && "!border-destructive focus-visible:!ring-destructive",
                    )}
                  />
                  {errors.buttonName && <p className="text-destructive text-sm">{errors.buttonName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="button_link" className="text-sm font-medium flex items-center">
                    Button Link <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    id="button_link"
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleChange}
                    placeholder="Enter button link (e.g., /contact)"
                    className={cn(
                      inputStyles,
                      errors.buttonLink && "!border-destructive focus-visible:!ring-destructive",
                    )}
                  />
                  {errors.buttonLink && <p className="text-destructive text-sm">{errors.buttonLink}</p>}
                </div>
              </div>
            </div>

            <Separator className="bg-border/3" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cycleDuration" className="text-sm font-medium">
                    Cycle Duration (ms)
                  </label>
                  <Input
                    id="cycleDuration"
                    name="animation.cycleDuration"
                    value={formData.animation_settings.cycleDuration}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className={cn(
                      inputStyles,
                      errors["animation.cycleDuration"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                  />
                  {errors["animation.cycleDuration"] && (
                    <p className="text-destructive text-sm">{errors["animation.cycleDuration"]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="animationDuration" className="text-sm font-medium">
                    Animation Duration (ms)
                  </label>
                  <Input
                    id="animationDuration"
                    name="animation.animationDuration"
                    value={formData.animation_settings.animationDuration}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className={cn(
                      inputStyles,
                      errors["animation.animationDuration"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                  />
                  {errors["animation.animationDuration"] && (
                    <p className="text-destructive text-sm">{errors["animation.animationDuration"]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="initialRevealDelay" className="text-sm font-medium">
                    Initial Delay (ms)
                  </label>
                  <Input
                    id="initialRevealDelay"
                    name="animation.initialRevealDelay"
                    value={formData.animation_settings.initialRevealDelay}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className={cn(
                      inputStyles,
                      errors["animation.initialRevealDelay"] && "!border-destructive focus-visible:!ring-destructive",
                    )}
                  />
                  {errors["animation.initialRevealDelay"] && (
                    <p className="text-destructive text-sm">{errors["animation.initialRevealDelay"]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload images for your hero section (Max 5MB, JPG, PNG, WebP, or GIF)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplacingIndex(null)
                  fileInputRef.current?.click()
                }}
                className={`flex items-center gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
              />
            </div>

            {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}

            {(!formData.images || formData.images.length === 0) && selectedImages.length === 0 && (
              <div className="border-2 border-dashed !border-white/10 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <h4 className="text-lg font-medium">No images added yet</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the 'Add Image' button to upload images for your hero section
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Existing Images */}
              {formData.images &&
                formData.images.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className={`group relative !border-[0.5px] !border-white/10 rounded-lg overflow-hidden bg-background transition-all hover:shadow-md ${cardStyles}`}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setReplacingIndex(index)
                            fileInputRef.current?.click()
                          }}
                          className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                        >
                          <Replace className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveImage(index, true)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 left-2 bg-primary/80 text-primary-foreground">
                        Image {index + 1}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <Input
                        type="text"
                        value={image.alt}
                        onChange={(e) => handleAltTextChange(index, e.target.value, true)}
                        className={inputStyles}
                        placeholder="Alt text (for accessibility)"
                      />
                    </div>
                  </div>
                ))}

              {/* New Images */}
              {selectedImages.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className={`group relative !border-[0.5px] !border-white/10 rounded-lg overflow-hidden bg-background transition-all hover:shadow-md ${cardStyles}`}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.onerror = null // Prevents infinite loop
                        e.target.src = "/placeholder.svg" // Fallback image
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveImage(index, false)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge
                      className={`absolute top-2 left-2 ${
                        image.replacingIndex !== undefined ? "bg-amber-500" : "bg-primary/80 text-primary-foreground"
                      }`}
                    >
                      {image.replacingIndex !== undefined
                        ? `Replacing Image #${image.replacingIndex + 1}`
                        : "New Image"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <Input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleAltTextChange(index, e.target.value, false)}
                      className={inputStyles}
                      placeholder="Alt text (for accessibility)"
                    />
                  </div>
                </div>
              ))}
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

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSaving || connectionError}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={fetchHeroData}
            disabled={isSaving}
            className={`hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

