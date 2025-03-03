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

export const metadata = {
  title: "Global Trade Solutions | Import Export Services India",
  description: "Comprehensive international trade services including customs clearance, freight forwarding, and logistics management. Your gateway to global markets.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    publishedTime: "2024-01-01T00:00:00.000Z",
    images: [{
      url: "https://salsabeelaljanoobimpexp.com/import&export-og.webp",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      secureUrl: "https://salsabeelaljanoobimpexp.com/import&export-og.webp",
      alt: "Global Trade Experts - Salsabeel Al Janoob ImpExp",
    }],
    siteName: "Salsabeel Al Janoob ImpExp"
  }
};

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