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
    "Leading Oman-India cross-border trade experts offering end-to-end import-export solutions, customs clearance, and logistics management between Gulf countries and South Asia.",
  keywords: [
    // Geo-Specific Keywords
    "Oman India import export company",
    "Muscat to Coimbatore trade services",
    "Gulf-India logistics solutions",
    "Sohar port shipping services",
    "Chennai maritime logistics",
    
    // Service Keywords
    "customs brokerage Oman India",
    "freight forwarding Muscat to Mumbai",
    "FTA benefits Oman India trade",
    "cross-border documentation experts",
    "cold chain logistics Gulf region",

    // Industry Terms
    "international trade consultancy Oman",
    "global shipping solutions India",
    "air sea cargo consolidation",
    "project cargo handling specialists",
    "trade compliance advisory",

    // Product Keywords
    "general cargo services",
    "perishables logistics Oman",
    "construction materials shipping",
    "textile export specialists India",
    "petrochemicals transportation",

    // Long-Tail Keywords
    "best import export company in Oman",
    "how to export from India to GCC",
    "reliable freight forwarders Muscat",
    "customs clearance agents Coimbatore",
    "Oman India trade agreement experts"
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