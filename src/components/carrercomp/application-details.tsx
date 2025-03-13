"use client"

import type { Application } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react"

interface ApplicationDetailsProps {
  application: Application
  onClose: () => void
  onStatusChange: (applicationId: number, status: string) => void
}

export default function ApplicationDetails({ application, onClose, onStatusChange }: ApplicationDetailsProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "reviewed":
        return "default"
      case "shortlisted":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto text-black">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 ">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{application.full_name}</h2>
              <p className="text-muted-foreground">Applied for: {application.job?.title || "Unknown Job"}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={application.status} onValueChange={(value) => onStatusChange(application.id, value)}>
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{application.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{application.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{application.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
            </div>

            {application.current_company && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>Current Company: {application.current_company}</span>
              </div>
            )}

            {application.experience !== null && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Experience:</span>
                <span>{application.experience} years</span>
              </div>
            )}

            {application.notice_period !== null && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Notice Period:</span>
                <span>{application.notice_period} days</span>
              </div>
            )}

            {application.current_ctc !== null && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Current CTC:</span>
                <span>{application.current_ctc}</span>
              </div>
            )}

            {application.expected_ctc !== null && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Expected CTC:</span>
                <span>{application.expected_ctc}</span>
              </div>
            )}
          </div>

          {application.additional_info && (
            <div className="space-y-2">
              <h3 className="font-medium">Additional Information</h3>
              <p className="text-sm">{application.additional_info}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            <Button onClick={() => window.open(application.resume_url, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

