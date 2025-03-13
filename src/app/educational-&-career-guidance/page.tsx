import type { Metadata } from "next"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/servicedetailpage/HeroSection"
import Explanation from "@/components/servicedetailpage/Explanation"
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoEducational"
import Benefits from "@/components/srvicepagesections/BenefitsEducational"
import Frequent from "@/components/servicedetailpage/FAQ"
import CTASection from "@/components/servicedetailpage/cta"
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export const metadata: Metadata = {
  title: "Educational Counseling & Career Guidance Services | Professional Academic Planning",
  description:
    "Comprehensive educational consulting and career path guidance for students and professionals. University admission support, skill assessment, and career transition strategies.",
  keywords: [
    "career counseling services",
    "educational guidance programs",
    "university admission consulting",
    "professional career planning",
    "skill development workshops",
  ],
  openGraph: {
    title: "Academic & Career Development Services | Salsabeel Al Janoob ImpExp",
    description: "Expert educational counseling and career roadmap development for academic and professional success",
    images: [
      {
        url: "/career-guidance-og.webp",
        width: 1200,
        height: 630,
        alt: "Career Guidance Session",
      },
    ],
  },
  alternates: {
    canonical: "/educational-&-career-guidance",
  },
}

async function getServiceData() {
  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching education data:", error)
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
                alt={image.alt || `Career guidance case ${index + 1}`}
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
        imageAlt={explanation?.imageAlt || "Career planning process flowchart"}
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

      {/* Structured Data for Educational Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["EducationalOrganization", "Occupation"],
          name: "Salsabeel Al Janoob ImpExp Career Services",
          description: "Professional educational counseling and career guidance services",
          serviceType: "CareerCounseling",
          provider: {
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            address: {
              "@type": "PostalAddress",
              addressCountry: "IN",
            },
          },
          educationalProgram: {
            "@type": "EducationalOccupationalProgram",
            programType: "CareerCounseling",
            occupationalCategory: "CareerGuidance",
            dayOfWeek: "Monday,Tuesday,Wednesday,Thursday,Friday",
            timeOfDay: "Evening",
          },
          offers: {
            "@type": "Offer",
            category: "EducationalConsulting",
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

