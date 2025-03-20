import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import AboutSection from "@/components/AboutCompany";
import ImportExportProcess from "@/components/Process";
import { GlareCardDemo } from "@/components/GlareCard";
import CoreServices from "@/components/Services";  
import Testimonial from "@/components/Testimonials";
import Frequent from "@/components/Frequent";


const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Features />
      <AboutSection />
      <CoreServices />
      <ImportExportProcess />
      <GlareCardDemo />
      <Testimonial />
      <Frequent />
      <Footer />
    </>
  );
};

export default Page;