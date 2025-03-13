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

export const metadata: Metadata = {
  title: "Foreign Language Courses & Certification Programs | Professional Language Training",
  description:
    "Comprehensive language learning programs with certified instructors. Learn English, Arabic, French, and more with our immersive teaching methodology.",
  keywords: [
    "language learning center",
    "foreign language courses",
    "professional language training",
    "TOEFL/IELTS preparation",
    "business communication skills",
  ],
  openGraph: {
    title: "Language Learning Programs | Salsabeel Al Janoob ImpExp",
    description: "Interactive foreign language courses with cultural immersion programs and certification",
    images: [
      {
        url: "/language-center-og.webp",
        width: 1200,
        height: 630,
        alt: "Language Learning Classroom",
      },
    ],
  },
  alternates: {
    canonical: "/foreign-language-learning-centers",
  },
}

async function getServiceData() {
  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("language")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching language data:", error)
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
        imageAlt={explanation?.imageAlt || "Language learning methodology diagram"}
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

