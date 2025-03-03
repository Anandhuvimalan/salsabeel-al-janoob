import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoVasthu";
import Benefits from "@/components/srvicepagesections/BenefitsVasthu";
import Frequent from "@/components/servicedetailpage/FAQ";
import CTASection from "@/components/servicedetailpage/cta";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";
import serviceData from "../../../data/vasthu.json";

export const metadata: Metadata = {
  title: "Vastu Shastra Consultation Services | Home & Office Energy Balancing",
  description: "Professional Vastu consultancy for residential and commercial spaces. Harmony optimization, directional alignment, and positive energy flow solutions.",
  keywords: [
    "vastu consultation",
    "home energy balancing",
    "commercial vastu shastra",
    "architectural alignment",
    "positive space design"
  ],
  openGraph: {
    title: "Vastu Shastra Experts | Salsabeel Al Janoob ImpExp",
    description: "Traditional Vastu consultations with modern implementation techniques for holistic living spaces",
    images: [{
      url: "/vastu-consultancy-og.jpg",
      width: 1200,
      height: 630,
      alt: "Vastu Consultation Process",
    }]
  },
  alternates: {
    canonical: "/vasthu-consultancy",
  }
};

async function getServiceData() {
  return await Promise.resolve(serviceData);
}

export default async function Page() {
  const { pageInfo } = await getServiceData();
  const { hero, explanation, faqs, cta, projects } = pageInfo;

  const enhancedProjects = projects.items.map(project => ({
    ...project,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-10 whitespace-pre-line">
          {project.details.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {project.details.images.map((image: { src: string; alt: string }, index: number) => (
            <Image
              key={index}
              src={image.src}
              alt={image.alt || `Vastu project ${index + 1}`}
              width={300}
              height={200}
              className="w-full h-auto object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ))}
        </div>
      </div>
    )
  }));

  return (
    <>
      <Navbar />
      <HeroSection
        backgroundImage={hero.backgroundImage}
        serviceType={hero.serviceType}
        title={hero.title}
        underlineText={hero.underlineText}
        description={hero.description}
        buttonText={hero.buttonText}
        buttonLink={hero.buttonLink}
      />

      <Explanation
        header={explanation.header}
        paragraphs={explanation.paragraphs}
        imageSrc={explanation.imageSrc}
        imageAlt={explanation.imageAlt || "Vastu principles diagram"}
        shutters={explanation.shutters}
      />

        <WhatWeDo />
        <Benefits />

      <ProjectsCarousel
        projects={enhancedProjects}
        title={projects.title}
        titleColor={projects.titleColor}
      />

      <Frequent
        title={faqs.title}
        highlightWord={faqs.highlightWord}
        description={faqs.description}
        faqs={faqs.items}
      />

      <CTASection
        title={cta.title}
        description={cta.description}
        buttonText={cta.buttonText}
        buttonLink={cta.buttonLink}
        buttonColor={cta.buttonColor}
        hoverButtonColor={cta.hoverButtonColor}
      />

      {/* Structured Data for Vastu Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ProfessionalService"],
          "name": "Salsabeel Al Janoob ImpExp Vastu Consultancy",
          "description": "Traditional Vastu Shastra consultation services",
          "serviceType": "VastuConsultancy",
          "provider": {
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          },
          "offers": {
            "@type": "Offer",
            "category": "ArchitecturalConsulting",
            "availability": "https://schema.org/InStock",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "INR"
            }
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "knowsAbout": [
            "Vastu Shastra",
            "Space Energy Balancing",
            "Directional Alignment",
            "Traditional Architecture"
          ]
        })}
      </script>
      <Footer />
    </>
  );
}