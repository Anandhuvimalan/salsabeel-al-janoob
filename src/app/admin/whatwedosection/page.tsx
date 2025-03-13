"use client"

import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import WhatWeDoForm from "@/components/admin/WhatWeDoForm"

const buttonStyles = "!border-[0.5px] !border-white/10 hover:!border-white/15"

export default function WhatWeDoSectionPage() {
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
            <h1 className="text-2xl font-bold tracking-tight gradient-text">What We Do Section</h1>
            <div className="ml-2 bg-background px-3 py-1 rounded-full text-xs !border-[0.5px] !border-white/10 text-muted-foreground">
              Homepage
            </div>
          </div>
          <p className="text-muted-foreground">
            Customize the services and offerings section that appears on your homepage.
          </p>
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
          <WhatWeDoForm />
        </div>
      </div>
    </div>
  )
}

