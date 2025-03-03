"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Loader2, Search, RefreshCw, Trash2, LogIn, LogOut } from "lucide-react"

type ContactSubmission = {
  id: string
  name: string
  company: string | null
  message: string
  email: string
  phone: string | null
  created_at: string
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState("pramodsh@salsabeelaljanoobimpexp.com")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setAuthLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setLoginError(error.message)
        return
      }

      setIsAuthenticated(true)
      fetchSubmissions()
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred during login.")
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setSubmissions([])
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Fetch submissions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }
  }, [isAuthenticated])

  // Function to fetch submissions
  const fetchSubmissions = async () => {
    if (!isAuthenticated) return
    
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
      alert("Failed to fetch submissions.")
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
    if (!isAuthenticated) {
      alert("You must be logged in to delete submissions.")
      return
    }
    
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return
    }
    
    setDeleting(id)
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id)

      if (error) throw error

      // Remove the deleted submission from the state
      setSubmissions(submissions.filter((submission) => submission.id !== id))
    } catch (error) {
      console.error("Error deleting submission:", error)
      alert("Failed to delete submission.")
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-2">Loading submissions...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <div className="flex space-x-3">
            <button
              onClick={refreshSubmissions}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl mb-8 shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center border border-gray-200 shadow-sm">
            <p className="text-lg text-gray-600">
              {submissions.length === 0
                ? "No submissions found. When users submit the contact form, they will appear here."
                : "No submissions match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{submission.name}</h2>
                    {submission.company && <p className="text-gray-600 mt-1">{submission.company}</p>}
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 mt-2 md:mt-0 text-sm mr-4">{formatDate(submission.created_at)}</div>
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      disabled={deleting === submission.id}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete submission"
                    >
                      {deleting === submission.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="text-gray-900">{submission.email}</p>
                  </div>
                  {submission.phone && (
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Phone</p>
                      <p className="text-gray-900">{submission.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 text-sm mb-2">Message</p>
                  <p className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700">{submission.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}