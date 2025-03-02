"use client"

import { useState } from "react"
import { ArrowLeft, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ProcessForm from "@/components/admin/ProcessForm"

export default function HeroSectionPage() {
  const [activeTab, setActiveTab] = useState("edit")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">work process section</h1>
          </div>
          <p className="text-muted-foreground">Customize the work process</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-4 w-4" />
              View Live Site
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">

          {activeTab === "preview" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                Desktop
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>work process content</CardTitle>
              <CardDescription>Update the work process</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

