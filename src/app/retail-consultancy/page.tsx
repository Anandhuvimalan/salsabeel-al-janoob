import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoRetail";
import Benefits from "@/components/srvicepagesections/BenefitsRetail";
import Frequent from "@/components/servicedetailpage/FAQ";
import CTASection from "@/components/servicedetailpage/cta";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";
import serviceData from "../../../data/retail.json";

export const metadata: Metadata = {
  title: "Retail Business Consulting & Store Management Services | Full-Service Solutions",
  description: "Comprehensive retail consultancy for food service businesses, convenience stores, and supermarkets. From setup to operations management and optimization.",
  keywords: [
    "retail business consulting",
    "store setup services",
    "24/7 convenience store management",
    "food service consulting",
    "retail operations optimization"
  ],
  openGraph: {
    title: "Retail Consultancy Services | Salsabeel Al Janoob ImpExp",
    description: "End-to-end retail solutions for food businesses and supermarkets including design, staffing, and inventory management",
    images: [{
      url: "/retail-consultancy-og.webp",
      width: 1200,
      height: 630,
      alt: "Retail Store Consulting Services",
    }]
  },
  alternates: {
    canonical: "/retail-consultancy",
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
              alt={image.alt || `Retail project ${index + 1}`}
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
        imageAlt={explanation.imageAlt || "Retail consultancy process flow"}
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

      {/* Structured Data for Retail Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ConsultingService"],
          "name": "Salsabeel Al Janoob ImpExp Retail Consultancy",
          "description": "Professional retail business consulting and management services",
          "serviceType": "RetailConsulting",
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
            "category": "BusinessConsulting",
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
            "Retail Management",
            "Food Service Operations",
            "Store Design",
            "Inventory Management"
          ]
        })}
      </script>
      <Footer />
    </>
  );
}