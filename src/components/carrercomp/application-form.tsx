"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { type Job, supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ApplicationFormProps {
  job: Job
  onClose: () => void
}

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  currentCompany: z.string().optional(),
  experience: z.string().optional(),
  noticePeriod: z.string().optional(),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  additionalInfo: z.string().optional(),
  resume: z.instanceof(FileList).refine((files) => files.length > 0, "Resume is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function ApplicationForm({ job, onClose }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const isFresher = job.experience === 0

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      currentCompany: "",
      experience: "",
      noticePeriod: "",
      currentCtc: "",
      expectedCtc: "",
      additionalInfo: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Upload resume to Supabase Storage
      const resumeFile = data.resume[0]
      const fileExt = resumeFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("applications").upload(filePath, resumeFile)

      if (uploadError) throw uploadError

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage.from("applications").getPublicUrl(filePath)

      // Submit application to database
      const { error: insertError } = await supabase.from("applications").insert({
        job_id: job.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        current_company: data.currentCompany || null,
        experience: data.experience ? Number.parseInt(data.experience) : null,
        notice_period: data.noticePeriod ? Number.parseInt(data.noticePeriod) : null,
        current_ctc: data.currentCtc ? Number.parseFloat(data.currentCtc) : null,
        expected_ctc: data.expectedCtc ? Number.parseFloat(data.expectedCtc) : null,
        additional_info: data.additionalInfo || null,
        resume_url: publicUrlData.publicUrl,
        status: "pending",
      })

      if (insertError) throw insertError

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      })

      onClose()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>Fill out the form below to apply for this position</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isFresher && (
                <>
                  <FormField
                    control={form.control}
                    name="currentCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noticePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notice Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentCtc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current CTC</FormLabel>
                        <FormControl>
                          <Input placeholder="50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedCtc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected CTC</FormLabel>
                        <FormControl>
                          <Input placeholder="60000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us anything else that might be relevant to your application"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onChange(e.target.files)} {...rest} />
                  </FormControl>
                  <FormDescription>Upload your resume (PDF, DOC, or DOCX)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

