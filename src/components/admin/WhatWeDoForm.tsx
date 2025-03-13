"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, AlertCircle, CheckCircle2, Minus } from "lucide-react"
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

type SectionData = {
  badge: string
  heading: string
  description: string
  icons: {
    arrowRight: string
  }
}

type Service = {
  iconSrc: string
  title: string
  description: string
  features: string[]
}

type WhatWeDoData = {
  section: SectionData
  services: Service[]
}

export default function WhatWeDoForm() {
  const [formData, setFormData] = useState<WhatWeDoData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("section")

  // Refs for file inputs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const arrowIconInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetchWhatWeDoData()
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

  const fetchWhatWeDoData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("whatwedo_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Initialize image previews for existing icons
      const previews: Record<string, string> = {}

      // Arrow icon
      if (data.section.icons.arrowRight) {
        previews["arrowIcon"] = getIconUrl(data.section.icons.arrowRight)
      }

      // Service icons
      data.services.forEach((service: Service, index: number) => {
        if (service.iconSrc) {
          previews[`service_${index}`] = getIconUrl(service.iconSrc)
        }
      })

      setImagePreviews(previews)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching what we do data:", error)
      setMessage({ text: "Failed to load data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        section: {
          badge: "SERVICES",
          heading: "What We Do",
          description: "We offer a range of specialized services to meet your business needs.",
          icons: {
            arrowRight: "",
          },
        },
        services: [
          {
            iconSrc: "",
            title: "Service 1",
            description: "Description of service 1",
            features: ["Feature 1", "Feature 2"],
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
    return supabase.storage.from("whatwedo-icons").getPublicUrl(path).data.publicUrl
  }

  // Helper: update nested objects/arrays without losing array type.
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

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return
    setFormData((prev) => updateNestedObject(prev, path.split("."), value))

    // Clear error for this field if it exists
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[path]
        return newErrors
      })
    }
  }

  // Service fields
  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    if (!formData) return
    const updatedServices = [...formData.services]
    updatedServices[index] = { ...updatedServices[index], [field]: value }
    setFormData({ ...formData, services: updatedServices })

    // Clear error for this field if it exists
    const errorKey = `services.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
    if (!formData) return
    const updatedServices = [...formData.services]
    const features = [...updatedServices[serviceIndex].features]
    features[featureIndex] = value
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features }
    setFormData({ ...formData, services: updatedServices })
  }

  const addFeature = (serviceIndex: number) => {
    if (!formData) return
    const updatedServices = [...formData.services]
    const features = [...updatedServices[serviceIndex].features, "New feature"]
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features }
    setFormData({ ...formData, services: updatedServices })
  }

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    if (!formData) return
    const updatedServices = [...formData.services]
    const features = updatedServices[serviceIndex].features.filter((_, i) => i !== featureIndex)
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features }
    setFormData({ ...formData, services: updatedServices })
  }

  const addService = () => {
    if (!formData) return
    const newService: Service = {
      iconSrc: "",
      title: "New Service",
      description: "",
      features: ["New feature"],
    }
    setFormData({ ...formData, services: [...formData.services, newService] })
  }

  const removeService = (index: number) => {
    if (!formData) return

    // If there's an icon, mark it for deletion
    const service = formData.services[index]
    if (service.iconSrc && !service.iconSrc.startsWith("http") && !service.iconSrc.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, service.iconSrc])
    }

    const updatedServices = formData.services.filter((_, i) => i !== index)
    setFormData({ ...formData, services: updatedServices })

    // Clean up any preview
    if (imagePreviews[`service_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`service_${index}`]
      setImagePreviews(newPreviews)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [key]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing icon to mark for deletion
    if (key === "arrowIcon") {
      const currentIcon = formData.section.icons.arrowRight
      if (currentIcon && !currentIcon.startsWith("http") && !currentIcon.startsWith("/")) {
        setFilesToDelete((prev) => [...prev, currentIcon])
      }
    } else if (key.startsWith("service_")) {
      const serviceIndex = Number.parseInt(key.split("_")[1])
      const currentIcon = formData.services[serviceIndex].iconSrc
      if (currentIcon && !currentIcon.startsWith("http") && !currentIcon.startsWith("/")) {
        setFilesToDelete((prev) => [...prev, currentIcon])
      }
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [key]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [key]: previewUrl,
    }))

    // Clear any errors
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteIcon = (key: string) => {
    if (!formData) return

    // Mark the icon for deletion if it's stored in Supabase
    if (key === "arrowIcon") {
      const iconPath = formData.section.icons.arrowRight
      if (iconPath && !iconPath.startsWith("http") && !iconPath.startsWith("/")) {
        setFilesToDelete((prev) => [...prev, iconPath])
      }

      // Update formData
      setFormData({
        ...formData,
        section: {
          ...formData.section,
          icons: {
            ...formData.section.icons,
            arrowRight: "",
          },
        },
      })
    } else if (key.startsWith("service_")) {
      const serviceIndex = Number.parseInt(key.split("_")[1])
      const iconPath = formData.services[serviceIndex].iconSrc
      if (iconPath && !iconPath.startsWith("http") && !iconPath.startsWith("/")) {
        setFilesToDelete((prev) => [...prev, iconPath])
      }

      // Update service in formData
      const updatedServices = [...formData.services]
      updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], iconSrc: "" }
      setFormData({ ...formData, services: updatedServices })
    }

    // Remove preview
    if (imagePreviews[key]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[key]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[key]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[key]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.section.badge.trim()) {
      newErrors["section.badge"] = "Badge is required"
    }
    if (!formData.section.heading.trim()) {
      newErrors["section.heading"] = "Heading is required"
    }
    if (!formData.section.description.trim()) {
      newErrors["section.description"] = "Description is required"
    }
    formData.services.forEach((service, index) => {
      if (!service.title.trim()) {
        newErrors[`services.${index}.title`] = "Title is required"
      }
      if (!service.description.trim()) {
        newErrors[`services.${index}.description`] = "Description is required"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([key, file]) => {
      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `${key.replace("_", "-")}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("whatwedo-icons").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

      if (uploadError) throw uploadError

      return { key, fileName }
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
      // Upload new icons first
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedFormData = { ...formData }

      // Update the data with new file paths
      uploadResults.forEach(({ key, fileName }) => {
        if (key === "arrowIcon") {
          updatedFormData.section.icons.arrowRight = fileName
        } else if (key.startsWith("service_")) {
          const serviceIndex = Number.parseInt(key.split("_")[1])
          updatedFormData.services[serviceIndex].iconSrc = fileName
        }
      })

      // Update the database
      let result
      if (recordId) {
        // Update existing record
        const { error } = await supabase
          .from("whatwedo_section")
          .update({
            section: updatedFormData.section,
            services: updatedFormData.services,
          })
          .eq("id", recordId)

        if (error) throw error
      } else {
        // Insert new record if none exists
        const { data, error } = await supabase
          .from("whatwedo_section")
          .insert({
            section: updatedFormData.section,
            services: updatedFormData.services,
          })
          .select()

        if (error) throw error
        if (data && data.length > 0) {
          setRecordId(data[0].id)
        }
      }

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("whatwedo-icons").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "What We Do section updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchWhatWeDoData()
    } catch (error) {
      console.error("Error saving what we do data:", error)
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
              onClick={() => setActiveTab("services")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "services"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Services
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
                <Label htmlFor="section.badge" className="flex items-center gap-1">
                  Badge <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="section.badge"
                  value={formData.section.badge}
                  onChange={(e) => handleTextChange("section.badge", e.target.value)}
                  className={cn(
                    inputStyles,
                    errors["section.badge"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                  placeholder="Enter badge text"
                />
                {errors["section.badge"] && <p className="text-sm text-destructive">{errors["section.badge"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section.heading" className="flex items-center gap-1">
                  Heading <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="section.heading"
                  value={formData.section.heading}
                  onChange={(e) => handleTextChange("section.heading", e.target.value)}
                  className={cn(
                    inputStyles,
                    errors["section.heading"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                  placeholder="Enter section heading"
                />
                {errors["section.heading"] && <p className="text-sm text-destructive">{errors["section.heading"]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section.description" className="flex items-center gap-1">
                Description <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="section.description"
                value={formData.section.description}
                onChange={(e) => handleTextChange("section.description", e.target.value)}
                className={cn(
                  inputStyles,
                  errors["section.description"] && "!border-destructive focus-visible:!ring-destructive",
                  "resize-y min-h-[100px] !h-auto",
                )}
                style={{ resize: "vertical" }}
                rows={3}
                placeholder="Enter section description"
              />
              {errors["section.description"] && (
                <p className="text-sm text-destructive">{errors["section.description"]}</p>
              )}
            </div>

            {/* Arrow Icon Upload */}
            <div className="space-y-2">
              <Label htmlFor="section.icons.arrowRight">Arrow Icon</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => arrowIconInputRef.current?.click()}
                  className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
                <input
                  ref={arrowIconInputRef}
                  id="section.icons.arrowRight"
                  type="file"
                  onChange={(e) => handleFileSelect(e, "arrowIcon")}
                  className="hidden"
                  accept="image/*"
                />
                {(formData.section.icons.arrowRight || selectedFiles["arrowIcon"]) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteIcon("arrowIcon")}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Icon
                  </Button>
                )}
              </div>
              {(formData.section.icons.arrowRight || imagePreviews["arrowIcon"]) && (
                <Card className={`mt-4 overflow-hidden w-16 h-16 relative ${cardStyles}`}>
                  <Image
                    src={imagePreviews["arrowIcon"] || getIconUrl(formData.section.icons.arrowRight)}
                    alt="Arrow Icon"
                    fill
                    className="object-contain p-2"
                  />
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Services */}
        {activeTab === "services" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Services</h2>
            </div>

            {formData.services.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No services added yet. Click the "Add Service" button to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.services.map((service, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Service #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`services.${index}.title`} className="flex items-center gap-1">
                            Title <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Input
                            id={`services.${index}.title`}
                            value={service.title}
                            onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                            className={cn(
                              inputStyles,
                              errors[`services.${index}.title`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                            )}
                            placeholder="Enter service title"
                          />
                          {errors[`services.${index}.title`] && (
                            <p className="text-sm text-destructive">{errors[`services.${index}.title`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`services.${index}.description`} className="flex items-center gap-1">
                            Description <span className="text-destructive ml-1">*</span>
                          </Label>
                          <Textarea
                            id={`services.${index}.description`}
                            value={service.description}
                            onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                            className={cn(
                              inputStyles,
                              errors[`services.${index}.description`] &&
                                "!border-destructive focus-visible:!ring-destructive",
                              "resize-y min-h-[100px] !h-auto",
                            )}
                            style={{ resize: "vertical" }}
                            rows={3}
                            placeholder="Enter service description"
                          />
                          {errors[`services.${index}.description`] && (
                            <p className="text-sm text-destructive">{errors[`services.${index}.description`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`services.${index}.iconSrc`}>Icon</Label>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRefs.current[index]?.click()}
                              className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                            >
                              <Upload className="h-4 w-4" />
                              Choose File
                            </Button>
                            <input
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              id={`services.${index}.iconSrc`}
                              type="file"
                              onChange={(e) => handleFileSelect(e, `service_${index}`)}
                              className="hidden"
                              accept="image/*"
                            />
                            {(service.iconSrc || selectedFiles[`service_${index}`]) && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteIcon(`service_${index}`)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove Icon
                              </Button>
                            )}
                          </div>
                          {(service.iconSrc || imagePreviews[`service_${index}`]) && (
                            <Card className={`mt-4 overflow-hidden w-16 h-16 relative ${cardStyles}`}>
                              <Image
                                src={
                                  imagePreviews[`service_${index || "/placeholder.svg"}`] || getIconUrl(service.iconSrc)
                                }
                                alt="Service icon"
                                fill
                                className="object-contain p-2"
                              />
                            </Card>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Features */}
                        <div className="space-y-2">
                          <Label>Features</Label>
                          {service.features.map((feature, featIndex) => (
                            <div key={featIndex} className="flex items-center mb-2">
                              <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, featIndex, e.target.value)}
                                className={inputStyles}
                                placeholder="Enter feature"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFeature(index, featIndex)}
                                disabled={service.features.length <= 1}
                                className={`ml-2 bg-background/30 hover:bg-background/50 text-foreground ${buttonStyles}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addFeature(index)}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Plus className="h-4 w-4" />
                            Add Feature
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Service button at the bottom right */}
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                onClick={addService}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
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
                Update What We Do Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchWhatWeDoData}
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

