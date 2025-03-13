"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, AlertCircle, CheckCircle2, Palette } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type Service = {
  id: number
  title: string
  image: string
  description: string
  gradient: string
}

type ServicesData = {
  sectionTitle: string
  services: Service[]
}

// Predefined gradient options
const gradientOptions = [
  { value: "from-blue-500 to-blue-700", label: "Blue" },
  { value: "from-purple-500 to-purple-700", label: "Purple" },
  { value: "from-green-500 to-green-700", label: "Green" },
  { value: "from-red-500 to-red-700", label: "Red" },
  { value: "from-yellow-500 to-yellow-700", label: "Yellow" },
  { value: "from-pink-500 to-pink-700", label: "Pink" },
  { value: "from-indigo-500 to-indigo-700", label: "Indigo" },
  { value: "from-teal-500 to-teal-700", label: "Teal" },
  { value: "from-orange-500 to-orange-700", label: "Orange" },
  { value: "from-gray-500 to-gray-700", label: "Gray" },
]

export default function ServicesSectionForm() {
  const [formData, setFormData] = useState<ServicesData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [recordId, setRecordId] = useState<number | null>(null)
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])

  // Create a ref array for file inputs.
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Fetch data on mount
  useEffect(() => {
    fetchServicesData()
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

  const fetchServicesData = async () => {
    setIsLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data, error } = await supabase
        .from("services_section")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(data.id)

      // Transform data from database format to component format
      const formattedData: ServicesData = {
        sectionTitle: data.section_title,
        services: data.services,
      }

      // Initialize image previews for existing images
      const previews: Record<string, string> = {}
      formattedData.services.forEach((service, index) => {
        if (service.image) {
          previews[`service_${index}`] = getImageUrl(service.image)
        }
      })

      setImagePreviews(previews)
      setFormData(formattedData)
    } catch (error) {
      console.error("Error fetching services data:", error)
      setMessage({ text: "Failed to load services data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setFormData({
        sectionTitle: "Our Services",
        services: [
          {
            id: 1,
            title: "Service 1",
            image: "",
            description: "Description for service 1",
            gradient: "from-blue-500 to-blue-700",
          },
        ],
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
    return supabase.storage.from("services-images").getPublicUrl(path).data.publicUrl
  }

  // Helper: Update nested object/array value without losing array types
  function updateNestedObject(obj: any, path: string[], value: any): any {
    if (path.length === 0) return value
    const [current, ...rest] = path
    const index = Number(current)
    if (!isNaN(index)) {
      // If the current path is numeric, treat the value as an array element.
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

  // Handle top-level text changes
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

  // Update a single service field
  const handleServiceChange = (index: number, field: string, value: string) => {
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

  // Add a new service (id is the increment of the last service's id)
  const addService = () => {
    if (!formData) return
    let newId = 1
    if (formData.services.length > 0) {
      newId = Math.max(...formData.services.map((service) => service.id)) + 1
    }
    const newService: Service = {
      id: newId,
      title: "New Service",
      image: "",
      description: "",
      gradient: "from-blue-500 to-blue-700",
    }
    setFormData({ ...formData, services: [...formData.services, newService] })
  }

  // Remove a service from the list
  const removeService = (index: number) => {
    if (!formData) return

    // If there's an image, mark it for deletion
    const service = formData.services[index]
    if (service.image && !service.image.startsWith("http") && !service.image.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, service.image])
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || !e.target.files[0] || !formData) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [`services.${index}.image`]: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        [`services.${index}.image`]: "File size exceeds 5MB limit.",
      }))
      return
    }

    // Check if there's an existing image to mark for deletion
    const currentImage = formData.services[index].image
    if (currentImage && !currentImage.startsWith("http") && !currentImage.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, currentImage])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [`service_${index}`]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [`service_${index}`]: previewUrl,
    }))

    // Clear any errors
    if (errors[`services.${index}.image`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`services.${index}.image`]
        return newErrors
      })
    }

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = (index: number) => {
    if (!formData) return

    // Mark the image for deletion if it's stored in Supabase
    const imagePath = formData.services[index].image
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, imagePath])
    }

    // Update service in formData
    const updatedServices = [...formData.services]
    updatedServices[index] = { ...updatedServices[index], image: "" }
    setFormData({ ...formData, services: updatedServices })

    // Remove preview
    if (imagePreviews[`service_${index}`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`service_${index}`]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[`service_${index}`]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[`service_${index}`]
      setSelectedFiles(newSelectedFiles)
    }
  }

  // Validate required fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.sectionTitle.trim()) {
      newErrors["sectionTitle"] = "Section title is required"
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
      // Extract index from key format "service_{index}"
      const index = Number.parseInt(key.split("_")[1])

      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `service-${index}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("services-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

      if (uploadError) throw uploadError

      return { index, fileName }
    })

    return Promise.all(uploads)
  }

  // Submit changes to the server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !validateForm()) {
      setMessage({ text: "Please fix the errors in the form", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Upload new images first
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedServices = [...formData.services]

      // Update the services with new image paths
      uploadResults.forEach(({ index, fileName }) => {
        updatedServices[index] = { ...updatedServices[index], image: fileName }
      })

      // Prepare data for Supabase in the format it expects
      const dataToUpdate = {
        section_title: formData.sectionTitle,
        services: updatedServices,
      }

      // Update the database
      let result
      if (recordId) {
        // Update existing record
        const { error } = await supabase.from("services_section").update(dataToUpdate).eq("id", recordId)
        if (error) throw error
      } else {
        // Insert new record if none exists
        const { data, error } = await supabase.from("services_section").insert(dataToUpdate).select()
        if (error) throw error
        if (data && data.length > 0) {
          setRecordId(data[0].id)
        }
      }

      // After successful update, delete old files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("services-images").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Services updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchServicesData()
    } catch (error) {
      console.error("Error saving services data:", error)
      setMessage({ text: "Failed to save services. Please try again.", type: "error" })
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Title */}
        <div className="space-y-2">
          <Label htmlFor="sectionTitle" className="flex items-center gap-1">
            Section Title <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="sectionTitle"
            value={formData.sectionTitle}
            onChange={(e) => handleTextChange("sectionTitle", e.target.value)}
            className={cn(inputStyles, errors["sectionTitle"] && "!border-destructive focus-visible:!ring-destructive")}
            placeholder="Enter section title"
          />
          {errors["sectionTitle"] && <p className="text-sm text-destructive">{errors["sectionTitle"]}</p>}
        </div>

        {/* Services List */}
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
                            errors[`services.${index}.title`] && "!border-destructive focus-visible:!ring-destructive",
                          )}
                          placeholder="Enter service title"
                        />
                        {errors[`services.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`services.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`services.${index}.gradient`} className="flex items-center">
                          Gradient <Palette className="h-4 w-4 ml-1 text-muted-foreground" />
                        </Label>
                        <Select
                          value={service.gradient}
                          onValueChange={(value) => handleServiceChange(index, "gradient", value)}
                        >
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder="Select a gradient" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradientOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full mr-2 bg-gradient-to-r ${option.value}`} />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className={`h-6 w-full rounded-md mt-1 bg-gradient-to-r ${service.gradient}`}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`services.${index}.description`} className="flex items-center gap-1">
                          Description <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Textarea
                          id={`services.${index}.description`}
                          value={service.description}
                          onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                          rows={4}
                          className={cn(
                            inputStyles,
                            errors[`services.${index}.description`] &&
                              "!border-destructive focus-visible:!ring-destructive",
                            "resize-y min-h-[100px] !h-auto",
                          )}
                          style={{ resize: "vertical" }}
                          placeholder="Enter service description"
                        />
                        {errors[`services.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`services.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`services.${index}.image`}>Service Image</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            id={`services.${index}.image`}
                            type="file"
                            onChange={(e) => handleFileSelect(e, index)}
                            className="hidden"
                            accept="image/*"
                          />
                          {(service.image || selectedFiles[`service_${index}`]) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteImage(index)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Image
                            </Button>
                          )}
                        </div>
                        {errors[`services.${index}.image`] && (
                          <p className="text-sm text-destructive">{errors[`services.${index}.image`]}</p>
                        )}

                        {(service.image || imagePreviews[`service_${index}`]) && (
                          <Card className={`mt-4 overflow-hidden w-32 h-32 relative ${cardStyles}`}>
                            <Image
                              src={
                                imagePreviews[`service_${index || "/placeholder.svg"}`] ||
                                getImageUrl(service.image) ||
                                "/placeholder.svg"
                              }
                              alt="Service image"
                              fill
                              className="object-cover"
                            />
                          </Card>
                        )}
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
                Update Services Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchServicesData}
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

