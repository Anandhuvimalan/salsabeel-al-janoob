import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoMarriage"
import Benefits from "@/components/srvicepagesections/BenefitsMarriage"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const metadata: Metadata = {
  title: "Marriage Counseling & Family Therapy Services | Relationship Experts",
  description: "Professional counseling for couples and families. Improve communication, resolve conflicts, and strengthen relationships with certified therapists.",
  keywords: [
    "marriage counseling",
    "family therapy",
    "relationship counseling",
    "couples therapy",
    "family conflict resolution"
  ],
  openGraph: {
    title: "Family & Marriage Counseling Services | Salsabeel Al Janoob ImpExp",
    description: "Confidential counseling sessions for couples and families with experienced relationship experts",
    images: [{
      url: "/counseling-og.jpg",
      width: 1200,
      height: 630,
      alt: "Family Counseling Session",
    }]
  },
  alternates: {
    canonical: "/marriage-&-family-counseling",
  }
}

async function getServiceData() {
  try {
    // Fetch the data
    const { data, error } = await supabase.from("marriage").select("page_info").single()

    if (error) {
      console.error("Error fetching marriage data:", error)
      throw new Error("Failed to fetch marriage data")
    }

    return data.page_info
  } catch (error) {
    console.error("Error in getServiceData:", error)
    // Return default data structure in case of error
    return {
      pageInfo: {
        hero: {
          backgroundImage: "/uploads/marriage/marriage-counseling.webp",
          serviceType: "Marriage & Family Counseling",
          title: "Strengthening Relationships",
          underlineText: "Marriage & Family Counseling",
          description: "Providing expert guidance and support to nurture and heal relationships within couples and families.",
          buttonText: "Get Started",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Marriage & Family Counseling",
          paragraphs: [
            "Our Marriage & Family Counseling services offer compassionate guidance for couples and families navigating life's challenges.",
            "Our expert team tailors each session to address individual needs, providing strategies for conflict resolution, stress management, and relationship enrichment."
          ],
          imageSrc: "/uploads/marriage/counseling.webp",
          imageAlt: "Couple in counseling session",
          shutters: 5,
        },
        projects: {
          title: "Our Counseling Initiatives",
          titleColor: "text-teal-800",
          items: [],
        },
        faqs: {
          title: "Marriage & Family Counseling FAQs",
          highlightWord: "Counseling",
          description: "Find answers to common questions about our counseling services.",
          items: [],
        },
        cta: {
          title: "Ready to Build Your Vision?",
          description: "Contact us today to discuss your project and discover how our comprehensive civil contract services can bring your vision to life.",
          buttonText: "Schedule Consultation",
          buttonLink: "/contact",
          buttonColor: "bg-emerald-600",
          hoverButtonColor: "hover:bg-emerald-700",
        },
      },
    }
  }
}

export default async function Page() {
  const data = await getServiceData()
  const { pageInfo } = data
  const { hero, explanation, faqs, cta, projects } = pageInfo

  const enhancedProjects = projects.items.map((project) => ({
    ...project,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-10 whitespace-pre-line">
          {project.details.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {project.details.images.map((image, index) => (
            <Image
              key={index}
              src={image.src || "/placeholder.svg"}
              alt={image.alt || `Counseling session ${index + 1}`}
              width={300}
              height={200}
              className="w-full h-auto object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ))}
        </div>
      </div>
    ),
  }))

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero.backgroundImage}
        serviceType={hero.serviceType}
        title={hero.title}
        underlineText={hero.underlineText}
        description={hero.description}
        buttonText={hero.buttonText}
        buttonLink={hero.buttonLink}
      />

      <Explanation
        header={explanation.header}
        paragraphs={explanation.paragraphs}
        imageSrc={explanation.imageSrc}
        imageAlt={explanation.imageAlt || "Counseling process overview"}
        shutters={explanation.shutters}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title}
        titleColor={projects.titleColor}
      />

      <Frequent
        title={faqs.title}
        highlightWord={faqs.highlightWord}
        description={faqs.description}
        faqs={faqs.items}
      />

      <CTASection
        title={cta.title}
        description={cta.description}
        buttonText={cta.buttonText}
        buttonLink={cta.buttonLink}
        buttonColor={cta.buttonColor}
        hoverButtonColor={cta.hoverButtonColor}
      />

      {/* Structured Data for Counseling Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["PsychologicalTreatment", "CounselingService"],
          "name": "Salsabeel Al Janoob ImpExp Counseling Services",
          "description": "Professional marriage and family counseling services",
          "provider": {
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          },
          "serviceType": "MarriageCounseling",
          "offers": {
            "@type": "Offer",
            "category": "Counseling",
            "availability": "https://schema.org/OnlineOnly",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "INR"
            }
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          }
        })}
      </script>
      <Footer />
    </>
  )
}