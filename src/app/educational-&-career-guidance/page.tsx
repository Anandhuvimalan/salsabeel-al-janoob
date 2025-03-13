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
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching education data:", error)
      throw new Error("Failed to fetch education data")
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
          backgroundImage: "/education-career.jpg",
          serviceType: "Educational & Career Guidance",
          title: "Expert & Personalized",
          underlineText: "Career Development Services",
          description:
            "Comprehensive educational counseling and career planning to help you achieve your academic and professional goals.",
          buttonText: "Schedule Consultation",
          buttonLink: "/contact",
        },
        explanation: {
          header: "Educational & Career Guidance",
          paragraphs: [
            "Salsabeel Al Janoob provides expert educational counseling and career guidance services to help students and professionals make informed decisions about their future.",
            "Our certified counselors offer personalized assessments, academic planning, and career development strategies for long-term success.",
          ],
          imageSrc: "/placeholder.svg?height=400&width=600",
          imageAlt: "Career planning process flowchart",
          shutters: 5,
        },
        projects: {
          title: "Our Success Stories",
          titleColor: "text-indigo-800",
          items: [],
        },
        faqs: {
          title: "Career Guidance FAQs",
          highlightWord: "Success",
          description: "Find answers to common questions about our educational and career counseling services.",
          items: [],
        },
        cta: {
          title: "Ready to Plan Your Future?",
          description: "Reach out today for professional guidance on your educational and career journey.",
          buttonText: "Get Started",
          buttonLink: "/contact",
          buttonColor: "bg-indigo-600",
          hoverButtonColor: "hover:bg-indigo-700",
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
      }))
    : []

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero.backgroundImage || "/education-career.jpg"}
        serviceType={hero.serviceType || "Educational & Career Guidance"}
        title={hero.title || "Expert & Personalized"}
        underlineText={hero.underlineText || "Career Development Services"}
        description={
          hero.description ||
          "Comprehensive educational counseling and career planning to help you achieve your academic and professional goals."
        }
        buttonText={hero.buttonText || "Schedule Consultation"}
        buttonLink={hero.buttonLink || "/contact"}
      />

      <Explanation
        header={explanation.header || "Educational & Career Guidance"}
        paragraphs={
          explanation.paragraphs || [
            "Salsabeel Al Janoob provides expert educational counseling and career guidance services to help students and professionals make informed decisions about their future.",
            "Our certified counselors offer personalized assessments, academic planning, and career development strategies for long-term success.",
          ]
        }
        imageSrc={explanation.imageSrc || "/placeholder.svg?height=400&width=600"}
        imageAlt={explanation.imageAlt || "Career planning process flowchart"}
        shutters={explanation.shutters || 5}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title || "Our Success Stories"}
        titleColor={projects.titleColor || "text-indigo-800"}
      />

      <Frequent
        title={faqs.title || "Career Guidance FAQs"}
        highlightWord={faqs.highlightWord || "Success"}
        description={
          faqs.description || "Find answers to common questions about our educational and career counseling services."
        }
        faqs={faqs.items || []}
      />

      <CTASection
        title={cta.title || "Ready to Plan Your Future?"}
        description={
          cta.description || "Reach out today for professional guidance on your educational and career journey."
        }
        buttonText={cta.buttonText || "Get Started"}
        buttonLink={cta.buttonLink || "/contact"}
        buttonColor={cta.buttonColor || "bg-indigo-600"}
        hoverButtonColor={cta.hoverButtonColor || "hover:bg-indigo-700"}
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

