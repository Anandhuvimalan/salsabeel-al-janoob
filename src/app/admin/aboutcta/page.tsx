"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Add these CSS classes for consistent styling
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-foreground focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

interface CallToActionData {
  id: number
  heading: string
  subheading: string
  button_text: string
  button_link: string
}

const CallToActionForm = () => {
  const [formData, setFormData] = useState<CallToActionData>({
    id: 0,
    heading: "",
    subheading: "",
    button_text: "",
    button_link: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

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

  // Update the fetchData function to better handle errors and the case where no data exists
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Check if the table has any data
      const { count, error: countError } = await supabase
        .from("aboutpage_calltoaction")
        .select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Error checking call to action data:", countError)
        throw new Error("Failed to check if data exists")
      }

      // If no data exists, insert default data
      if (count === 0) {
        const defaultData = {
          heading: "Ready to Elevate Your Business?",
          subheading: "Join us today and unlock unparalleled growth opportunities.",
          button_text: "Get Started",
          button_link: "/contact",
        }

        const { error: insertError } = await supabase.from("aboutpage_calltoaction").insert(defaultData)

        if (insertError) {
          console.error("Error inserting default data:", insertError)
          throw new Error("Failed to initialize call to action data")
        }
      }

      // Now fetch the data
      const { data, error } = await supabase
        .from("aboutpage_calltoaction")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)

      if (error) {
        console.error("Supabase query error:", error)
        throw new Error("Failed to fetch call to action data")
      }

      if (!data || data.length === 0) {
        console.error("No data returned from query")
        throw new Error("No call to action data found")
      }

      setFormData(data[0])
    } catch (error) {
      console.error("Error fetching call to action data:", error)
      setMessage({ text: "Failed to load data. Please try again.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Update the handleSubmit function to handle the case where we need to insert instead of update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // Map form field names to database column names
      const dataToUpdate = {
        heading: formData.heading,
        subheading: formData.subheading,
        button_text: formData.button_text,
        button_link: formData.button_link,
      }

      let operation
      if (formData.id) {
        // Update existing record
        operation = supabase.from("aboutpage_calltoaction").update(dataToUpdate).eq("id", formData.id)
      } else {
        // Insert new record
        operation = supabase.from("aboutpage_calltoaction").insert(dataToUpdate)
      }

      const { error } = await operation

      if (error) throw error

      setMessage({ text: "Call to Action updated successfully", type: "success" })
      await fetchData() // Refresh data after successful update
    } catch (error) {
      console.error("Error updating call to action:", error)
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
        </div>
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
              onClick={() => setActiveTab("content")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "content"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("button")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "button"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Button
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === "content" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Call to Action Content</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="Enter heading"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="subheading">Subheading</Label>
                <Textarea
                  id="subheading"
                  name="subheading"
                  value={formData.subheading}
                  onChange={handleChange}
                  placeholder="Enter subheading"
                  rows={4}
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "button" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Button Settings</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleChange}
                  placeholder="Enter button text"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  name="button_link"
                  value={formData.button_link}
                  onChange={handleChange}
                  placeholder="Enter button link"
                  className={inputStyles}
                />
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
                Update Call to Action
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

export default CallToActionForm

