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
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "About Salsabeel Al Janoob Imp Exp | Trade Experts Since 1975",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "BE'AH, PDO-certified industrial experts with 49 years experience. Specializing in chemical waste management, civil works, and import/export across countries.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/about",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Our Legacy | Salsabeel Al Janoob ImpExp",
    description:
      "Pioneers in global commerce since 1975, delivering comprehensive global trade solutions, expert logistics, and reliable freight forwarding.",
    images: [
      {
        url: "/about-og.webp",
        width: 1200,
        height: 630,
        alt: "Salsabeel Al Janoob Team and Operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Legacy | Salsabeel Al Janoob ImpExp",
    description:
      "Pioneers in global commerce since 1975, delivering excellence in international trade, logistics, and global trade solutions.",
    images: ["/about-og.webp"],
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
    canonical: "/about",
  },
  category: "Corporate",
  manifest: "/site.webmanifest",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Salsabeel Al Janoob ImpExp",
          description: "Global trade and logistics company established in 1975",
          foundingDate: "1975",
          founder: {
            "@type": "Person",
            name: "Khalfan Abdullah Khalfan Al Mandhari",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Muscat",
            addressRegion: "Oman",
            addressCountry: "OM",
          },
          location: ["OM", "IN"],
          numberOfEmployees: "50+",
          awards: [
            "Oman Excellence in Trade",
            "GCC Environmental Stewardship",
          ],
        })}
      </script>
      <HeroSection />
      <div className="sr-only" aria-hidden="true">
        <h1>Salsabeel Al Janoob Imp Exp - Industrial Solutions Since 1975</h1>
        
        <h2>49-Year Operational Legacy</h2>
        <p>
          Founded in 1975 by Khalfan Abdullah Khalfan Al Mandhari, our services include:
        </p>
        <ul>
          <li>BE'AH-certified chemical waste management</li>
          <li>PDO-approved petroleum industry solutions</li>
          <li>Government-recognized import/export operations</li>
          <li>Sustainable civil construction & MEP works</li>
        </ul>

        <h2>Key Operational Milestones</h2>
        <h3>Oman Foundation</h3>
        <ul>
          <li>1975: Established in Muscat</li>
          <li>1500+ completed industrial projects</li>
          <li>95% client retention rate</li>
          <li>Specialized waste oil conversion systems</li>
        </ul>

        <h3>Global Presence</h3>
        <ul>
          <li>Expanding our network across multiple countries</li>
          <li>Local and international recycling solutions</li>
          <li>Robust service infrastructure</li>
        </ul>

        <h2>Certifications & Compliance</h2>
        <ul>
          <li>Omani Ministry of Commerce Approved</li>
          <li>BE'AH Environmental Certification</li>
          <li>PDO Certified</li>
          <li>ISO 9001:2015 Quality Standard</li>
        </ul>

        <h2>Core Service Divisions</h2>
        <ol>
          <li>International Trade Compliance</li>
          <li>Industrial Waste Management</li>
          <li>Civil Infrastructure Development</li>
        </ol>
      </div>
      <CompanyAbout />
      <ValuesSection />
      <VisionMissionSection />
      <TeamSection />
      <Testimonials />
      <MemorialSection />
      <CallToAction />
      <Footer />
    </>
  );
}
