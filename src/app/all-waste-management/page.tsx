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

export const metadata: Metadata = {
  title: "Comprehensive Waste Management Solutions | Oil Recycling & Waste Removal",
  description:
    "Professional waste management services including industrial recycling, MEP waste handling, oil recycling, and eco-friendly waste removal. ISO-certified sustainable solutions.",
  keywords: [
    "oil recycling services",
    "industrial waste management",
    "construction waste removal",
    "hazardous waste disposal",
    "electronic waste recycling",
  ],
  openGraph: {
    title: "Complete Waste Management Solutions | Salsabeel Al Janoob ImpExp",
    description:
      "Environmentally responsible waste management services including recycling, disposal, and waste-to-energy solutions",
    images: [
      {
        url: "/all-waste-management-og.webp",
        width: 1200,
        height: 630,
        alt: "Industrial Waste Management Operations",
      },
    ],
  },
  alternates: {
    canonical: "/all-waste-management",
  },
}

async function getServiceData() {
  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("allwaste")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching allwaste data:", error)
    return { pageInfo: {} }
  }

  return data.page_info
}

export default async function Page() {
  const { pageInfo } = await getServiceData()
  const { hero, explanation, faqs, cta, projects } = pageInfo

  const enhancedProjects =
    projects?.items?.map((project) => ({
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
    })) || []

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero?.backgroundImage}
        serviceType={hero?.serviceType}
        title={hero?.title}
        underlineText={hero?.underlineText}
        description={hero?.description}
        buttonText={hero?.buttonText}
        buttonLink={hero?.buttonLink}
      />

      <Explanation
        header={explanation?.header}
        paragraphs={explanation?.paragraphs || []}
        imageSrc={explanation?.imageSrc}
        imageAlt={explanation?.imageAlt || "Waste management process diagram"}
        shutters={explanation?.shutters}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel projects={enhancedProjects} title={projects?.title} titleColor={projects?.titleColor} />

      <Frequent
        title={faqs?.title}
        highlightWord={faqs?.highlightWord}
        description={faqs?.description}
        faqs={faqs?.items || []}
      />

      <CTASection
        title={cta?.title}
        description={cta?.description}
        buttonText={cta?.buttonText}
        buttonLink={cta?.buttonLink}
        buttonColor={cta?.buttonColor}
        hoverButtonColor={cta?.hoverButtonColor}
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

