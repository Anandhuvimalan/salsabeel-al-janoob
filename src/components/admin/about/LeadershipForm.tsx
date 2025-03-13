"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"

interface Profile {
  id: string
  image: { src: string; alt: string }
  name: string
  role: string
  description: string
  contacts?: {
    phone?: string[]
    email?: string
  }
}

interface LeadershipData {
  banner: string
  heading: string
  profiles: Profile[]
}

export default function LeadershipSectionForm() {
  const [formData, setFormData] = useState<LeadershipData>({
    banner: "",
    heading: "",
    profiles: [],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({})
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("aboutpage_leadership")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, initialize with empty values
          setFormData({
            banner: "Our Leadership",
            heading: "Meet Our Leadership Team",
            profiles: [createEmptyProfile()],
          })
        } else {
          throw error
        }
      } else {
        // Add IDs to profiles if they don't exist
        const profilesWithIds = data.profiles.map((profile: any) => ({
          ...profile,
          id: profile.id || uuidv4(),
        }))

        setFormData({
          ...data,
          profiles: profilesWithIds.length > 0 ? profilesWithIds : [createEmptyProfile()],
        })

        // Set image previews for existing images
        const previews: { [key: string]: string } = {}
        profilesWithIds.forEach((profile: Profile) => {
          if (profile.image && profile.image.src) {
            previews[profile.id] = getImageUrl(profile.image.src)
          }
        })
        setImagePreview(previews)
      }
    } catch (error) {
      console.error("Error fetching leadership data:", error)
      setError("Failed to load leadership data")
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return ""

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("aboutpage-leadership-images").getPublicUrl(path).data.publicUrl
  }

  const createEmptyProfile = (): Profile => ({
    id: uuidv4(),
    image: { src: "", alt: "" },
    name: "",
    role: "",
    description: "",
    contacts: {
      phone: [""],
      email: "",
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleProfileChange = (index: number, field: string, value: any) => {
    const updatedProfiles = [...formData.profiles]

    if (field.startsWith("contacts.")) {
      const contactField = field.split(".")[1]
      updatedProfiles[index].contacts = {
        ...updatedProfiles[index].contacts,
        [contactField]: value,
      }
    } else if (field.startsWith("image.")) {
      const imageField = field.split(".")[1]
      updatedProfiles[index].image = {
        ...updatedProfiles[index].image,
        [imageField]: value,
      }
    } else {
      updatedProfiles[index][field as keyof Profile] = value
    }

    setFormData({ ...formData, profiles: updatedProfiles })
  }

  const handlePhoneChange = (profileIndex: number, phoneIndex: number, value: string) => {
    const updatedProfiles = [...formData.profiles]
    const phones = [...(updatedProfiles[profileIndex].contacts?.phone || [])]
    phones[phoneIndex] = value

    updatedProfiles[profileIndex].contacts = {
      ...updatedProfiles[profileIndex].contacts,
      phone: phones,
    }

    setFormData({ ...formData, profiles: updatedProfiles })
  }

  const addPhoneNumber = (profileIndex: number) => {
    const updatedProfiles = [...formData.profiles]
    const phones = [...(updatedProfiles[profileIndex].contacts?.phone || []), ""]

    updatedProfiles[profileIndex].contacts = {
      ...updatedProfiles[profileIndex].contacts,
      phone: phones,
    }

    setFormData({ ...formData, profiles: updatedProfiles })
  }

  const removePhoneNumber = (profileIndex: number, phoneIndex: number) => {
    const updatedProfiles = [...formData.profiles]
    const phones = [...(updatedProfiles[profileIndex].contacts?.phone || [])]
    phones.splice(phoneIndex, 1)

    updatedProfiles[profileIndex].contacts = {
      ...updatedProfiles[profileIndex].contacts,
      phone: phones,
    }

    setFormData({ ...formData, profiles: updatedProfiles })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFiles({ ...imageFiles, [profileId]: file })

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview({
          ...imagePreview,
          [profileId]: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addProfile = () => {
    setFormData({
      ...formData,
      profiles: [...formData.profiles, createEmptyProfile()],
    })
  }

  const removeProfile = (index: number) => {
    if (formData.profiles.length <= 1) {
      return // Keep at least one profile
    }

    const updatedProfiles = [...formData.profiles]
    const removedProfile = updatedProfiles[index]
    updatedProfiles.splice(index, 1)

    // Remove image preview and file if exists
    if (removedProfile.id) {
      const newImagePreview = { ...imagePreview }
      delete newImagePreview[removedProfile.id]
      setImagePreview(newImagePreview)

      const newImageFiles = { ...imageFiles }
      delete newImageFiles[removedProfile.id]
      setImageFiles(newImageFiles)
    }

    setFormData({ ...formData, profiles: updatedProfiles })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      // Upload images first
      const updatedProfiles = [...formData.profiles]

      for (let i = 0; i < updatedProfiles.length; i++) {
        const profile = updatedProfiles[i]
        const file = imageFiles[profile.id]

        if (file) {
          const fileName = `${profile.id}-${Date.now()}.${file.name.split(".").pop()}`

          const { error: uploadError } = await supabase.storage
            .from("aboutpage-leadership-images")
            .upload(fileName, file)

          if (uploadError) throw uploadError

          // Update the image path in the profile
          updatedProfiles[i].image.src = fileName
        }
      }

      // Save the data to Supabase
      const { error: upsertError } = await supabase.from("aboutpage_leadership").upsert({
        banner: formData.banner,
        heading: formData.heading,
        profiles: updatedProfiles,
      })

      if (upsertError) throw upsertError

      setSuccess(true)

      // Clear image files after successful upload
      setImageFiles({})
    } catch (error) {
      console.error("Error saving leadership data:", error)
      setError("Failed to save leadership data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {/* Section Content */}
        <div className="bg-card border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-l-4 border-primary pl-3">Section Content</h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="banner" className="text-sm font-medium">
                Banner Text
              </Label>
              <Input
                id="banner"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
                placeholder="Our Leadership"
                className="border-[0.5px] border-white/10 bg-background"
              />
              <p className="text-xs text-muted-foreground">This appears as a small highlight above the main heading</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading" className="text-sm font-medium">
                Section Heading
              </Label>
              <Input
                id="heading"
                name="heading"
                onChange={handleInputChange}
                value={formData.heading}
                placeholder="Meet Our Leadership Team"
                className="border-[0.5px] border-white/10 bg-background"
              />
              <p className="text-xs text-muted-foreground">The main title for the leadership section</p>
            </div>
          </div>
        </div>

        {/* Team Profiles */}
        <div className="bg-card border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-l-4 border-primary pl-3">Team Profiles</h3>

          <div className="space-y-6">
            {formData.profiles.map((profile, index) => (
              <div key={profile.id} className="border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-card/50 p-4 flex justify-between items-center border-b border-white/10">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProfile(index)}
                    disabled={formData.profiles.length <= 1}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="p-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor={`profile-${index}-name`}>Name</Label>
                        <Input
                          id={`profile-${index}-name`}
                          value={profile.name}
                          onChange={(e) => handleProfileChange(index, "name", e.target.value)}
                          placeholder="John Doe"
                          className="border-[0.5px] border-white/10 bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`profile-${index}-role`}>Role</Label>
                        <Input
                          id={`profile-${index}-role`}
                          value={profile.role}
                          onChange={(e) => handleProfileChange(index, "role", e.target.value)}
                          placeholder="CEO"
                          className="border-[0.5px] border-white/10 bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`profile-${index}-description`}>Description</Label>
                        <Textarea
                          id={`profile-${index}-description`}
                          value={profile.description}
                          onChange={(e) => handleProfileChange(index, "description", e.target.value)}
                          placeholder="Brief description about the team member"
                          className="min-h-[120px] resize-y border-[0.5px] border-white/10 bg-background"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor={`profile-${index}-image`}>Profile Image</Label>
                        <div className="bg-card/50 border border-white/10 rounded-lg p-4">
                          <div className="relative h-40 bg-muted rounded-md overflow-hidden mb-3">
                            {imagePreview[profile.id] ? (
                              <Image
                                src={imagePreview[profile.id] || "/placeholder.svg"}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              id={`profile-${index}-image`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, profile.id)}
                              className="hidden"
                            />
                            <Label
                              htmlFor={`profile-${index}-image`}
                              className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {imageFiles[profile.id] ? "Change Image" : "Upload Image"}
                            </Label>
                          </div>
                          <div className="mt-3">
                            <Label htmlFor={`profile-${index}-image-alt`} className="text-xs">
                              Image Alt Text
                            </Label>
                            <Input
                              id={`profile-${index}-image-alt`}
                              value={profile.image.alt}
                              onChange={(e) => handleProfileChange(index, "image.alt", e.target.value)}
                              placeholder="Photo of John Doe"
                              className="mt-1 border-[0.5px] border-white/10 bg-background text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-card/50 border border-white/10 rounded-lg p-4 space-y-4">
                        <Label className="text-sm font-medium">Contact Information</Label>

                        <div className="space-y-2">
                          <Label htmlFor={`profile-${index}-email`} className="text-xs">
                            Email
                          </Label>
                          <Input
                            id={`profile-${index}-email`}
                            value={profile.contacts?.email || ""}
                            onChange={(e) => handleProfileChange(index, "contacts.email", e.target.value)}
                            placeholder="john@example.com"
                            className="border-[0.5px] border-white/10 bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Phone Numbers</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addPhoneNumber(index)}
                              className="text-primary hover:text-primary/90 hover:bg-primary/10 h-7 text-xs"
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Add Phone
                            </Button>
                          </div>

                          {profile.contacts?.phone?.map((phone, phoneIndex) => (
                            <div key={phoneIndex} className="flex items-center gap-2">
                              <Input
                                value={phone}
                                onChange={(e) => handlePhoneChange(index, phoneIndex, e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="flex-1 border-[0.5px] border-white/10 bg-background text-sm"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePhoneNumber(index, phoneIndex)}
                                disabled={profile.contacts?.phone?.length === 1}
                                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addProfile}
              className="w-full flex items-center justify-center gap-2 bg-transparent border border-dashed border-white/10 text-white hover:bg-primary/5 hover:border-white/20 py-3"
            >
              <PlusCircle className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-card border border-white/10 rounded-lg p-6">
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
            {loading ? "Saving..." : "Save Leadership Section"}
          </Button>

          {error && <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-center">{error}</div>}

          {success && (
            <div className="mt-4 p-3 rounded-md bg-green-500/10 text-green-500 text-center">
              Leadership section updated successfully!
            </div>
          )}
        </div>
      </div>
    </form>
  )
}

