import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoCivil"
import Benefits from "@/components/srvicepagesections/BenefitsCivil"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Civil Construction & Maintenance Contracts | Design-Build Services",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Complete civil contracting solutions from design to construction, demolition to solar installations. Professional project management with AMC services.",
  keywords: [
    "civil construction services",
    "design-build contracts",
    "building demolition experts",
    "solar panel installation",
    "annual maintenance contracts",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/civil-contracts",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Integrated Civil Contracting Services | Salsabeel Al Janoob ImpExp",
    description:
      "End-to-end civil construction solutions including landscaping, electrical works, and sustainable energy installations",
    images: [
      {
        url: "/civil-contracts-og.webp",
        width: 1200,
        height: 630,
        alt: "Civil Construction Site Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Integrated Civil Contracting Services | Salsabeel Al Janoob ImpExp",
    description:
      "End-to-end civil construction solutions including landscaping, electrical works, and sustainable energy installations",
    images: ["/civil-contracts-og.webp"],
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
    canonical: "/civil-contracts",
    languages: {
      en: "https://salsabeelaljanoobimpexp.com/civil-contracts",
      ar: "https://salsabeelaljanoobimpexp.com/ar/civil-contracts",
    },
  },
  category: "Construction",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("civil")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching civil data:", error)
      throw new Error("Failed to fetch civil data")
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
          backgroundImage: "/civil.jpg",
          serviceType: "Civil Contracts",
          title: "Professional & Reliable",
          underlineText: "Civil Construction Services",
          description:
            "Delivering high-quality civil construction and maintenance services with a focus on safety and sustainability.",
          buttonText: "Get in Touch",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Civil Construction Services",
          paragraphs: [
            "Salsabeel Al Janoob provides comprehensive civil construction services from design to completion, ensuring quality and timely delivery.",
            "We handle all aspects of construction including structural work, electrical, plumbing, and finishing with expert project management.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Civil construction process flow",
          shutters: 5,
        },
        projects: {
          title: "Our Civil Construction Projects",
          titleColor: "text-amber-800",
          items: [],
        },
        faqs: {
          title: "Civil Construction FAQs",
          highlightWord: "Solutions",
          description: "Find answers to common questions about our civil construction services.",
          items: [],
        },
        cta: {
          title: "Need Expert Construction Solutions?",
          description:
            "Reach out today for professional civil construction services that deliver quality, safety, and value.",
          buttonText: "Schedule Consultation",
          buttonLink: "/contact",
          buttonColor: "bg-amber-600",
          hoverButtonColor: "hover:bg-amber-700",
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
    ? projects.items.map((project: any) => ({
        ...project,
        content: (
          <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
            <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-10 whitespace-pre-line">
              {project.details?.description || "No description available"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(project.details?.images || []).map((image: any, index: number) => (
                <Image
                  key={index}
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || `Civil project ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/civil.jpg"}
        serviceType={hero.serviceType || "Civil Contracts"}
        title={hero.title || "Professional & Reliable"}
        underlineText={hero.underlineText || "Civil Construction Services"}
        description={
          hero.description ||
          "Delivering high-quality civil construction and maintenance services with a focus on safety and sustainability."
        }
        buttonText={hero.buttonText || "Get in Touch"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Civil Construction Services"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides comprehensive civil construction services from design to completion, ensuring quality and timely delivery.",
            "We handle all aspects of construction including structural work, electrical, plumbing, and finishing with expert project management.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Civil construction process flow"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Civil Construction Projects"}
        titleColor={projects.titleColor || "text-amber-800"}
      />

      <Frequent
        title={faqs.title || "Civil Construction FAQs"}
        highlightWord={faqs.highlightWord || "Solutions"}
        description={
          faqs.description || "Find answers to common questions about our civil construction services."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Need Expert Construction Solutions?"}
        description={
          cta.description ||
          "Reach out today for professional civil construction services that deliver quality, safety, and value."
        }
        buttonText={cta.buttonText || "Schedule Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-amber-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-amber-700"}
      />

      {/* Structured Data for Construction Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "CivilConstruction",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            employee: {
              "@type": "Person",
              name: "Project Manager",
            },
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Civil Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Design-Build Construction",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Commercial Demolition",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Solar Energy Installations",
                },
              },
            ],
          },
          areaServed: {
            "@type": "AdministrativeArea",
            name: "South India",
          },
        })}
      </script>
      <Footer />
    </>
  )
}
