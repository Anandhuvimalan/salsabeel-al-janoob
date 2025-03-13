"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Trash2, Upload, RefreshCw, Save, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
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

interface FooterData {
  company_info: {
    logoSrc: string
    heading: string
    description: string
  }
  quick_links: { name: string; link: string }[]
  newsletter: {
    heading: string
    placeholder: string
    buttonText: string
    buttonIcon: string
  }
  social_media: { iconSrc: string; name: string; link: string }[]
  company_locations: {
    name: string
    operation: string
    address: string
    phoneNumbers: string[]
    mapSrc: string
  }[]
  legal: {
    terms: string
    privacy: string
    copyright: string
    chevronIcon: string
  }
}

export default function FooterForm() {
  const [data, setData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [recordId, setRecordId] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [filesToDelete, setFilesToDelete] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("company")

  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const newsletterIconInputRef = useRef<HTMLInputElement | null>(null)
  const legalChevronInputRef = useRef<HTMLInputElement | null>(null)
  const socialMediaInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetchData()
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

  async function fetchData() {
    setLoading(true)
    setFilesToDelete([]) // Reset files to delete when fetching new data
    try {
      const { data: footerData, error } = await supabase
        .from("footer_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setRecordId(footerData.id)

      // Initialize image previews for existing images
      const previews: Record<string, string> = {}

      // Company logo
      if (footerData.company_info.logoSrc) {
        previews["company_info.logoSrc"] = getImageUrl(footerData.company_info.logoSrc)
      }

      // Newsletter button icon
      if (footerData.newsletter.buttonIcon) {
        previews["newsletter.buttonIcon"] = getImageUrl(footerData.newsletter.buttonIcon)
      }

      // Legal chevron icon
      if (footerData.legal.chevronIcon) {
        previews["legal.chevronIcon"] = getImageUrl(footerData.legal.chevronIcon)
      }

      // Social media icons
      footerData.social_media.forEach((social: any, index: number) => {
        if (social.iconSrc) {
          previews[`social_media.${index}.iconSrc`] = getImageUrl(social.iconSrc)
        }
      })

      setImagePreviews(previews)
      setData(footerData)
    } catch (err: any) {
      console.error("Error fetching footer data:", err)
      setMessage({ text: "Failed to load footer data. Please refresh the page.", type: "error" })

      // Initialize with default data if fetch fails
      setData({
        company_info: {
          logoSrc: "",
          heading: "Company Name",
          description: "Your company description goes here.",
        },
        quick_links: [
          { name: "Home", link: "/" },
          { name: "About", link: "/about" },
          { name: "Services", link: "/services" },
          { name: "Contact", link: "/contact" },
        ],
        newsletter: {
          heading: "Subscribe to our newsletter",
          placeholder: "Enter your email",
          buttonText: "Subscribe",
          buttonIcon: "",
        },
        social_media: [
          { iconSrc: "", name: "Facebook", link: "https://facebook.com" },
          { iconSrc: "", name: "Twitter", link: "https://twitter.com" },
          { iconSrc: "", name: "Instagram", link: "https://instagram.com" },
        ],
        company_locations: [
          {
            name: "Headquarters",
            operation: "Mon-Fri: 9AM-5PM",
            address: "123 Main Street, City, Country",
            phoneNumbers: ["+1 (123) 456-7890"],
            mapSrc: "",
          },
        ],
        legal: {
          terms: "/terms",
          privacy: "/privacy",
          copyright: "© 2023 Company Name. All rights reserved.",
          chevronIcon: "",
        },
      })
    } finally {
      setLoading(false)
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
    return supabase.storage.from("footer-images").getPublicUrl(path).data.publicUrl
  }

  // Updated nested updater that preserves arrays
  const updateNested = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value
    const [head, ...rest] = path
    const index = Number(head)
    if (!isNaN(index) && Array.isArray(obj)) {
      const newArr = [...obj]
      newArr[index] = updateNested(newArr[index], rest, value)
      return newArr
    } else {
      return {
        ...obj,
        [head]: updateNested(obj ? obj[head] : undefined, rest, value),
      }
    }
  }

  const handleChange = (path: string, value: string) => {
    if (!data) return
    const keys = path.split(".")
    setData((prev) => updateNested(prev, keys, value))
  }

  // For arrays like quick_links, social_media, company_locations we update directly
  const addQuickLink = () => {
    if (!data) return
    setData({ ...data, quick_links: [...data.quick_links, { name: "New Link", link: "/" }] })
  }

  const removeQuickLink = (index: number) => {
    if (!data) return
    setData({ ...data, quick_links: data.quick_links.filter((_, i) => i !== index) })
  }

  const addSocialMedia = () => {
    if (!data) return
    setData({ ...data, social_media: [...data.social_media, { iconSrc: "", name: "New Social", link: "#" }] })
  }

  const removeSocialMedia = (index: number) => {
    if (!data) return

    // If there's an icon, mark it for deletion
    const social = data.social_media[index]
    if (social.iconSrc && !social.iconSrc.startsWith("http") && !social.iconSrc.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, social.iconSrc])
    }

    setData({ ...data, social_media: data.social_media.filter((_, i) => i !== index) })

    // Clean up any preview
    if (imagePreviews[`social_media.${index}.iconSrc`]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[`social_media.${index}.iconSrc`]
      setImagePreviews(newPreviews)
    }
  }

  const addCompanyLocation = () => {
    if (!data) return
    setData({
      ...data,
      company_locations: [
        ...data.company_locations,
        { name: "New Location", operation: "", address: "", phoneNumbers: [""], mapSrc: "" },
      ],
    })
  }

  const removeCompanyLocation = (index: number) => {
    if (!data) return
    setData({ ...data, company_locations: data.company_locations.filter((_, i) => i !== index) })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    if (!e.target.files || !e.target.files[0] || !data) return

    const file = e.target.files[0]

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setMessage({
        text: "Invalid file type. Please upload JPEG, PNG, WebP, or SVG.",
        type: "error",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setMessage({
        text: "File size exceeds 5MB limit.",
        type: "error",
      })
      return
    }

    // Check if there's an existing file at this path that needs to be marked for deletion
    const keys = fieldPath.split(".")
    let current: any = data

    // Navigate to the correct object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const index = Number(key)
      if (!isNaN(index) && Array.isArray(current)) {
        current = current[index]
      } else {
        current = current[key]
      }
    }

    // Get the last key
    const lastKey = keys[keys.length - 1]
    const existingPath = current[lastKey]

    // If there's an existing file path and it's not a URL, mark it for deletion
    if (existingPath && !existingPath.startsWith("http") && !existingPath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, existingPath])
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Store file and preview
    setSelectedFiles((prev) => ({
      ...prev,
      [fieldPath]: file,
    }))

    setImagePreviews((prev) => ({
      ...prev,
      [fieldPath]: previewUrl,
    }))

    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleDeleteImage = (fieldPath: string) => {
    if (!data) return

    // Get the current image path from data
    const keys = fieldPath.split(".")
    let current: any = data

    // Navigate to the correct object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const index = Number(key)
      if (!isNaN(index) && Array.isArray(current)) {
        current = current[index]
      } else {
        current = current[key]
      }
    }

    // Get the last key
    const lastKey = keys[keys.length - 1]
    const imagePath = current[lastKey]

    // If there's a valid image path that's not a URL, mark it for deletion
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      setFilesToDelete((prev) => [...prev, imagePath])
    }

    // Update data to clear the path
    handleChange(fieldPath, "")

    // Remove preview
    if (imagePreviews[fieldPath]) {
      const newPreviews = { ...imagePreviews }
      delete newPreviews[fieldPath]
      setImagePreviews(newPreviews)
    }

    // Clear selected file if there is one
    if (selectedFiles[fieldPath]) {
      const newSelectedFiles = { ...selectedFiles }
      delete newSelectedFiles[fieldPath]
      setSelectedFiles(newSelectedFiles)
    }
  }

  const uploadFiles = async () => {
    const uploads = Object.entries(selectedFiles).map(async ([fieldPath, file]) => {
      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `footer-${fieldPath.replace(/\./g, "-")}-${timestamp}-${randomString}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from("footer-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

      if (uploadError) throw uploadError

      return { fieldPath, fileName }
    })

    return Promise.all(uploads)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data || !recordId) return

    setSaving(true)
    setMessage({ text: "", type: "" })

    try {
      // First upload all selected files
      const uploadResults = await uploadFiles()

      // Create a copy of the form data to update with new file paths
      const updatedData = JSON.parse(JSON.stringify(data))

      // Update the data with new file paths
      uploadResults.forEach(({ fieldPath, fileName }) => {
        const keys = fieldPath.split(".")
        let current: any = updatedData

        // Navigate to the correct object
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i]
          const index = Number(key)
          if (!isNaN(index) && Array.isArray(current)) {
            current = current[index]
          } else {
            current = current[key]
          }
        }

        // Update the path
        const lastKey = keys[keys.length - 1]
        current[lastKey] = fileName
      })

      // Save the updated data to Supabase
      const { error } = await supabase.from("footer_section").update(updatedData).eq("id", recordId)

      if (error) throw error

      // After successful update, delete all marked files
      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from("footer-images").remove(filesToDelete)

        if (deleteError) {
          console.error("Error deleting old files:", deleteError)
          // Don't throw error here, just log it - we don't want to fail the whole operation
        }
      }

      setMessage({ text: "Footer updated successfully!", type: "success" })
      setSelectedFiles({})
      setFilesToDelete([])
      await fetchData()
    } catch (err: any) {
      console.error("Error saving footer data:", err)
      setMessage({ text: "Failed to save footer. Please try again.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
            <Skeleton className="h-8 w-24 bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-40 w-full bg-white/5" />
        <Skeleton className="h-40 w-full bg-white/5" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div>
      {/* Content Tabs */}
      <div className="mb-8">
        <div className="flex justify-center w-full">
          <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg p-1 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "company"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Company Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "links"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Links & Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("locations")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "locations"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Locations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("legal")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "legal"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              Legal
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Info Tab */}
        {activeTab === "company" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Company Info</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_info.logoSrc">Logo</Label>
                {(data.company_info.logoSrc || imagePreviews["company_info.logoSrc"]) && (
                  <div className="mb-2 w-24 h-24 relative">
                    <Image
                      src={imagePreviews["company_info.logoSrc"] || getImageUrl(data.company_info.logoSrc)}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={() => handleDeleteImage("company_info.logoSrc")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleFileSelect(e, "company_info.logoSrc")}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_info.heading">Heading</Label>
                <Input
                  id="company_info.heading"
                  value={data.company_info.heading}
                  onChange={(e) => handleChange("company_info.heading", e.target.value)}
                  placeholder="Enter company heading"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_info.description">Description</Label>
                <Textarea
                  id="company_info.description"
                  value={data.company_info.description}
                  onChange={(e) => handleChange("company_info.description", e.target.value)}
                  rows={3}
                  placeholder="Enter company description"
                  className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-medium">Newsletter</h3>
              <div className="space-y-2">
                <Label htmlFor="newsletter.heading">Heading</Label>
                <Input
                  id="newsletter.heading"
                  value={data.newsletter.heading}
                  onChange={(e) => handleChange("newsletter.heading", e.target.value)}
                  placeholder="Enter newsletter heading"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter.placeholder">Placeholder</Label>
                <Input
                  id="newsletter.placeholder"
                  value={data.newsletter.placeholder}
                  onChange={(e) => handleChange("newsletter.placeholder", e.target.value)}
                  placeholder="Enter input placeholder"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter.buttonText">Button Text</Label>
                <Input
                  id="newsletter.buttonText"
                  value={data.newsletter.buttonText}
                  onChange={(e) => handleChange("newsletter.buttonText", e.target.value)}
                  placeholder="Enter button text"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter.buttonIcon">Button Icon</Label>
                {(data.newsletter.buttonIcon || imagePreviews["newsletter.buttonIcon"]) && (
                  <div className="mb-2 w-16 h-16 relative">
                    <Image
                      src={imagePreviews["newsletter.buttonIcon"] || getImageUrl(data.newsletter.buttonIcon)}
                      alt="Button Icon"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={() => handleDeleteImage("newsletter.buttonIcon")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={newsletterIconInputRef}
                    onChange={(e) => handleFileSelect(e, "newsletter.buttonIcon")}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => newsletterIconInputRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Button Icon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links & Social Tab */}
        {activeTab === "links" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quick Links</h2>
              <Button
                type="button"
                onClick={addQuickLink}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>

            {data.quick_links.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No quick links added yet. Click the "Add Link" button to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {data.quick_links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Input
                      value={link.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          quick_links: data.quick_links.map((l, i) =>
                            i === index ? { ...l, name: e.target.value } : l,
                          ),
                        })
                      }
                      placeholder="Link name"
                      className={inputStyles}
                    />
                    <Input
                      value={link.link}
                      onChange={(e) =>
                        setData({
                          ...data,
                          quick_links: data.quick_links.map((l, i) =>
                            i === index ? { ...l, link: e.target.value } : l,
                          ),
                        })
                      }
                      placeholder="Link URL"
                      className={inputStyles}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeQuickLink(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Social Media</h2>
                <Button
                  type="button"
                  onClick={addSocialMedia}
                  className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
                >
                  <Plus className="h-4 w-4" />
                  Add Social
                </Button>
              </div>

              {data.social_media.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                  No social media links added yet. Click the "Add Social" button to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.social_media.map((social, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 h-12 relative flex-shrink-0 bg-background/30 rounded-md">
                        {(social.iconSrc || imagePreviews[`social_media.${index}.iconSrc`]) && (
                          <Image
                            src={
                              imagePreviews[`social_media.${index || "/placeholder.svg"}.iconSrc`] ||
                              getImageUrl(social.iconSrc)
                            }
                            alt={social.name}
                            fill
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={social.name}
                            onChange={(e) =>
                              setData({
                                ...data,
                                social_media: data.social_media.map((sm, i) =>
                                  i === index ? { ...sm, name: e.target.value } : sm,
                                ),
                              })
                            }
                            placeholder="Social media name"
                            className={inputStyles}
                          />
                          <Input
                            value={social.link}
                            onChange={(e) =>
                              setData({
                                ...data,
                                social_media: data.social_media.map((sm, i) =>
                                  i === index ? { ...sm, link: e.target.value } : sm,
                                ),
                              })
                            }
                            placeholder="Social media link"
                            className={inputStyles}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={(el) => (socialMediaInputRefs.current[index] = el)}
                            onChange={(e) => handleFileSelect(e, `social_media.${index}.iconSrc`)}
                            className="hidden"
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => socialMediaInputRefs.current[index]?.click()}
                            className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                          >
                            <Upload className="h-4 w-4" />
                            {social.iconSrc ? "Change Icon" : "Upload Icon"}
                          </Button>
                          {social.iconSrc && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteImage(`social_media.${index}.iconSrc`)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Icon
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSocialMedia(index)}
                            className="ml-auto gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove Social
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === "locations" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Company Locations</h2>
              <Button
                type="button"
                onClick={addCompanyLocation}
                className={`gap-2 hover:bg-primary/15 hover:text-primary bg-background text-foreground ${buttonStyles}`}
              >
                <Plus className="h-4 w-4" />
                Add Location
              </Button>
            </div>

            {data.company_locations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed !border-white/10 rounded-lg">
                No locations added yet. Click the "Add Location" button to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {data.company_locations.map((loc, index) => (
                  <div key={index} className={`p-6 rounded-lg ${cardStyles}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Location #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCompanyLocation(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company_locations.${index}.name`}>Name</Label>
                        <Input
                          id={`company_locations.${index}.name`}
                          value={loc.name}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company_locations: data.company_locations.map((l, i) =>
                                i === index ? { ...l, name: e.target.value } : l,
                              ),
                            })
                          }
                          placeholder="Enter location name"
                          className={inputStyles}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company_locations.${index}.operation`}>Operational Location</Label>
                        <Input
                          id={`company_locations.${index}.operation`}
                          value={loc.operation}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company_locations: data.company_locations.map((l, i) =>
                                i === index ? { ...l, operation: e.target.value } : l,
                              ),
                            })
                          }
                          placeholder="Enter operation details"
                          className={inputStyles}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company_locations.${index}.address`}>Address</Label>
                        <Textarea
                          id={`company_locations.${index}.address`}
                          value={loc.address}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company_locations: data.company_locations.map((l, i) =>
                                i === index ? { ...l, address: e.target.value } : l,
                              ),
                            })
                          }
                          rows={3}
                          placeholder="Enter location address"
                          className={cn(inputStyles, "resize-y min-h-[100px] !h-auto")}
                          style={{ resize: "vertical" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company_locations.${index}.phoneNumbers`}>Phone Numbers</Label>
                        <Input
                          id={`company_locations.${index}.phoneNumbers`}
                          value={loc.phoneNumbers.join(", ")}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company_locations: data.company_locations.map((l, i) =>
                                i === index
                                  ? { ...l, phoneNumbers: e.target.value.split(",").map((s) => s.trim()) }
                                  : l,
                              ),
                            })
                          }
                          placeholder="Enter phone numbers (comma separated)"
                          className={inputStyles}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company_locations.${index}.mapSrc`}>Map URL</Label>
                        <Input
                          id={`company_locations.${index}.mapSrc`}
                          value={loc.mapSrc}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company_locations: data.company_locations.map((l, i) =>
                                i === index ? { ...l, mapSrc: e.target.value } : l,
                              ),
                            })
                          }
                          placeholder="Enter map URL"
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Legal Tab */}
        {activeTab === "legal" && (
          <div className={`space-y-6 p-6 rounded-lg ${cardStyles}`}>
            <h2 className="text-xl font-semibold">Legal Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legal.terms">Terms URL</Label>
                <Input
                  id="legal.terms"
                  value={data.legal.terms}
                  onChange={(e) => handleChange("legal.terms", e.target.value)}
                  placeholder="Enter terms URL"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legal.privacy">Privacy URL</Label>
                <Input
                  id="legal.privacy"
                  value={data.legal.privacy}
                  onChange={(e) => handleChange("legal.privacy", e.target.value)}
                  placeholder="Enter privacy URL"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legal.copyright">Copyright</Label>
                <Input
                  id="legal.copyright"
                  value={data.legal.copyright}
                  onChange={(e) => handleChange("legal.copyright", e.target.value)}
                  placeholder="Enter copyright text"
                  className={inputStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legal.chevronIcon">Chevron Icon</Label>
                {(data.legal.chevronIcon || imagePreviews["legal.chevronIcon"]) && (
                  <div className="mb-2 w-12 h-12 relative">
                    <Image
                      src={imagePreviews["legal.chevronIcon"] || getImageUrl(data.legal.chevronIcon)}
                      alt="Chevron Icon"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={() => handleDeleteImage("legal.chevronIcon")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={legalChevronInputRef}
                    onChange={(e) => handleFileSelect(e, "legal.chevronIcon")}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => legalChevronInputRef.current?.click()}
                    className={`gap-2 hover:bg-background/80 hover:text-foreground bg-background text-foreground ${buttonStyles}`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Chevron Icon
                  </Button>
                </div>
              </div>
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
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Footer
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
            disabled={saving}
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

