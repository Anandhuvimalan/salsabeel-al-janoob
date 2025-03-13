"use client"

import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import LeadershipSectionForm from "@/components/admin/about/LeadershipForm"

export default function LeadershipSectionPage() {
  return (
    <div className="space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Leadership Section</h1>
          </div>
          <p className="text-muted-foreground">Manage the leadership team section that appears on your about page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/about" target="_blank">
            <Button variant="outline" size="sm" className="gap-1 border-[0.5px] border-white/10 hover:bg-primary/10">
              <ExternalLink className="h-4 w-4" />
              View About Page
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-white/5" />

      <div className="bg-card border border-white/10 rounded-lg">
        <div className="p-6">
          <LeadershipSectionForm />
        </div>
      </div>
    </div>
  )
}

