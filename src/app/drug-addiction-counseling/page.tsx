import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoDrug"
import Benefits from "@/components/srvicepagesections/BenefitsDrug"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Professional Drug Addiction Counseling & Recovery Programs",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Confidential substance abuse counseling and comprehensive addiction treatment services. Certified therapists offering personalized recovery plans and family support.",
  keywords: [
    "drug addiction counseling",
    "substance abuse treatment",
    "addiction recovery programs",
    "outpatient rehab services",
    "relapse prevention therapy",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/drug-addiction-counseling",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Drug Addiction Recovery Services | Salsabeel Al Janoob ImpExp",
    description:
      "Professional counseling and evidence-based treatment programs for substance abuse recovery",
    images: [
      {
        url: "/addiction-counseling-og.webp",
        width: 1200,
        height: 630,
        alt: "Addiction Counseling Session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drug Addiction Recovery Services | Salsabeel Al Janoob ImpExp",
    description:
      "Professional counseling and evidence-based treatment programs for substance abuse recovery",
    images: ["/addiction-counseling-og.webp"],
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
    canonical: "/drug-addiction-counseling",
  },
  category: "Counseling",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("drug")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching drug data:", error)
      throw new Error("Failed to fetch drug data")
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
          backgroundImage: "/drug-addiction.jpg",
          serviceType: "Drug Addiction Counseling",
          title: "Compassionate & Confidential",
          underlineText: "Addiction Recovery Services",
          description:
            "Professional counseling and evidence-based treatment programs for substance abuse recovery.",
          buttonText: "Get Help Today",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Drug Addiction Counseling",
          paragraphs: [
            "Salsabeel Al Janoob provides confidential and compassionate addiction counseling services to help individuals overcome substance abuse.",
            "Our certified therapists develop personalized recovery plans and provide ongoing support for lasting recovery.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Addiction recovery process diagram",
          shutters: 5,
        },
        projects: {
          title: "Our Recovery Programs",
          titleColor: "text-purple-800",
          items: [],
        },
        faqs: {
          title: "Addiction Recovery FAQs",
          highlightWord: "Support",
          description: "Find answers to common questions about our addiction counseling services.",
          items: [],
        },
        cta: {
          title: "Ready to Start Your Recovery Journey?",
          description:
            "Reach out today for confidential support and professional guidance on your path to recovery.",
          buttonText: "Contact Us Now",
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
                  alt={image.alt || `Recovery program ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/drug-addiction.jpg"}
        serviceType={hero.serviceType || "Drug Addiction Counseling"}
        title={hero.title || "Compassionate & Confidential"}
        underlineText={hero.underlineText || "Addiction Recovery Services"}
        description={
          hero.description ||
          "Professional counseling and evidence-based treatment programs for substance abuse recovery."
        }
        buttonText={hero.buttonText || "Get Help Today"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Drug Addiction Counseling"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides confidential and compassionate addiction counseling services to help individuals overcome substance abuse.",
            "Our certified therapists develop personalized recovery plans and provide ongoing support for lasting recovery.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Addiction recovery process diagram"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Recovery Programs"}
        titleColor={projects.titleColor || "text-purple-800"}
      />

      <Frequent
        title={faqs.title || "Addiction Recovery FAQs"}
        highlightWord={faqs.highlightWord || "Support"}
        description={
          faqs.description ||
          "Find answers to common questions about our addiction counseling services."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Start Your Recovery Journey?"}
        description={
          cta.description ||
          "Reach out today for confidential support and professional guidance on your path to recovery."
        }
        buttonText={cta.buttonText || "Contact Us Now"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-purple-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-purple-700"}
      />

      {/* Structured Data for Counseling Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MedicalOrganization", "CounselingService"],
          name: "Salsabeel Al Janoob ImpExp Addiction Services",
          medicalSpecialty: "AddictionMedicine",
          description: "Professional drug addiction counseling and recovery programs",
          serviceType: "Substance Abuse Treatment",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-93494-74746",
            contactType: "Crisis counseling",
          },
          areaServed: {
            "@type": "AdministrativeArea",
            name: "India",
          },
          offers: {
            "@type": "Offer",
            category: "Counseling",
            availability: "https://schema.org/OnlineOnly",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
            },
          },
        })}
      </script>
      <Footer />
    </>
  )
}
