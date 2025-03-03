import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoLaundry";
import Benefits from "@/components/srvicepagesections/BenefitsLaundry";
import Frequent from "@/components/servicedetailpage/FAQ";
import CTASection from "@/components/servicedetailpage/cta";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";
import serviceData from "../../../data/laundry.json";

export const metadata: Metadata = {
  title: "Professional Laundry & Dry Cleaning Services | Eco-Friendly Fabric Care",
  description: "Premium laundry solutions with pickup/delivery. Specialized in delicate fabric handling, stain removal, and commercial laundry services. Hygienic and eco-friendly processes.",
  keywords: [
    "professional laundry services",
    "dry cleaning near me",
    "curtain cleaning",
    "commercial laundry",
    "eco-friendly fabric care"
  ],
  openGraph: {
    title: "Expert Laundry Services | Salsabeel Al Janoob ImpExp",
    description: "24/7 laundry solutions with free pickup and delivery. Special care for delicate fabrics and bulk commercial services",
    images: [{
      url: "/laundry-services-og.jpg",
      width: 1200,
      height: 630,
      alt: "Professional Laundry Service",
    }]
  },
  alternates: {
    canonical: "/laundry-services",
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
              alt={image.alt || `Laundry service example ${index + 1}`}
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
        imageAlt={explanation.imageAlt || "Laundry service process flowchart"}
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

      {/* Structured Data for Laundry Services */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Salsabeel Al Janoob ImpExp Laundry Services",
          "image": "/laundry-services-og.jpg",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Coimbatore",
            "addressRegion": "Tamil Nadu",
            "postalCode": "641105",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.0168",
            "longitude": "76.9558"
          },
          "url": "https://salsabeelaljanoobimpexp.com/services/laundry-services",
          "telephone": "+91-93494-74746",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "07:00",
            "closes": "21:00"
          },
          "sameAs": [
            "https://facebook.com/yourpage",
            "https://instagram.com/yourprofile"
          ]
        })}
      </script>
      <Footer />
    </>
  );
}