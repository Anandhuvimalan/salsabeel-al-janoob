import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoAllWaste"
import Benefits from "@/components/srvicepagesections/BenefitsAllWaste"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Comprehensive Waste Management Solutions | Oil Recycling & Waste Removal",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Professional waste management services including industrial recycling, MEP waste handling, oil recycling, and eco-friendly waste removal. ISO-certified sustainable solutions.",
  keywords: [
    "oil recycling services",
    "industrial waste management",
    "construction waste removal",
    "hazardous waste disposal",
    "electronic waste recycling",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/all-waste-management",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Comprehensive Waste Management Solutions | Oil Recycling & Waste Removal",
    description:
      "Environmentally responsible waste management services including recycling, disposal, and waste-to-energy solutions.",
    images: [
      {
        url: "/all-waste-management-og.webp",
        width: 1200,
        height: 630,
        alt: "Industrial Waste Management Operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprehensive Waste Management Solutions | Salsabeel Al Janoob ImpExp",
    description:
      "Professional waste management services with a focus on sustainable recycling and eco-friendly waste removal.",
    images: ["/all-waste-management-og.webp"],
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
    canonical: "/all-waste-management",
    languages: {
      en: "https://salsabeelaljanoobimpexp.com/all-waste-management",
      ar: "https://salsabeelaljanoobimpexp.com/ar/all-waste-management",
    },
  },
  category: "Waste Management",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("allwaste")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching allwaste data:", error)
      throw new Error("Failed to fetch allwaste data")
    }

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
    return {
      pageInfo: {
        hero: {
          backgroundImage: "/allwaste.jpg",
          serviceType: "All Waste Management",
          title: "Comprehensive & Sustainable",
          underlineText: "Waste Management Solutions",
          description:
            "Delivering integrated waste management services for all types of waste with a focus on sustainability and compliance.",
          buttonText: "Get in Touch",
          buttonLink: "/contact",
        },
        explanation: {
          header: "All Waste Management",
          paragraphs: [
            "Salsabeel Al Janoob provides complete waste management solutions for all types of waste, from collection to disposal.",
            "We use advanced technology and expert professionals to ensure regulatory compliance and environmental protection.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Waste Management Process Diagram",
          shutters: 5,
        },
        projects: {
          title: "Our Waste Management Projects",
          titleColor: "text-blue-800",
          items: [],
        },
        faqs: {
          title: "Waste Management FAQs",
          highlightWord: "Solutions",
          description: "Find answers to common questions about our waste management services.",
          items: [],
        },
        cta: {
          title: "Need Expert Waste Solutions?",
          description:
            "Reach out today for innovative and compliant waste management that protects your business and the environment.",
          buttonText: "Schedule Consultation",
          buttonLink: "/contact",
          buttonColor: "bg-blue-600",
          hoverButtonColor: "hover:bg-blue-700",
        },
      },
    }
  }
}

export default async function Page() {
  const data = await getServiceData()
  const pageInfo = data?.pageInfo || {}
  const hero = pageInfo.hero || {}
  const explanation = pageInfo.explanation || {}
  const faqs = pageInfo.faqs || { items: [] }
  const cta = pageInfo.cta || {}
  const projects = pageInfo.projects || { items: [] }

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
                  alt={image.alt || `Waste management project ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
        backgroundImage={hero.backgroundImage || "/allwaste.jpg"}
        serviceType={hero.serviceType || "All Waste Management"}
        title={hero.title || "Comprehensive & Sustainable"}
        underlineText={hero.underlineText || "Waste Management Solutions"}
        description={
          hero.description ||
          "Delivering integrated waste management services for all types of waste with a focus on sustainability and compliance."
        }
        buttonText={hero.buttonText || "Get in Touch"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "All Waste Management"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides complete waste management solutions for all types of waste, from collection to disposal.",
            "We use advanced technology and expert professionals to ensure regulatory compliance and environmental protection.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Waste management process diagram"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Waste Management Projects"}
        titleColor={projects.titleColor || "text-blue-800"}
      />

      <Frequent
        title={faqs.title || "Waste Management FAQs"}
        highlightWord={faqs.highlightWord || "Solutions"}
        description={faqs.description || "Find answers to common questions about our waste management services."}
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Need Expert Waste Solutions?"}
        description={
          cta.description ||
          "Reach out today for innovative and compliant waste management that protects your business and the environment."
        }
        buttonText={cta.buttonText || "Schedule Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-blue-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-blue-700"}
      />

      {/* Structured Data for Waste Management Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "WasteManagement",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            url: "https://salsabeelaljanoobimpexp.com",
          },
          areaServed: ["India", "Middle East", "Global"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Waste Management Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Oil Recycling",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Industrial Waste Removal",
                },
              },
            ],
          },
        })}
      </script>
      <Footer />
    </>
  )
}
