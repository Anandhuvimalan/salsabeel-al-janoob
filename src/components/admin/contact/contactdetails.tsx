"use client"
import { useState, useEffect } from "react"

import { supabase } from "@/lib/supabaseClient"
import { Loader2, Search, RefreshCw, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Add these CSS classes for consistent styling with other forms
const inputStyles =
  "bg-background !border-[0.5px] !border-white/10 text-white focus-visible:!ring-opacity-20 focus-visible:!ring-primary/30 focus-visible:!border-primary/20"
const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"
const cardStyles = "!border-[0.5px] !border-white/10 hover:!border-primary/30 bg-background"

type ContactSubmission = {
  id: string
  name: string
  company: string | null
  message: string
  email: string
  phone: string | null
  created_at: string
}

export default function ContactDetails() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState({ text: "", type: "" })

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Fetch submissions when component mounts
  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Function to fetch submissions
  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setSubmissions(data || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      setMessage({ text: "Failed to fetch submissions. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh submissions
  const refreshSubmissions = async () => {
    setRefreshing(true)
    await fetchSubmissions()
    setRefreshing(false)
  }

  // Function to delete a submission
  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return
    }

    setDeleting(id)
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted submission from the state
      setSubmissions(submissions.filter((submission) => submission.id !== id))
      setMessage({ text: "Submission deleted successfully!", type: "success" })
    } catch (error) {
      console.error("Error deleting submission:", error)
      setMessage({ text: "Failed to delete submission. Please try again.", type: "error" })
    } finally {
      setDeleting(null)
    }
  }

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.company && submission.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-64 bg-white/5" />
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-24 bg-white/5" />
            </div>
          </div>

          <Card className={`p-6 rounded-xl mb-8 ${cardStyles}`}>
            <Skeleton className="h-12 w-full bg-white/5" />
          </Card>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className={`p-6 rounded-xl ${cardStyles}`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <Skeleton className="h-6 w-48 bg-white/5 mb-2" />
                    <Skeleton className="h-4 w-32 bg-white/5" />
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <Skeleton className="h-4 w-36 bg-white/5 mr-4" />
                    <Skeleton className="h-8 w-8 rounded-full bg-white/5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Skeleton className="h-4 w-16 bg-white/5 mb-1" />
                    <Skeleton className="h-5 w-48 bg-white/5" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 bg-white/5 mb-1" />
                    <Skeleton className="h-5 w-32 bg-white/5" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-4 w-20 bg-white/5 mb-2" />
                  <Skeleton className="h-24 w-full bg-white/5 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Contact Submissions</h1>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={refreshSubmissions}
              disabled={refreshing}
              variant="outline"
              className={`gap-2 hover:bg-background/80 hover:text-white bg-background text-white ${buttonStyles}`}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {message.text && (
          <Alert
            variant={message.type === "warning" ? "warning" : message.type === "error" ? "destructive" : "default"}
            className={`mb-6 ${message.type === "success" ? "bg-zinc-900/90 border-emerald-600/30" : ""}`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 !text-emerald-400" />
            ) : message.type === "warning" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle className={message.type === "success" ? "text-white" : ""}>
              {message.type === "success" ? "Success" : message.type === "warning" ? "Warning" : "Error"}
            </AlertTitle>
            <AlertDescription className={message.type === "success" ? "text-white/90" : ""}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card className={`p-6 rounded-xl mb-8 ${cardStyles}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${inputStyles}`}
            />
          </div>
        </Card>

        {filteredSubmissions.length === 0 ? (
          <Card className={`p-8 rounded-xl text-center ${cardStyles}`}>
            <p className="text-lg text-white/70">
              {submissions.length === 0
                ? "No submissions found. When users submit the contact form, they will appear here."
                : "No submissions match your search."}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} className={`p-6 rounded-xl ${cardStyles} transition-all duration-200`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{submission.name}</h2>
                    {submission.company && <p className="text-white/70 mt-1">{submission.company}</p>}
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <div className="text-white/70 text-sm mr-4">{formatDate(submission.created_at)}</div>
                    <Button
                      onClick={() => deleteSubmission(submission.id)}
                      disabled={deleting === submission.id}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      title="Delete submission"
                    >
                      {deleting === submission.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Email</p>
                    <p className="text-white">{submission.email}</p>
                  </div>
                  {submission.phone && (
                    <div>
                      <p className="text-white/70 text-sm mb-1">Phone</p>
                      <p className="text-white">{submission.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-2">Message</p>
                  <div className={`p-4 rounded-lg border border-white/5 bg-white/5 text-white`}>
                    {submission.message}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

