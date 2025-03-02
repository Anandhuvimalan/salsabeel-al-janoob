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

type ProcessSection = {
  heading: string
  description: string
  buttonLink: string
  buttonText: string
}

type ProcessStep = {
  title: string
  description: string
  iconSrc: string
  hoverFrom: string
  hoverTo: string
  iconFrom: string
  iconTo: string
}

type ProcessData = {
  section: ProcessSection
  steps: ProcessStep[]
}

export default function ProcessForm() {
  const [formData, setFormData] = useState<ProcessData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Refs for file inputs (for step icon uploads)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetchProcessData()
  }, [])

  const fetchProcessData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/homepage/process")
      if (!res.ok) throw new Error("Failed to fetch process data")
      const data: ProcessData = await res.json()
      setFormData(data)
    } catch (error) {
      console.error("Error fetching process data:", error)
      setMessage({ text: "Failed to load process data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to update nested objects/arrays without losing array type.
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

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    if (!formData) return
    const updatedSteps = [...formData.steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setFormData({ ...formData, steps: updatedSteps })

    // Clear error for this field if it exists
    const errorKey = `steps.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addStep = () => {
    if (!formData) return
    const newStep: ProcessStep = {
      title: "New Step",
      description: "",
      iconSrc: "",
      hoverFrom: "",
      hoverTo: "",
      iconFrom: "",
      iconTo: "",
    }
    setFormData({ ...formData, steps: [...formData.steps, newStep] })
  }

  const removeStep = (index: number) => {
    if (!formData) return
    const updatedSteps = formData.steps.filter((_, i) => i !== index)
    setFormData({ ...formData, steps: updatedSteps })
  }

  const handleIconUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData()
    form.append("image", file)
    form.append("oldImagePath", oldPath)
    try {
      const res = await fetch("/api/homepage/process/upload", {
        method: "POST",
        body: form,
      })
      const { imagePath } = await res.json()
      const updatedSteps = [...formData!.steps]
      updatedSteps[index] = { ...updatedSteps[index], iconSrc: imagePath }
      setFormData({ ...formData!, steps: updatedSteps })
    } catch (error) {
      console.error("Icon upload failed:", error)
      setMessage({ text: "Icon upload failed. Please try again.", type: "error" })
    }
  }

  const handleDeleteIcon = async (index: number) => {
    if (!formData) return
    const iconPath = formData.steps[index].iconSrc
    if (!iconPath) return
    try {
      const res = await fetch("/api/homepage/process/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: iconPath }),
      })
      if (res.ok) {
        const updatedSteps = [...formData.steps]
        updatedSteps[index] = { ...updatedSteps[index], iconSrc: "" }
        setFormData({ ...formData, steps: updatedSteps })
      }
    } catch (error) {
      console.error("Icon deletion failed:", error)
      setMessage({ text: "Icon deletion failed. Please try again.", type: "error" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData) return false
    if (!formData.section.heading.trim()) {
      newErrors["section.heading"] = "Heading is required"
    }
    if (!formData.section.description.trim()) {
      newErrors["section.description"] = "Description is required"
    }
    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`steps.${index}.title`] = "Title is required"
      }
      if (!step.description.trim()) {
        newErrors[`steps.${index}.description`] = "Description is required"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      const res = await fetch("/api/homepage/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to save process data")
      setMessage({ text: "Process updated successfully!", type: "success" })
      await fetchProcessData()
    } catch (error) {
      console.error("Error saving process data:", error)
      setMessage({ text: "Failed to save process data. Please try again.", type: "error" })
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
        {/* Section Details */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Section Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section.heading" className="flex items-center gap-1">
                Heading <span className="text-destructive">*</span>
              </Label>
              <Input
                id="section.heading"
                value={formData.section.heading}
                onChange={(e) => handleTextChange("section.heading", e.target.value)}
                className={errors["section.heading"] ? "border-destructive" : ""}
                placeholder="Enter section heading"
              />
              {errors["section.heading"] && <p className="text-sm text-destructive">{errors["section.heading"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section.description" className="flex items-center gap-1">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="section.description"
                value={formData.section.description}
                onChange={(e) => handleTextChange("section.description", e.target.value)}
                className={errors["section.description"] ? "border-destructive" : ""}
                rows={3}
                placeholder="Enter section description"
              />
              {errors["section.description"] && (
                <p className="text-sm text-destructive">{errors["section.description"]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section.buttonText">Button Text</Label>
              <Input
                id="section.buttonText"
                value={formData.section.buttonText}
                onChange={(e) => handleTextChange("section.buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section.buttonLink">Button Link</Label>
              <Input
                id="section.buttonLink"
                value={formData.section.buttonLink}
                onChange={(e) => handleTextChange("section.buttonLink", e.target.value)}
                placeholder="Enter button link URL"
              />
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Process Steps</h2>
            <Button type="button" onClick={addStep} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>

          {formData.steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No steps added yet. Click the "Add Step" button to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.steps.map((step, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Step #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.title`} className="flex items-center gap-1">
                          Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`steps.${index}.title`}
                          value={step.title}
                          onChange={(e) => handleStepChange(index, "title", e.target.value)}
                          className={errors[`steps.${index}.title`] ? "border-destructive" : ""}
                          placeholder="Enter step title"
                        />
                        {errors[`steps.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`steps.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.description`} className="flex items-center gap-1">
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`steps.${index}.description`}
                          value={step.description}
                          onChange={(e) => handleStepChange(index, "description", e.target.value)}
                          className={errors[`steps.${index}.description`] ? "border-destructive" : ""}
                          rows={3}
                          placeholder="Enter step description"
                        />
                        {errors[`steps.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`steps.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.iconSrc`}>Icon</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            id={`steps.${index}.iconSrc`}
                            type="file"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                await handleIconUpload(e.target.files[0], index, step.iconSrc)
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                          {step.iconSrc && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteIcon(index)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Icon
                            </Button>
                          )}
                        </div>

                        {step.iconSrc && (
                          <Card className="mt-4 overflow-hidden w-16 h-16 relative">
                            <Image
                              src={step.iconSrc || "/placeholder.svg"}
                              alt="Step icon"
                              fill
                              className="object-cover"
                            />
                          </Card>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Hover Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`steps.${index}.hoverFrom`}>Hover From</Label>
                          <Input
                            id={`steps.${index}.hoverFrom`}
                            value={step.hoverFrom}
                            onChange={(e) => handleStepChange(index, "hoverFrom", e.target.value)}
                            placeholder="e.g. from-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`steps.${index}.hoverTo`}>Hover To</Label>
                          <Input
                            id={`steps.${index}.hoverTo`}
                            value={step.hoverTo}
                            onChange={(e) => handleStepChange(index, "hoverTo", e.target.value)}
                            placeholder="e.g. to-blue-700"
                          />
                        </div>
                      </div>

                      {/* Icon Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`steps.${index}.iconFrom`}>Icon From</Label>
                          <Input
                            id={`steps.${index}.iconFrom`}
                            value={step.iconFrom}
                            onChange={(e) => handleStepChange(index, "iconFrom", e.target.value)}
                            placeholder="e.g. from-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`steps.${index}.iconTo`}>Icon To</Label>
                          <Input
                            id={`steps.${index}.iconTo`}
                            value={step.iconTo}
                            onChange={(e) => handleStepChange(index, "iconTo", e.target.value)}
                            placeholder="e.g. to-blue-700"
                          />
                        </div>
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
                Update Process Section
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={fetchProcessData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

