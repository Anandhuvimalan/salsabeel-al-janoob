"use client"

import { useState } from "react"
import { type ExperienceRange, supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Plus } from "lucide-react"

interface ExperienceManagementProps {
  experienceRanges: ExperienceRange[]
  onUpdate: () => void
}

export default function ExperienceManagement({ experienceRanges, onUpdate }: ExperienceManagementProps) {
  const [newRange, setNewRange] = useState("")
  const [newValue, setNewValue] = useState("")
  const [editingRange, setEditingRange] = useState<ExperienceRange | null>(null)
  const [editRange, setEditRange] = useState("")
  const [editValue, setEditValue] = useState("")
  const { toast } = useToast()

  const handleAddRange = async () => {
    if (!newRange.trim() || !newValue.trim()) return

    try {
      const { error } = await supabase.from("experience_ranges").insert({
        range: newRange.trim(),
        value: Number.parseInt(newValue),
      })

      if (error) throw error

      setNewRange("")
      setNewValue("")
      onUpdate()
      toast({
        title: "Experience Range Added",
        description: "The experience range has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding experience range:", error)
      toast({
        title: "Error",
        description: "Failed to add experience range. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditRange = async () => {
    if (!editingRange || !editRange.trim() || !editValue.trim()) return

    try {
      const { error } = await supabase
        .from("experience_ranges")
        .update({
          range: editRange.trim(),
          value: Number.parseInt(editValue),
        })
        .eq("id", editingRange.id)

      if (error) throw error

      setEditingRange(null)
      setEditRange("")
      setEditValue("")
      onUpdate()
      toast({
        title: "Experience Range Updated",
        description: "The experience range has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating experience range:", error)
      toast({
        title: "Error",
        description: "Failed to update experience range. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRange = async (rangeId: number) => {
    try {
      const { error } = await supabase.from("experience_ranges").delete().eq("id", rangeId)

      if (error) throw error

      onUpdate()
      toast({
        title: "Experience Range Deleted",
        description: "The experience range has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting experience range:", error)
      toast({
        title: "Error",
        description: "Failed to delete experience range. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Experience Ranges</h2>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Range name (e.g., '1+ years')"
              value={newRange}
              onChange={(e) => setNewRange(e.target.value)}
            />
          </div>
          <div className="w-32">
            <Input
              placeholder="Value (e.g., 1)"
              type="number"
              min="0"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <Button onClick={handleAddRange}>
            <Plus className="h-4 w-4 mr-2" />
            Add Range
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Range</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experienceRanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No experience ranges found. Add your first range.
                </TableCell>
              </TableRow>
            ) : (
              experienceRanges.map((range) => (
                <TableRow key={range.id}>
                  <TableCell>
                    {editingRange?.id === range.id ? (
                      <Input value={editRange} onChange={(e) => setEditRange(e.target.value)} autoFocus />
                    ) : (
                      range.range
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRange?.id === range.id ? (
                      <Input type="number" min="0" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    ) : (
                      range.value
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRange?.id === range.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleEditRange}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRange(null)
                            setEditRange("")
                            setEditValue("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingRange(range)
                            setEditRange(range.range)
                            setEditValue(range.value.toString())
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this experience range?")) {
                              handleDeleteRange(range.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

