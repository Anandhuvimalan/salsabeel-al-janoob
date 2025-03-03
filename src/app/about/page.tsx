import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/aboutpage/HeroSection";
import CompanyAbout from "@/components/aboutpage/CompanyAbout";
import TeamSection from "@/components/aboutpage/TeamSection";
import ValuesSection from "@/components/aboutpage/Values";
import VisionMissionSection from "@/components/aboutpage/VisionMissionSection";
import CallToAction from "@/components/aboutpage/CallToAction";
import Testimonials from "@/components/aboutpage/LongTestimonial";
import MemorialSection from "@/components/aboutpage/Memorial";

export const metadata: Metadata = {
  title: "About Salsabeel Al Janoob ImpExp | Global Trade Leaders Since 1975",
  description: "Discover our legacy in international trade, waste management, and import-export services. Oman-based company expanding operations to India with 45+ years of expertise.",
  keywords: [
    "global trade company",
    "waste management experts",
    "Oman import export",
    "India business expansion",
    "international trade history"
  ],
  openGraph: {
    title: "Our Legacy | Salsabeel Al Janoob ImpExp",
    description: "Pioneers in global commerce since 1975, now bringing expertise to India's market",
    images: [{
      url: "/about-og.jpg",
      width: 1200,
      height: 630,
      alt: "Salsabeel Al Janoob Team and Operations",
    }]
  },
  alternates: {
    canonical: "/about",
  }
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp",
            "description": "Global trade and logistics company established in 1975",
            "foundingDate": "1975",
            "founder": {
              "@type": "Person",
              "name": "Khalfan Abdullah Khalfan Al Mandhari"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Muscat",
              "addressRegion": "Oman",
              "addressCountry": "OM"
            },
            "location": ["OM", "IN"],
            "numberOfEmployees": "50+",
            "awards": [
              "Oman Excellence in Trade",
              "GCC Environmental Stewardship"
            ]
          })}
        </script>
        <HeroSection />     
        <CompanyAbout />
        <ValuesSection />
        <VisionMissionSection />
        <TeamSection />
        <Testimonials />
        <MemorialSection />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}