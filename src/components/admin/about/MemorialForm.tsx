"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

type MemorialData = {
  fullMessage: string;
  title: string;
  years: string;
  image: {
    src: string;
    alt: string;
  };
};

export default function MemorialForm() {
  const [formData, setFormData] = useState<MemorialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Ref for the image file input
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/memorial");
      if (!res.ok) throw new Error("Failed to fetch memorial data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      setMessage({ text: "Failed to load memorial data.", type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field: keyof MemorialData, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageUpload = async () => {
    if (!imageInputRef.current?.files || !imageInputRef.current.files[0] || !formData)
      return;
    const file = imageInputRef.current.files[0];
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", formData.image.src || "");
    try {
      const res = await fetch("/api/aboutpage/memorial/upload?field=memorialImage", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (result.imagePath) {
        setFormData({
          ...formData,
          image: {
            ...formData.image,
            src: result.imagePath,
          },
        });
      }
    } catch (error) {
      setMessage({ text: "Image upload failed. Please try again.", type: "error" });
      console.error(error);
    }
  };

  const handleImageDelete = async () => {
    if (!formData || !formData.image.src) return;
    try {
      const res = await fetch("/api/aboutpage/memorial/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: formData.image.src }),
      });
      if (res.ok) {
        setFormData({
          ...formData,
          image: {
            ...formData.image,
            src: "",
          },
        });
      }
    } catch (error) {
      setMessage({ text: "Failed to delete image. Please try again.", type: "error" });
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/aboutpage/memorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save memorial data");
      setMessage({ text: "Memorial data updated successfully", type: "success" });
      await fetchData();
    } catch (error) {
      setMessage({ text: "Failed to save changes", type: "error" });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Memorial Section</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullMessage">Full Message</Label>
            <Textarea
              id="fullMessage"
              value={formData.fullMessage}
              onChange={(e) => handleChange("fullMessage", e.target.value)}
              placeholder="Enter full message"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Years</Label>
            <Input
              id="years"
              value={formData.years}
              onChange={(e) => handleChange("years", e.target.value)}
              placeholder="Enter years (e.g. 1950 - 2023)"
            />
          </div>
          <div className="space-y-2">
            <Label>Memorial Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => imageInputRef.current?.click()}
              >
                {formData.image.src ? "Change Image" : "Upload Image"}
              </Button>
              {formData.image.src && (
                <Button type="button" variant="destructive" onClick={handleImageDelete}>
                  Remove Image
                </Button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/svg+xml, image/png, image/jpeg"
              />
            </div>
            {formData.image.src && (
              <div className="mt-2 relative h-48 w-48">
                <Image
                  src={formData.image.src}
                  alt={formData.image.alt || "Memorial Image"}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={fetchData} disabled={isSaving}>
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mt-4">
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
