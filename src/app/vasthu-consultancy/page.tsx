import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoVasthu"
import Benefits from "@/components/srvicepagesections/BenefitsVasthu"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const metadata: Metadata = {
  title: "Vastu Shastra Consultation Services | Home & Office Energy Balancing",
  description:
    "Professional Vastu consultancy for residential and commercial spaces. Harmony optimization, directional alignment, and positive energy flow solutions.",
  keywords: [
    "vastu consultation",
    "home energy balancing",
    "commercial vastu shastra",
    "architectural alignment",
    "positive space design",
  ],
  openGraph: {
    title: "Vastu Shastra Experts | Salsabeel Al Janoob ImpExp",
    description: "Traditional Vastu consultations with modern implementation techniques for holistic living spaces",
    images: [
      {
        url: "/vastu-consultancy-og.jpg",
        width: 1200,
        height: 630,
        alt: "Vastu Consultation Process",
      },
    ],
  },
  alternates: {
    canonical: "/vasthu-consultancy",
  },
}

async function getServiceData() {
  try {
    // Fetch the data
    const { data, error } = await supabase.from("vasthu").select("page_info").single()

    if (error) {
      console.error("Error fetching vasthu data:", error)
      throw new Error("Failed to fetch vasthu data")
    }

    // Parse the JSON string if needed
    let pageInfo
    if (typeof data.page_info === "string") {
      try {
        pageInfo = JSON.parse(data.page_info)
      } catch (parseError) {
        console.error("Error parsing page_info JSON:", parseError)
        throw new Error("Failed to parse page_info data")
      }
    } else {
      pageInfo = data.page_info
    }

    return pageInfo
  } catch (error) {
    console.error("Error in getServiceData:", error)
    // Return default data structure in case of error
    return {
      pageInfo: {
        hero: {
          backgroundImage: "/vasthu-consultancy.webp",
          serviceType: "Vasthu Consultancy",
          title: "Harmonize Your Living Spaces",
          underlineText: "Vasthu Consultancy",
          description:
            "Guiding you to design harmonious spaces aligned with ancient principles for well-being and prosperity.",
          buttonText: "Book a Consultation",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Vasthu Consultancy",
          paragraphs: [
            "Our Vasthu Consultancy services blend ancient wisdom with modern design to create balanced and harmonious living and workspaces.",
            "Our experienced consultants conduct comprehensive site evaluations, detailed reports, and practical recommendations.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Vasthu consultation session",
          shutters: 5,
        },
        projects: {
          title: "Our Vasthu Initiatives",
          titleColor: "text-purple-800",
          items: [],
        },
        faqs: {
          title: "Vasthu Consultancy FAQs",
          highlightWord: "Vasthu",
          description: "Find answers to common questions about our vasthu consultancy services.",
          items: [],
        },
        cta: {
          title: "Ready to Harmonize Your Space?",
          description:
            "Transform your surroundings with our expert vasthu consultancy services and experience balanced, positive energy.",
          buttonText: "Book a Consultation",
          buttonLink: "/contact",
          buttonColor: "bg-purple-600",
          hoverButtonColor: "hover:bg-purple-700",
        },
      },
    }
  }
}

export default async function Page() {
  const data = await getServiceData()

  // Check if we have the expected structure and provide defaults if not
  const pageInfo = data?.pageInfo || {}

  // Destructure with default empty objects to prevent undefined errors
  const hero = pageInfo.hero || {}
  const explanation = pageInfo.explanation || {}
  const faqs = pageInfo.faqs || { items: [] }
  const cta = pageInfo.cta || {}
  const projects = pageInfo.projects || { items: [] }

  // Ensure projects.items exists before mapping
  const enhancedProjects = projects.items
    ? projects.items.map((project) => ({
        ...project,
        content: (
          <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
            <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-10 whitespace-pre-line">
              {project.details?.description || "No description available"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(project.details?.images || []).map((image, index) => (
                <Image
                  key={index}
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || `Vasthu project ${index + 1}`}
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
    : []

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero.backgroundImage || "/vasthu-consultancy.webp"}
        serviceType={hero.serviceType || "Vasthu Consultancy"}
        title={hero.title || "Harmonize Your Living Spaces"}
        underlineText={hero.underlineText || "Vasthu Consultancy"}
        description={
          hero.description ||
          "Guiding you to design harmonious spaces aligned with ancient principles for well-being and prosperity."
        }
        buttonText={hero.buttonText || "Book a Consultation"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Vasthu Consultancy"}
        paragraphs={
          explanation.paragraphs || [
            "Our Vasthu Consultancy services blend ancient wisdom with modern design to create balanced and harmonious living and workspaces.",
            "Our experienced consultants conduct comprehensive site evaluations, detailed reports, and practical recommendations.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Vasthu principles diagram"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Vasthu Initiatives"}
        titleColor={projects.titleColor || "text-purple-800"}
      />

      <Frequent
        title={faqs.title || "Vasthu Consultancy FAQs"}
        highlightWord={faqs.highlightWord || "Vasthu"}
        description={faqs.description || "Find answers to common questions about our vasthu consultancy services."}
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Harmonize Your Space?"}
        description={
          cta.description ||
          "Transform your surroundings with our expert vasthu consultancy services and experience balanced, positive energy."
        }
        buttonText={cta.buttonText || "Book a Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-purple-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-purple-700"}
      />

      {/* Structured Data for Vasthu Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ProfessionalService"],
          name: "Salsabeel Al Janoob ImpExp Vasthu Consultancy",
          description: "Traditional Vasthu Shastra consultation services",
          serviceType: "VasthuConsultancy",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
          },
          offers: {
            "@type": "Offer",
            category: "ArchitecturalConsulting",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
            },
          },
          areaServed: {
            "@type": "Country",
            name: "India",
          },
          knowsAbout: ["Vasthu Shastra", "Space Energy Balancing", "Directional Alignment", "Traditional Architecture"],
        })}
      </script>
      <Footer />
    </>
  )
}

