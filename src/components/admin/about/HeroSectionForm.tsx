"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type HeroData = {
  background: {
    image: string;
    alt: string;
  };
  content: {
    badge: string;
    mainTitle: string;
    highlightText: string;
    description: string;
    button: {
      text: string;
      link: string;
    };
  };
};

export default function HeroForm() {
  const [formData, setFormData] = useState<HeroData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/aboutpage/herosection");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      setMessage({ text: "Failed to load hero data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (path: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const keys = path.split(".");
      const lastKey = keys.pop()!;
      const nested = keys.reduce((obj, key) => obj[key as keyof typeof obj], prev as any);
      (nested as any)[lastKey] = value;
      return { ...prev };
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!formData) return;

    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", formData.background.image);

    try {
      const res = await fetch("/api/aboutpage/herosection/upload", {
        method: "POST",
        body: form,
      });

      const { imagePath } = await res.json();
      
      setFormData(prev => ({
        ...prev!,
        background: {
          ...prev!.background,
          image: imagePath
        }
      }));
    } catch (error) {
      setMessage({ text: "Image upload failed", type: "error" });
    }
  };

  const handleDeleteImage = async () => {
    if (!formData?.background.image) return;

    try {
      await fetch("/api/aboutpage/herosection/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: formData.background.image }),
      });

      setFormData(prev => ({
        ...prev!,
        background: {
          ...prev!.background,
          image: ""
        }
      }));
    } catch (error) {
      setMessage({ text: "Image delete failed", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await fetch("/api/aboutpage/herosection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Save failed");
      
      setMessage({ text: "Hero section saved successfully!", type: "success" });
      await fetchData();
    } catch (error) {
      setMessage({ text: "Failed to save changes", type: "error" });
    }
  };

  if (isLoading || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          <AlertTitle>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Background Image Section */}
        <div className="space-y-4">
          <Label>Background Image</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  await handleImageUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            {formData.background.image && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteImage}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Image
              </Button>
            )}
          </div>
          
          {formData.background.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image
                src={formData.background.image}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Content Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={formData.content.badge}
              onChange={(e) => handleTextChange("content.badge", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input
              value={formData.content.mainTitle}
              onChange={(e) => handleTextChange("content.mainTitle", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Highlighted Text</Label>
            <Input
              value={formData.content.highlightText}
              onChange={(e) => handleTextChange("content.highlightText", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.content.description}
              onChange={(e) => handleTextChange("content.description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={formData.content.button.text}
              onChange={(e) => handleTextChange("content.button.text", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={formData.content.button.link}
              onChange={(e) => handleTextChange("content.button.link", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={fetchData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  );
}