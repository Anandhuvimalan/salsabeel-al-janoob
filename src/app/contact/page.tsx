import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ContactForm from "@/components/contact"

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Contact Us | Salsabeel Al Janoob ImpExp",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Get in touch with Salsabeel Al Janoob for inquiries, support, and collaborations. We're here to help and answer your questions.",
  keywords: [
    "contact",
    "inquiries",
    "customer support",
    "reach out",
    "Salsabeel Al Janoob ImpExp contact",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/contact",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Contact Us | Salsabeel Al Janoob ImpExp",
    description:
      "Get in touch with Salsabeel Al Janoob for inquiries, support, and collaborations.",
    images: [
      {
        url: "/contact-og.webp",
        width: 1200,
        height: 630,
        alt: "Contact Salsabeel Al Janoob ImpExp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Salsabeel Al Janoob ImpExp",
    description:
      "Reach out to Salsabeel Al Janoob for inquiries, support, and collaborations.",
    images: ["/contact-og.webp"],
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
    canonical: "/contact",
  },
  category: "CustomerSupport",
  manifest: "/site.webmanifest",
}

const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <ContactForm />
      <Footer />
    </>
  )
}

export default Page
