import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Terms of Service | Salsabeel Al Janoob ImpExp",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Review the Terms of Service for Salsabeel Al Janoob ImpExp. These terms govern your access to and use of our website and services.",
  keywords: [
    "terms of service",
    "TOS",
    "user agreement",
    "legal",
    "Salsabeel Al Janoob ImpExp terms",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/terms-of-service",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Terms of Service | Salsabeel Al Janoob ImpExp",
    description:
      "Review the Terms of Service for Salsabeel Al Janoob ImpExp. By using our services, you agree to these terms.",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Salsabeel Al Janoob ImpExp",
    description:
      "Review the Terms of Service for Salsabeel Al Janoob ImpExp and understand your rights and responsibilities.",
    creator: "@salsabeelaljanoob",
    site: "@salsabeelaljanoob",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/terms-of-service",
  },
  category: "Legal",
  manifest: "/site.webmanifest",
  verification: {
    google: "G-VS910V1G3D",
  },
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to Salsabeel Al Janoob ImpExp ("Company", "we", "us", or "our").
            These Terms of Service ("Terms") govern your access to and use of our website, services, and any related platforms (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
          </p>
          <p>
            We operate through two primary entities:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Oman Operation</h3>
              <p className="text-sm">
                Salsabeel Al Janoob Trad & Cont. Est<br />
                PO Box xxxx PC xxx Salalah<br />
                Head Office at Barka, Sultanate of Oman
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Indian Operation</h3>
              <p className="text-sm">
                Salsabeel Al Janoob ImpExp<br />
                Jwala Complex, Marappalam<br />
                PO Madukarai 641105, Coimbatore, Tamilnadu
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. Services Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We specialize in comprehensive business solutions including but not limited to:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Core Services</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>International Import/Export Operations</li>
                <li>Environmental Management Solutions</li>
                <li>Civil Engineering & Construction Contracts</li>
                <li>Industrial Waste Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Consultancy Services</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Retail & Business Strategy</li>
                <li>Educational & Career Development</li>
                <li>Cultural & Family Services</li>
                <li>Vasthu & Wellness Consulting</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Specific service terms will be detailed in individual service agreements prior to engagement.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. Privacy & Data Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We are committed to responsible data management:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not sell or trade personal data to third parties</li>
            <li>Google Analytics is employed for website traffic analysis</li>
            <li>Data collection is limited to necessary service provision</li>
            <li>Detailed privacy practices are available in our separate Privacy Policy</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. User Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            By using our Services, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information in all interactions</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Immediately report unauthorized account activity</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>5. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            All content, trademarks, and proprietary information displayed on our platforms remain the exclusive property of Salsabeel Al Janoob ImpExp. A revocable license for personal, non-commercial use is granted through website access.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our liability is limited to the maximum extent permitted by law. We shall not be liable for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Service interruptions beyond our reasonable control</li>
            <li>Third-party actions or content</li>
            <li>Accuracy of external website links</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>7. Governing Law & Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            These Terms are governed by Omani law. Any disputes shall be resolved through arbitration in Muscat, Oman, in accordance with Oman Arbitration Law. For Indian operations, concurrent jurisdiction may apply as specified in individual service contracts.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>8. Contact & Communications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Oman Headquarters</h4>
              <p className="text-sm">
                Salsabeel Al Janoob Trad & Cont. Est<br />
                Post Box no : 730, postal code : 111<br />
                Dhofar-Salala, Sultanate of Oman<br />
                Tel: +968 9171 8606
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Indian Operations</h4>
              <p className="text-sm">
                Salsabeel Al Janoob ImpExp<br />
                Jwala Complex, Marappalam<br />
                PO Madukarai 641105, Coimbatore, Tamilnadu<br />
                Tel: 0422-4547438 | +91 93494 74746
              </p>
            </div>
          </div>
          <p>
            Visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a> for inquiries or explore opportunities on our <a href="/careers" className="text-primary hover:underline">Career Portal</a>.
          </p>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>© {new Date().getFullYear()} Salsabeel Al Janoob ImpExp. All rights reserved.</p>
        <p className="mt-2">Version 1.1 | Updated {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}
