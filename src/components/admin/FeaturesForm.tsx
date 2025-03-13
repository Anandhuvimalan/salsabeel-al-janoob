"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, AlertCircle, CheckCircle2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type Feature = {
  title: string
  description: string
  icon: string
  details: string[]
}

type CTA = {
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
  icon: string
}

type FeaturesData = {
  id?: string
  heading: {
    title: string
    subtitle: string
  }
  features: Feature[]
  cta: CTA
}

type IconData = {
  file: File
  oldPath: string
}

type IconPreview = {
  url: string
  isNew: boolean
}

export default function FeaturesSectionForm() {
  const [formData, setFormData] = useState<FeaturesData>({
    heading: { title: "", subtitle: "" },
    features: [],
    cta: { title: "", subtitle: "", linkText: "", linkUrl: "", icon: "" },
  })

  const [selectedIcons, setSelectedIcons] = useState<Record<string, IconData>>({})
  const [iconPreviews, setIconPreviews] = useState<Record<string, IconPreview>>({})
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const [activeTab, setActiveTab] = useState("heading")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    return () => {
      Object.values(iconPreviews).forEach((preview) => {
        if (preview.isNew) URL.revokeObjectURL(preview.url)
      })
    }
  }, [iconPreviews])

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
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from("features_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      const initialPreviews: Record<string, IconPreview> = {}

      data.features.forEach((feature: Feature, index: number) => {
        if (feature.icon) {
          const iconUrl = supabase.storage.from("feature-icons").getPublicUrl(feature.icon).data.publicUrl

          initialPreviews[`features.${index}.icon`] = {
            url: iconUrl,
            isNew: false,
          }
        }
      })

      if (data.cta.icon) {
        const ctaIconUrl = supabase.storage.from("feature-icons").getPublicUrl(data.cta.icon).data.publicUrl

        initialPreviews["cta.icon"] = {
          url: ctaIconUrl,
          isNew: false,
        }
      }

      setIconPreviews(initialPreviews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching features data:", error)
      setMessage({ text: "Failed to load features data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the deleteIcon function to properly handle state updates
  const deleteIcon = async (iconPath: string, fieldPath: string) => {
    try {
      // Only attempt to delete from storage if the path exists
      if (iconPath) {
        const { error } = await supabase.storage.from("feature-icons").remove([iconPath])

        if (error) throw error
      }

      // Update the form data to clear the icon path
      const keys = fieldPath.split(".")
      setFormData((prev) => {
        const newData = { ...prev }
        let current: any = newData

        // Navigate to the correct nested property
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }

        // Set the icon path to empty string
        current[keys[keys.length - 1]] = ""

        return newData
      })

      // Remove the preview
      setIconPreviews((prev) => {
        const newPreviews = { ...prev }
        delete newPreviews[fieldPath]
        return newPreviews
      })

      return true
    } catch (error) {
      console.error("Icon deletion error:", error)
      setMessage({
        text: "Failed to delete icon. Please try again.",
        type: "error",
      })
      return false
    }
  }

  // Update the handleIconChange function to better handle SVG files
  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>, path: string, currentIcon: string) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [path]: "Please select a valid image file (JPEG, PNG, WEBP, GIF, or SVG)",
        }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [path]: "Image size should be less than 5MB",
        }))
        return
      }

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file)

      // Store the file and old path information
      setSelectedIcons((prev) => ({
        ...prev,
        [path]: {
          file,
          oldPath: currentIcon,
        },
      }))

      // Update the preview
      setIconPreviews((prev) => ({
        ...prev,
        [path]: { url: previewUrl, isNew: true },
      }))

      // Clear any errors for this field
      if (errors[path]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[path]
          return newErrors
        })
      }

      // Reset the input value to allow selecting the same file again
      e.target.value = ""
    }
  }

  const handleChange = (path: string, value: string) => {
    setFormData((prev) => {
      const keys = path.split(".")
      const newData = { ...prev }
      let current: any = newData
      keys.forEach((key, i) => {
        if (i === keys.length - 1) current[key] = value
        else current = current[key] = { ...current[key] }
      })
      return newData
    })

    // Clear error for this field if it exists
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[path]
        return newErrors
      })
    }
  }

  const handleFeatureChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features]
      newFeatures[index] = { ...newFeatures[index], [field]: value }
      return { ...prev, features: newFeatures }
    })

    // Clear error for this field if it exists
    const errorKey = `features.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleDetailChange = (featureIndex: number, detailIndex: number, value: string) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features]
      newFeatures[featureIndex].details[detailIndex] = value
      return { ...prev, features: newFeatures }
    })

    // Clear error for this field if it exists
    const errorKey = `features.${featureIndex}.details.${detailIndex}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addDetail = (featureIndex: number) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features]
      newFeatures[featureIndex] = {
        ...newFeatures[featureIndex],
        details: [...newFeatures[featureIndex].details, ""],
      }
      return { ...prev, features: newFeatures }
    })
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          title: "",
          description: "",
          icon: "",
          details: [""],
        },
      ],
    }))
  }

  const removeDetail = (featureIndex: number, detailIndex: number) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features]
      newFeatures[featureIndex].details = newFeatures[featureIndex].details.filter((_, i) => i !== detailIndex)
      return { ...prev, features: newFeatures }
    })
  }

  const removeFeature = async (index: number) => {
    const feature = formData.features[index]

    if (feature.icon) {
      await deleteIcon(feature.icon, `features.${index}.icon`)
    }

    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.heading.title.trim()) newErrors["heading.title"] = "Title is required"
    if (!formData.heading.subtitle.trim()) newErrors["heading.subtitle"] = "Subtitle is required"

    formData.features.forEach((feature, index) => {
      if (!feature.title.trim()) newErrors[`features.${index}.title`] = "Title is required"
      if (!feature.description.trim()) newErrors[`features.${index}.description`] = "Description is required"
      if (!feature.icon && !selectedIcons[`features.${index}.icon`]) {
        newErrors[`features.${index}.icon`] = "Icon is required"
      }
      feature.details.forEach((detail, detailIndex) => {
        if (!detail.trim()) newErrors[`features.${index}.details.${detailIndex}`] = "Detail is required"
      })
    })

    if (!formData.cta.title.trim()) newErrors["cta.title"] = "Title is required"
    if (!formData.cta.subtitle.trim()) newErrors["cta.subtitle"] = "Subtitle is required"
    if (!formData.cta.linkText.trim()) newErrors["cta.linkText"] = "Button text is required"
    if (!formData.cta.linkUrl.trim()) newErrors["cta.linkUrl"] = "Button URL is required"
    if (!formData.cta.icon && !selectedIcons["cta.icon"]) {
      newErrors["cta.icon"] = "Icon is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      setMessage({ text: "Please fix the errors in the form", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Upload new icons and update paths
      const uploads = Object.entries(selectedIcons).map(async ([path, { file, oldPath }]) => {
        // Generate a unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 10)
        const fileExt = file.name.split(".").pop() || "svg" // Default to svg if extension can't be determined
        const fileName = `${timestamp}-${randomString}.${fileExt}`

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage.from("feature-icons").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type, // Explicitly set the content type for SVG files
        })

        if (uploadError) throw uploadError

        // Delete the old icon if it exists and is not empty
        if (oldPath && oldPath.trim() !== "") {
          try {
            await supabase.storage.from("feature-icons").remove([oldPath])
          } catch (error) {
            console.warn(`Failed to delete old icon ${oldPath}:`, error)
            // Continue with the process even if deletion fails
          }
        }

        return { path, iconPath: fileName }
      })

      const uploadResults = await Promise.all(uploads)
      const updatedData = { ...formData }

      // Update the form data with the new icon paths
      uploadResults.forEach(({ path, iconPath }) => {
        const keys = path.split(".")
        let current: any = updatedData
        keys.forEach((key: string | number, i: number) => {
          if (i === keys.length - 1) current[key] = iconPath
          else current = current[key]
        })
      })

      // Save the updated data to Supabase
      const { error } = await supabase.from("features_section").upsert({
        id: formData.id,
        heading: updatedData.heading,
        features: updatedData.features,
        cta: updatedData.cta,
      })

      if (error) throw error

      setMessage({ text: "Features section updated successfully!", type: "success" })
      setSelectedIcons({})
      await fetchData()
    } catch (error: any) {
      console.error("Error saving features data:", error)
      setMessage({
        text: error.message || "An error occurred while updating the features section",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
              onClick={() => setActiveTab("heading")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "heading"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Heading
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("features")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "features"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cta")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "cta"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Call to Action
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Heading */}
        {activeTab === "heading" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Section Heading</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heading.title" className="flex items-center gap-1">
                  Title <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="heading.title"
                  value={formData.heading.title}
                  onChange={(e) => handleChange("heading.title", e.target.value)}
                  placeholder="Enter section title"
                  className={cn(
                    inputStyles,
                    errors["heading.title"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["heading.title"] && <p className="text-sm text-destructive">{errors["heading.title"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading.subtitle" className="flex items-center gap-1">
                  Subtitle <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="heading.subtitle"
                  value={formData.heading.subtitle}
                  onChange={(e) => handleChange("heading.subtitle", e.target.value)}
                  placeholder="Enter section subtitle"
                  className={cn(
                    inputStyles,
                    errors["heading.subtitle"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["heading.subtitle"] && <p className="text-sm text-destructive">{errors["heading.subtitle"]}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        {activeTab === "features" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Features</h2>

            {formData.features.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No features added yet. Click the "Add Feature" button to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.features.map((feature, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Feature #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`features.${index}.title`} className="flex items-center gap-1">
                            Title <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id={`features.${index}.title`}
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                            placeholder="Enter feature title"
                            className={cn(
                              inputStyles,
                              errors[`features.${index}.title`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                            )}
                          />
                          {errors[`features.${index}.title`] && (
                            <p className="text-sm text-destructive">{errors[`features.${index}.title`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`features.${index}.icon`} className="flex items-center gap-1">
                            Icon <span className="text-destructive ml-1">*</span>
                          </Label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRefs.current[`feature-${index}`]?.click()}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Upload className="h-4 w-4" />
                              Choose File
                            </Button>
                            <input
                              ref={(el) => {
                                fileInputRefs.current[`feature-${index}`] = el!
                              }}
                              id={`features.${index}.icon`}
                              type="file"
                              onChange={(e) => handleIconChange(e, `features.${index}.icon`, feature.icon)}
                              className="hidden"
                              accept="image/jpeg, image/jpg, image/png, image/webp, image/gif, image/svg+xml"
                            />
                            {feature.icon && !selectedIcons[`features.${index}.icon`] && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  await deleteIcon(feature.icon, `features.${index}.icon`)
                                }}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Icon
                              </Button>
                            )}

                            {selectedIcons[`features.${index}.icon`] && (
                              <p className="text-sm text-muted-foreground">
                                Selected: {selectedIcons[`features.${index}.icon`].file.name}
                              </p>
                            )}
                          </div>
                          {errors[`features.${index}.icon`] && (
                            <p className="text-sm text-destructive">{errors[`features.${index}.icon`]}</p>
                          )}

                          {(feature.icon || iconPreviews[`features.${index}.icon`]) && (
                            <Card className={`mt-4 overflow-hidden w-24 h-24 relative ${cardStyles}`}>
                              <Image
                                src={
                                  iconPreviews[`features.${index || "/placeholder.svg"}.icon`]?.url ||
                                  supabase.storage.from("feature-icons").getPublicUrl(feature.icon).data.publicUrl ||
                                  "/placeholder.svg"
                                }
                                alt="Feature icon"
                                fill
                                className="object-contain p-2"
                              />
                              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                {selectedIcons[`features.${index}.icon`] ? "New" : "Current"}
                              </div>
                            </Card>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`features.${index}.description`} className="flex items-center gap-1">
                            Description <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea
                            id={`features.${index}.description`}
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                            rows={3}
                            placeholder="Enter feature description"
                            className={cn(
                              inputStyles,
                              errors[`features.${index}.description`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                            )}
                          />
                          {errors[`features.${index}.description`] && (
                            <p className="text-sm text-destructive">{errors[`features.${index}.description`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            Feature Points <span className="text-destructive ml-1">*</span>
                          </Label>
                          <div className="space-y-3">
                            {feature.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center gap-2">
                                <Input
                                  value={detail}
                                  onChange={(e) => handleDetailChange(index, detailIndex, e.target.value)}
                                  placeholder="Enter feature point"
                                  className={cn(
                                    inputStyles,
                                    errors[`features.${index}.details.${detailIndex}`] &&
                                      "!border-destructive focus-visible:!ring-destructive",
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeDetail(index, detailIndex)}
                                  disabled={feature.details.length <= 1}
                                  className={`bg-background/30 hover:bg-background/50 text-foreground ${buttonStyles}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {errors[`features.${index}.details.${feature.details.length - 1}`] && (
                              <p className="text-sm text-destructive">
                                {errors[`features.${index}.details.${feature.details.length - 1}`]}
                              </p>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addDetail(index)}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Plus className="h-4 w-4" />
                              Add Point
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "features" && (
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={addFeature}
                  className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        {activeTab === "cta" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Call to Action</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta.title" className="flex items-center gap-1">
                  Title <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="cta.title"
                  value={formData.cta.title}
                  onChange={(e) => handleChange("cta.title", e.target.value)}
                  placeholder="Enter CTA title"
                  className={cn(
                    inputStyles,
                    errors["cta.title"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["cta.title"] && <p className="text-sm text-destructive">{errors["cta.title"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta.subtitle" className="flex items-center gap-1">
                  Subtitle <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="cta.subtitle"
                  value={formData.cta.subtitle}
                  onChange={(e) => handleChange("cta.subtitle", e.target.value)}
                  placeholder="Enter CTA subtitle"
                  className={cn(
                    inputStyles,
                    errors["cta.subtitle"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["cta.subtitle"] && <p className="text-sm text-destructive">{errors["cta.subtitle"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta.linkText" className="flex items-center gap-1">
                  Button Text <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="cta.linkText"
                  value={formData.cta.linkText}
                  onChange={(e) => handleChange("cta.linkText", e.target.value)}
                  placeholder="Enter button text"
                  className={cn(
                    inputStyles,
                    errors["cta.linkText"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["cta.linkText"] && <p className="text-sm text-destructive">{errors["cta.linkText"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta.linkUrl" className="flex items-center gap-1">
                  Button URL <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="cta.linkUrl"
                  value={formData.cta.linkUrl}
                  onChange={(e) => handleChange("cta.linkUrl", e.target.value)}
                  placeholder="Enter button URL"
                  className={cn(
                    inputStyles,
                    errors["cta.linkUrl"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                />
                {errors["cta.linkUrl"] && <p className="text-sm text-destructive">{errors["cta.linkUrl"]}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="cta.icon" className="flex items-center gap-1">
                  CTA Icon <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRefs.current["cta"]?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={(el) => {
                      fileInputRefs.current["cta"] = el!
                    }}
                    id="cta.icon"
                    type="file"
                    onChange={(e) => handleIconChange(e, "cta.icon", formData.cta.icon)}
                    className="hidden"
                    accept="image/jpeg, image/jpg, image/png, image/webp, image/gif, image/svg+xml"
                  />
                  {formData.cta.icon && !selectedIcons["cta.icon"] && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteIcon(formData.cta.icon, "cta.icon")
                      }}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Icon
                    </Button>
                  )}

                  {selectedIcons["cta.icon"] && (
                    <p className="text-sm text-muted-foreground">Selected: {selectedIcons["cta.icon"].file.name}</p>
                  )}
                </div>
                {errors["cta.icon"] && <p className="text-sm text-destructive">{errors["cta.icon"]}</p>}

                {(formData.cta.icon || iconPreviews["cta.icon"]) && (
                  <Card className={`mt-4 overflow-hidden w-24 h-24 relative ${cardStyles}`}>
                    <Image
                      src={
                        iconPreviews["cta.icon"]?.url ||
                        supabase.storage.from("feature-icons").getPublicUrl(formData.cta.icon).data.publicUrl ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="CTA icon"
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {selectedIcons["cta.icon"] ? "New" : "Current"}
                    </div>
                  </Card>
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
                Update Features Section
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

