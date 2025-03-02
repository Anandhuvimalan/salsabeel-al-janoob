"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Upload,
  RefreshCw,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TestimonialItem {
  name: string;
  title: string;
  message: string;
  image: string;
}

interface TestimonialData {
  section: {
    heading: string;
    descriptions: string[];
  };
  testimonials: TestimonialItem[];
}

export default function TestimonialForm() {
  const [data, setData] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/homepage/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials data");
      const json = await res.json();
      setData(json);
      setMessage({ text: "", type: "" });
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: "Failed to load testimonial data. Please refresh the page.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to update nested state
  const updateNestedState = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value;
    const [current, ...rest] = path;
    const index = Number(current);
    if (!isNaN(index)) {
      const newArr = Array.isArray(obj) ? [...obj] : [];
      newArr[index] = updateNestedState(newArr[index], rest, value);
      return newArr;
    }
    return {
      ...obj,
      [current]: updateNestedState(obj ? obj[current] : undefined, rest, value),
    };
  };

  const handleChange = (path: string, value: string) => {
    if (!data) return;
    setData((prev) => updateNestedState(prev, path.split("."), value));
  };

  const handleTestimonialChange = (
    index: number,
    field: keyof TestimonialItem,
    value: string
  ) => {
    if (!data) return;
    const testimonials = [...data.testimonials];
    testimonials[index] = { ...testimonials[index], [field]: value };
    setData({ ...data, testimonials });
  };

  const addTestimonial = () => {
    if (!data) return;
    const newTestimonial: TestimonialItem = {
      name: "New Name",
      title: "New Title",
      message: "New Message",
      image: "",
    };
    setData({ ...data, testimonials: [...data.testimonials, newTestimonial] });
  };

  const removeTestimonial = (index: number) => {
    if (!data) return;
    const testimonials = data.testimonials.filter((_, i) => i !== index);
    setData({ ...data, testimonials });
  };

  const handleImageUpload = async (
    file: File,
    index: number,
    oldPath: string
  ) => {
    if (!data) return;
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    try {
      const res = await fetch("/api/homepage/testimonials/upload", {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      const testimonials = [...data.testimonials];
      testimonials[index] = { ...testimonials[index], image: imagePath };
      setData({ ...data, testimonials });
    } catch (err) {
      console.error("Upload error", err);
      setMessage({
        text: "Failed to upload image. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!data) return;
    const imagePath = data.testimonials[index].image;
    if (!imagePath) return;
    setIsDeletingImage(true);
    try {
      const res = await fetch("/api/homepage/testimonials/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      });
      if (res.ok) {
        const testimonials = [...data.testimonials];
        testimonials[index] = { ...testimonials[index], image: "" };
        setData({ ...data, testimonials });
        setMessage({ text: "Image deleted successfully", type: "success" });
      }
    } catch (err) {
      console.error("Delete image error", err);
      setMessage({
        text: "Failed to delete image. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/homepage/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save data");
      await fetchData();
      setMessage({
        text: "Testimonials updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      setMessage({
        text: err.message || "An error occurred while updating testimonials",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div>
      {message.text && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          className="mb-6"
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Details */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Section Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section.heading" className="flex items-center gap-1">
                Heading <span className="text-destructive">*</span>
              </Label>
              <Input
                id="section.heading"
                value={data.section.heading}
                onChange={(e) =>
                  handleChange("section.heading", e.target.value)
                }
                placeholder="Enter section heading"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Description <span className="text-destructive">*</span>
              </Label>
              {data.section.descriptions.map((desc, idx) => (
                <Textarea
                  key={idx}
                  value={desc}
                  onChange={(e) =>
                    handleChange(`section.descriptions.${idx}`, e.target.value)
                  }
                  rows={3}
                  placeholder={`Description ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Testimonials */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Testimonials</h2>
            <Button type="button" onClick={addTestimonial} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
          {data.testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No testimonials added yet. Click the "Add Testimonial" button to get
              started.
            </div>
          ) : (
            data.testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Testimonial #{index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`testimonial.${index}.name`}
                        className="flex items-center gap-1"
                      >
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`testimonial.${index}.name`}
                        value={testimonial.name}
                        onChange={(e) =>
                          handleTestimonialChange(index, "name", e.target.value)
                        }
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`testimonial.${index}.title`}
                        className="flex items-center gap-1"
                      >
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`testimonial.${index}.title`}
                        value={testimonial.title}
                        onChange={(e) =>
                          handleTestimonialChange(index, "title", e.target.value)
                        }
                        placeholder="Enter title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`testimonial.${index}.message`}
                        className="flex items-center gap-1"
                      >
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`testimonial.${index}.message`}
                        value={testimonial.message}
                        onChange={(e) =>
                          handleTestimonialChange(
                            index,
                            "message",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Enter message"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="flex items-center gap-1">
                      Profile Image
                    </Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          fileInputRefs.current[index]?.click()
                        }
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {testimonial.image ? "Change" : "Upload"}
                      </Button>
                      <input
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        type="file"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            await handleImageUpload(
                              e.target.files[0],
                              index,
                              testimonial.image
                            );
                          }
                        }}
                        className="hidden"
                        accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
                      />
                      {testimonial.image && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(index)}
                          disabled={isDeletingImage}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Image
                        </Button>
                      )}
                    </div>
                    {testimonial.image && (
                      <Card className="mt-4 overflow-hidden w-40 h-40 relative">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
