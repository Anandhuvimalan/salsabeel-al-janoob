import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoForiegn"
import Benefits from "@/components/srvicepagesections/BenefitsForiegn"
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
      "Foreign Language Courses & Certification Programs | Professional Language Training",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Comprehensive language learning programs with certified instructors. Learn English, Arabic, French, and more with our immersive teaching methodology.",
  keywords: [
    "language learning center",
    "foreign language courses",
    "professional language training",
    "TOEFL/IELTS preparation",
    "business communication skills",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/foreign-language-learning-centers",
    siteName: "Salsabeel Al Janoob ImpExp",
    title:
      "Language Learning Programs | Salsabeel Al Janoob ImpExp",
    description:
      "Interactive foreign language courses with cultural immersion programs and certification",
    images: [
      {
        url: "/language-center-og.webp",
        width: 1200,
        height: 630,
        alt: "Language Learning Classroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Language Learning Programs | Salsabeel Al Janoob ImpExp",
    description:
      "Interactive foreign language courses with cultural immersion programs and certification",
    images: ["/language-center-og.webp"],
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
    canonical: "/foreign-language-learning-centers",
  },
  category: "Education",
  manifest: "/site.webmanifest",
}

async function getServiceData() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("language")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching language data:", error)
      throw new Error("Failed to fetch language data")
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
          backgroundImage: "/language-learning.jpg",
          serviceType: "Foreign Language Learning",
          title: "Immersive & Effective",
          underlineText: "Language Training Programs",
          description:
            "Comprehensive language courses with certified instructors for personal and professional development.",
          buttonText: "Explore Courses",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Foreign Language Learning Centers",
          paragraphs: [
            "Salsabeel Al Janoob provides professional language training programs with a focus on practical communication skills and cultural understanding.",
            "Our certified instructors use immersive teaching methods to help students achieve fluency in their chosen language quickly and effectively.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Language learning methodology diagram",
          shutters: 5,
        },
        projects: {
          title: "Our Language Programs",
          titleColor: "text-teal-800",
          items: [],
        },
        faqs: {
          title: "Language Learning FAQs",
          highlightWord: "Fluency",
          description:
            "Find answers to common questions about our language courses and teaching methodology.",
          items: [],
        },
        cta: {
          title: "Ready to Learn a New Language?",
          description:
            "Reach out today to enroll in our language courses and start your journey to multilingual fluency.",
          buttonText: "Enroll Now",
          buttonLink: "/contact",
          buttonColor: "bg-teal-600",
          hoverButtonColor: "hover:bg-teal-700",
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
                  alt={image.alt || `Language course session ${index + 1}`}
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
        backgroundImage={hero.backgroundImage || "/language-learning.jpg"}
        serviceType={hero.serviceType || "Foreign Language Learning"}
        title={hero.title || "Immersive & Effective"}
        underlineText={hero.underlineText || "Language Training Programs"}
        description={
          hero.description ||
          "Comprehensive language courses with certified instructors for personal and professional development."
        }
        buttonText={hero.buttonText || "Explore Courses"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Foreign Language Learning Centers"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides professional language training programs with a focus on practical communication skills and cultural understanding.",
            "Our certified instructors use immersive teaching methods to help students achieve fluency in their chosen language quickly and effectively.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Language learning methodology diagram"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Language Programs"}
        titleColor={projects.titleColor || "text-teal-800"}
      />

      <Frequent
        title={faqs.title || "Language Learning FAQs"}
        highlightWord={faqs.highlightWord || "Fluency"}
        description={
          faqs.description ||
          "Find answers to common questions about our language courses and teaching methodology."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Learn a New Language?"}
        description={
          cta.description ||
          "Reach out today to enroll in our language courses and start your journey to multilingual fluency."
        }
        buttonText={cta.buttonText || "Enroll Now"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-teal-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-teal-700"}
      />

      {/* Structured Data for Language Courses */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["EducationalOrganization", "Course"],
          name: "Salsabeel Al Janoob ImpExp Language Center",
          description: "Professional foreign language training and certification programs",
          courseCode: "FLL-101",
          educationalProgramMode: "classroom, online",
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: ["online", "mixed", "classroom"],
            inLanguage: ["English", "Arabic", "French"],
          },
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
            category: "LanguageCourse",
            availability: "https://schema.org/InStock",
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
