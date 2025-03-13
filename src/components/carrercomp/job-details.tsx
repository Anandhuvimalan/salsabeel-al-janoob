"use client"

import { useState } from "react"
import Link from "next/link"
import type { Job } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Globe, Calendar, ArrowLeft } from 'lucide-react'
import ApplicationForm from "@/components/carrercomp/application-form"

interface JobDetailsProps {
  job: Job
}

export default function JobDetails({ job }: JobDetailsProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  return (
    <div className="min-h-screen bg-[#0e1116] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <Link href="/careers" className="inline-flex items-center text-[#38bdf8] hover:text-[#38bdf8]/80 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all positions
        </Link>

        <div className="grid gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                {job.category && (
                  <Badge className="mt-2 bg-[#38bdf8]/20 text-[#38bdf8] hover:bg-[#38bdf8]/30 border-[#38bdf8]/30">
                    {job.category.name}
                  </Badge>
                )}
              </div>
              <Button
                size="lg"
                onClick={() => setShowApplicationForm(true)}
                className="md:self-start bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white font-medium"
              >
                Apply Now
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#38bdf8]" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-[#38bdf8]" />
                <span>
                  {job.experience} {job.experience === 1 ? "year" : "years"} experience
                </span>
              </div>

              {job.is_remote && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-[#38bdf8]" />
                  <span>Remote</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#38bdf8]" />
                <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Job Description</h2>
                <div
                  className="prose prose-invert max-w-none text-zinc-200"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Responsibilities</h2>
                <div
                  className="prose prose-invert max-w-none text-zinc-200"
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Requirements</h2>
                <div
                  className="prose prose-invert max-w-none text-zinc-200"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => setShowApplicationForm(true)}
              className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white font-medium"
            >
              Apply for this Position
            </Button>
          </div>

          {showApplicationForm && <ApplicationForm job={job} onClose={() => setShowApplicationForm(false)} />}
        </div>
      </div>
    </div>
  )
}
