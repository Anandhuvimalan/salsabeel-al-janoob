import type { Metadata } from "next"
import ApplicationManagement from "@/components/carrercomp/application-management"

export const metadata: Metadata = {
  title: "Application Management | Admin",
  description: "Manage job applications",
}

export default function ApplicationManagementPage() {
  return <ApplicationManagement />
}

