"use client"

import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import MemorialForm from "@/components/admin/about/MemorialForm"

const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"

export default function MemorialSectionPage() {
  return (
    <div className="space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/15 hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Memorial Section</h1>
            <div className="ml-2 bg-background px-3 py-1 rounded-full text-xs !border-[0.5px] !border-white/10 text-muted-foreground">
              About
            </div>
          </div>
          <p className="text-muted-foreground">Customize the memorial section that appears on your about page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/about" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className={`px-4 py-2 bg-background hover:bg-background/80 hover:text-foreground ${buttonStyles}`}
            >
              <ExternalLink className="h-4 w-4 mr-2 text-primary" />
              <span className="text-foreground">View About Page</span>
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-border/3" />

      <div className="bg-card">
        <div className="p-6">
          <MemorialForm />
        </div>
      </div>
    </div>
  )
}

