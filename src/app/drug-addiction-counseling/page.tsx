import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoDrug";
import Benefits from "@/components/srvicepagesections/BenefitsDrug";
import Frequent from "@/components/servicedetailpage/FAQ";
import CTASection from "@/components/servicedetailpage/cta";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";
import serviceData from "../../../data/drug.json";

export const metadata: Metadata = {
  title: "Professional Drug Addiction Counseling & Recovery Programs",
  description: "Confidential substance abuse counseling and comprehensive addiction treatment services. Certified therapists offering personalized recovery plans and family support.",
  keywords: [
    "drug addiction counseling",
    "substance abuse treatment",
    "addiction recovery programs",
    "outpatient rehab services",
    "relapse prevention therapy"
  ],
  openGraph: {
    title: "Drug Addiction Recovery Services | Salsabeel Al Janoob ImpExp",
    description: "Professional counseling and evidence-based treatment programs for substance abuse recovery",
    images: [{
      url: "/addiction-counseling-og.jpg",
      width: 1200,
      height: 630,
      alt: "Addiction Counseling Session",
    }]
  },
  alternates: {
    canonical: "/drug-addiction-counseling",
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
              alt={image.alt || `Recovery program ${index + 1}`}
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
        imageAlt={explanation.imageAlt || "Addiction recovery process diagram"}
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

      {/* Structured Data for Counseling Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MedicalOrganization", "CounselingService"],
          "name": "Salsabeel Al Janoob ImpExp Addiction Services",
          "medicalSpecialty": "AddictionMedicine",
          "description": "Professional drug addiction counseling and recovery programs",
          "serviceType": "Substance Abuse Treatment",
          "provider": {
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-93494-74746",
            "contactType": "Crisis counseling"
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": "India"
          },
          "offers": {
            "@type": "Offer",
            "category": "Counseling",
            "availability": "https://schema.org/OnlineOnly",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "INR"
            }
          }
        })}
      </script>
      <Footer />
    </>
  );
}