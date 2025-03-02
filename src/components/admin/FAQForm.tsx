"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, RefreshCw, Save, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch("/api/homepage/faqs")
      if (!res.ok) throw new Error("Failed to fetch FAQ data")
      const json: FAQData = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || "Error fetching data")
    } finally {
      setLoading(false)
    }
  }

  // Helper to update nested values (for section fields)
  const updateNested = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value
    const [head, ...rest] = path
    return {
      ...obj,
      [head]: rest.length ? updateNested(obj[head] || {}, rest, value) : value,
    }
  }

  const handleSectionChange = (field: string, value: string) => {
    if (!data) return
    setData({ ...data, section: { ...data.section, [field]: value } })
  }

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    if (!data) return
    const faqs = [...data.faqs]
    faqs[index] = { ...faqs[index], [field]: value }
    setData({ ...data, faqs })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setMessage({ text: "", type: "" })
    try {
      const res = await fetch("/api/homepage/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to save data")
      setMessage({ text: "FAQ section updated successfully!", type: "success" })
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Error saving data")
      setMessage({ text: "Failed to save FAQ section. Please try again.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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

  if (!data) return null

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
              <Label htmlFor="section.heading">Heading</Label>
              <Input
                id="section.heading"
                value={data.section.heading}
                onChange={(e) => handleSectionChange("heading", e.target.value)}
                placeholder="Enter section heading"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section.highlighted">Highlighted Text</Label>
              <Input
                id="section.highlighted"
                value={data.section.highlighted}
                onChange={(e) => handleSectionChange("highlighted", e.target.value)}
                placeholder="Enter highlighted text"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="section.description">Description</Label>
            <Textarea
              id="section.description"
              value={data.section.description}
              onChange={(e) => handleSectionChange("description", e.target.value)}
              rows={3}
              placeholder="Enter section description"
            />
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">FAQs</h2>
            <Button type="button" onClick={addFAQ} className="gap-2">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          {data.faqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FAQs added yet. Click the "Add FAQ" button to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {data.faqs.map((faq, index) => (
                <Card key={index} className="p-6">
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
                      <Label htmlFor={`faq.${index}.question`}>Question</Label>
                      <Input
                        id={`faq.${index}.question`}
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                        placeholder="Enter FAQ question"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`faq.${index}.answer`}>Answer</Label>
                      <Textarea
                        id={`faq.${index}.answer`}
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                        rows={3}
                        placeholder="Enter FAQ answer"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 border-t">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? (
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

          <Button type="button" variant="outline" onClick={fetchData} disabled={saving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

