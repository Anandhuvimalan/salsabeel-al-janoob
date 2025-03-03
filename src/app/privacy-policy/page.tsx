import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Mail, Phone, Globe,ChartBarIncreasing } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            1. Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p>
            Salsabeel Al Janoob Imp Exp ("we", "us", or "our") operates across Oman and India, 
            committed to protecting your personal information through compliance with international 
            data protection standards.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              By using our services across either:
              <span className="block mt-2 font-medium">
                Oman Operation: Salsabeel Al Janoob Trad & Cont. Est<br />
                Indian Operation: Salsabeel Al Janoob ImpExp
              </span>
              you agree to the terms outlined in this policy.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            2. Data Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Direct Collection</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Contact forms & service requests</li>
              <li>Career applications (CVs, qualifications)</li>
              <li>Business contract information</li>
              <li>Client onboarding documentation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Automatic Collection</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Device & browser characteristics</li>
              <li>Usage patterns & engagement metrics</li>
              <li>Geolocation data (country-level)</li>
              <li>Referral source information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ChartBarIncreasing className="w-6 h-6 text-primary" />
            3. Analytics & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p>
              We utilize Google Analytics with these safeguards:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Anonymized IP tracking</li>
              <li>Data retention limited to 26 months</li>
              <li>No cross-site user identification</li>
            </ul>
            <p className="mt-3 text-sm">
              Opt-out available via 
              <a href="https://tools.google.com/dlpage/gaoptout" 
                 className="text-primary hover:underline ml-1">
                Google's browser extension
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            4. Data Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Operational Use</h4>
            <ul className="space-y-2 text-sm">
              <li>• Service delivery & improvement</li>
              <li>• Client communication</li>
              <li>• Recruitment processing</li>
              <li>• Legal compliance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Commercial Use</h4>
            <ul className="space-y-2 text-sm">
              <li>• Market trend analysis</li>
              <li>• Service optimization</li>
              <li>• Strategic planning (aggregated data only)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            5. Data Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Internal Sharing</h4>
              <p className="text-sm">
                Operational data shared between our Omani and Indian entities under 
                strict confidentiality agreements.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Third-Party Partners</h4>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Legal authorities (when required)</li>
                <li>Certified subcontractors</li>
                <li>Professional advisors</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            We maintain a no-sale policy for all personal data.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            6. Security Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded">
              <div className="font-semibold">Technical</div>
              <p className="text-sm mt-2">SSL Encryption<br/>Firewalls<br/>Access Controls</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <div className="font-semibold">Organizational</div>
              <p className="text-sm mt-2">Staff Training<br/>Data Audits<br/>NDA Agreements</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <div className="font-semibold">Physical</div>
              <p className="text-sm mt-2">Secure Facilities<br/>Access Logs<br/>Disposal Protocols</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            7. Contact & Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Data Requests</h4>
            <p className="text-sm">
              Submit inquiries to:
              <span className="block mt-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Oman: +968 9171 8606<br />
                <Phone className="inline w-4 h-4 mr-1" />
                India: +91 93494 74746
              </span>
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Office Locations</h4>
            <p className="text-sm">
              OMAN: PO Box xxxx PC xxx Salalah<br />
              INDIA: Jwala Complex, Marappalam,<br />
              PO Madukarai 641105, Coimbatore
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-12 pt-6 border-t">
        <p>© {new Date().getFullYear()} Salsabeel Al Janoob Group</p>
        <p className="mt-1">Version 2.1 | Updated {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}