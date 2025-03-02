import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/servicedetailpage/HeroSection";
import Explanation from "@/components/servicedetailpage/Explanation";
import WhatWeDo from "@/components/srvicepagesections/WhatWeDoMarriage";
import Benefits from "@/components/srvicepagesections/BenefitsMarriage";
import Frequent from "@/components/servicedetailpage/FAQ";
import ProjectsCarousel from "@/components/servicedetailpage/apple-cards-carousel-demo-2";
import Image from "next/image";

import serviceData from "../../../data/marriage.json";

const Page: React.FC = () => {
  // Transform project data to include React content components
  const projects = serviceData.pageInfo.projects.items.map(project => ({
    category: project.category,
    title: project.title,
    src: project.src,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto mb-10 whitespace-pre-line">
          {project.details.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(project.details.images as { src: string, alt: string }[]).map((image, index) => (
            <Image 
              key={index}
              src={image.src} 
              alt={image.alt} 
              width={300} 
              height={200} 
              className="w-full h-auto object-cover rounded-lg" 
            />
          ))}
        </div>
      </div>
    )
  }));

  const { hero, explanation, faqs, cta } = serviceData.pageInfo;

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
        imageAlt={explanation.imageAlt}
        shutters={explanation.shutters}
      />

      <WhatWeDo />
      <Benefits />

      <ProjectsCarousel 
        projects={projects}
        title={serviceData.pageInfo.projects.title}
        titleColor={serviceData.pageInfo.projects.titleColor}
      />

      <Frequent
        title={faqs.title}
        highlightWord={faqs.highlightWord}
        description={faqs.description}
        faqs={faqs.items}
      />
      <Footer />
    </>
  )
}

export default Page