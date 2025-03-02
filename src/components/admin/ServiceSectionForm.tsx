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

export default function ServicesSectionForm() {
  const [formData, setFormData] = useState<ServicesData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Create a ref array for file inputs.
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Fetch data on mount
  useEffect(() => {
    fetchServicesData()
  }, [])

  const fetchServicesData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/homepage/services")
      if (!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json()
      setFormData(data)
    } catch (error) {
      console.error("Error fetching services data:", error)
      setMessage({ text: "Failed to load services data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
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
      gradient: "from-gray-500 to-gray-700",
    }
    setFormData({ ...formData, services: [...formData.services, newService] })
  }

  // Remove a service from the list
  const removeService = (index: number) => {
    if (!formData) return
    const updatedServices = formData.services.filter((_, i) => i !== index)
    setFormData({ ...formData, services: updatedServices })
  }

  // Handle image upload for a given service
  const handleImageUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData()
    form.append("image", file)
    form.append("oldImagePath", oldPath)
    try {
      const res = await fetch("/api/homepage/services/upload", {
        method: "POST",
        body: form,
      })
      const { imagePath } = await res.json()
      const updatedServices = [...formData!.services]
      updatedServices[index] = { ...updatedServices[index], image: imagePath }
      setFormData({ ...formData!, services: updatedServices })
    } catch (error) {
      console.error("Image upload failed:", error)
      setMessage({ text: "Image upload failed. Please try again.", type: "error" })
    }
  }

  // Delete the image of a given service
  const handleDeleteImage = async (index: number) => {
    if (!formData) return
    const imagePath = formData.services[index].image
    if (!imagePath) return
    try {
      const res = await fetch("/api/homepage/services/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      })
      if (res.ok) {
        const updatedServices = [...formData.services]
        updatedServices[index] = { ...updatedServices[index], image: "" }
        setFormData({ ...formData, services: updatedServices })
      }
    } catch (error) {
      console.error("Delete image failed:", error)
      setMessage({ text: "Delete image failed. Please try again.", type: "error" })
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
      const res = await fetch("/api/homepage/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to save data")
      setMessage({ text: "Services updated successfully!", type: "success" })
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
        {/* Section Title */}
        <div className="space-y-2">
          <Label htmlFor="sectionTitle" className="flex items-center gap-1">
            Section Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sectionTitle"
            value={formData.sectionTitle}
            onChange={(e) => handleTextChange("sectionTitle", e.target.value)}
            className={errors["sectionTitle"] ? "border-destructive" : ""}
            placeholder="Enter section title"
          />
          {errors["sectionTitle"] && <p className="text-sm text-destructive">{errors["sectionTitle"]}</p>}
        </div>

        {/* Services List */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Services</h2>
            <Button type="button" onClick={addService} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          {formData.services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No services added yet. Click the "Add Service" button to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.services.map((service, index) => (
                <div key={index} className="p-6 border rounded-lg">
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
                          Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`services.${index}.title`}
                          value={service.title}
                          onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                          className={errors[`services.${index}.title`] ? "border-destructive" : ""}
                          placeholder="Enter service title"
                        />
                        {errors[`services.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`services.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`services.${index}.gradient`}>Gradient</Label>
                        <Input
                          id={`services.${index}.gradient`}
                          value={service.gradient}
                          onChange={(e) => handleServiceChange(index, "gradient", e.target.value)}
                          placeholder="e.g. from-blue-500 to-blue-700"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tailwind CSS gradient classes (e.g. from-blue-500 to-blue-700)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`services.${index}.description`} className="flex items-center gap-1">
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`services.${index}.description`}
                          value={service.description}
                          onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                          rows={3}
                          className={errors[`services.${index}.description`] ? "border-destructive" : ""}
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
                            variant="secondary"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            id={`services.${index}.image`}
                            type="file"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                await handleImageUpload(e.target.files[0], index, service.image)
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                          {service.image && (
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

                        {service.image && (
                          <Card className="mt-4 overflow-hidden w-32 h-32 relative">
                            <Image
                              src={service.image || "/placeholder.svg"}
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
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 border-t">
          <Button type="submit" disabled={isSaving} className="gap-2">
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

          <Button type="button" variant="outline" onClick={fetchServicesData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

