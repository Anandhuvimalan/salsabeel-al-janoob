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

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/homepage/section2/features")
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()

      const initialPreviews: Record<string, IconPreview> = {}

      data.features.forEach((feature: Feature, index: number) => {
        if (feature.icon) {
          initialPreviews[`features.${index}.icon`] = {
            url: `/icons/${feature.icon.split("/").pop()}`,
            isNew: false,
          }
        }
      })

      if (data.cta.icon) {
        initialPreviews["cta.icon"] = {
          url: `/icons/${data.cta.icon.split("/").pop()}`,
          isNew: false,
        }
      }

      setIconPreviews(initialPreviews)
      setFormData(data)
    } catch (error) {
      setMessage({ text: "Failed to load features data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteIcon = async (iconPath: string) => {
    try {
      const res = await fetch("/api/homepage/section2/deleteIcon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iconPath }),
      })

      if (!res.ok) throw new Error("Failed to delete icon")
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

      const previewUrl = URL.createObjectURL(file)

      setSelectedIcons((prev) => ({
        ...prev,
        [path]: {
          file,
          oldPath: currentIcon,
        },
      }))

      setIconPreviews((prev) => ({
        ...prev,
        [path]: { url: previewUrl, isNew: true },
      }))

      // Clear error for this field if it exists
      if (errors[path]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[path]
          return newErrors
        })
      }
    }
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
      const success = await deleteIcon(feature.icon)
      if (!success) return
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
      const uploads = Object.entries(selectedIcons).map(async ([path, { file, oldPath }]) => {
        const formData = new FormData()
        formData.append("icon", file)
        formData.append("path", path)
        formData.append("oldIconPath", oldPath)

        const res = await fetch("/api/homepage/section2/uploadIcon", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Icon upload failed")
        }

        return res.json()
      })

      const uploadResults = await Promise.all(uploads)
      const updatedData = { ...formData }

      uploadResults.forEach(({ path, iconPath }) => {
        const keys = path.split(".")
        let current: any = updatedData
        keys.forEach((key: string | number, i: number) => {
          if (i === keys.length - 1) current[key] = iconPath
          else current = current[key]
        })
      })

      const res = await fetch("/api/homepage/section2/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update features data")
      }

      setMessage({ text: "Features section updated successfully!", type: "success" })
      setSelectedIcons({})
      await fetchData()
    } catch (error: any) {
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-32 w-full" />
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
        {/* Section Heading */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Section Heading</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heading.title" className="flex items-center gap-1">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="heading.title"
                value={formData.heading.title}
                onChange={(e) => handleChange("heading.title", e.target.value)}
                placeholder="Enter section title"
                className={errors["heading.title"] ? "border-destructive" : ""}
              />
              {errors["heading.title"] && <p className="text-sm text-destructive">{errors["heading.title"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading.subtitle" className="flex items-center gap-1">
                Subtitle <span className="text-destructive">*</span>
              </Label>
              <Input
                id="heading.subtitle"
                value={formData.heading.subtitle}
                onChange={(e) => handleChange("heading.subtitle", e.target.value)}
                placeholder="Enter section subtitle"
                className={errors["heading.subtitle"] ? "border-destructive" : ""}
              />
              {errors["heading.subtitle"] && <p className="text-sm text-destructive">{errors["heading.subtitle"]}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Features</h2>
            <Button type="button" onClick={addFeature} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Feature
            </Button>
          </div>

          {formData.features.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No features added yet. Click the "Add Feature" button to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-6 border rounded-lg">
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
                          Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`features.${index}.title`}
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                          placeholder="Enter feature title"
                          className={errors[`features.${index}.title`] ? "border-destructive" : ""}
                        />
                        {errors[`features.${index}.title`] && (
                          <p className="text-sm text-destructive">{errors[`features.${index}.title`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`features.${index}.icon`} className="flex items-center gap-1">
                          Icon <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRefs.current[`feature-${index}`]?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <input
                            ref={(el) => { fileInputRefs.current[`feature-${index}`] = el!; }}
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
                                const success = await deleteIcon(feature.icon)
                                if (success) {
                                  handleFeatureChange(index, "icon", "")
                                  const newPreviews = { ...iconPreviews }
                                  delete newPreviews[`features.${index}.icon`]
                                  setIconPreviews(newPreviews)
                                }
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
                          <Card className="mt-4 overflow-hidden w-24 h-24 relative">
                            <Image
                              src={
                                iconPreviews[`features.${index || "/placeholder.svg"}.icon`]?.url ||
                                `/icons/${feature.icon.split("/").pop()}`
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
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`features.${index}.description`}
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                          rows={3}
                          placeholder="Enter feature description"
                          className={errors[`features.${index}.description`] ? "border-destructive" : ""}
                        />
                        {errors[`features.${index}.description`] && (
                          <p className="text-sm text-destructive">{errors[`features.${index}.description`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          Feature Points <span className="text-destructive">*</span>
                        </Label>
                        <div className="space-y-3">
                          {feature.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center gap-2">
                              <Input
                                value={detail}
                                onChange={(e) => handleDetailChange(index, detailIndex, e.target.value)}
                                placeholder="Enter feature point"
                                className={
                                  errors[`features.${index}.details.${detailIndex}`] ? "border-destructive" : ""
                                }
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeDetail(index, detailIndex)}
                                disabled={feature.details.length <= 1}
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
                            className="gap-2"
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
        </div>

        {/* CTA Section */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Call to Action</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta.title" className="flex items-center gap-1">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cta.title"
                value={formData.cta.title}
                onChange={(e) => handleChange("cta.title", e.target.value)}
                placeholder="Enter CTA title"
                className={errors["cta.title"] ? "border-destructive" : ""}
              />
              {errors["cta.title"] && <p className="text-sm text-destructive">{errors["cta.title"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta.subtitle" className="flex items-center gap-1">
                Subtitle <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cta.subtitle"
                value={formData.cta.subtitle}
                onChange={(e) => handleChange("cta.subtitle", e.target.value)}
                placeholder="Enter CTA subtitle"
                className={errors["cta.subtitle"] ? "border-destructive" : ""}
              />
              {errors["cta.subtitle"] && <p className="text-sm text-destructive">{errors["cta.subtitle"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta.linkText" className="flex items-center gap-1">
                Button Text <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cta.linkText"
                value={formData.cta.linkText}
                onChange={(e) => handleChange("cta.linkText", e.target.value)}
                placeholder="Enter button text"
                className={errors["cta.linkText"] ? "border-destructive" : ""}
              />
              {errors["cta.linkText"] && <p className="text-sm text-destructive">{errors["cta.linkText"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta.linkUrl" className="flex items-center gap-1">
                Button URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cta.linkUrl"
                value={formData.cta.linkUrl}
                onChange={(e) => handleChange("cta.linkUrl", e.target.value)}
                placeholder="Enter button URL"
                className={errors["cta.linkUrl"] ? "border-destructive" : ""}
              />
              {errors["cta.linkUrl"] && <p className="text-sm text-destructive">{errors["cta.linkUrl"]}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="cta.icon" className="flex items-center gap-1">
                CTA Icon <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRefs.current["cta"]?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
                <input
                  ref={(el) => { fileInputRefs.current["cta"] = el!; }}
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
                      const success = await deleteIcon(formData.cta.icon)
                      if (success) {
                        handleChange("cta.icon", "")
                        const newPreviews = { ...iconPreviews }
                        delete newPreviews["cta.icon"]
                        setIconPreviews(newPreviews)
                      }
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
                <Card className="mt-4 overflow-hidden w-24 h-24 relative">
                  <Image
                    src={iconPreviews["cta.icon"]?.url || `/icons/${formData.cta.icon.split("/").pop()}`}
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
                Update Features Section
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={fetchData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

