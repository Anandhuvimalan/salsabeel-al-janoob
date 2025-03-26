import type React from "react"
import HeroSection from "@/components/HeroSection"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import Features from "@/components/Features"
import AboutSection from "@/components/AboutCompany"
import ImportExportProcess from "@/components/Process"
import { GlareCardDemo } from "@/components/GlareCard"
import CoreServices from "@/components/Services"
import Testimonial from "@/components/Testimonials"
import Frequent from "@/components/Frequent"
import type { Metadata } from "next"

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
    "export to oman",
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
    description: "Streamlining cross-border commerce with expert logistics and comprehensive trade solutions.",
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
    canonical: "https://salsabeelaljanoobimpexp.com",
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
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
      {/* Screen Reader Only Content - Enhanced for SEO with links */}
      <div className="sr-only">
        <h1>Salsabeel Al Janoob Imp Exp | Import, Export & Waste Solutions</h1>

        <p>
          Welcome to <strong>Salsabeel Al Janoob Import Export</strong>, your trusted partner for comprehensive
          industrial waste management and global trade solutions. With operations spanning across Oman and India, we
          deliver excellence in cross-border commerce, environmental services, and specialized industrial solutions.
        </p>

        <p>
          As a <strong>Be'ah-certified</strong> and <strong>PDO-approved</strong> company, we maintain the highest
          standards in waste management while facilitating seamless international trade. Our expertise extends across
          chemical waste handling, petroleum services, and innovative waste oil conversion technology, making us a
          leader in sustainable industrial practices.
        </p>

        <p>
          Our import and export services connect businesses across borders, with particular strength in the Oman-India
          trade corridor. Based in Muscat with our Indian operations hub in Coimbatore, we provide end-to-end logistics,
          customs clearance, and trade consultancy that simplifies complex international transactions.
        </p>

        <h2>Excellence in Industrial Waste Management & Global Trade</h2>
        <ul>
          <li>BE'AH-approved chemical waste management</li>
          <li>PDO-certified petroleum services</li>
          <li>Government-recognized domestic trade operations</li>
          <li>Omani construction & MEP expertise</li>
        </ul>

        <h2>Our Comprehensive Services</h2>
        <p>
          Salsabeel Al Janoob offers a diverse range of services tailored to meet the needs of industries across
          sectors:
        </p>
        <ul>
          <li>Industrial waste management and disposal solutions</li>
          <li>Chemical waste handling with BE'AH-approved methodologies</li>
          <li>Cross-border trade facilitation between Oman, India, and beyond</li>
          <li>Customs clearance and documentation services</li>
          <li>Logistics and supply chain management</li>
          <li>MEP services and construction expertise in Oman</li>
          <li>Waste oil recycling and conversion technology</li>
          <li>Industrial laundry systems implementation</li>
        </ul>

        <h2>Indian Operations Hub: Coimbatore</h2>
        <ul>
          <li>Domestic trade consultancy services</li>
          <li>Local waste management solutions</li>
          <li>Regional civil contract expertise</li>
          <li>Specialists in the South Indian market</li>
        </ul>

        <h2>Why Choose Salsabeel Al Janoob?</h2>
        <p>
          With over 1500 successful domestic shipments and a 95% on-time delivery record, our track record speaks for
          itself. Our government-approved contractor status in Oman and ISO 9001 certification demonstrate our
          commitment to quality and compliance in every aspect of our operations.
        </p>

        <p>
          Whether you're looking for reliable waste management solutions or seeking to expand your business across
          borders, Salsabeel Al Janoob Import Export provides the expertise, infrastructure, and dedication to ensure
          your success.
        </p>

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

        <h2>Explore Our Website</h2>
        <p>Visit our various pages to learn more about our services and expertise:</p>
        <ul>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com">Home - Salsabeel Al Janoob Import Export</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/about">About Us - Our History and Mission</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/contact">Contact Us - Get in Touch</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/careers">Careers - Join Our Team</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/terms-of-service">Terms of Service</a>
          </li>
        </ul>

        <h2>Our Specialized Services</h2>
        <ul>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/all-waste-management">All Waste Management Solutions</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/chemical-waste-management">Chemical Waste Management</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/civil-contracts">Civil Contracts</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/laundry-services">Industrial Laundry Services</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/retail-consultancy">Retail Consultancy</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/vasthu-consultancy">Vasthu Consultancy</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/drug-addiction-counseling">Drug Addiction Counseling</a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/educational-&-career-guidance">
              Educational & Career Guidance
            </a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/foreign-language-learning-centers">
              Foreign Language Learning Centers
            </a>
          </li>
          <li>
            <a href="https://salsabeelaljanoobimpexp.com/marriage-&-family-counselling">
              Marriage & Family Counselling
            </a>
          </li>
        </ul>

        <h2>Industry Partnerships & Certifications</h2>
        <ul>
          <li>
            <a href="https://www.beah.om" target="_blank" rel="noopener noreferrer">
              Be'ah (Oman Environmental Services Holding Company)
            </a>
          </li>
          <li>
            <a href="https://www.pdo.co.om" target="_blank" rel="noopener noreferrer">
              Petroleum Development Oman (PDO)
            </a>
          </li>
        </ul>

        <h2>Share Our Services on Social Media</h2>
        <ul>
          <li>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://salsabeelaljanoobimpexp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on Facebook
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/intent/tweet?url=https://salsabeelaljanoobimpexp.com&text=Expert import, export and waste management solutions by Salsabeel Al Janoob"
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on Twitter
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/shareArticle?mini=true&url=https://salsabeelaljanoobimpexp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on LinkedIn
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              Follow on Instagram
            </a>
          </li>
        </ul>

        <p>
          Salsabeel Al Janoob Import Export is committed to providing sustainable waste management solutions and
          seamless cross-border trade services. Our team of experts ensures compliance with international standards
          while delivering exceptional value to our clients across Oman, India, and beyond.
        </p>
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
  )
}

export default Page

