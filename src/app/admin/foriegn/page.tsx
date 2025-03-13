"use client"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LanguageForm from "@/components/admin/services/foriegnform"


export default function ForiegnLanguageForm() {
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
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Foreign Language Learning Section</h1>
            <div className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Services</div>
          </div>
          <p className="text-muted-foreground">Manage the Foreign Language Learning Section content.</p>
        </div>
      </div>
      <Separator className="bg-border/3" />
      <Card className="border-[0.5px] border-white/10 bg-card text-white">
        <CardContent>
          <LanguageForm />
        </CardContent>
      </Card>
    </div>
  )
}


