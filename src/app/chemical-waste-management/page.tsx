import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/servicedetailpage/WhatWeDo"
import Benefits from "@/components/servicedetailpage/Benefits"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const metadata: Metadata = {
  title: "Chemical Waste Disposal & Management Services | Hazardous Waste Solutions",
  description:
    "Safe and compliant chemical waste management services including hazardous material disposal, laboratory waste handling, and industrial chemical recycling. EPA-compliant solutions.",
  keywords: [
    "hazardous waste disposal",
    "chemical waste management",
    "laboratory waste removal",
    "toxic waste handling",
    "industrial chemical recycling",
  ],
  openGraph: {
    title: "Professional Chemical Waste Management Services | Salsabeel Al Janoob ImpExp",
    description:
      "Certified chemical waste disposal and hazardous material management solutions with 24/7 emergency response",
    images: [
      {
        url: "/chemical-waste-og.webp",
        width: 1200,
        height: 630,
        alt: "Chemical Waste Management Process",
      },
    ],
  },
  alternates: {
    canonical: "/chemical-waste-management",
  },
}

async function getServiceData() {
  try {
    // Fetch the data
    const { data, error } = await supabase.from("chemicalwaste").select("page_info").single()

    if (error) {
      console.error("Error fetching chemical waste data:", error)
      throw new Error("Failed to fetch chemical waste data")
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
          backgroundImage: "/chemicalwaste.jpg",
          serviceType: "Chemical Waste Management",
          title: "Innovative & Sustainable",
          underlineText: "Chemical Waste Management",
          description: "Delivering cutting-edge, eco-friendly solutions for safe chemical waste handling and disposal.",
          buttonText: "Get in Touch",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Chemical Waste Management",
          paragraphs: [
            "Salsabeel Al Janoob provides responsible chemical waste management, transforming hazardous materials into environmental renewal.",
            "We manage the complete chemical waste lifecycle, from collection to disposal, using advanced technology and expert professionals.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Chemical Processing Flow Diagram",
          shutters: 5,
        },
        projects: {
          title: "Our Chemical Waste Projects",
          titleColor: "text-emerald-800",
          items: [],
        },
        faqs: {
          title: "Chemical Waste FAQs",
          highlightWord: "Solutions",
          description: "Find answers to common questions about our specialized chemical waste processes.",
          items: [],
        },
        cta: {
          title: "Need Expert Waste Solutions?",
          description:
            "Reach out today for innovative and compliant chemical waste management that protects your business and the environment.",
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
                  alt={image.alt || `Chemical waste project ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/chemicalwaste.jpg"}
        serviceType={hero.serviceType || "Chemical Waste Management"}
        title={hero.title || "Innovative & Sustainable"}
        underlineText={hero.underlineText || "Chemical Waste Management"}
        description={
          hero.description ||
          "Delivering cutting-edge, eco-friendly solutions for safe chemical waste handling and disposal."
        }
        buttonText={hero.buttonText || "Get in Touch"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Chemical Waste Management"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides responsible chemical waste management, transforming hazardous materials into environmental renewal.",
            "We manage the complete chemical waste lifecycle, from collection to disposal, using advanced technology and expert professionals.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Chemical waste management process flow"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Chemical Waste Projects"}
        titleColor={projects.titleColor || "text-emerald-800"}
      />

      <Frequent
        title={faqs.title || "Chemical Waste FAQs"}
        highlightWord={faqs.highlightWord || "Solutions"}
        description={
          faqs.description || "Find answers to common questions about our specialized chemical waste processes."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Need Expert Waste Solutions?"}
        description={
          cta.description ||
          "Reach out today for innovative and compliant chemical waste management that protects your business and the environment."
        }
        buttonText={cta.buttonText || "Schedule Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-emerald-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-emerald-700"}
      />

      {/* Structured Data for Chemical Waste Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "ChemicalWasteManagement",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
          },
          areaServed: {
            "@type": "Country",
            name: "India",
          },
          serviceOutput: {
            "@type": "CreativeWork",
            name: "Waste Manifest",
          },
          termsOfService: "https://salsabeelaljanoobimpexp.com/terms",
          category: "EnvironmentalService",
        })}
      </script>
      <Footer />
    </>
  )
}

