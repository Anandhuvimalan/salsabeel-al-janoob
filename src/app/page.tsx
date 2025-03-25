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
    default: "Salsabeel Al Janoob ImpExp | Your Gateway to International Markets",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Be'ah & PDO-certified specialists in industrial waste management and global trade solutions. Your first-call partner for complex projects and cross-border operational excellence.",
  keywords: [
    // Certifications & Approvals
    "Be'ah approved waste management",
    "PDO certified services",
    "Oman government approved",
    "chemical waste specialists",
    
    // Core Services
    "Oman-India import export",
    "waste oil purification",
    "MEP civil works Oman",
    "hazardous waste disposal",
    "international trade compliance",

    // Industry Terms
    "cross-border logistics solutions",
    "specialty waste conversion",
    "construction project management",
    "petroleum waste handling",
    "global trade consultancy",

    // Geographic Focus
    "Sultanate of Oman trade",
    "Indian market entry",
    "Gulf-India corridor",
    "Middle East waste solutions",
    "South Asia logistics",

    // Value Propositions
    "first-call trade experts",
    "end-to-end waste management",
    "certified conversion services",
    "government-approved contractors",
    "specialized market entry"
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Oman-India Trade Solutions | Salsabeel Al Janoob ImpExp",
    description: "Your trusted partner for cross-border trade between Oman and India - Customs clearance, logistics management, and export-import consultancy",
    images: [
      {
        url: "/oman-india-trade-og.webp",
        width: 1200,
        height: 630,
        alt: "Oman-India Trade Bridge - Salsabeel Al Janoob ImpExp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oman-India Trade Experts | Salsabeel Al Janoob ImpExp",
    description: "Streamlining cross-border commerce between Gulf countries and South Asia",
    images: ["/oman-india-trade-twitter.webp"],
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
}

const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
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