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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type HeroSection = {
  backgroundImage: string
  serviceType: string
  title: string
  underlineText: string
  description: string
  buttonText: string
  buttonLink: string
}

type ExplanationSection = {
  header: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
  shutters: number
}

type ProjectImage = {
  src: string
  alt: string
}

type ProjectDetails = {
  description: string
  images: ProjectImage[]
}

type Project = {
  category: string
  title: string
  src: string
  details: ProjectDetails
}

type ProjectsSection = {
  title: string
  titleColor: string
  items: Project[]
}

type FaqItem = {
  question: string
  answer: string
}

type FaqsSection = {
  title: string
  highlightWord: string
  description: string
  items: FaqItem[]
}

type CtaSection = {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  buttonColor: string
  hoverButtonColor: string
}

type PageInfo = {
  hero: HeroSection
  explanation: ExplanationSection
  projects: ProjectsSection
  faqs: FaqsSection
  cta: CtaSection
}

type WasteManagementData = {
  pageInfo: PageInfo
}

export default function WasteManagementForm() {
  const [formData, setFormData] = useState<WasteManagementData | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["hero"])

  // Refs for file inputs
  const heroImageRef = useRef<HTMLInputElement>(null)
  const explanationImageRef = useRef<HTMLInputElement>(null)
  const projectImageRefs = useRef<(HTMLInputElement | null)[]>([])
  const projectDetailImageRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    fetchWasteManagementData()
  }, [])

  const fetchWasteManagementData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/education")
      if (!res.ok) throw new Error("Failed to fetch waste management data")
      const data: WasteManagementData = await res.json()
      setFormData(data)
    } catch (error) {
      console.error("Error fetching waste management data:", error)
      setMessage({ text: "Failed to load waste management data. Please refresh the page.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to update nested objects/arrays without losing array type
  function updateNestedObject(obj: any, path: string[], value: any): any {
    if (path.length === 0) return value
    const [current, ...rest] = path

    if (current.includes("[")) {
      // Handle array notation like "projects.items[0].title"
      const arrayMatch = current.match(/(.+)\[(\d+)\]/)
      if (arrayMatch) {
        const [_, arrayName, indexStr] = arrayMatch
        const index = Number.parseInt(indexStr)
        const newObj = { ...obj }
        if (!newObj[arrayName]) newObj[arrayName] = []
        const newArr = [...newObj[arrayName]]
        if (!newArr[index]) newArr[index] = {}
        newArr[index] = updateNestedObject(newArr[index], rest, value)
        newObj[arrayName] = newArr
        return newObj
      }
    }

    return {
      ...obj,
      [current]: updateNestedObject(obj ? obj[current] : undefined, rest, value),
    }
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return

    // Convert path like "projects.items[0].title" to ["projects", "items[0]", "title"]
    const pathParts = path.split(".")

    setFormData((prev) => {
      if (!prev) return prev
      return updateNestedObject(prev, pathParts, value)
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

  const handleArrayTextChange = (path: string, index: number, field: string, value: string) => {
    if (!formData) return
    const fullPath = `${path}[${index}].${field}`
    handleTextChange(fullPath, value)
  }

  const addParagraph = () => {
    if (!formData) return
    const updatedParagraphs = [...formData.pageInfo.explanation.paragraphs, ""]
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        explanation: {
          ...formData.pageInfo.explanation,
          paragraphs: updatedParagraphs,
        },
      },
    })
  }

  const removeParagraph = (index: number) => {
    if (!formData) return
    const updatedParagraphs = formData.pageInfo.explanation.paragraphs.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        explanation: {
          ...formData.pageInfo.explanation,
          paragraphs: updatedParagraphs,
        },
      },
    })
  }

  const addFaq = () => {
    if (!formData) return
    const newFaq = {
      question: "New Question",
      answer: "New Answer",
    }
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        faqs: {
          ...formData.pageInfo.faqs,
          items: [...formData.pageInfo.faqs.items, newFaq],
        },
      },
    })
  }

  const removeFaq = (index: number) => {
    if (!formData) return
    const updatedFaqs = formData.pageInfo.faqs.items.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        faqs: {
          ...formData.pageInfo.faqs,
          items: updatedFaqs,
        },
      },
    })
  }

  const addProject = () => {
    if (!formData) return
    const newProject = {
      category: "New Category",
      title: "New Project",
      src: "",
      details: {
        description: "Project description",
        images: [
          { src: "", alt: "Image 1" },
          { src: "", alt: "Image 2" },
          { src: "", alt: "Image 3" },
        ],
      },
    }
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        projects: {
          ...formData.pageInfo.projects,
          items: [...formData.pageInfo.projects.items, newProject],
        },
      },
    })
  }

  const removeProject = (index: number) => {
    if (!formData) return
    const updatedProjects = formData.pageInfo.projects.items.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      pageInfo: {
        ...formData.pageInfo,
        projects: {
          ...formData.pageInfo.projects,
          items: updatedProjects,
        },
      },
    })
  }

  const handleImageUpload = async (file: File, section: string, oldPath = "") => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    form.append("section", section);
  
    try {
      const res = await fetch("/api/education/upload", {
        method: "POST",
        body: form,
      });
  
      if (!res.ok) throw new Error("Upload failed");
      const { imagePath } = await res.json();
  
      setFormData((prevData) => {
        if (!prevData) return prevData;
        
        // Create a deep clone of the state
        const updatedData = structuredClone(prevData);
  
        // Handle different section types
        const sectionParts = section.split("-");
        switch (sectionParts[0]) {
          case "hero":
            updatedData.pageInfo.hero.backgroundImage = imagePath;
            break;
            
          case "explanation":
            updatedData.pageInfo.explanation.imageSrc = imagePath;
            break;
  
          case "project":
            if (sectionParts[1] === "detail") {
              // Handle project detail images: project-detail-0-1
              const projectIndex = parseInt(sectionParts[2]);
              const imageIndex = parseInt(sectionParts[3]);
              updatedData.pageInfo.projects.items[projectIndex].details.images[imageIndex].src = imagePath;
            } else {
              // Handle main project images: project-0
              const projectIndex = parseInt(sectionParts[1]);
              updatedData.pageInfo.projects.items[projectIndex].src = imagePath;
            }
            break;
        }
  
        return updatedData;
      });
  
      return imagePath;
    } catch (error) {
      console.error("Image upload failed:", error);
      setMessage({ text: "Image upload failed. Please try again.", type: "error" });
      return null;
    }
  };
  
  const handleDeleteImage = async (imagePath: string, section: string) => {
    if (!imagePath || !formData) return;
  
    try {
      const res = await fetch("/api/education/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      });
  
      if (!res.ok) throw new Error("Delete failed");
  
      setFormData((prevData) => {
        if (!prevData) return prevData;
        
        const updatedData = structuredClone(prevData);
        const sectionParts = section.split("-");
  
        switch (sectionParts[0]) {
          case "hero":
            updatedData.pageInfo.hero.backgroundImage = "";
            break;
  
          case "explanation":
            updatedData.pageInfo.explanation.imageSrc = "";
            break;
  
          case "project":
            if (sectionParts[1] === "detail") {
              // Handle project detail images: project-detail-0-1
              const projectIndex = parseInt(sectionParts[2]);
              const imageIndex = parseInt(sectionParts[3]);
              updatedData.pageInfo.projects.items[projectIndex].details.images[imageIndex].src = "";
            } else {
              // Handle main project images: project-0
              const projectIndex = parseInt(sectionParts[1]);
              updatedData.pageInfo.projects.items[projectIndex].src = "";
            }
            break;
        }
  
        return updatedData;
      });
  
      return true;
    } catch (error) {
      console.error("Image deletion failed:", error);
      setMessage({ text: "Image deletion failed. Please try again.", type: "error" });
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData) return false

    // Validate hero section
    if (!formData.pageInfo.hero.title.trim()) {
      newErrors["pageInfo.hero.title"] = "Title is required"
    }
    if (!formData.pageInfo.hero.description.trim()) {
      newErrors["pageInfo.hero.description"] = "Description is required"
    }

    // Validate explanation section
    if (!formData.pageInfo.explanation.header.trim()) {
      newErrors["pageInfo.explanation.header"] = "Header is required"
    }
    if (formData.pageInfo.explanation.paragraphs.length === 0) {
      newErrors["pageInfo.explanation.paragraphs"] = "At least one paragraph is required"
    }

    // Validate projects section
    if (!formData.pageInfo.projects.title.trim()) {
      newErrors["pageInfo.projects.title"] = "Title is required"
    }

    formData.pageInfo.projects.items.forEach((project, index) => {
      if (!project.title.trim()) {
        newErrors[`pageInfo.projects.items[${index}].title`] = "Project title is required"
      }
      if (!project.category.trim()) {
        newErrors[`pageInfo.projects.items[${index}].category`] = "Category is required"
      }
    })

    // Validate FAQs section
    if (!formData.pageInfo.faqs.title.trim()) {
      newErrors["pageInfo.faqs.title"] = "Title is required"
    }

    formData.pageInfo.faqs.items.forEach((faq, index) => {
      if (!faq.question.trim()) {
        newErrors[`pageInfo.faqs.items[${index}].question`] = "Question is required"
      }
      if (!faq.answer.trim()) {
        newErrors[`pageInfo.faqs.items[${index}].answer`] = "Answer is required"
      }
    })

    // Validate CTA section
    if (!formData.pageInfo.cta.title.trim()) {
      newErrors["pageInfo.cta.title"] = "Title is required"
    }
    if (!formData.pageInfo.cta.description.trim()) {
      newErrors["pageInfo.cta.description"] = "Description is required"
    }

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
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to save waste management data")
      }

      setMessage({ text: "Waste management section updated successfully!", type: "success" })
      await fetchWasteManagementData()
    } catch (error) {
      console.error("Error saving waste management data:", error)
      setMessage({ text: "Failed to save waste management data. Please try again.", type: "error" })
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
        <Accordion type="multiple" value={activeAccordion} onValueChange={setActiveAccordion} className="space-y-4">
          {/* Hero Section */}
          <AccordionItem value="hero" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-xl font-semibold">Hero Section</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.serviceType" className="flex items-center gap-1">
                    Service Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pageInfo.hero.serviceType"
                    value={formData.pageInfo.hero.serviceType}
                    onChange={(e) => handleTextChange("pageInfo.hero.serviceType", e.target.value)}
                    className={errors["pageInfo.hero.serviceType"] ? "border-destructive" : ""}
                    placeholder="Enter service type"
                  />
                  {errors["pageInfo.hero.serviceType"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.hero.serviceType"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.title" className="flex items-center gap-1">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pageInfo.hero.title"
                    value={formData.pageInfo.hero.title}
                    onChange={(e) => handleTextChange("pageInfo.hero.title", e.target.value)}
                    className={errors["pageInfo.hero.title"] ? "border-destructive" : ""}
                    placeholder="Enter title"
                  />
                  {errors["pageInfo.hero.title"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.hero.title"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.underlineText" className="flex items-center gap-1">
                    Underline Text <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pageInfo.hero.underlineText"
                    value={formData.pageInfo.hero.underlineText}
                    onChange={(e) => handleTextChange("pageInfo.hero.underlineText", e.target.value)}
                    className={errors["pageInfo.hero.underlineText"] ? "border-destructive" : ""}
                    placeholder="Enter underline text"
                  />
                  {errors["pageInfo.hero.underlineText"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.hero.underlineText"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.description" className="flex items-center gap-1">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="pageInfo.hero.description"
                    value={formData.pageInfo.hero.description}
                    onChange={(e) => handleTextChange("pageInfo.hero.description", e.target.value)}
                    className={errors["pageInfo.hero.description"] ? "border-destructive" : ""}
                    rows={3}
                    placeholder="Enter description"
                  />
                  {errors["pageInfo.hero.description"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.hero.description"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.buttonText">Button Text</Label>
                  <Input
                    id="pageInfo.hero.buttonText"
                    value={formData.pageInfo.hero.buttonText}
                    onChange={(e) => handleTextChange("pageInfo.hero.buttonText", e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.hero.buttonLink">Button Link</Label>
                  <Input
                    id="pageInfo.hero.buttonLink"
                    value={formData.pageInfo.hero.buttonLink}
                    onChange={(e) => handleTextChange("pageInfo.hero.buttonLink", e.target.value)}
                    placeholder="Enter button link URL"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pageInfo.hero.backgroundImage">Background Image</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => heroImageRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      ref={heroImageRef}
                      id="pageInfo.hero.backgroundImage"
                      type="file"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleImageUpload(e.target.files[0], "hero", formData.pageInfo.hero.backgroundImage)
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    {formData.pageInfo.hero.backgroundImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(formData.pageInfo.hero.backgroundImage, "hero")}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Image
                      </Button>
                    )}
                  </div>

                  {formData.pageInfo.hero.backgroundImage && (
                    <Card className="mt-4 overflow-hidden w-full h-48 relative">
                      <Image
                        src={formData.pageInfo.hero.backgroundImage || "/placeholder.svg"}
                        alt="Hero background"
                        fill
                        className="object-cover"
                      />
                    </Card>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Explanation Section */}
          <AccordionItem value="explanation" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-xl font-semibold">Explanation Section</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pageInfo.explanation.header" className="flex items-center gap-1">
                    Header <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pageInfo.explanation.header"
                    value={formData.pageInfo.explanation.header}
                    onChange={(e) => handleTextChange("pageInfo.explanation.header", e.target.value)}
                    className={errors["pageInfo.explanation.header"] ? "border-destructive" : ""}
                    placeholder="Enter header"
                  />
                  {errors["pageInfo.explanation.header"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.explanation.header"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-1">
                      Paragraphs <span className="text-destructive">*</span>
                    </Label>
                    <Button type="button" onClick={addParagraph} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Paragraph
                    </Button>
                  </div>
                  {errors["pageInfo.explanation.paragraphs"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.explanation.paragraphs"]}</p>
                  )}

                  {formData.pageInfo.explanation.paragraphs.map((paragraph, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`pageInfo.explanation.paragraphs.${index}`}>Paragraph {index + 1}</Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeParagraph(index)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                      <Textarea
                        id={`pageInfo.explanation.paragraphs.${index}`}
                        value={paragraph}
                        onChange={(e) => {
                          const updatedParagraphs = [...formData.pageInfo.explanation.paragraphs]
                          updatedParagraphs[index] = e.target.value
                          setFormData({
                            ...formData,
                            pageInfo: {
                              ...formData.pageInfo,
                              explanation: {
                                ...formData.pageInfo.explanation,
                                paragraphs: updatedParagraphs,
                              },
                            },
                          })
                        }}
                        rows={4}
                        placeholder="Enter paragraph text"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.explanation.imageAlt">Image Alt Text</Label>
                  <Input
                    id="pageInfo.explanation.imageAlt"
                    value={formData.pageInfo.explanation.imageAlt}
                    onChange={(e) => handleTextChange("pageInfo.explanation.imageAlt", e.target.value)}
                    placeholder="Enter image alt text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.explanation.shutters">Shutters</Label>
                  <Input
                    id="pageInfo.explanation.shutters"
                    type="number"
                    value={formData.pageInfo.explanation.shutters}
                    onChange={(e) => handleTextChange("pageInfo.explanation.shutters", e.target.value)}
                    placeholder="Enter number of shutters"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.explanation.imageSrc">Explanation Image</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => explanationImageRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      ref={explanationImageRef}
                      id="pageInfo.explanation.imageSrc"
                      type="file"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleImageUpload(
                            e.target.files[0],
                            "explanation",
                            formData.pageInfo.explanation.imageSrc,
                          )
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    {formData.pageInfo.explanation.imageSrc && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(formData.pageInfo.explanation.imageSrc, "explanation")}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Image
                      </Button>
                    )}
                  </div>

                  {formData.pageInfo.explanation.imageSrc && (
                    <Card className="mt-4 overflow-hidden w-full h-48 relative">
                      <Image
                        src={formData.pageInfo.explanation.imageSrc || "/placeholder.svg"}
                        alt={formData.pageInfo.explanation.imageAlt}
                        fill
                        className="object-cover"
                      />
                    </Card>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Projects Section */}
          <AccordionItem value="projects" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-xl font-semibold">Projects Section</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pageInfo.projects.title" className="flex items-center gap-1">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pageInfo.projects.title"
                      value={formData.pageInfo.projects.title}
                      onChange={(e) => handleTextChange("pageInfo.projects.title", e.target.value)}
                      className={errors["pageInfo.projects.title"] ? "border-destructive" : ""}
                      placeholder="Enter projects section title"
                    />
                    {errors["pageInfo.projects.title"] && (
                      <p className="text-sm text-destructive">{errors["pageInfo.projects.title"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageInfo.projects.titleColor">Title Color</Label>
                    <Input
                      id="pageInfo.projects.titleColor"
                      value={formData.pageInfo.projects.titleColor}
                      onChange={(e) => handleTextChange("pageInfo.projects.titleColor", e.target.value)}
                      placeholder="Enter title color class (e.g., text-emerald-800)"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Projects</Label>
                    <Button type="button" onClick={addProject} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Project
                    </Button>
                  </div>

                  {formData.pageInfo.projects.items.map((project, projectIndex) => (
                    <div key={projectIndex} className="border rounded-lg p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Project #{projectIndex + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProject(projectIndex)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Project
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`pageInfo.projects.items[${projectIndex}].category`}
                            className="flex items-center gap-1"
                          >
                            Category <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`pageInfo.projects.items[${projectIndex}].category`}
                            value={project.category}
                            onChange={(e) =>
                              handleArrayTextChange("pageInfo.projects.items", projectIndex, "category", e.target.value)
                            }
                            className={
                              errors[`pageInfo.projects.items[${projectIndex}].category`] ? "border-destructive" : ""
                            }
                            placeholder="Enter project category"
                          />
                          {errors[`pageInfo.projects.items[${projectIndex}].category`] && (
                            <p className="text-sm text-destructive">
                              {errors[`pageInfo.projects.items[${projectIndex}].category`]}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`pageInfo.projects.items[${projectIndex}].title`}
                            className="flex items-center gap-1"
                          >
                            Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`pageInfo.projects.items[${projectIndex}].title`}
                            value={project.title}
                            onChange={(e) =>
                              handleArrayTextChange("pageInfo.projects.items", projectIndex, "title", e.target.value)
                            }
                            className={
                              errors[`pageInfo.projects.items[${projectIndex}].title`] ? "border-destructive" : ""
                            }
                            placeholder="Enter project title"
                          />
                          {errors[`pageInfo.projects.items[${projectIndex}].title`] && (
                            <p className="text-sm text-destructive">
                              {errors[`pageInfo.projects.items[${projectIndex}].title`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`pageInfo.projects.items[${projectIndex}].src`}>Project Image</Label>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => projectImageRefs.current[projectIndex]?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <input
                            ref={(el) => (projectImageRefs.current[projectIndex] = el)}
                            id={`pageInfo.projects.items[${projectIndex}].src`}
                            type="file"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                await handleImageUpload(e.target.files[0], `project-${projectIndex}`, project.src)
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                          {project.src && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteImage(project.src, `project-${projectIndex}`)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Image
                            </Button>
                          )}
                        </div>

                        {project.src && (
                          <Card className="mt-4 overflow-hidden w-full h-48 relative">
                            <Image
                              src={project.src || "/placeholder.svg"}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </Card>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label>Project Details</Label>
                        <div className="space-y-4 border rounded-lg p-4">
                          <div className="space-y-2">
                            <Label htmlFor={`pageInfo.projects.items[${projectIndex}].details.description`}>
                              Description
                            </Label>
                            <Textarea
                              id={`pageInfo.projects.items[${projectIndex}].details.description`}
                              value={project.details.description}
                              onChange={(e) => {
                                const updatedProjects = [...formData.pageInfo.projects.items]
                                updatedProjects[projectIndex] = {
                                  ...updatedProjects[projectIndex],
                                  details: {
                                    ...updatedProjects[projectIndex].details,
                                    description: e.target.value,
                                  },
                                }
                                setFormData({
                                  ...formData,
                                  pageInfo: {
                                    ...formData.pageInfo,
                                    projects: {
                                      ...formData.pageInfo.projects,
                                      items: updatedProjects,
                                    },
                                  },
                                })
                              }}
                              rows={4}
                              placeholder="Enter project description"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label>Detail Images</Label>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  const updatedProjects = [...formData.pageInfo.projects.items]
                                  const updatedImages = [
                                    ...updatedProjects[projectIndex].details.images,
                                    {
                                      src: "",
                                      alt: `Image ${updatedProjects[projectIndex].details.images.length + 1}`,
                                    },
                                  ]
                                  updatedProjects[projectIndex] = {
                                    ...updatedProjects[projectIndex],
                                    details: {
                                      ...updatedProjects[projectIndex].details,
                                      images: updatedImages,
                                    },
                                  }
                                  setFormData({
                                    ...formData,
                                    pageInfo: {
                                      ...formData.pageInfo,
                                      projects: {
                                        ...formData.pageInfo.projects,
                                        items: updatedProjects,
                                      },
                                    },
                                  })
                                }}
                                className="gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                Add Image
                              </Button>
                            </div>
                            {project.details.images.map((image, imageIndex) => (
                              <div key={imageIndex} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <Label>Image #{imageIndex + 1}</Label>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      // First delete the image if it exists
                                      if (image.src) {
                                        handleDeleteImage(image.src, `project-detail-${projectIndex}-${imageIndex}`)
                                      }

                                      // Then remove the image from the array
                                      const updatedProjects = [...formData.pageInfo.projects.items]
                                      const updatedImages = updatedProjects[projectIndex].details.images.filter(
                                        (_, i) => i !== imageIndex,
                                      )
                                      updatedProjects[projectIndex] = {
                                        ...updatedProjects[projectIndex],
                                        details: {
                                          ...updatedProjects[projectIndex].details,
                                          images: updatedImages,
                                        },
                                      }
                                      setFormData({
                                        ...formData,
                                        pageInfo: {
                                          ...formData.pageInfo,
                                          projects: {
                                            ...formData.pageInfo.projects,
                                            items: updatedProjects,
                                          },
                                        },
                                      })
                                    }}
                                    className="gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label htmlFor={`project-${projectIndex}-image-${imageIndex}-alt`}>Alt Text</Label>
                                    <Input
                                      id={`project-${projectIndex}-image-${imageIndex}-alt`}
                                      value={image.alt}
                                      onChange={(e) => {
                                        const updatedProjects = [...formData.pageInfo.projects.items]
                                        const updatedImages = [...updatedProjects[projectIndex].details.images]
                                        updatedImages[imageIndex] = {
                                          ...updatedImages[imageIndex],
                                          alt: e.target.value,
                                        }
                                        updatedProjects[projectIndex] = {
                                          ...updatedProjects[projectIndex],
                                          details: {
                                            ...updatedProjects[projectIndex].details,
                                            images: updatedImages,
                                          },
                                        }
                                        setFormData({
                                          ...formData,
                                          pageInfo: {
                                            ...formData.pageInfo,
                                            projects: {
                                              ...formData.pageInfo.projects,
                                              items: updatedProjects,
                                            },
                                          },
                                        })
                                      }}
                                      placeholder="Enter image alt text"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`project-${projectIndex}-image-${imageIndex}-src`}>Image</Label>
                                    <div className="flex flex-wrap items-center gap-3">
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() =>
                                          projectDetailImageRefs.current[`${projectIndex}-${imageIndex}`]?.click()
                                        }
                                        className="gap-2"
                                      >
                                        <Upload className="h-4 w-4" />
                                        Choose File
                                      </Button>
                                      <input
                                        ref={(el) =>
                                          (projectDetailImageRefs.current[`${projectIndex}-${imageIndex}`] = el)
                                        }
                                        id={`project-${projectIndex}-image-${imageIndex}-src`}
                                        type="file"
                                        onChange={async (e) => {
                                          if (e.target.files?.[0]) {
                                            const newImagePath = await handleImageUpload(
                                              e.target.files[0],
                                              `project-detail-${projectIndex}-${imageIndex}`,
                                              image.src,
                                            )
                                            if (newImagePath) {
                                              const updatedProjects = [...formData.pageInfo.projects.items]
                                              const updatedImages = [...updatedProjects[projectIndex].details.images]
                                              updatedImages[imageIndex] = {
                                                ...updatedImages[imageIndex],
                                                src: newImagePath,
                                              }
                                              updatedProjects[projectIndex] = {
                                                ...updatedProjects[projectIndex],
                                                details: {
                                                  ...updatedProjects[projectIndex].details,
                                                  images: updatedImages,
                                                },
                                              }
                                              setFormData({
                                                ...formData,
                                                pageInfo: {
                                                  ...formData.pageInfo,
                                                  projects: {
                                                    ...formData.pageInfo.projects,
                                                    items: updatedProjects,
                                                  },
                                                },
                                              })
                                            }
                                          }
                                        }}
                                        className="hidden"
                                        accept="image/*"
                                      />
                                      {image.src && (
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteImage(image.src, `project-detail-${projectIndex}-${imageIndex}`)
                                          }
                                          className="gap-2"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          Remove
                                        </Button>
                                      )}
                                    </div>

                                    {image.src && (
                                      <Card className="mt-4 overflow-hidden w-full h-32 relative">
                                        <Image
                                          src={image.src || "/placeholder.svg"}
                                          alt={image.alt}
                                          fill
                                          className="object-cover"
                                        />
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* FAQs Section */}
          <AccordionItem value="faqs" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-xl font-semibold">FAQs Section</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pageInfo.faqs.title" className="flex items-center gap-1">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pageInfo.faqs.title"
                      value={formData.pageInfo.faqs.title}
                      onChange={(e) => handleTextChange("pageInfo.faqs.title", e.target.value)}
                      className={errors["pageInfo.faqs.title"] ? "border-destructive" : ""}
                      placeholder="Enter FAQs section title"
                    />
                    {errors["pageInfo.faqs.title"] && (
                      <p className="text-sm text-destructive">{errors["pageInfo.faqs.title"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageInfo.faqs.highlightWord">Highlight Word</Label>
                    <Input
                      id="pageInfo.faqs.highlightWord"
                      value={formData.pageInfo.faqs.highlightWord}
                      onChange={(e) => handleTextChange("pageInfo.faqs.highlightWord", e.target.value)}
                      placeholder="Enter highlight word"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.faqs.description">Description</Label>
                  <Textarea
                    id="pageInfo.faqs.description"
                    value={formData.pageInfo.faqs.description}
                    onChange={(e) => handleTextChange("pageInfo.faqs.description", e.target.value)}
                    rows={3}
                    placeholder="Enter FAQs description"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">FAQ Items</Label>
                    <Button type="button" onClick={addFaq} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add FAQ
                    </Button>
                  </div>

                  {formData.pageInfo.faqs.items.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">FAQ #{faqIndex + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFaq(faqIndex)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`pageInfo.faqs.items[${faqIndex}].question`}
                          className="flex items-center gap-1"
                        >
                          Question <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`pageInfo.faqs.items[${faqIndex}].question`}
                          value={faq.question}
                          onChange={(e) =>
                            handleArrayTextChange("pageInfo.faqs.items", faqIndex, "question", e.target.value)
                          }
                          className={errors[`pageInfo.faqs.items[${faqIndex}].question`] ? "border-destructive" : ""}
                          placeholder="Enter question"
                        />
                        {errors[`pageInfo.faqs.items[${faqIndex}].question`] && (
                          <p className="text-sm text-destructive">
                            {errors[`pageInfo.faqs.items[${faqIndex}].question`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`pageInfo.faqs.items[${faqIndex}].answer`} className="flex items-center gap-1">
                          Answer <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`pageInfo.faqs.items[${faqIndex}].answer`}
                          value={faq.answer}
                          onChange={(e) =>
                            handleArrayTextChange("pageInfo.faqs.items", faqIndex, "answer", e.target.value)
                          }
                          className={errors[`pageInfo.faqs.items[${faqIndex}].answer`] ? "border-destructive" : ""}
                          rows={3}
                          placeholder="Enter answer"
                        />
                        {errors[`pageInfo.faqs.items[${faqIndex}].answer`] && (
                          <p className="text-sm text-destructive">
                            {errors[`pageInfo.faqs.items[${faqIndex}].answer`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* CTA Section */}
          <AccordionItem value="cta" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-xl font-semibold">CTA Section</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.title" className="flex items-center gap-1">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pageInfo.cta.title"
                    value={formData.pageInfo.cta.title}
                    onChange={(e) => handleTextChange("pageInfo.cta.title", e.target.value)}
                    className={errors["pageInfo.cta.title"] ? "border-destructive" : ""}
                    placeholder="Enter CTA title"
                  />
                  {errors["pageInfo.cta.title"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.cta.title"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.description" className="flex items-center gap-1">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="pageInfo.cta.description"
                    value={formData.pageInfo.cta.description}
                    onChange={(e) => handleTextChange("pageInfo.cta.description", e.target.value)}
                    className={errors["pageInfo.cta.description"] ? "border-destructive" : ""}
                    rows={3}
                    placeholder="Enter CTA description"
                  />
                  {errors["pageInfo.cta.description"] && (
                    <p className="text-sm text-destructive">{errors["pageInfo.cta.description"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.buttonText">Button Text</Label>
                  <Input
                    id="pageInfo.cta.buttonText"
                    value={formData.pageInfo.cta.buttonText}
                    onChange={(e) => handleTextChange("pageInfo.cta.buttonText", e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.buttonLink">Button Link</Label>
                  <Input
                    id="pageInfo.cta.buttonLink"
                    value={formData.pageInfo.cta.buttonLink}
                    onChange={(e) => handleTextChange("pageInfo.cta.buttonLink", e.target.value)}
                    placeholder="Enter button link URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.buttonColor">Button Color</Label>
                  <Input
                    id="pageInfo.cta.buttonColor"
                    value={formData.pageInfo.cta.buttonColor}
                    onChange={(e) => handleTextChange("pageInfo.cta.buttonColor", e.target.value)}
                    placeholder="Enter button color class (e.g., bg-emerald-600)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageInfo.cta.hoverButtonColor">Hover Button Color</Label>
                  <Input
                    id="pageInfo.cta.hoverButtonColor"
                    value={formData.pageInfo.cta.hoverButtonColor}
                    onChange={(e) => handleTextChange("pageInfo.cta.hoverButtonColor", e.target.value)}
                    placeholder="Enter hover button color class (e.g., hover:bg-emerald-700)"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
                Update Waste Management Section
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchWasteManagementData}
            disabled={isSaving}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

