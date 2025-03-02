import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Upload, RefreshCw, Save, AlertCircle, CheckCircle2, Plus, X, Replace } from "lucide-react";

// Define proper types for better type safety
interface AnimationSettings {
  cycleDuration: number;
  animationDuration: number;
  initialRevealDelay: number;
}

interface ImageData {
  src: string;
  alt: string;
}

interface FormDataType {
  tag: string;
  title: string;
  highlightedTitle: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  animationSettings: AnimationSettings;
  images: ImageData[];
}

interface SelectedImage {
  file: File;
  alt: string;
  preview: string;
  replacingIndex?: number;
}

interface Message {
  text: string;
  type: "success" | "error" | "";
}

interface FormErrors {
  [key: string]: string;
}

function HeroSectionForm() {
  const initialFormState: FormDataType = {
    tag: "",
    title: "",
    highlightedTitle: "",
    description: "",
    buttonName: "",
    buttonLink: "",
    animationSettings: {
      cycleDuration: 3000,
      animationDuration: 1500,
      initialRevealDelay: 2000
    },
    images: []
  };

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [message, setMessage] = useState<Message>({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [selectedImages]);

  const fetchHeroData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/homepage/section1/heroSection');
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      const data = await response.json();
      setFormData(data);
      setErrors({});
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setMessage({ text: "Failed to load data. Please refresh.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('animation.')) {
      const animationField = name.split('.')[1] as keyof AnimationSettings;
      setFormData(prev => ({
        ...prev,
        animationSettings: { 
          ...prev.animationSettings, 
          [animationField]: Number(value) || 0 // Ensure it's always a number
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const files = Array.from(e.target.files);
    
    const newImages = files.reduce<SelectedImage[]>((acc, file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: `${file.name} has an invalid file type`, type: "error" });
        return acc;
      }
      
      if (file.size > maxSize) {
        setMessage({ text: `${file.name} exceeds the maximum size of 5MB`, type: "error" });
        return acc;
      }
      
      acc.push({
        file,
        alt: "",
        preview: URL.createObjectURL(file),
        replacingIndex: replacingIndex ?? undefined
      });
      
      return acc;
    }, []);

    if (newImages.length > 0) {
      setSelectedImages(prev => [...prev, ...newImages]);
      setReplacingIndex(null);
    }
    
    // Reset the input value to allow selecting the same file again
    if (e.target.value) e.target.value = '';
  };

  const handleAltTextChange = (index: number, value: string, isExisting: boolean) => {
    if (isExisting) {
      setFormData(prev => {
        const newImages = [...prev.images];
        newImages[index] = { ...newImages[index], alt: value };
        return { ...prev, images: newImages };
      });
    } else {
      setSelectedImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], alt: value };
        return updated;
      });
    }
  };

  const handleRemoveImage = async (index: number, isExisting: boolean) => {
    if (isExisting) {
      try {
        setIsSaving(true);
        const imageToDelete = formData.images[index];
        const response = await fetch('/api/homepage/section1/deleteImage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePath: imageToDelete.src }),
        });
        
        if (!response.ok) throw new Error('Failed to delete image');
        
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }));
        setMessage({ text: "Image deleted successfully", type: "success" });
      } catch (error) {
        console.error('Error deleting image:', error);
        setMessage({ text: "Failed to delete image", type: "error" });
      } finally {
        setIsSaving(false);
      }
    } else {
      setSelectedImages(prev => {
        const imageToRemove = prev[index];
        URL.revokeObjectURL(imageToRemove.preview);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.buttonName.trim()) newErrors.buttonName = "Button text is required";
    if (!formData.buttonLink.trim()) newErrors.buttonLink = "Button link is required";
    
    // URL validation for button link
    if (formData.buttonLink.trim() && !formData.buttonLink.startsWith('/') && !formData.buttonLink.startsWith('http')) {
      newErrors.buttonLink = "Button link must be a valid URL or path";
    }
    
    // Image validation
    const totalImages = formData.images.length + 
      selectedImages.filter(img => img.replacingIndex === undefined).length;
      
    if (totalImages < 1) {
      newErrors.images = "At least one image is required";
    }

    // Animation settings validation
    const { cycleDuration, animationDuration, initialRevealDelay } = formData.animationSettings;
    if (cycleDuration <= 0) newErrors["animation.cycleDuration"] = "Must be greater than 0";
    if (animationDuration <= 0) newErrors["animation.animationDuration"] = "Must be greater than 0";
    if (initialRevealDelay < 0) newErrors["animation.initialRevealDelay"] = "Cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async () => {
    if (!selectedImages.length) return { images: [] };
    
    const formDataObj = new FormData();
    selectedImages.forEach(img => {
      formDataObj.append('images', img.file);
      formDataObj.append('altTexts', img.alt);
      if (img.replacingIndex !== undefined) {
        formDataObj.append('replaceIndexes', String(img.replacingIndex));
      }
    });

    const uploadResponse = await fetch('/api/homepage/section1/uploadImage', {
      method: 'POST',
      body: formDataObj,
    });
    
    if (!uploadResponse.ok) throw new Error('Upload failed');
    return await uploadResponse.json();
  };

  const deleteReplacedImages = async (imagesToDelete: string[]) => {
    if (!imagesToDelete.length) return;
    
    await Promise.all(imagesToDelete.map(async (path) => {
      await fetch('/api/homepage/section1/deleteImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: path }),
      });
    }));
  };

  const saveFormData = async (finalData: FormDataType) => {
    const response = await fetch('/api/homepage/section1/heroSection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });
    
    if (!response.ok) throw new Error('Failed to save data');
    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Step 1: Upload new images
      const uploadResult = await uploadImages();

      // Step 2: Update images array
      const updatedImages = [...formData.images];
      const imagesToDelete: string[] = [];
      
      uploadResult.images.forEach((newImage: ImageData, index: number) => {
        const replaceIndex = selectedImages[index].replacingIndex;
        if (replaceIndex !== undefined && updatedImages[replaceIndex]) {
          imagesToDelete.push(updatedImages[replaceIndex].src);
          updatedImages[replaceIndex] = newImage;
        } else {
          updatedImages.push(newImage);
        }
      });

      // Step 3: Save final data
      const finalData = { ...formData, images: updatedImages };
      await saveFormData(finalData);

      // Step 4: Cleanup replaced images
      await deleteReplacedImages(imagesToDelete);

      setMessage({ text: "Saved successfully!", type: "success" });
      setSelectedImages([]);
      await fetchHeroData();
    } catch (error) {
      console.error('Error saving form:', error);
      setMessage({ text: "Save failed. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Hero Section Editor</h1>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md flex items-center ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.type === "success" ? 
              <CheckCircle2 className="h-5 w-5 mr-2" /> : 
              <AlertCircle className="h-5 w-5 mr-2" />
            }
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Text Fields Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tag" className="block text-sm font-medium">Tag Line</label>
                <input
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="highlightedTitle" className="block text-sm font-medium">Highlighted Title</label>
                <input
                  id="highlightedTitle"
                  name="highlightedTitle"
                  value={formData.highlightedTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="buttonName" className="block text-sm font-medium">
                  Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  id="buttonName"
                  name="buttonName"
                  value={formData.buttonName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.buttonName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.buttonName && <p className="text-red-500 text-sm">{errors.buttonName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="buttonLink" className="block text-sm font-medium">
                  Button Link <span className="text-red-500">*</span>
                </label>
                <input
                  id="buttonLink"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.buttonLink ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.buttonLink && <p className="text-red-500 text-sm">{errors.buttonLink}</p>}
              </div>
            </div>

            {/* Description and Animation Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium">Animation Settings</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="cycleDuration" className="block text-sm font-medium">Cycle Duration (ms)</label>
                    <input
                      id="cycleDuration"
                      name="animation.cycleDuration"
                      value={formData.animationSettings.cycleDuration}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors["animation.cycleDuration"] ? "border-red-500" : ""
                      }`}
                    />
                    {errors["animation.cycleDuration"] && (
                      <p className="text-red-500 text-sm">{errors["animation.cycleDuration"]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="animationDuration" className="block text-sm font-medium">Animation Duration (ms)</label>
                    <input
                      id="animationDuration"
                      name="animation.animationDuration"
                      value={formData.animationSettings.animationDuration}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors["animation.animationDuration"] ? "border-red-500" : ""
                      }`}
                    />
                    {errors["animation.animationDuration"] && (
                      <p className="text-red-500 text-sm">{errors["animation.animationDuration"]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="initialRevealDelay" className="block text-sm font-medium">Initial Delay (ms)</label>
                    <input
                      id="initialRevealDelay"
                      name="animation.initialRevealDelay"
                      value={formData.animationSettings.initialRevealDelay}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors["animation.initialRevealDelay"] ? "border-red-500" : ""
                      }`}
                    />
                    {errors["animation.initialRevealDelay"] && (
                      <p className="text-red-500 text-sm">{errors["animation.initialRevealDelay"]}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">
                Images <span className="text-red-500">*</span>
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Max 5MB, JPG, PNG, WebP, or GIF)
                </span>
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplacingIndex(null);
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                />
              </div>
            </div>

            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

            {formData.images.length === 0 && selectedImages.length === 0 && (
              <div className="border-2 border-dashed rounded-md p-8 text-center bg-gray-50">
                <p className="text-gray-500">No images added yet. Click 'Add New' to upload images.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={`existing-${index}`} className="border rounded-md overflow-hidden bg-gray-50 transition-shadow hover:shadow-md">
                  <div className="aspect-video relative">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingIndex(index);
                          fileInputRef.current?.click();
                        }}
                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        title="Replace image"
                        aria-label="Replace image"
                      >
                        <Replace className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, true)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Delete image"
                        aria-label="Delete image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <label className="sr-only">Image alt text</label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleAltTextChange(index, e.target.value, true)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alt text (for accessibility)"
                    />
                  </div>
                </div>
              ))}

              {selectedImages.map((image, index) => (
                <div key={`new-${index}`} className="border rounded-md overflow-hidden bg-gray-50 transition-shadow hover:shadow-md">
                  <div className="aspect-video relative">
                    <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {image.replacingIndex !== undefined ? 'Replacement' : 'New'}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, false)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <label className="sr-only">Image alt text</label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleAltTextChange(index, e.target.value, false)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alt text (for accessibility)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isSaving ? (
                <><RefreshCw className="h-5 w-5 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-5 w-5" /> Save Changes</>
              )}
            </button>
            <button
              type="button"
              onClick={fetchHeroData}
              disabled={isSaving}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HeroSectionForm;