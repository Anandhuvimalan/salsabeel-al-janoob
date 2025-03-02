import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/aboutpage/HeroSection";
import CompanyAbout from "@/components/aboutpage/CompanyAbout";
import TeamSection from "@/components/aboutpage/TeamSection";
import ValuesSection from "@/components/aboutpage/Values";
import VisionMissionSection from "@/components/aboutpage/VisionMissionSection";
import CallToAction from "@/components/aboutpage/CallToAction";
import Testimonials from "@/components/aboutpage/LongTestimonial";
import MemorialSection from "@/components/aboutpage/Memorial";

const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CompanyAbout />
      <TeamSection />
      <ValuesSection />
      <VisionMissionSection />
      <CallToAction />
      <Testimonials />
      <MemorialSection />
      <Footer />
    </>
  );
};

export default Page;
