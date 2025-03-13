"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, RefreshCw, Save, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type FAQ = {
  question: string
  answer: string
}

interface FAQData {
  section: {
    heading: string
    highlighted: string
    description: string
  }
  faqs: FAQ[]
}

export default function FAQForm() {
  const [data, setData] = useState<FAQData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [recordId, setRecordId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("section")

  useEffect(() => {
    fetchData()
  }, [])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: faqData, error } = await supabase
        .from("faqs_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(faqData.id)
      setData(faqData)
      setMessage({ text: "", type: "" })
    } catch (err: any) {
      console.error("Error fetching FAQ data:", err)
      setMessage({ text: "Failed to load FAQ data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setData({
        section: {
          heading: "Frequently Asked",
          highlighted: "Questions",
          description: "Find answers to common questions about our services and offerings.",
        },
        faqs: [
          {
            question: "What services do you offer?",
            answer: "We offer a wide range of services including...",
          },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper to update nested values (for section fields)
  const handleSectionChange = (field: string, value: string) => {
    if (!data) return
    setData({ ...data, section: { ...data.section, [field]: value } })

    // Clear error for this field if it exists
    if (errors[`section.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`section.${field}`]
        return newErrors
      })
    }
  }

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    if (!data) return
    const faqs = [...data.faqs]
    faqs[index] = { ...faqs[index], [field]: value }
    setData({ ...data, faqs })

    // Clear error for this field if it exists
    const errorKey = `faqs.${index}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addFAQ = () => {
    if (!data) return
    setData({ ...data, faqs: [...data.faqs, { question: "New question", answer: "New answer" }] })
  }

  const removeFAQ = (index: number) => {
    if (!data) return
    const faqs = data.faqs.filter((_, i) => i !== index)
    setData({ ...data, faqs })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!data) return false

    if (!data.section.heading.trim()) {
      newErrors["section.heading"] = "Heading is required"
    }

    if (!data.section.description.trim()) {
      newErrors["section.description"] = "Description is required"
    }

    data.faqs.forEach((faq, index) => {
      if (!faq.question.trim()) {
        newErrors[`faqs.${index}.question`] = "Question is required"
      }
      if (!faq.answer.trim()) {
        newErrors[`faqs.${index}.answer`] = "Answer is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data || !validateForm()) {
      setMessage({ text: "Please fix the errors in the form", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      let result
      if (recordId) {
        // Update existing record
        const { error } = await supabase
          .from("faqs_section")
          .update({
            section: data.section,
            faqs: data.faqs,
          })
          .eq("id", recordId)

        if (error) throw error
      } else {
        // Insert new record if none exists
        const { data: newData, error } = await supabase
          .from("faqs_section")
          .insert({
            section: data.section,
            faqs: data.faqs,
          })
          .select()

        if (error) throw error
        if (newData && newData.length > 0) {
          setRecordId(newData[0].id)
        }
      }

      setMessage({ text: "FAQ section updated successfully!", type: "success" })
    } catch (err: any) {
      console.error("Error saving FAQ data:", err)
      setMessage({ text: "Failed to save FAQ section. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !data) {
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
              onClick={() => setActiveTab("faqs")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "faqs"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              FAQs
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
                <Label htmlFor="section.heading" className="flex items-center gap-1">
                  Heading <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="section.heading"
                  value={data.section.heading}
                  onChange={(e) => handleSectionChange("heading", e.target.value)}
                  className={cn(
                    inputStyles,
                    errors["section.heading"] && "!border-destructive focus-visible:!ring-destructive",
                  )}
                  placeholder="Enter section heading"
                />
                {errors["section.heading"] && <p className="text-sm text-destructive">{errors["section.heading"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="section.highlighted">Highlighted Text</Label>
                <Input
                  id="section.highlighted"
                  value={data.section.highlighted}
                  onChange={(e) => handleSectionChange("highlighted", e.target.value)}
                  className={inputStyles}
                  placeholder="Enter highlighted text"
                />
                <p className="text-xs text-muted-foreground">This text will be highlighted with accent color</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section.description" className="flex items-center gap-1">
                Description <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="section.description"
                value={data.section.description}
                onChange={(e) => handleSectionChange("description", e.target.value)}
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
          </div>
        )}

        {/* FAQs List */}
        {activeTab === "faqs" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">FAQs</h2>
            </div>

            {data.faqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No FAQs added yet. Click the "Add FAQ" button to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {data.faqs.map((faq, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">FAQ #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`faq.${index}.question`} className="flex items-center gap-1">
                          Question <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id={`faq.${index}.question`}
                          value={faq.question}
                          onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`faqs.${index}.question`] && "!border-destructive focus-visible:!ring-destructive",
                          )}
                          placeholder="Enter FAQ question"
                        />
                        {errors[`faqs.${index}.question`] && (
                          <p className="text-sm text-destructive">{errors[`faqs.${index}.question`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`faq.${index}.answer`} className="flex items-center gap-1">
                          Answer <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Textarea
                          id={`faq.${index}.answer`}
                          value={faq.answer}
                          onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                          className={cn(
                            inputStyles,
                            errors[`faqs.${index}.answer`] && "!border-destructive focus-visible:!ring-destructive",
                            "resize-y min-h-[100px] !h-auto",
                          )}
                          style={{ resize: "vertical" }}
                          rows={3}
                          placeholder="Enter FAQ answer"
                        />
                        {errors[`faqs.${index}.answer`] && (
                          <p className="text-sm text-destructive">{errors[`faqs.${index}.answer`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add FAQ button at the bottom right */}
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                onClick={addFAQ}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
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
                Update FAQ Section
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

