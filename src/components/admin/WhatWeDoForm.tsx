"use client";
import React, { useState, useEffect, useRef } from "react";
import { Trash2, Upload, RefreshCw, Save, Plus } from "lucide-react";
import Image from "next/image";

type SectionData = {
  badge: string;
  heading: string;
  description: string;
  icons: {
    arrowRight: string;
  };
};

type Service = {
  iconSrc: string;
  title: string;
  description: string;
  features: string[];
};

type WhatWeDoData = {
  section: SectionData;
  services: Service[];
};

export default function WhatWeDoForm() {
  const [formData, setFormData] = useState<WhatWeDoData | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for file inputs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const arrowIconInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchWhatWeDoData();
  }, []);

  const fetchWhatWeDoData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/homepage/whatwedo");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: WhatWeDoData = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching whatwedo data:", error);
      setMessage({ text: "Failed to load data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: update nested objects/arrays without losing array type.
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
        [current]: updateNestedObject(obj ? obj[current] : undefined, rest, value)
      };
    }
  }

  const handleTextChange = (path: string, value: string) => {
    if (!formData) return;
    setFormData(prev => updateNestedObject(prev, path.split("."), value));
  };

  // Service fields
  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    if (!formData) return;
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData({ ...formData, services: updatedServices });
  };

  const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
    if (!formData) return;
    const updatedServices = [...formData.services];
    const features = [...updatedServices[serviceIndex].features];
    features[featureIndex] = value;
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features };
    setFormData({ ...formData, services: updatedServices });
  };

  const addFeature = (serviceIndex: number) => {
    if (!formData) return;
    const updatedServices = [...formData.services];
    const features = [...updatedServices[serviceIndex].features, ""];
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features };
    setFormData({ ...formData, services: updatedServices });
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    if (!formData) return;
    const updatedServices = [...formData.services];
    const features = updatedServices[serviceIndex].features.filter((_, i) => i !== featureIndex);
    updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], features };
    setFormData({ ...formData, services: updatedServices });
  };

  const addService = () => {
    if (!formData) return;
    const newService: Service = {
      iconSrc: "",
      title: "New Service",
      description: "",
      features: []
    };
    setFormData({ ...formData, services: [...formData.services, newService] });
  };

  const removeService = (index: number) => {
    if (!formData) return;
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  // Handle service icon upload
  const handleIconUpload = async (file: File, index: number, oldPath: string) => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    try {
      const res = await fetch("/api/homepage/whatwedo/upload", {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      const updatedServices = [...formData!.services];
      updatedServices[index] = { ...updatedServices[index], iconSrc: imagePath };
      setFormData({ ...formData!, services: updatedServices });
    } catch (error) {
      console.error("Icon upload failed:", error);
      setMessage({ text: "Icon upload failed", type: "error" });
    }
  };

  const handleDeleteIcon = async (index: number) => {
    if (!formData) return;
    const iconPath = formData.services[index].iconSrc;
    if (!iconPath) return;
    try {
      const res = await fetch("/api/homepage/whatwedo/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: iconPath }),
      });
      if (res.ok) {
        const updatedServices = [...formData.services];
        updatedServices[index] = { ...updatedServices[index], iconSrc: "" };
        setFormData({ ...formData, services: updatedServices });
      }
    } catch (error) {
      console.error("Icon deletion failed:", error);
      setMessage({ text: "Icon deletion failed", type: "error" });
    }
  };

  // Handle arrow icon upload (for section.icons.arrowRight)
  const handleArrowIconUpload = async (file: File, oldPath: string) => {
    const form = new FormData();
    form.append("image", file);
    form.append("oldImagePath", oldPath);
    try {
      const res = await fetch("/api/homepage/whatwedo/upload", {
        method: "POST",
        body: form,
      });
      const { imagePath } = await res.json();
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          section: {
            ...prev.section,
            icons: {
              ...prev.section.icons,
              arrowRight: imagePath,
            },
          },
        };
      });
    } catch (error) {
      console.error("Arrow icon upload failed:", error);
      setMessage({ text: "Arrow icon upload failed", type: "error" });
    }
  };

  const handleArrowIconDelete = async () => {
    if (!formData) return;
    const oldPath = formData.section.icons.arrowRight;
    if (!oldPath) return;
    try {
      const res = await fetch("/api/homepage/whatwedo/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: oldPath }),
      });
      if (res.ok) {
        setFormData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            section: {
              ...prev.section,
              icons: {
                ...prev.section.icons,
                arrowRight: "",
              },
            },
          };
        });
      }
    } catch (error) {
      console.error("Arrow icon deletion failed:", error);
      setMessage({ text: "Arrow icon deletion failed", type: "error" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false;
    if (!formData.section.badge.trim()) newErrors["section.badge"] = "Badge is required";
    if (!formData.section.heading.trim()) newErrors["section.heading"] = "Heading is required";
    if (!formData.section.description.trim()) newErrors["section.description"] = "Description is required";
    formData.services.forEach((service, index) => {
      if (!service.title.trim()) newErrors[`services.${index}.title`] = "Title is required";
      if (!service.description.trim()) newErrors[`services.${index}.description`] = "Description is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/homepage/whatwedo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Data updated successfully!", type: "success" });
      await fetchWhatWeDoData();
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage({ text: "Failed to save data", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit What We Do Section</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Details */}
        <div className="border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Section Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Badge</label>
            <input
              type="text"
              value={formData.section.badge}
              onChange={(e) => handleTextChange("section.badge", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors["section.badge"] && <p className="mt-1 text-sm text-red-600">{errors["section.badge"]}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Heading</label>
            <input
              type="text"
              value={formData.section.heading}
              onChange={(e) => handleTextChange("section.heading", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors["section.heading"] && <p className="mt-1 text-sm text-red-600">{errors["section.heading"]}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.section.description}
              onChange={(e) => handleTextChange("section.description", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-24"
            />
            {errors["section.description"] && <p className="mt-1 text-sm text-red-600">{errors["section.description"]}</p>}
          </div>
        
          {/* Arrow Icon Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Arrow Icon</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={arrowIconInputRef}
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    await handleArrowIconUpload(e.target.files[0], formData.section.icons.arrowRight);
                  }
                }}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => arrowIconInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Arrow Icon
              </button>
              {formData.section.icons.arrowRight && (
                <button
                  type="button"
                  onClick={handleArrowIconDelete}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Arrow Icon
                </button>
              )}
            </div>
            {formData.section.icons.arrowRight && (
              <div className="mt-4 w-16 h-16 rounded-lg overflow-hidden border">
                <Image
                  src={formData.section.icons.arrowRight}
                  alt="Arrow Icon"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          {formData.services.map((service, index) => (
            <div key={index} className="border rounded-xl p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Service #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleIconUpload(e.target.files[0], index, service.iconSrc);
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[index]?.click()}
                      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Icon
                    </button>
                    {service.iconSrc && (
                      <button
                        type="button"
                        onClick={() => handleDeleteIcon(index)}
                        className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Icon
                      </button>
                    )}
                  </div>
                  {service.iconSrc && (
                    <div className="mt-4 w-16 h-16 rounded-lg overflow-hidden border">
                      <Image
                        src={service.iconSrc}
                        alt="Service icon"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  {service.features.map((feature, featIndex) => (
                    <div key={featIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, featIndex, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index, featIndex)}
                        className="ml-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFeature(index)}
                    className="flex items-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-8 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={fetchWhatWeDoData}
            className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Changes
          </button>
        </div>
      </form>
      {message.text && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
