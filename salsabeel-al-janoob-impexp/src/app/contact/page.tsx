import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact";

const Page: React.FC = () => {
  return (
    <>
      <Navbar />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Page;
