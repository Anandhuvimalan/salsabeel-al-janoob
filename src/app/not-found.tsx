import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        {/* Logo/Company Name */}
        <div className="flex items-center justify-center space-x-2">
          <Compass className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Salsabeel Al Janoob</h1>
        </div>

        {/* 404 Display */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <span className="text-[12rem] font-bold">404</span>
          </div>
          <div className="relative flex flex-col items-center justify-center space-y-4 py-10">
            <div className="rounded-full bg-muted p-4">
              <MapPin className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Homepage
          </Link>
        </Button>

        {/* Company Info */}
        <p className="text-sm text-muted-foreground">
          Salsabeel Al Janoob Import Export | International Trade Solutions
        </p>
      </div>
    </div>
  )
}