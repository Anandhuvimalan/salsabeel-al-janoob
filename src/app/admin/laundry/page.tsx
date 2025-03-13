"use client"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LaundryServiceForm from "@/components/admin/services/laundryform"

export default function LaundryServicePage() {
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
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Laundry Service Section</h1>
            <div className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Services</div>
          </div>
          <p className="text-muted-foreground">Manage the laundry service section content.</p>
        </div>
      </div>
      <Separator className="bg-border/3" />

      <Card className="border-[0.5px] border-white/10 bg-card text-white">
        <CardContent>
          <LaundryServiceForm />
        </CardContent>
      </Card>
    </div>
  )
}

