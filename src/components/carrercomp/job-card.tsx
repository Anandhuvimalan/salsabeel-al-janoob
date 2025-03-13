import Link from "next/link"
import type { Job } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Globe } from "lucide-react"

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden bg-zinc-800/50 border-zinc-700 hover:border-[#38bdf8]/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl text-white">{job.title}</h3>
              {job.category && (
                <Badge className="bg-zinc-700 text-zinc-200 hover:bg-zinc-700/80">{job.category.name}</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>
                  {job.experience} {job.experience === 1 ? "year" : "years"} experience
                </span>
              </div>

              {job.is_remote && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>Remote</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Link href={`/careers/${job.id}`}>
              <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white font-medium">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

