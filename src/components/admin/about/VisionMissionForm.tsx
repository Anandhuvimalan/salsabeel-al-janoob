"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Upload, RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type VisionMissionData = {
  inlineBanner: string;
  mainHeading: string;
  visionCard: {
    icon: string;
    title: string;
    description: string;
  };
  missionCard: {
    icon: string;
    title: string;
    items: {
      icon: string;
      strongText: string;
      text: string;
    }[];
  };
};

export default function VisionMissionForm() {
  const [formData, setFormData] = useState<VisionMissionData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Refs for file inputs
  const visionIconRef = useRef<HTMLInputElement>(null);
  const missionIconRef = useRef<HTMLInputElement>(null);
  const missionItemIconRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/visionmission");
      if (!res.ok) throw new Error("Failed to fetch vision & mission data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to load data. Please refresh the page.", type: "error" });
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

  // New: Function to add a mission item
  const addMissionItem = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newItem = { icon: "", strongText: "", text: "" };
      return {
        ...prev,
        missionCard: {
          ...prev.missionCard,
          items: [...prev.missionCard.items, newItem],
        },
      };
    });
  };

  // New: Function to remove a mission item at a given index
  const removeMissionItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.missionCard.items.filter((_, idx) => idx !== index);
      return {
        ...prev,
        missionCard: {
          ...prev.missionCard,
          items: updatedItems,
        },
      };
    });
  };

  const handleIconUpload = async (file: File, field: string, oldPath: string, itemIndex?: number) => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    const queryField = itemIndex !== undefined ? `${field}_${itemIndex}` : field;
    try {
      const res = await fetch(`/api/aboutpage/visionmission/upload?field=${queryField}`, {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      if (!formData) return;
      if (field === "vision") {
        setFormData((prev) => ({
          ...prev!,
          visionCard: {
            ...prev!.visionCard,
            icon: imagePath,
          },
        }));
      } else if (field === "mission") {
        setFormData((prev) => ({
          ...prev!,
          missionCard: {
            ...prev!.missionCard,
            icon: imagePath,
          },
        }));
      } else if (field === "missionItem" && itemIndex !== undefined) {
        setFormData((prev) => {
          if (!prev) return prev;
          const updatedItems = [...prev.missionCard.items];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: imagePath };
          return {
            ...prev,
            missionCard: {
              ...prev.missionCard,
              items: updatedItems,
            },
          };
        });
      }
    } catch (error) {
      setMessage({ text: "Icon upload failed. Please try again.", type: "error" });
    }
  };

  const handleDeleteIcon = async (field: string, itemIndex?: number) => {
    if (!formData) return;
    let oldPath = "";
    if (field === "vision") {
      oldPath = formData.visionCard.icon;
    } else if (field === "mission") {
      oldPath = formData.missionCard.icon;
    } else if (field === "missionItem" && itemIndex !== undefined) {
      oldPath = formData.missionCard.items[itemIndex].icon;
    }
    if (!oldPath) return;
    try {
      const res = await fetch("/api/aboutpage/visionmission/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: oldPath }),
      });
      if (res.ok) {
        if (field === "vision") {
          setFormData((prev) => ({
            ...prev!,
            visionCard: { ...prev!.visionCard, icon: "" },
          }));
        } else if (field === "mission") {
          setFormData((prev) => ({
            ...prev!,
            missionCard: { ...prev!.missionCard, icon: "" },
          }));
        } else if (field === "missionItem" && itemIndex !== undefined) {
          setFormData((prev) => {
            if (!prev) return prev;
            const updatedItems = [...prev.missionCard.items];
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: "" };
            return { ...prev, missionCard: { ...prev.missionCard, items: updatedItems } };
          });
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage({ text: "Failed to delete icon. Please try again.", type: "error" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false;
    if (!formData.inlineBanner.trim()) newErrors["inlineBanner"] = "Inline banner is required";
    if (!formData.mainHeading.trim()) newErrors["mainHeading"] = "Main heading is required";
    if (!formData.visionCard.title.trim()) newErrors["visionCard.title"] = "Vision title is required";
    if (!formData.visionCard.description.trim()) newErrors["visionCard.description"] = "Vision description is required";
    if (!formData.visionCard.icon) newErrors["visionCard.icon"] = "Vision icon is required";
    if (!formData.missionCard.title.trim()) newErrors["missionCard.title"] = "Mission title is required";
    formData.missionCard.items.forEach((item, idx) => {
      if (!item.strongText.trim()) newErrors[`missionCard.items.${idx}.strongText`] = "Strong text is required";
      if (!item.text.trim()) newErrors[`missionCard.items.${idx}.text`] = "Mission item text is required";
      if (!item.icon) newErrors[`missionCard.items.${idx}.icon`] = "Mission item icon is required";
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
      const res = await fetch("/api/aboutpage/visionmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Vision & Mission section updated successfully!", type: "success" });
      await fetchData();
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
        {/* Vision & Mission Header */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Vision & Mission Section</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inlineBanner">Inline Banner</Label>
              <Input
                id="inlineBanner"
                value={formData.inlineBanner}
                onChange={(e) => handleTextChange("inlineBanner", e.target.value)}
                placeholder="Enter inline banner text"
                className={errors["inlineBanner"] ? "border-destructive" : ""}
              />
              {errors["inlineBanner"] && <p className="text-sm text-destructive">{errors["inlineBanner"]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainHeading">Main Heading</Label>
              <Input
                id="mainHeading"
                value={formData.mainHeading}
                onChange={(e) => handleTextChange("mainHeading", e.target.value)}
                placeholder="Enter main heading"
                className={errors["mainHeading"] ? "border-destructive" : ""}
              />
              {errors["mainHeading"] && <p className="text-sm text-destructive">{errors["mainHeading"]}</p>}
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Vision Card</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visionCard.title">Title</Label>
              <Input
                id="visionCard.title"
                value={formData.visionCard.title}
                onChange={(e) => handleTextChange("visionCard.title", e.target.value)}
                placeholder="Enter vision title"
                className={errors["visionCard.title"] ? "border-destructive" : ""}
              />
              {errors["visionCard.title"] && <p className="text-sm text-destructive">{errors["visionCard.title"]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionCard.description">Description</Label>
              <Textarea
                id="visionCard.description"
                value={formData.visionCard.description}
                onChange={(e) => handleTextChange("visionCard.description", e.target.value)}
                placeholder="Enter vision description"
                className={errors["visionCard.description"] ? "border-destructive" : ""}
                rows={4}
              />
              {errors["visionCard.description"] && <p className="text-sm text-destructive">{errors["visionCard.description"]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => visionIconRef.current?.click()} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Icon
                </Button>
                <input
                  ref={visionIconRef}
                  type="file"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleIconUpload(e.target.files[0], "vision", formData.visionCard.icon);
                    }
                  }}
                  className="hidden"
                  accept="image/svg+xml, image/png, image/jpeg"
                />
                {formData.visionCard.icon && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteIcon("vision")} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Remove Icon
                  </Button>
                )}
              </div>
              {formData.visionCard.icon && (
                <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                  <Image
                    src={formData.visionCard.icon}
                    alt="Vision Icon"
                    fill
                    className="object-contain"
                  />
                </Card>
              )}
              {errors["visionCard.icon"] && <p className="text-sm text-destructive">{errors["visionCard.icon"]}</p>}
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Mission Card</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missionCard.title">Title</Label>
              <Input
                id="missionCard.title"
                value={formData.missionCard.title}
                onChange={(e) => handleTextChange("missionCard.title", e.target.value)}
                placeholder="Enter mission title"
                className={errors["missionCard.title"] ? "border-destructive" : ""}
              />
              {errors["missionCard.title"] && <p className="text-sm text-destructive">{errors["missionCard.title"]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Top Icon</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => missionIconRef.current?.click()} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Icon
                </Button>
                <input
                  ref={missionIconRef}
                  type="file"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      await handleIconUpload(e.target.files[0], "mission", formData.missionCard.icon);
                    }
                  }}
                  className="hidden"
                  accept="image/svg+xml, image/png, image/jpeg"
                />
                {formData.missionCard.icon && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteIcon("mission")} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Remove Icon
                  </Button>
                )}
              </div>
              {formData.missionCard.icon && (
                <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                  <Image
                    src={formData.missionCard.icon}
                    alt="Mission Icon"
                    fill
                    className="object-contain"
                  />
                </Card>
              )}
              {errors["missionCard.icon"] && <p className="text-sm text-destructive">{errors["missionCard.icon"]}</p>}
            </div>

            {/* Mission Items */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mission Items</h2>
                <Button type="button" onClick={addMissionItem} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Add Mission Item
                </Button>
              </div>
              {formData.missionCard.items.map((item, index) => (
                <div key={index} className="p-6 border rounded-lg bg-card">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Mission Item #{index + 1}</h3>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMissionItem(index)} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove Item
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`missionCard.items.${index}.strongText`}>Strong Text</Label>
                      <Input
                        id={`missionCard.items.${index}.strongText`}
                        value={item.strongText}
                        onChange={(e) => handleTextChange(`missionCard.items.${index}.strongText`, e.target.value)}
                        placeholder="Enter strong text"
                        className={errors[`missionCard.items.${index}.strongText`] ? "border-destructive" : ""}
                      />
                      {errors[`missionCard.items.${index}.strongText`] && <p className="text-sm text-destructive">{errors[`missionCard.items.${index}.strongText`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`missionCard.items.${index}.text`}>Text</Label>
                      <Textarea
                        id={`missionCard.items.${index}.text`}
                        value={item.text}
                        onChange={(e) => handleTextChange(`missionCard.items.${index}.text`, e.target.value)}
                        placeholder="Enter mission item text"
                        className={errors[`missionCard.items.${index}.text`] ? "border-destructive" : ""}
                        rows={3}
                      />
                      {errors[`missionCard.items.${index}.text`] && <p className="text-sm text-destructive">{errors[`missionCard.items.${index}.text`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={() => missionItemIconRefs.current[index]?.click()} className="gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Icon
                        </Button>
                        <input
                          ref={(el) => (missionItemIconRefs.current[index] = el)}
                          type="file"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              await handleIconUpload(e.target.files[0], "missionItem", item.icon, index);
                            }
                          }}
                          className="hidden"
                          accept="image/svg+xml, image/png, image/jpeg"
                        />
                        {item.icon && (
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteIcon("missionItem", index)} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Remove Icon
                          </Button>
                        )}
                      </div>
                      {item.icon && (
                        <Card className="mt-4 overflow-hidden w-16 h-16 relative p-2">
                          <Image
                            src={item.icon}
                            alt="Mission Item Icon"
                            fill
                            className="object-contain"
                          />
                        </Card>
                      )}
                      {errors[`missionCard.items.${index}.icon`] && <p className="text-sm text-destructive">{errors[`missionCard.items.${index}.icon`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                Update Vision & Mission Section
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={fetchData} disabled={isSaving} className="gap-2">
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
