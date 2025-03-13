import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoRetail"
import Benefits from "@/components/srvicepagesections/BenefitsRetail"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const metadata: Metadata = {
  title: "Retail Business Consulting & Store Management Services | Full-Service Solutions",
  description:
    "Comprehensive retail consultancy for food service businesses, convenience stores, and supermarkets. From setup to operations management and optimization.",
  keywords: [
    "retail business consulting",
    "store setup services",
    "24/7 convenience store management",
    "food service consulting",
    "retail operations optimization",
  ],
  openGraph: {
    title: "Retail Consultancy Services | Salsabeel Al Janoob ImpExp",
    description:
      "End-to-end retail solutions for food businesses and supermarkets including design, staffing, and inventory management",
    images: [
      {
        url: "/retail-consultancy-og.webp",
        width: 1200,
        height: 630,
        alt: "Retail Store Consulting Services",
      },
    ],
  },
  alternates: {
    canonical: "/retail-consultancy",
  },
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("retail")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching retail data:", error)
      throw new Error("Failed to fetch retail data")
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
          backgroundImage: "/retail-consultancy.jpg",
          serviceType: "Retail Consultancy",
          title: "Strategic & Comprehensive",
          underlineText: "Retail Business Solutions",
          description:
            "End-to-end retail consulting services for food businesses, convenience stores, and supermarkets.",
          buttonText: "Get Expert Advice",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Retail Business Consulting",
          paragraphs: [
            "Salsabeel Al Janoob provides comprehensive retail consultancy services to help businesses establish, manage, and optimize their retail operations.",
            "Our expert team offers tailored solutions for store setup, inventory management, staff training, and operational efficiency.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Retail consultancy process flow",
          shutters: 5,
        },
        projects: {
          title: "Our Retail Projects",
          titleColor: "text-orange-800",
          items: [],
        },
        faqs: {
          title: "Retail Consultancy FAQs",
          highlightWord: "Solutions",
          description: "Find answers to common questions about our retail business consulting services.",
          items: [],
        },
        cta: {
          title: "Ready to Optimize Your Retail Business?",
          description:
            "Contact us today to discover how our retail consultancy services can help you establish or improve your retail operations.",
          buttonText: "Schedule Consultation",
          buttonLink: "/contact",
          buttonColor: "bg-orange-600",
          hoverButtonColor: "hover:bg-orange-700",
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
                  alt={image.alt || `Retail project ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/retail-consultancy.jpg"}
        serviceType={hero.serviceType || "Retail Consultancy"}
        title={hero.title || "Strategic & Comprehensive"}
        underlineText={hero.underlineText || "Retail Business Solutions"}
        description={
          hero.description ||
          "End-to-end retail consulting services for food businesses, convenience stores, and supermarkets."
        }
        buttonText={hero.buttonText || "Get Expert Advice"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Retail Business Consulting"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides comprehensive retail consultancy services to help businesses establish, manage, and optimize their retail operations.",
            "Our expert team offers tailored solutions for store setup, inventory management, staff training, and operational efficiency.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Retail consultancy process flow"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Retail Projects"}
        titleColor={projects.titleColor || "text-orange-800"}
      />

      <Frequent
        title={faqs.title || "Retail Consultancy FAQs"}
        highlightWord={faqs.highlightWord || "Solutions"}
        description={
          faqs.description || "Find answers to common questions about our retail business consulting services."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Optimize Your Retail Business?"}
        description={
          cta.description ||
          "Contact us today to discover how our retail consultancy services can help you establish or improve your retail operations."
        }
        buttonText={cta.buttonText || "Schedule Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-orange-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-orange-700"}
      />

      {/* Structured Data for Retail Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ConsultingService"],
          name: "Salsabeel Al Janoob ImpExp Retail Consultancy",
          description: "Professional retail business consulting and management services",
          serviceType: "RetailConsulting",
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
            category: "BusinessConsulting",
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
          knowsAbout: ["Retail Management", "Food Service Operations", "Store Design", "Inventory Management"],
        })}
      </script>
      <Footer />
    </>
  )
}

