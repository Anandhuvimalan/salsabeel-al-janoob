"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true)
        const { data } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false })

        setSubscribers(data || [])
      } catch (err) {
        console.error("Error fetching subscribers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSubscribers(new Set())
    } else {
      const allIds = subscribers.map((sub) => sub.id)
      setSelectedSubscribers(new Set(allIds))
    }
    setIsAllSelected(!isAllSelected)
  }

  // Handle individual checkbox selection
  const handleSelectSubscriber = (id: string) => {
    const newSelected = new Set(selectedSubscribers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSubscribers(newSelected)
    setIsAllSelected(newSelected.size === subscribers.length)
  }

  // Delete a single subscriber
  const deleteSubscriber = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      await supabase.from("newsletter_subscribers").delete().eq("id", id)

      setSubscribers(subscribers.filter((sub) => sub.id !== id))

      // If this subscriber was selected, remove it from selected set
      if (selectedSubscribers.has(id)) {
        const newSelected = new Set(selectedSubscribers)
        newSelected.delete(id)
        setSelectedSubscribers(newSelected)
      }
    }
  }

  // Delete selected subscribers
  const deleteSelected = async () => {
    if (selectedSubscribers.size === 0) return

    if (confirm(`Are you sure you want to delete ${selectedSubscribers.size} selected subscribers?`)) {
      await supabase.from("newsletter_subscribers").delete().in("id", Array.from(selectedSubscribers))

      setSubscribers(subscribers.filter((sub) => !selectedSubscribers.has(sub.id)))
      setSelectedSubscribers(new Set())
      setIsAllSelected(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button
              variant="destructive"
              onClick={deleteSelected}
              disabled={selectedSubscribers.size === 0}
              className="bg-red-700 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedSubscribers.size})
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center p-12 text-gray-400">No subscribers found</div>
          ) : (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-900">
                  <TableRow className="hover:bg-gray-800 border-gray-700">
                    <TableHead className="w-12 text-gray-400">
                      <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} className="border-gray-600" />
                    </TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Subscribed On</TableHead>
                    <TableHead className="w-12 text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="hover:bg-gray-800 border-gray-700">
                      <TableCell>
                        <Checkbox
                          checked={selectedSubscribers.has(subscriber.id)}
                          onCheckedChange={() => handleSelectSubscriber(subscriber.id)}
                          className="border-gray-600"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">{subscriber.email}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(subscriber.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

