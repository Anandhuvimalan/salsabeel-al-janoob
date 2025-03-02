"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  img: string;
  alt: string;
  text: string;
};

type TestimonialsData = {
  header: {
    banner: string;
    title: string;
    subheading: string;
  };
  columns: {
    column1: Testimonial[];
    column2: Testimonial[];
    column3: Testimonial[];
  };
};

export default function TestimonialsForm() {
  const [formData, setFormData] = useState<TestimonialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Refs for file inputs for each column testimonial image
  const testimonialImageRefs = {
    column1: useRef<{ [key: number]: HTMLInputElement | null }>({}),
    column2: useRef<{ [key: number]: HTMLInputElement | null }>({}),
    column3: useRef<{ [key: number]: HTMLInputElement | null }>({}),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/testimonials");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      setMessage({ text: "Failed to load testimonials data.", type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update nested field using dot notation
  const handleFieldChange = (path: string, value: string) => {
    if (!formData) return;
    const keys = path.split(".");
    setFormData((prev) => {
      if (!prev) return prev;
      let updated: any = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleTestimonialChange = (
    column: "column1" | "column2" | "column3",
    index: number,
    field: keyof Testimonial,
    value: string
  ) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedColumn = [...prev.columns[column]];
      updatedColumn[index] = { ...updatedColumn[index], [field]: value };
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: updatedColumn,
        },
      };
    });
  };

  const addTestimonial = (column: "column1" | "column2" | "column3") => {
    if (!formData) return;
    const newTestimonial: Testimonial = {
      name: "",
      role: "",
      img: "",
      alt: "",
      text: "",
    };
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: [...prev.columns[column], newTestimonial],
        },
      };
    });
  };

  const removeTestimonial = (column: "column1" | "column2" | "column3", index: number) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedColumn = prev.columns[column].filter((_, i) => i !== index);
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: updatedColumn,
        },
      };
    });
  };

  // Handle file upload for testimonial image
  const handleTestimonialImageUpload = async (
    column: "column1" | "column2" | "column3",
    index: number,
    oldPath: string
  ) => {
    const fileInput = testimonialImageRefs[column].current[index];
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    // Create a query field identifier like "testimonial_column1_0"
    const queryField = `testimonial_${column}_${index}`;
    try {
      const res = await fetch(`/api/aboutpage/testimonials/upload?field=${queryField}`, {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      if (!formData) return;
      setFormData((prev) => {
        if (!prev) return prev;
        const updatedColumn = [...prev.columns[column]];
        updatedColumn[index] = { ...updatedColumn[index], img: imagePath };
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [column]: updatedColumn,
          },
        };
      });
    } catch (error) {
      setMessage({ text: "Image upload failed. Please try again.", type: "error" });
      console.error(error);
    }
  };

  const handleTestimonialImageDelete = async (
    column: "column1" | "column2" | "column3",
    index: number
  ) => {
    if (!formData) return;
    const oldPath = formData.columns[column][index].img;
    if (!oldPath) return;
    try {
      const res = await fetch("/api/aboutpage/testimonials/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: oldPath }),
      });
      if (res.ok) {
        setFormData((prev) => {
          if (!prev) return prev;
          const updatedColumn = [...prev.columns[column]];
          updatedColumn[index] = { ...updatedColumn[index], img: "" };
          return {
            ...prev,
            columns: {
              ...prev.columns,
              [column]: updatedColumn,
            },
          };
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
      const res = await fetch("/api/aboutpage/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Testimonials updated successfully", type: "success" });
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
      {/* Header Section */}
      <div className="p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Testimonials Header</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner">Banner</Label>
            <Input
              id="banner"
              value={formData.header.banner}
              onChange={(e) => handleFieldChange("header.banner", e.target.value)}
              placeholder="Enter banner text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.header.title}
              onChange={(e) => handleFieldChange("header.title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheading">Subheading</Label>
            <Input
              id="subheading"
              value={formData.header.subheading}
              onChange={(e) => handleFieldChange("header.subheading", e.target.value)}
              placeholder="Enter subheading"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Columns */}
      {(["column1", "column2", "column3"] as const).map((column) => (
        <div key={column} className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">{column.toUpperCase()} Testimonials</h2>
          {formData.columns[column].map((testimonial, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Testimonial #{index + 1}</h3>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeTestimonial(column, index)}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${column}-${index}-name`}>Name</Label>
                    <Input
                      id={`${column}-${index}-name`}
                      value={testimonial.name}
                      onChange={(e) => handleTestimonialChange(column, index, "name", e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${column}-${index}-role`}>Role</Label>
                    <Input
                      id={`${column}-${index}-role`}
                      value={testimonial.role}
                      onChange={(e) => handleTestimonialChange(column, index, "role", e.target.value)}
                      placeholder="Enter role"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${column}-${index}-img`}>Image URL</Label>
                    <Input
                      id={`${column}-${index}-img`}
                      value={testimonial.img}
                      onChange={(e) => handleTestimonialChange(column, index, "img", e.target.value)}
                      placeholder="Enter image URL or upload below"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${column}-${index}-alt`}>Alt Text</Label>
                    <Input
                      id={`${column}-${index}-alt`}
                      value={testimonial.alt}
                      onChange={(e) => handleTestimonialChange(column, index, "alt", e.target.value)}
                      placeholder="Enter alt text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${column}-${index}-text`}>Testimonial Text</Label>
                    <Textarea
                      id={`${column}-${index}-text`}
                      value={testimonial.text}
                      onChange={(e) => handleTestimonialChange(column, index, "text", e.target.value)}
                      placeholder="Enter testimonial text"
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* Image Preview Section */}
                <div className="space-y-3">
                  <Label>Image Preview</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                    {testimonial.img ? (
                      <img 
                        src={testimonial.img} 
                        alt={testimonial.alt || "Testimonial image"} 
                        className="max-w-full max-h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm text-center p-4">
                        No image uploaded
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => testimonialImageRefs[column].current[index]?.click()}
                    >
                      {testimonial.img ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                      ref={(el) => (testimonialImageRefs[column].current[index] = el)}
                      type="file"
                      onChange={() => handleTestimonialImageUpload(column, index, testimonial.img)}
                      className="hidden"
                      accept="image/svg+xml, image/png, image/jpeg"
                    />
                    
                    {testimonial.img && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleTestimonialImageDelete(column, index)}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addTestimonial(column)} className="mt-2">
            Add Testimonial
          </Button>
        </div>
      ))}

      {/* Actions */}
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
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mt-4">
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

// Helper function to update nested objects based on dot notation keys
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