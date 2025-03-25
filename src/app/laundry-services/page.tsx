import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoLaundry"
import Benefits from "@/components/srvicepagesections/BenefitsLaundry"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default:
      "Professional Laundry & Dry Cleaning Services | Eco-Friendly Fabric Care",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Premium laundry solutions with pickup/delivery. Specialized in delicate fabric handling, stain removal, and commercial laundry services. Hygienic and eco-friendly processes.",
  keywords: [
    "professional laundry services",
    "dry cleaning near me",
    "curtain cleaning",
    "commercial laundry",
    "eco-friendly fabric care",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/laundry-services",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Expert Laundry Services | Salsabeel Al Janoob ImpExp",
    description:
      "24/7 laundry solutions with free pickup and delivery. Special care for delicate fabrics and bulk commercial services",
    images: [
      {
        url: "/laundry-services-og.webp",
        width: 1200,
        height: 630,
        alt: "Professional Laundry Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert Laundry Services | Salsabeel Al Janoob ImpExp",
    description:
      "24/7 laundry solutions with free pickup and delivery. Special care for delicate fabrics and bulk commercial services",
    images: ["/laundry-services-og.webp"],
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
    canonical: "/laundry-services",
  },
  category: "HouseholdServices",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("laundry")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching laundry data:", error)
      throw new Error("Failed to fetch laundry data")
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
          backgroundImage: "/laundry-services.jpg",
          serviceType: "Laundry Services",
          title: "Professional & Eco-Friendly",
          underlineText: "Laundry & Dry Cleaning",
          description:
            "Premium laundry solutions with pickup and delivery. Specialized in delicate fabric care and commercial services.",
          buttonText: "Schedule Pickup",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Laundry & Dry Cleaning Services",
          paragraphs: [
            "Salsabeel Al Janoob provides professional laundry and dry cleaning services with a focus on quality, convenience, and environmental responsibility.",
            "Our advanced cleaning processes ensure your garments receive the best care while our efficient logistics ensure timely pickup and delivery.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Laundry service process flowchart",
          shutters: 5,
        },
        projects: {
          title: "Our Laundry Solutions",
          titleColor: "text-sky-800",
          items: [],
        },
        faqs: {
          title: "Laundry Services FAQs",
          highlightWord: "Clean",
          description:
            "Find answers to common questions about our laundry and dry cleaning services.",
          items: [],
        },
        cta: {
          title: "Ready for Fresh, Clean Clothes?",
          description:
            "Schedule a pickup today and experience our premium laundry services with free delivery.",
          buttonText: "Book Now",
          buttonLink: "/contact",
          buttonColor: "bg-sky-600",
          hoverButtonColor: "hover:bg-sky-700",
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
                  alt={image.alt || `Laundry service example ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/laundry-services.jpg"}
        serviceType={hero.serviceType || "Laundry Services"}
        title={hero.title || "Professional & Eco-Friendly"}
        underlineText={hero.underlineText || "Laundry & Dry Cleaning"}
        description={
          hero.description ||
          "Premium laundry solutions with pickup and delivery. Specialized in delicate fabric care and commercial services."
        }
        buttonText={hero.buttonText || "Schedule Pickup"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Laundry & Dry Cleaning Services"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides professional laundry and dry cleaning services with a focus on quality, convenience, and environmental responsibility.",
            "Our advanced cleaning processes ensure your garments receive the best care while our efficient logistics ensure timely pickup and delivery.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Laundry service process flowchart"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Laundry Solutions"}
        titleColor={projects.titleColor || "text-sky-800"}
      />

      <Frequent
        title={faqs.title || "Laundry Services FAQs"}
        highlightWord={faqs.highlightWord || "Clean"}
        description={
          faqs.description ||
          "Find answers to common questions about our laundry and dry cleaning services."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready for Fresh, Clean Clothes?"}
        description={
          cta.description ||
          "Schedule a pickup today and experience our premium laundry services with free delivery."
        }
        buttonText={cta.buttonText || "Book Now"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-sky-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-sky-700"}
      />

      {/* Structured Data for Laundry Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Salsabeel Al Janoob ImpExp Laundry Services",
          image: "/laundry-services-og.jpg",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Coimbatore",
            addressRegion: "Tamil Nadu",
            postalCode: "641105",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "11.0168",
            longitude: "76.9558",
          },
          url: "https://salsabeelaljanoobimpexp.com/services/laundry-services",
          telephone: "+91-93494-74746",
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "22:00",
          },
        })}
      </script>
      <Footer />
    </>
  )
}
