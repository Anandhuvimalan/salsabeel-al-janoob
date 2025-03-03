import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/servicedetailpage/WhatWeDo";
import Benefits from "@/components/servicedetailpage/Benefits";
import Frequent from "@/components/servicedetailpage/FAQ";
import CTASection from "@/components/servicedetailpage/cta";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";
import serviceData from "../../../data/chemicalwasteData.json";

export const metadata: Metadata = {
  title: "Chemical Waste Disposal & Management Services | Hazardous Waste Solutions",
  description: "Safe and compliant chemical waste management services including hazardous material disposal, laboratory waste handling, and industrial chemical recycling. EPA-compliant solutions.",
  keywords: [
    "hazardous waste disposal",
    "chemical waste management",
    "laboratory waste removal",
    "toxic waste handling",
    "industrial chemical recycling"
  ],
  openGraph: {
    title: "Professional Chemical Waste Management Services | Salsabeel Al Janoob ImpExp",
    description: "Certified chemical waste disposal and hazardous material management solutions with 24/7 emergency response",
    images: [{
      url: "/chemical-waste-og.webp",
      width: 1200,
      height: 630,
      alt: "Chemical Waste Management Process",
    }]
  },
  alternates: {
    canonical: "/chemical-waste-management",
  }
};

async function getServiceData() {
  // Simulate API call
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
          {project.details.images.map((image, index) => (
            <Image 
              key={index}
              src={image.src}
              alt={image.alt || `Chemical waste project ${index + 1}`}
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
        imageAlt={explanation.imageAlt || "Chemical waste management process flow"}
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

      {/* Structured Data for Chemical Waste Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "ChemicalWasteManagement",
          "provider": {
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "serviceOutput": {
            "@type": "CreativeWork",
            "name": "Waste Manifest"
          },
          "termsOfService": "https://salsabeelaljanoobimpexp.com/terms",
          "category": "EnvironmentalService"
        })}
      </script>
      <Footer />
    </>
  );
}