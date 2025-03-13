"use client"

import { useState } from "react"
import { type JobCategory, supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Plus } from "lucide-react"

interface CategoryManagementProps {
  categories: JobCategory[]
  onUpdate: () => void
}

export default function CategoryManagement({ categories, onUpdate }: CategoryManagementProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null)
  const [editName, setEditName] = useState("")
  const { toast } = useToast()

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const { error } = await supabase.from("job_categories").insert({ name: newCategory.trim() })

      if (error) throw error

      setNewCategory("")
      onUpdate()
      toast({
        title: "Category Added",
        description: "The category has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editName.trim()) return

    try {
      const { error } = await supabase
        .from("job_categories")
        .update({ name: editName.trim() })
        .eq("id", editingCategory.id)

      if (error) throw error

      setEditingCategory(null)
      setEditName("")
      onUpdate()
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      // Check if category is in use
      const { count, error: countError } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryId)

      if (countError) throw countError

      if (count && count > 0) {
        toast({
          title: "Cannot Delete",
          description: "This category is in use by one or more jobs.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("job_categories").delete().eq("id", categoryId)

      if (error) throw error

      onUpdate()
      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Job Categories</h2>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-6">
                  No categories found. Add your first category.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {editingCategory?.id === category.id ? (
                      <div className="flex gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                        <Button size="sm" onClick={handleEditCategory}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null)
                            setEditName("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingCategory?.id !== category.id && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category)
                            setEditName(category.name)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this category?")) {
                              handleDeleteCategory(category.id)
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

