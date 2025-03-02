"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react";

const CallToActionForm = () => {
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    buttonText: "",
    buttonLink: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aboutpage/calltoaction");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      setMessage({ text: "Failed to load data.", type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/aboutpage/calltoaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save data");
      setMessage({ text: "Call to Action updated successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to save changes.", type: "error" });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="heading">Heading</Label>
        <Input
          id="heading"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
          placeholder="Enter heading"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subheading">Subheading</Label>
        <Textarea
          id="subheading"
          name="subheading"
          value={formData.subheading}
          onChange={handleChange}
          placeholder="Enter subheading"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          name="buttonText"
          value={formData.buttonText}
          onChange={handleChange}
          placeholder="Enter button text"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonLink">Button Link</Label>
        <Input
          id="buttonLink"
          name="buttonLink"
          value={formData.buttonLink}
          onChange={handleChange}
          placeholder="Enter button link"
        />
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
    </form>
  );
};

export default CallToActionForm;
