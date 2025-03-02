"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trash2, Upload, RefreshCw, Save, Plus, Minus, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AboutSectionData = {
  hero: {
    title: {
      highlight: string
      subtitle: string
    }
    description: string[]
    button: {
      text: string
    }
    image: {
      src: string
      alt: string
    }
    imageOverlay: {
      text: string
      icon: string
    }
  }
  achievements: {
    value: number
    suffix: string
    label: string
    color: string
  }[]
  values: {
    title: string
    items: {
      icon: string
      title: string
      description: string
      iconColor: string
    }[]
    image: {
      src: string
      alt: string
    }
  }
}

export default function AboutSectionForm() {
  const [formData, setFormData] = useState<AboutSectionData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const heroIconFileInputRef = useRef<HTMLInputElement>(null)
  const valuesFileInputRef = useRef<HTMLInputElement>(null)
  const valueIconFileInputRefs = useRef<Record<string, HTMLInputElement>>({})

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/homepage/about")
      if (!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json()
      setFormData(data)
    } catch (error) {
      console.error("Error fetching about data:", error)
      setMessage({ text: "Failed to load about section data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return

    setFormData((prev) => ({
      ...prev!,
      ...updateNestedObject(prev!, path.split("."), value),
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

  const handleAchievementChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev
      const updated = [...prev.achievements]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, achievements: updated }
    })

    // Clear error for this field if it exists
    const errorKey = `achievements.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addAchievement = () => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        achievements: [
          ...prev.achievements,
          { value: 0, suffix: "+", label: "New Achievement", color: "text-blue-600" },
        ],
      }
    })
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index),
      }
    })
  }

  const handleImageUpload = async (file: File, field: "hero" | "values", oldPath: string) => {
    const form = new FormData()
    form.append("image", file)
    form.append("oldImagePath", oldPath)

    try {
      const res = await fetch(`/api/homepage/about/upload?field=${field}`, {
        method: "POST",
        body: form,
      })

      const { imagePath } = await res.json()

      setFormData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          [field]: {
            ...prev[field],
            image: { ...prev[field].image, src: imagePath },
          },
        }
      })

      // Clear error for this field if it exists
      if (errors[`${field}.image`]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[`${field}.image`]
          return newErrors
        })
      }
    } catch (error) {
      setMessage({ text: "Image upload failed. Please try again.", type: "error" })
    }
  }

  const handleIconUpload = async (file: File, oldPath: string) => {
    const form = new FormData()
    form.append("image", file)
    form.append("oldImagePath", oldPath)

    try {
      const res = await fetch("/api/homepage/about/upload?field=icon", {
        method: "POST",
        body: form,
      })

      const { imagePath } = await res.json()

      setFormData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          hero: {
            ...prev.hero,
            imageOverlay: { ...prev.hero.imageOverlay, icon: imagePath },
          },
        }
      })
    } catch (error) {
      setMessage({ text: "Icon upload failed. Please try again.", type: "error" })
    }
  }

  const handleDeleteImage = async (field: "hero" | "values") => {
    if (!formData) return

    const imagePath = formData[field].image.src
    if (!imagePath) return

    try {
      const res = await fetch("/api/homepage/about/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      })

      if (res.ok) {
        setFormData((prev) => ({
          ...prev!,
          [field]: {
            ...prev![field],
            image: { ...prev![field].image, src: "" },
          },
        }))
      }
    } catch (error) {
      console.error("Delete failed:", error)
      setMessage({ text: "Failed to delete image. Please try again.", type: "error" })
    }
  }

  const handleDeleteIcon = async () => {
    if (!formData?.hero.imageOverlay.icon) return

    try {
      const res = await fetch("/api/homepage/about/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: formData.hero.imageOverlay.icon }),
      })

      if (res.ok) {
        setFormData((prev) => ({
          ...prev!,
          hero: {
            ...prev!.hero,
            imageOverlay: { ...prev!.hero.imageOverlay, icon: "" },
          },
        }))
      }
    } catch (error) {
      console.error("Icon delete failed:", error)
      setMessage({ text: "Failed to delete icon. Please try again.", type: "error" })
    }
  }

  const handleValueIconUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData()
    form.append("image", file)
    form.append("oldImagePath", oldPath)

    try {
      const res = await fetch("/api/homepage/about/upload?field=icon", {
        method: "POST",
        body: form,
      })
      const { imagePath } = await res.json()

      setFormData((prev) => {
        if (!prev) return prev
        const updatedItems = [...prev.values.items]
        updatedItems[index] = { ...updatedItems[index], icon: imagePath }
        return {
          ...prev,
          values: {
            ...prev.values,
            items: updatedItems,
          },
        }
      })
    } catch (error) {
      setMessage({ text: "Icon upload failed. Please try again.", type: "error" })
    }
  }

  const handleValueIconDelete = async (index: number) => {
    if (!formData) return
    const imagePath = formData.values.items[index].icon
    if (!imagePath) return

    try {
      const res = await fetch("/api/homepage/about/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      })

      if (res.ok) {
        setFormData((prev) => {
          if (!prev) return prev
          const updatedItems = [...prev.values.items]
          updatedItems[index] = { ...updatedItems[index], icon: "" }
          return {
            ...prev,
            values: {
              ...prev.values,
              items: updatedItems,
            },
          }
        })
      }
    } catch (error) {
      console.error("Value icon delete failed:", error)
      setMessage({ text: "Failed to delete icon. Please try again.", type: "error" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData) return false

    // Hero Section Validation
    if (!formData.hero.title.highlight.trim()) newErrors["hero.title.highlight"] = "Highlighted title is required"
    if (!formData.hero.title.subtitle.trim()) newErrors["hero.title.subtitle"] = "Subtitle is required"
    if (!formData.hero.image.src) newErrors["hero.image"] = "Hero image is required"
    formData.hero.description.forEach((para, index) => {
      if (!para.trim()) newErrors[`hero.description.${index}`] = "Description paragraph is required"
    })

    // Achievements Validation
    formData.achievements.forEach((achievement, index) => {
      if (!achievement.label.trim()) newErrors[`achievements.${index}.label`] = "Label is required"
      if (isNaN(achievement.value)) newErrors[`achievements.${index}.value`] = "Value must be a number"
    })

    // Values Validation
    if (!formData.values.title.trim()) newErrors["values.title"] = "Values title is required"
    formData.values.items.forEach((item, index) => {
      if (!item.title.trim()) newErrors[`values.items.${index}.title`] = "Value title is required"
      if (!item.description.trim()) newErrors[`values.items.${index}.description`] = "Value description is required"
    })
    if (!formData.values.image.src) newErrors["values.image"] = "Values image is required"

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
      const res = await fetch("/api/homepage/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save data")

      setMessage({ text: "About section updated successfully!", type: "success" })
      await fetchAboutData()
    } catch (error) {
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
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
        {/* Hero Section */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Hero Section</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero.title.highlight" className="flex items-center gap-1">
                  Highlighted Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hero.title.highlight"
                  value={formData.hero.title.highlight}
                  onChange={(e) => handleTextChange("hero.title.highlight", e.target.value)}
                  className={errors["hero.title.highlight"] ? "border-destructive" : ""}
                  placeholder="Enter highlighted title"
                />
                {errors["hero.title.highlight"] && (
                  <p className="text-sm text-destructive">{errors["hero.title.highlight"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero.title.subtitle" className="flex items-center gap-1">
                  Subtitle <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hero.title.subtitle"
                  value={formData.hero.title.subtitle}
                  onChange={(e) => handleTextChange("hero.title.subtitle", e.target.value)}
                  className={errors["hero.title.subtitle"] ? "border-destructive" : ""}
                  placeholder="Enter subtitle"
                />
                {errors["hero.title.subtitle"] && (
                  <p className="text-sm text-destructive">{errors["hero.title.subtitle"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Description <span className="text-destructive">*</span>
                </Label>
                {formData.hero.description.map((para, index) => (
                  <div key={index} className="mb-4">
                    <Textarea
                      value={para}
                      onChange={(e) => handleTextChange(`hero.description.${index}`, e.target.value)}
                      className={errors[`hero.description.${index}`] ? "border-destructive" : ""}
                      rows={3}
                      placeholder="Enter description paragraph"
                    />
                    {errors[`hero.description.${index}`] && (
                      <p className="text-sm text-destructive">{errors[`hero.description.${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero.button.text">Button Text</Label>
                <Input
                  id="hero.button.text"
                  value={formData.hero.button.text}
                  onChange={(e) => handleTextChange("hero.button.text", e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero.image" className="flex items-center gap-1">
                  Hero Image <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={heroFileInputRef}
                    id="hero.image"
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await handleImageUpload(e.target.files[0], "hero", formData.hero.image.src)
                      }
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  {formData.hero.image.src && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage("hero")}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
                {errors["hero.image"] && <p className="text-sm text-destructive">{errors["hero.image"]}</p>}

                {formData.hero.image.src && (
                  <Card className="mt-4 overflow-hidden aspect-video relative">
                    <Image
                      src={formData.hero.image.src || "/placeholder.svg"}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                    />
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero.imageOverlay.icon">Overlay Icon</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => heroIconFileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={heroIconFileInputRef}
                    id="hero.imageOverlay.icon"
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await handleIconUpload(e.target.files[0], formData.hero.imageOverlay.icon)
                      }
                    }}
                    className="hidden"
                    accept="image/svg+xml, image/png, image/jpeg"
                  />
                  {formData.hero.imageOverlay.icon && (
                    <Button type="button" variant="destructive" size="sm" onClick={handleDeleteIcon} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove Icon
                    </Button>
                  )}
                </div>

                {formData.hero.imageOverlay.icon && (
                  <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                    <Image
                      src={formData.hero.imageOverlay.icon || "/placeholder.svg"}
                      alt="Icon preview"
                      fill
                      className="object-contain"
                    />
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero.imageOverlay.text">Overlay Text</Label>
                <Input
                  id="hero.imageOverlay.text"
                  value={formData.hero.imageOverlay.text}
                  onChange={(e) => handleTextChange("hero.imageOverlay.text", e.target.value)}
                  placeholder="Enter overlay text"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Achievements</h2>
            <Button type="button" onClick={addAchievement} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          </div>

          {formData.achievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No achievements added yet. Click the "Add Achievement" button to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Achievement #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                      className="gap-2"
                    >
                      <Minus className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`achievements.${index}.label`} className="flex items-center gap-1">
                        Label <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`achievements.${index}.label`}
                        value={achievement.label}
                        onChange={(e) => handleAchievementChange(index, "label", e.target.value)}
                        className={errors[`achievements.${index}.label`] ? "border-destructive" : ""}
                        placeholder="Enter achievement label"
                      />
                      {errors[`achievements.${index}.label`] && (
                        <p className="text-sm text-destructive">{errors[`achievements.${index}.label`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`achievements.${index}.value`} className="flex items-center gap-1">
                          Value <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`achievements.${index}.value`}
                          type="number"
                          value={achievement.value}
                          onChange={(e) =>
                            handleAchievementChange(index, "value", Number.parseInt(e.target.value) || 0)
                          }
                          className={errors[`achievements.${index}.value`] ? "border-destructive" : ""}
                          placeholder="Enter value"
                        />
                        {errors[`achievements.${index}.value`] && (
                          <p className="text-sm text-destructive">{errors[`achievements.${index}.value`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`achievements.${index}.suffix`}>Suffix</Label>
                        <Select
                          value={achievement.suffix}
                          onValueChange={(value) => handleAchievementChange(index, "suffix", value)}
                        >
                          <SelectTrigger id={`achievements.${index}.suffix`}>
                            <SelectValue placeholder="Select suffix" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+">+</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="None">None</SelectItem> {/* Updated: Added value prop */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`achievements.${index}.color`}>Color Class</Label>
                      <Select
                        value={achievement.color}
                        onValueChange={(value) => handleAchievementChange(index, "color", value)}
                      >
                        <SelectTrigger id={`achievements.${index}.color`}>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-blue-600">Blue</SelectItem>
                          <SelectItem value="text-teal-600">Teal</SelectItem>
                          <SelectItem value="text-purple-600">Purple</SelectItem>
                          <SelectItem value="text-orange-600">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Values Section */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Core Values</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="values.title" className="flex items-center gap-1">
                  Section Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="values.title"
                  value={formData.values.title}
                  onChange={(e) => handleTextChange("values.title", e.target.value)}
                  className={errors["values.title"] ? "border-destructive" : ""}
                  placeholder="Enter section title"
                />
                {errors["values.title"] && <p className="text-sm text-destructive">{errors["values.title"]}</p>}
              </div>

              {formData.values.items.map((item, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`values.items.${index}.title`} className="flex items-center gap-1">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`values.items.${index}.title`}
                        value={item.title}
                        onChange={(e) => handleTextChange(`values.items.${index}.title`, e.target.value)}
                        className={errors[`values.items.${index}.title`] ? "border-destructive" : ""}
                        placeholder="Enter value title"
                      />
                      {errors[`values.items.${index}.title`] && (
                        <p className="text-sm text-destructive">{errors[`values.items.${index}.title`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`values.items.${index}.description`} className="flex items-center gap-1">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`values.items.${index}.description`}
                        value={item.description}
                        onChange={(e) => handleTextChange(`values.items.${index}.description`, e.target.value)}
                        className={errors[`values.items.${index}.description`] ? "border-destructive" : ""}
                        rows={3}
                        placeholder="Enter value description"
                      />
                      {errors[`values.items.${index}.description`] && (
                        <p className="text-sm text-destructive">{errors[`values.items.${index}.description`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`values.items.${index}.icon`}>Value Icon</Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => document.getElementById(`value-icon-input-${index}`)?.click()}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Icon
                        </Button>
                        <input
                          id={`value-icon-input-${index}`}
                          type="file"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              await handleValueIconUpload(e.target.files[0], index, item.icon)
                            }
                          }}
                          className="hidden"
                          accept="image/svg+xml, image/png, image/jpeg"
                        />
                        {item.icon && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleValueIconDelete(index)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove Icon
                          </Button>
                        )}
                      </div>
                      {item.icon && (
                        <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                          <Image
                            src={item.icon || "/placeholder.svg"}
                            alt="Value icon preview"
                            fill
                            className="object-contain"
                          />
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="values.image" className="flex items-center gap-1">
                  Values Image <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => valuesFileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={valuesFileInputRef}
                    id="values.image"
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await handleImageUpload(e.target.files[0], "values", formData.values.image.src)
                      }
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  {formData.values.image.src && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage("values")}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
                {errors["values.image"] && <p className="text-sm text-destructive">{errors["values.image"]}</p>}

                {formData.values.image.src && (
                  <Card className="mt-4 overflow-hidden aspect-video relative">
                    <Image
                      src={formData.values.image.src || "/placeholder.svg"}
                      alt="Values preview"
                      fill
                      className="object-cover"
                    />
                  </Card>
                )}
              </div>
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
                Update About Section
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={fetchAboutData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

// Helper function to update nested objects
function updateNestedObject(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value
  const [current, ...rest] = path
  const index = Number(current)
  if (!isNaN(index)) {
    // Current path is a numeric index, so treat obj as an array.
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

