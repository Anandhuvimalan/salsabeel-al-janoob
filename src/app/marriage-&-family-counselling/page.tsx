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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Marriage Counseling & Family Therapy Services | Relationship Experts",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Professional counseling for couples and families. Improve communication, resolve conflicts, and strengthen relationships with certified therapists.",
  keywords: [
    "marriage counseling",
    "family therapy",
    "relationship counseling",
    "couples therapy",
    "family conflict resolution",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/marriage-&-family-counseling",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Family & Marriage Counseling Services | Salsabeel Al Janoob ImpExp",
    description:
      "Confidential counseling sessions for couples and families with experienced relationship experts",
    images: [
      {
        url: "/counseling-og.webp",
        width: 1200,
        height: 630,
        alt: "Family Counseling Session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Family & Marriage Counseling Services | Salsabeel Al Janoob ImpExp",
    description:
      "Confidential counseling sessions for couples and families with experienced relationship experts",
    images: ["/counseling-og.webp"],
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
    canonical: "/marriage-&-family-counseling",
    languages: {
      en: "https://salsabeelaljanoobimpexp.com/marriage-&-family-counseling",
      ar: "https://salsabeelaljanoobimpexp.com/ar/marriage-&-family-counseling",
    },
  },
  category: "Counseling",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch the data
    const { data, error } = await supabase
      .from("marriage")
      .select("page_info")
      .single()

    if (error) {
      console.error("Error fetching marriage data:", error)
      throw new Error("Failed to fetch marriage data")
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
          backgroundImage: "/uploads/marriage/marriage-counseling.webp",
          serviceType: "Marriage & Family Counseling",
          title: "Strengthening Relationships",
          underlineText: "Marriage & Family Counseling",
          description:
            "Providing expert guidance and support to nurture and heal relationships within couples and families.",
          buttonText: "Get Started",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Marriage & Family Counseling",
          paragraphs: [
            "Our Marriage & Family Counseling services offer compassionate guidance for couples and families navigating life's challenges.",
            "Our expert team tailors each session to address individual needs, providing strategies for conflict resolution, stress management, and relationship enrichment.",
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
          description:
            "Contact us today to discuss your relationship goals and discover how our expert counseling can help strengthen your bonds.",
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
    : []

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero.backgroundImage || "/uploads/marriage/marriage-counseling.webp"}
        serviceType={hero.serviceType || "Marriage & Family Counseling"}
        title={hero.title || "Strengthening Relationships"}
        underlineText={hero.underlineText || "Marriage & Family Counseling"}
        description={
          hero.description ||
          "Providing expert guidance and support to nurture and heal relationships within couples and families."
        }
        buttonText={hero.buttonText || "Get Started"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Marriage & Family Counseling"}
        paragraphs={
          explanation.paragraphs || [
            "Our Marriage & Family Counseling services offer compassionate guidance for couples and families navigating life's challenges.",
            "Our expert team tailors each session to address individual needs, providing strategies for conflict resolution, stress management, and relationship enrichment.",
          ]
        }
        imageSrc={explanation.imageSrc || "/uploads/marriage/counseling.webp"}
        imageAlt={explanation.imageAlt || "Couple in counseling session"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Counseling Initiatives"}
        titleColor={projects.titleColor || "text-teal-800"}
      />

      <Frequent
        title={faqs.title || "Marriage & Family Counseling FAQs"}
        highlightWord={faqs.highlightWord || "Counseling"}
        description={faqs.description || "Find answers to common questions about our counseling services."}
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Build Your Vision?"}
        description={
          cta.description ||
          "Contact us today to discuss your relationship goals and discover how our expert counseling can help strengthen your bonds."
        }
        buttonText={cta.buttonText || "Schedule Consultation"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-emerald-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-emerald-700"}
      />

      {/* Structured Data for Counseling Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["PsychologicalTreatment", "CounselingService"],
          name: "Salsabeel Al Janoob ImpExp Counseling Services",
          description: "Professional marriage and family counseling services",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
          },
          serviceType: "MarriageCounseling",
          offers: {
            "@type": "Offer",
            category: "Counseling",
            availability: "https://schema.org/OnlineOnly",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
            },
          },
          areaServed: {
            "@type": "Country",
            name: "India",
          },
        })}
      </script>
      <Footer />
    </>
  )
}
