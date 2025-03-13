"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import HeroSectionForm from "@/components/admin/HeroSectionForm"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const buttonStyles = "!border-[0.5px] !border-white/5 hover:!border-white/10"

export default function HeroSectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/15 hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Hero Section</h1>
            <div className="ml-2 bg-background px-3 py-1 rounded-full text-xs !border-[0.5px] !border-white/5 text-muted-foreground">
              Homepage
            </div>
          </div>
          <p className="text-muted-foreground">Customize the main hero section that appears on your homepage.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className={`px-4 py-2 bg-background hover:bg-background/80 hover:text-foreground ${buttonStyles}`}
            >
              <ExternalLink className="h-4 w-4 mr-2 text-primary" />
              <span className="text-foreground">View Live Site</span>
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-border/3" />

      <div className="bg-card">
        <div className="p-6">
          <HeroSectionForm />
        </div>
      </div>
    </div>
  )
}

