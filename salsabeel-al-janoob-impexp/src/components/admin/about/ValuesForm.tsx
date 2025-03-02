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

type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

type ValuesData = {
  banner: string;
  sectionHeading: string;
  values: ValueItem[];
};

export default function ValuesSectionForm() {
  const [formData, setFormData] = useState<ValuesData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Refs for file input elements for icon uploads
  const iconFileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchValuesData();
  }, []);

  const fetchValuesData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/values");
      if (!res.ok) throw new Error("Failed to fetch values data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching values data:", error);
      setMessage({ text: "Failed to load values data. Please refresh the page.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return;
    setFormData((prev) => updateNestedObject(prev!, path.split("."), value));
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  const addValue = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        values: [
          ...prev.values,
          { icon: "", title: "New Value", description: "" }
        ]
      };
    });
  };

  const removeValue = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, values: prev.values.filter((_, i) => i !== index) };
    });
  };

  const handleIconUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    try {
      const res = await fetch("/api/aboutpage/values/upload", {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      setFormData((prev) => {
        if (!prev) return prev;
        const updatedValues = [...prev.values];
        updatedValues[index] = {
          ...updatedValues[index],
          icon: imagePath,
        };
        return { ...prev, values: updatedValues };
      });
    } catch (error) {
      setMessage({ text: "Icon upload failed. Please try again.", type: "error" });
    }
  };

  const handleDeleteIcon = async (index: number) => {
    if (!formData) return;
    const oldPath = formData.values[index].icon;
    if (!oldPath) return;
    try {
      const res = await fetch("/api/aboutpage/values/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: oldPath }),
      });
      if (res.ok) {
        setFormData((prev) => {
          if (!prev) return prev;
          const updatedValues = [...prev.values];
          updatedValues[index] = {
            ...updatedValues[index],
            icon: "",
          };
          return { ...prev, values: updatedValues };
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage({ text: "Failed to delete icon. Please try again.", type: "error" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false;
    if (!formData.banner.trim()) newErrors["banner"] = "Banner is required";
    if (!formData.sectionHeading.trim()) newErrors["sectionHeading"] = "Section heading is required";
    formData.values.forEach((value, index) => {
      if (!value.title.trim()) newErrors[`values.${index}.title`] = "Title is required";
      if (!value.description.trim()) newErrors[`values.${index}.description`] = "Description is required";
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
      const res = await fetch("/api/aboutpage/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Values section updated successfully!", type: "success" });
      await fetchValuesData();
    } catch (error) {
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return <Skeleton className="h-40 w-full" />;
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
          <h2 className="text-xl font-semibold mb-4">Values Section</h2>
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
              <Label htmlFor="sectionHeading">Section Heading</Label>
              <Input
                id="sectionHeading"
                value={formData.sectionHeading}
                onChange={(e) => handleTextChange("sectionHeading", e.target.value)}
                placeholder="Enter section heading"
                className={errors["sectionHeading"] ? "border-destructive" : ""}
              />
              {errors["sectionHeading"] && <p className="text-sm text-destructive">{errors["sectionHeading"]}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Values</h2>
            <Button type="button" onClick={addValue} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Value
            </Button>
          </div>

          {formData.values.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No values added yet. Click "Add Value" to get started.
            </div>
          ) : (
            formData.values.map((value, index) => (
              <div key={index} className="p-6 border rounded-lg bg-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Value #{index + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeValue(index)} className="gap-2">
                    <Minus className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`values.${index}.title`}>Title</Label>
                    <Input
                      id={`values.${index}.title`}
                      value={value.title}
                      onChange={(e) => handleTextChange(`values.${index}.title`, e.target.value)}
                      placeholder="Enter value title"
                      className={errors[`values.${index}.title`] ? "border-destructive" : ""}
                    />
                    {errors[`values.${index}.title`] && <p className="text-sm text-destructive">{errors[`values.${index}.title`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`values.${index}.description`}>Description</Label>
                    <Textarea
                      id={`values.${index}.description`}
                      value={value.description}
                      onChange={(e) => handleTextChange(`values.${index}.description`, e.target.value)}
                      placeholder="Enter value description"
                      className={errors[`values.${index}.description`] ? "border-destructive" : ""}
                      rows={3}
                    />
                    {errors[`values.${index}.description`] && <p className="text-sm text-destructive">{errors[`values.${index}.description`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="secondary" onClick={() => iconFileRefs.current[index]?.click()} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Icon
                      </Button>
                      <input
                        ref={(el) => (iconFileRefs.current[index] = el)}
                        type="file"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            await handleIconUpload(e.target.files[0], index, value.icon);
                          }
                        }}
                        className="hidden"
                        accept="image/svg+xml, image/png, image/jpeg"
                      />
                      {value.icon && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteIcon(index)} className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Remove Icon
                        </Button>
                      )}
                    </div>
                    {value.icon && (
                      <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                        <Image
                          src={value.icon || "/placeholder.svg"}
                          alt="Icon preview"
                          fill
                          className="object-contain"
                        />
                      </Card>
                    )}
                    {errors[`values.${index}.icon`] && <p className="text-sm text-destructive">{errors[`values.${index}.icon`]}</p>}
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
                Update Values Section
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={fetchValuesData} disabled={isSaving} className="gap-2">
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
