import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import AboutSection from "@/components/AboutCompany";
import ImportExportProcess from "@/components/Process";
import { GlareCardDemo } from "@/components/GlareCard";
import CoreServices from "@/components/Services";
import Testimonial from "@/components/Testimonials";
import Frequent from "@/components/Frequent";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Salsabeel Al Janoob Imp Exp | Import, Export & Waste Solutions",
    template: "%s | Salsabeel Al Janoob Imp Exp",
  },
  description:
    "Be'ah & PDO-certified experts in industrial waste management and global trade, delivering cross-border excellence with proven expertise and reliable service.",
  keywords: [
    "Salsabeel Al Janoob Imp Exp",
    "Industrial Waste Management",
    "Global Trade Solutions",
    "Be'ah Certified Waste Management",
    "PDO Certified Waste Management",
    "Import Export Services Oman",
    "Cross-Border Trade Oman India",
    "International Trade Expertise",
    "Certified Global Logistics",
    "Environmental Waste Management",
    "Waste Oil Recycling",
    "Industrial Waste Disposal",
    "Chemical Waste Management",
    "MEP Services Oman",
    "Oman Import Export Company",
    "India Import Export Solutions",
    "Global Waste Management",
    "Best Import Export Company",
    "Cross Border Trading Solutions",
    "Industrial Trade Services",
    "import export india",
    "import export services in india",
    "import in india",
    "export in india",
    "import to oman",
    "export to oman"
  ],
  authors: [{ name: "Salsabeel Al Janoob Imp Exp" }],
  creator: "Salsabeel Al Janoob Imp Exp",
  publisher: "Salsabeel Al Janoob Imp Exp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com",
    siteName: "Salsabeel Al Janoob Imp Exp",
    title: "Global Trade Solutions | Salsabeel Al Janoob Imp Exp",
    description:
      "Redefining cross-border trade with seamless logistics, customs clearance, and expert export-import consultancy.",
    images: [
      {
        url: "/import&export-og.webp",
        width: 1200,
        height: 630,
        alt: "Global Trade Bridge - Salsabeel Al Janoob Imp Exp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Trade Experts | Salsabeel Al Janoob Imp Exp",
    description:
      "Streamlining cross-border commerce with expert logistics and comprehensive trade solutions.",
    images: ["/import&export-og.webp"],
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
    canonical: "/",
  },
  category: "International Trade",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      {/* Screen Reader Only Content */}
      <div className="sr-only" aria-hidden="true">
        <h1>Salsabeel Al Janoob Imp Exp | Import, Export & Waste Solutions</h1>
        <h2>Excellence in Industrial Waste Management & Global Trade</h2>
        <ul>
          <li>BE'AH-approved chemical waste management</li>
          <li>PDO-certified petroleum services</li>
          <li>Government-recognized domestic trade operations</li>
          <li>Omani construction & MEP expertise</li>
        </ul>
        <h2>Indian Operations Hub: Coimbatore</h2>
        <ul>
          <li>Domestic trade consultancy services</li>
          <li>Local waste management solutions</li>
          <li>Regional civil contract expertise</li>
          <li>Specialists in the South Indian market</li>
        </ul>
        <h2>Core Capabilities</h2>
        <ul>
          <li>1500+ domestic shipments completed</li>
          <li>95% on-time delivery record</li>
          <li>Innovative waste oil conversion technology</li>
          <li>Industrial laundry systems</li>
        </ul>
        <h2>Certifications & Standards</h2>
        <ul>
          <li>Government Approved Contractors in Oman</li>
          <li>BE'AH Environmental Compliance</li>
          <li>PDO Certified</li>
          <li>ISO 9001 Quality Certified</li>
        </ul>
      </div>
      <Features />
      <AboutSection />
      <CoreServices />
      <ImportExportProcess />
      <GlareCardDemo />
      <Testimonial />
      <Frequent />
      <Footer />
    </>
  );
};

export default Page;
