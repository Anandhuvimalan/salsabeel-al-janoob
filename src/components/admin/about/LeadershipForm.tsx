"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Upload, RefreshCw, Save, Plus, Minus, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LeadershipData = {
  banner: string;
  heading: string;
  profiles: {
    name: string;
    role: string;
    description: string;
    image: { src: string; alt: string };
    contacts: { phone?: string[]; email?: string };
  }[];
};

export default function LeadershipSectionForm() {
  const [formData, setFormData] = useState<LeadershipData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const profileImageRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchLeadershipData();
  }, []);

  const fetchLeadershipData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/leadership");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching leadership data:", error);
      setMessage({ text: "Failed to load leadership data. Please refresh the page.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return;
    setFormData((prev) => (updateNestedObject(prev!, path.split("."), value)));
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  const addProfile = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profiles: [
          ...prev.profiles,
          {
            name: "New Leader",
            role: "",
            description: "",
            image: { src: "", alt: "" },
            contacts: { phone: [], email: "" }
          }
        ]
      };
    });
  };

  const removeProfile = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profiles: prev.profiles.filter((_, i) => i !== index)
      };
    });
  };

  const handleImageUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);

    try {
      const res = await fetch(`/api/aboutpage/leadership/upload?field=profile`, {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();

      setFormData((prev) => {
        if (!prev) return prev;
        const updatedProfiles = [...prev.profiles];
        updatedProfiles[index] = {
          ...updatedProfiles[index],
          image: { ...updatedProfiles[index].image, src: imagePath },
        };
        return { ...prev, profiles: updatedProfiles };
      });
    } catch (error) {
      setMessage({ text: "Image upload failed. Please try again.", type: "error" });
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!formData) return;
    const imagePath = formData.profiles[index].image.src;
    if (!imagePath) return;

    try {
      const res = await fetch("/api/aboutpage/leadership/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      });
      if (res.ok) {
        setFormData((prev) => {
          if (!prev) return prev;
          const updatedProfiles = [...prev.profiles];
          updatedProfiles[index] = {
            ...updatedProfiles[index],
            image: { ...updatedProfiles[index].image, src: "" },
          };
          return { ...prev, profiles: updatedProfiles };
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage({ text: "Failed to delete image. Please try again.", type: "error" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false;
    if (!formData.banner.trim()) newErrors["banner"] = "Banner text is required";
    if (!formData.heading.trim()) newErrors["heading"] = "Heading is required";
    formData.profiles.forEach((profile, index) => {
      if (!profile.name.trim()) newErrors[`profiles.${index}.name`] = "Name is required";
      if (!profile.role.trim()) newErrors[`profiles.${index}.role`] = "Role is required";
      if (!profile.description.trim()) newErrors[`profiles.${index}.description`] = "Description is required";
      if (!profile.image.src) newErrors[`profiles.${index}.image`] = "Profile image is required";
      if (profile.contacts.email && !profile.contacts.email.includes("@"))
        newErrors[`profiles.${index}.contacts.email`] = "Invalid email address";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) {
      setMessage({ text: "Please fix the errors in the form", type: "error" });
      return;
    }
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/aboutpage/leadership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Leadership data updated successfully!", type: "success" });
      await fetchLeadershipData();
    } catch (error) {
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
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
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Leadership Section</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner">Banner</Label>
              <Input
                id="banner"
                value={formData.banner}
                onChange={(e) => handleTextChange("banner", e.target.value)}
                placeholder="Enter banner text"
                className={errors["banner"] ? "border-destructive" : ""}
              />
              {errors["banner"] && <p className="text-sm text-destructive">{errors["banner"]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={formData.heading}
                onChange={(e) => handleTextChange("heading", e.target.value)}
                placeholder="Enter heading"
                className={errors["heading"] ? "border-destructive" : ""}
              />
              {errors["heading"] && <p className="text-sm text-destructive">{errors["heading"]}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Profiles</h2>
            <Button type="button" onClick={addProfile} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </div>

          {formData.profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No profiles added yet. Click "Add Profile" to get started.
            </div>
          ) : (
            formData.profiles.map((profile, index) => (
              <div key={index} className="p-6 border rounded-lg bg-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Profile #{index + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeProfile(index)} className="gap-2">
                    <Minus className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`profiles.${index}.name`}>Name</Label>
                    <Input
                      id={`profiles.${index}.name`}
                      value={profile.name}
                      onChange={(e) => handleTextChange(`profiles.${index}.name`, e.target.value)}
                      placeholder="Enter name"
                      className={errors[`profiles.${index}.name`] ? "border-destructive" : ""}
                    />
                    {errors[`profiles.${index}.name`] && <p className="text-sm text-destructive">{errors[`profiles.${index}.name`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`profiles.${index}.role`}>Role</Label>
                    <Input
                      id={`profiles.${index}.role`}
                      value={profile.role}
                      onChange={(e) => handleTextChange(`profiles.${index}.role`, e.target.value)}
                      placeholder="Enter role"
                      className={errors[`profiles.${index}.role`] ? "border-destructive" : ""}
                    />
                    {errors[`profiles.${index}.role`] && <p className="text-sm text-destructive">{errors[`profiles.${index}.role`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`profiles.${index}.description`}>Description</Label>
                    <Textarea
                      id={`profiles.${index}.description`}
                      value={profile.description}
                      onChange={(e) => handleTextChange(`profiles.${index}.description`, e.target.value)}
                      placeholder="Enter description"
                      className={errors[`profiles.${index}.description`] ? "border-destructive" : ""}
                      rows={3}
                    />
                    {errors[`profiles.${index}.description`] && <p className="text-sm text-destructive">{errors[`profiles.${index}.description`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="secondary" onClick={() => profileImageRefs.current[index]?.click()} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                      <input
                        ref={(el) => (profileImageRefs.current[index] = el)}
                        type="file"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            await handleImageUpload(e.target.files[0], index, profile.image.src);
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                      {profile.image.src && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteImage(index)} className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Remove Image
                        </Button>
                      )}
                    </div>
                    {profile.image.src && (
                      <Card className="mt-4 overflow-hidden w-32 h-32 relative">
                        <Image
                          src={profile.image.src}
                          alt={profile.image.alt}
                          fill
                          className="object-cover"
                        />
                      </Card>
                    )}
                    {errors[`profiles.${index}.image`] && <p className="text-sm text-destructive">{errors[`profiles.${index}.image`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`profiles.${index}.contacts.email`}>Email</Label>
                    <Input
                      id={`profiles.${index}.contacts.email`}
                      value={profile.contacts.email}
                      onChange={(e) => handleTextChange(`profiles.${index}.contacts.email`, e.target.value)}
                      placeholder="Enter email"
                      className={errors[`profiles.${index}.contacts.email`] ? "border-destructive" : ""}
                    />
                    {errors[`profiles.${index}.contacts.email`] && <p className="text-sm text-destructive">{errors[`profiles.${index}.contacts.email`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Numbers</Label>
                    {(profile.contacts.phone || []).map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={phone}
                          onChange={(e) => {
                            const newPhone = e.target.value;
                            setFormData((prev) => {
                              if (!prev) return prev;
                              const updatedProfiles = [...prev.profiles];
                              const phones = updatedProfiles[index].contacts.phone || [];
                              phones[idx] = newPhone;
                              updatedProfiles[index].contacts.phone = phones;
                              return { ...prev, profiles: updatedProfiles };
                            });
                          }}
                          placeholder="Enter phone number"
                        />
                        <Button type="button" variant="destructive" size="sm" onClick={() => {
                          setFormData((prev) => {
                            if (!prev) return prev;
                            const updatedProfiles = [...prev.profiles];
                            updatedProfiles[index].contacts.phone = (updatedProfiles[index].contacts.phone || []).filter((_, i) => i !== idx);
                            return { ...prev, profiles: updatedProfiles };
                          });
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
  type="button"
  onClick={() => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedProfiles = [...prev.profiles];
      const currentPhones = updatedProfiles[index].contacts.phone || [];
      // Only add a new phone if there are no phone numbers or the last one isn't empty
      if (currentPhones.length === 0 || currentPhones[currentPhones.length - 1].trim() !== "") {
        updatedProfiles[index].contacts.phone = [...currentPhones, ""];
      }
      return { ...prev, profiles: updatedProfiles };
    });
  }}
  className="gap-2"
>
  <Plus className="h-4 w-4" />
  Add Phone
</Button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 pt-6 border-t">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Leadership Section
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={fetchLeadershipData} disabled={isSaving} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

// Helper function to update nested objects
function updateNestedObject(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const [current, ...rest] = path;
  const index = Number(current);
  if (!isNaN(index)) {
    const newArr = Array.isArray(obj) ? [...obj] : [];
    newArr[index] = updateNestedObject(newArr[index], rest, value);
    return newArr;
  } else {
    return {
      ...obj,
      [current]: updateNestedObject(obj ? obj[current] : undefined, rest, value),
    };
  }
}
