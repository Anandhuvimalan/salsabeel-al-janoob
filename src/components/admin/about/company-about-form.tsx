"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Save, RefreshCw, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type CompanyAboutData = {
  leftColumn: {
    intro: {
      title: string;
      description: string;
    };
    founder: {
      title: string;
      descriptionBefore: string;
      founderName: string;
      descriptionAfter: string;
    };
    growth: {
      title: string;
      description: string;
    };
    timeline: Array<{
      label: string;
      value?: string;
      title?: string;
      subtitle?: string;
    }>;
  };
  rightColumn: {
    globalExpansion: {
      title: string;
      description: string;
    };
    imageBlock: {
      image: {
        src: string;
        alt: string;
      };
    };
    legacy: {
      title: string;
      description: string;
    };
  };
};

export default function CompanyAboutForm() {
  const [formData, setFormData] = useState<CompanyAboutData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/aboutpage/companyabout");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      setMessage({ text: "Failed to load data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (path: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const keys = path.split(".");
      const lastKey = keys.pop()!;
      const nested = keys.reduce((obj, key) => obj[key], prev);
      nested[lastKey] = value;
      return { ...prev };
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!formData) return;

    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", formData.rightColumn.imageBlock.image.src);

    try {
      const res = await fetch("/api/aboutpage/companyabout/upload", {
        method: "POST",
        body: form,
      });

      const { imagePath } = await res.json();
      
      setFormData(prev => ({
        ...prev!,
        rightColumn: {
          ...prev!.rightColumn,
          imageBlock: {
            ...prev!.rightColumn.imageBlock,
            image: {
              src: imagePath,
              alt: prev!.rightColumn.imageBlock.image.alt
            }
          }
        }
      }));
    } catch (error) {
      setMessage({ text: "Image upload failed", type: "error" });
    }
  };

  const handleDeleteImage = async () => {
    if (!formData?.rightColumn.imageBlock.image.src) return;

    try {
      await fetch("/api/aboutpage/companyabout/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: formData.rightColumn.imageBlock.image.src }),
      });

      setFormData(prev => ({
        ...prev!,
        rightColumn: {
          ...prev!.rightColumn,
          imageBlock: {
            ...prev!.rightColumn.imageBlock,
            image: {
              src: "",
              alt: prev!.rightColumn.imageBlock.image.alt
            }
          }
        }
      }));
    } catch (error) {
      setMessage({ text: "Image delete failed", type: "error" });
    }
  };

  const handleTimelineChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const updatedTimeline = [...prev.leftColumn.timeline];
      updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
      return {
        ...prev,
        leftColumn: {
          ...prev.leftColumn,
          timeline: updatedTimeline
        }
      };
    });
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev!,
      leftColumn: {
        ...prev!.leftColumn,
        timeline: [
          ...prev!.leftColumn.timeline,
          { label: "New Item", value: "" }
        ]
      }
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormData(prev => ({
      ...prev!,
      leftColumn: {
        ...prev!.leftColumn,
        timeline: prev!.leftColumn.timeline.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await fetch("/api/aboutpage/companyabout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Save failed");
      
      setMessage({ text: "Data saved successfully!", type: "success" });
      await fetchData();
    } catch (error) {
      setMessage({ text: "Failed to save changes", type: "error" });
    }
  };

  if (isLoading || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          <AlertTitle>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Left Column */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Intro Title</Label>
              <Input
                value={formData.leftColumn.intro.title}
                onChange={(e) => handleTextChange("leftColumn.intro.title", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Intro Description</Label>
              <Textarea
                value={formData.leftColumn.intro.description}
                onChange={(e) => handleTextChange("leftColumn.intro.description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Founder Title</Label>
              <Input
                value={formData.leftColumn.founder.title}
                onChange={(e) => handleTextChange("leftColumn.founder.title", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Founder Description Before</Label>
              <Input
                value={formData.leftColumn.founder.descriptionBefore}
                onChange={(e) => handleTextChange("leftColumn.founder.descriptionBefore", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Founder Name</Label>
              <Input
                value={formData.leftColumn.founder.founderName}
                onChange={(e) => handleTextChange("leftColumn.founder.founderName", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Founder Description After</Label>
              <Input
                value={formData.leftColumn.founder.descriptionAfter}
                onChange={(e) => handleTextChange("leftColumn.founder.descriptionAfter", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Growth Title</Label>
              <Input
                value={formData.leftColumn.growth.title}
                onChange={(e) => handleTextChange("leftColumn.growth.title", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Growth Description</Label>
              <Textarea
                value={formData.leftColumn.growth.description}
                onChange={(e) => handleTextChange("leftColumn.growth.description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Timeline Items</Label>
                <Button type="button" onClick={addTimelineItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              {formData.leftColumn.timeline.map((item, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Timeline Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTimelineItem(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => handleTimelineChange(index, "label", e.target.value)}
                    />
                  </div>
                  {item.value ? (
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={item.value}
                        onChange={(e) => handleTimelineChange(index, "value", e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={item.title || ""}
                          onChange={(e) => handleTimelineChange(index, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={item.subtitle || ""}
                          onChange={(e) => handleTimelineChange(index, "subtitle", e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Global Expansion Title</Label>
              <Input
                value={formData.rightColumn.globalExpansion.title}
                onChange={(e) => handleTextChange("rightColumn.globalExpansion.title", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Global Expansion Description</Label>
              <Textarea
                value={formData.rightColumn.globalExpansion.description}
                onChange={(e) => handleTextChange("rightColumn.globalExpansion.description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Company Image</Label>
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
                {formData.rightColumn.imageBlock.image.src && (
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
              {formData.rightColumn.imageBlock.image.src && (
                <div className="relative aspect-video rounded-lg overflow-hidden border mt-4">
                  <Image
                    src={formData.rightColumn.imageBlock.image.src}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Legacy Title</Label>
              <Input
                value={formData.rightColumn.legacy.title}
                onChange={(e) => handleTextChange("rightColumn.legacy.title", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Legacy Description</Label>
              <Textarea
                value={formData.rightColumn.legacy.description}
                onChange={(e) => handleTextChange("rightColumn.legacy.description", e.target.value)}
                rows={4}
              />
            </div>
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