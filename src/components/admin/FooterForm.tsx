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
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface FooterData {
  companyInfo: {
    logoSrc: string
    heading: string
    description: string
  }
  quickLinks: { name: string; link: string }[]
  newsletter: {
    heading: string
    placeholder: string
    buttonText: string
    buttonIcon: string
  }
  socialMedia: { iconSrc: string; name: string; link: string }[]
  companyLocations: {
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

  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const newsletterIconInputRef = useRef<HTMLInputElement | null>(null)
  const legalChevronInputRef = useRef<HTMLInputElement | null>(null)
  const socialMediaInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch("/api/homepage/footer")
      if (!res.ok) throw new Error("Failed to fetch footer data")
      const json: FooterData = await res.json()
      setData(json)
    } catch (err: any) {
      setMessage({ text: "Failed to load footer data. Please refresh the page.", type: "error" })
    } finally {
      setLoading(false)
    }
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

  // For arrays like quickLinks, socialMedia, companyLocations we update directly
  const addQuickLink = () => {
    if (!data) return
    setData({ ...data, quickLinks: [...data.quickLinks, { name: "New Link", link: "/" }] })
  }
  const removeQuickLink = (index: number) => {
    if (!data) return
    setData({ ...data, quickLinks: data.quickLinks.filter((_, i) => i !== index) })
  }

  const addSocialMedia = () => {
    if (!data) return
    setData({ ...data, socialMedia: [...data.socialMedia, { iconSrc: "", name: "New Social", link: "#" }] })
  }
  const removeSocialMedia = (index: number) => {
    if (!data) return
    setData({ ...data, socialMedia: data.socialMedia.filter((_, i) => i !== index) })
  }

  const addCompanyLocation = () => {
    if (!data) return
    setData({
      ...data,
      companyLocations: [
        ...data.companyLocations,
        { name: "New Location", operation: "", address: "", phoneNumbers: [""], mapSrc: "" },
      ],
    })
  }
  const removeCompanyLocation = (index: number) => {
    if (!data) return
    setData({ ...data, companyLocations: data.companyLocations.filter((_, i) => i !== index) })
  }

  // Generic image upload handler
  const handleImageUpload = async (file: File, fieldPath: string, oldPath: string) => {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("oldImagePath", oldPath)
    try {
      const res = await fetch("/api/homepage/footer/upload", {
        method: "POST",
        body: formData,
      })
      const { imagePath } = await res.json()
      handleChange(fieldPath, imagePath)
    } catch (err) {
      console.error("Image upload failed", err)
      setMessage({ text: "Image upload failed. Please try again.", type: "error" })
    }
  }

  const handleDeleteImage = async (fieldPath: string, currentPath: string) => {
    if (!currentPath) return
    try {
      const res = await fetch("/api/homepage/footer/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: currentPath }),
      })
      if (res.ok) {
        handleChange(fieldPath, "")
      }
    } catch (err) {
      console.error("Image deletion failed", err)
      setMessage({ text: "Image deletion failed. Please try again.", type: "error" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setMessage({ text: "", type: "" })
    try {
      const res = await fetch("/api/homepage/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to save footer data")
      setMessage({ text: "Footer updated successfully!", type: "success" })
      await fetchData()
    } catch (err: any) {
      setMessage({ text: "Failed to save footer. Please try again.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
        {/* Company Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Company Info</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyInfo.logoSrc">Logo</Label>
              {data.companyInfo.logoSrc && (
                <div className="mb-2 w-24 h-24 relative">
                  <Image
                    src={data.companyInfo.logoSrc || "/placeholder.svg"}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleDeleteImage("companyInfo.logoSrc", data.companyInfo.logoSrc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleImageUpload(e.target.files[0], "companyInfo.logoSrc", data.companyInfo.logoSrc)
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <Button type="button" variant="secondary" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyInfo.heading">Heading</Label>
              <Input
                id="companyInfo.heading"
                value={data.companyInfo.heading}
                onChange={(e) => handleChange("companyInfo.heading", e.target.value)}
                placeholder="Enter company heading"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyInfo.description">Description</Label>
              <Textarea
                id="companyInfo.description"
                value={data.companyInfo.description}
                onChange={(e) => handleChange("companyInfo.description", e.target.value)}
                rows={3}
                placeholder="Enter company description"
              />
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <Button type="button" onClick={addQuickLink} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
          {data.quickLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Input
                value={link.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    quickLinks: data.quickLinks.map((l, i) => (i === index ? { ...l, name: e.target.value } : l)),
                  })
                }
                placeholder="Link name"
              />
              <Input
                value={link.link}
                onChange={(e) =>
                  setData({
                    ...data,
                    quickLinks: data.quickLinks.map((l, i) => (i === index ? { ...l, link: e.target.value } : l)),
                  })
                }
                placeholder="Link URL"
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => removeQuickLink(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </Card>

        {/* Newsletter */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter.heading">Heading</Label>
              <Input
                id="newsletter.heading"
                value={data.newsletter.heading}
                onChange={(e) => handleChange("newsletter.heading", e.target.value)}
                placeholder="Enter newsletter heading"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter.placeholder">Placeholder</Label>
              <Input
                id="newsletter.placeholder"
                value={data.newsletter.placeholder}
                onChange={(e) => handleChange("newsletter.placeholder", e.target.value)}
                placeholder="Enter input placeholder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter.buttonText">Button Text</Label>
              <Input
                id="newsletter.buttonText"
                value={data.newsletter.buttonText}
                onChange={(e) => handleChange("newsletter.buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter.buttonIcon">Button Icon</Label>
              {data.newsletter.buttonIcon && (
                <div className="mb-2 w-16 h-16 relative">
                  <Image
                    src={data.newsletter.buttonIcon || "/placeholder.svg"}
                    alt="Button Icon"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleDeleteImage("newsletter.buttonIcon", data.newsletter.buttonIcon)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={newsletterIconInputRef}
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleImageUpload(e.target.files[0], "newsletter.buttonIcon", data.newsletter.buttonIcon)
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <Button type="button" variant="secondary" onClick={() => newsletterIconInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Button Icon
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Social Media</h2>
            <Button type="button" onClick={addSocialMedia} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Social
            </Button>
          </div>
          {data.socialMedia.map((social, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 relative">
                {social.iconSrc && (
                  <>
                    <Image
                      src={social.iconSrc || "/placeholder.svg"}
                      alt={social.name}
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => handleDeleteImage(`socialMedia.${index}.iconSrc`, social.iconSrc)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <Input
                value={social.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialMedia: data.socialMedia.map((sm, i) => (i === index ? { ...sm, name: e.target.value } : sm)),
                  })
                }
                placeholder="Social media name"
              />
              <Input
                value={social.link}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialMedia: data.socialMedia.map((sm, i) => (i === index ? { ...sm, link: e.target.value } : sm)),
                  })
                }
                placeholder="Social media link"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={(el) => (socialMediaInputRefs.current[index] = el)}
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleImageUpload(e.target.files[0], `socialMedia.${index}.iconSrc`, social.iconSrc)
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <Button type="button" variant="secondary" onClick={() => socialMediaInputRefs.current[index]?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Icon
                </Button>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeSocialMedia(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </Card>

        {/* Company Locations */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Company Locations</h2>
            <Button type="button" onClick={addCompanyLocation} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </div>
          {data.companyLocations.map((loc, index) => (
            <Card key={index} className="p-6 mb-4">
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
                  <Label htmlFor={`companyLocations.${index}.name`}>Name</Label>
                  <Input
                    id={`companyLocations.${index}.name`}
                    value={loc.name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        companyLocations: data.companyLocations.map((l, i) =>
                          i === index ? { ...l, name: e.target.value } : l,
                        ),
                      })
                    }
                    placeholder="Enter location name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`companyLocations.${index}.operation`}>Operation</Label>
                  <Input
                    id={`companyLocations.${index}.operation`}
                    value={loc.operation}
                    onChange={(e) =>
                      setData({
                        ...data,
                        companyLocations: data.companyLocations.map((l, i) =>
                          i === index ? { ...l, operation: e.target.value } : l,
                        ),
                      })
                    }
                    placeholder="Enter operation details"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`companyLocations.${index}.address`}>Address</Label>
                  <Textarea
                    id={`companyLocations.${index}.address`}
                    value={loc.address}
                    onChange={(e) =>
                      setData({
                        ...data,
                        companyLocations: data.companyLocations.map((l, i) =>
                          i === index ? { ...l, address: e.target.value } : l,
                        ),
                      })
                    }
                    rows={3}
                    placeholder="Enter location address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`companyLocations.${index}.phoneNumbers`}>Phone Numbers</Label>
                  <Input
                    id={`companyLocations.${index}.phoneNumbers`}
                    value={loc.phoneNumbers.join(", ")}
                    onChange={(e) =>
                      setData({
                        ...data,
                        companyLocations: data.companyLocations.map((l, i) =>
                          i === index ? { ...l, phoneNumbers: e.target.value.split(",").map((s) => s.trim()) } : l,
                        ),
                      })
                    }
                    placeholder="Enter phone numbers (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`companyLocations.${index}.mapSrc`}>Map URL</Label>
                  <Input
                    id={`companyLocations.${index}.mapSrc`}
                    value={loc.mapSrc}
                    onChange={(e) =>
                      setData({
                        ...data,
                        companyLocations: data.companyLocations.map((l, i) =>
                          i === index ? { ...l, mapSrc: e.target.value } : l,
                        ),
                      })
                    }
                    placeholder="Enter map URL"
                  />
                </div>
              </div>
            </Card>
          ))}
        </Card>

        {/* Legal */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Legal</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legal.terms">Terms URL</Label>
              <Input
                id="legal.terms"
                value={data.legal.terms}
                onChange={(e) => handleChange("legal.terms", e.target.value)}
                placeholder="Enter terms URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal.privacy">Privacy URL</Label>
              <Input
                id="legal.privacy"
                value={data.legal.privacy}
                onChange={(e) => handleChange("legal.privacy", e.target.value)}
                placeholder="Enter privacy URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal.copyright">Copyright</Label>
              <Input
                id="legal.copyright"
                value={data.legal.copyright}
                onChange={(e) => handleChange("legal.copyright", e.target.value)}
                placeholder="Enter copyright text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal.chevronIcon">Chevron Icon</Label>
              {data.legal.chevronIcon && (
                <div className="mb-2 w-12 h-12 relative">
                  <Image
                    src={data.legal.chevronIcon || "/placeholder.svg"}
                    alt="Chevron Icon"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleDeleteImage("legal.chevronIcon", data.legal.chevronIcon)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={legalChevronInputRef}
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleImageUpload(e.target.files[0], "legal.chevronIcon", data.legal.chevronIcon)
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <Button type="button" variant="secondary" onClick={() => legalChevronInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Chevron Icon
                </Button>
              </div>
            </div>
          </div>
        </Card>

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
                Update Footer
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

