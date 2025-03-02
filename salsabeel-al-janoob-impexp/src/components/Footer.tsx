"use client";
import { Fragment, useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

interface FooterData {
  companyInfo: {
    logoSrc: string;
    heading: string;
    description: string;
  };
  quickLinks: Array<{ name: string; link: string }>;
  newsletter: {
    heading: string;
    placeholder: string;
    buttonText: string;
    buttonIcon: string;
  };
  socialMedia: Array<{ iconSrc: string; name: string; link: string }>;
  companyLocations: Array<{
    name: string;
    operation: string;
    address: string;
    phoneNumbers: string[];
    mapSrc: string;
  }>;
  legal: {
    terms: string;
    privacy: string;
    copyright: string;
    chevronIcon: string;
  };
}

const SocialLink = ({ href, iconSrc, label }: { 
  href: string; 
  iconSrc: string; 
  label: string 
}) => (
  <a
    href={href}
    className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={iconSrc} alt={label} className="w-6 h-6" />
    <span className="ml-2">{label}</span>
  </a>
);

const LocationMap = ({ src, title }: { src: string; title: string }) => (
  <div className="w-full h-64 rounded-lg overflow-hidden">
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
    ></iframe>
  </div>
);

const CompanyLocation = ({
  name,
  operation,
  address,
  phoneNumbers,
  mapSrc
}: {
  name: string;
  operation: string;
  address: string;
  phoneNumbers: string[];
  mapSrc: string;
}) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-purple-400">{name}</h4>
    <p className="text-gray-300">{operation}</p>
    <p className="text-gray-400">{address}</p>
    <div className="flex items-start">
      <img src="/icons/phone.svg" alt="Phone" className="w-5 h-5 mr-2 mt-1" />
      <div className="flex flex-wrap">
        {phoneNumbers.map((phone, index) => (
          <Fragment key={index}>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-gray-300 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              {phone}
            </a>
            {index !== phoneNumbers.length - 1 && <span className="mr-1">,</span>}
          </Fragment>
        ))}
      </div>
    </div>
    <LocationMap src={mapSrc} title={`${name} Location`} />
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/homepage/footer');
        if (!response.ok) throw new Error('Failed to fetch footer data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load footer data');
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black text-red-400 text-center py-20">
        Error: {error}
      </div>
    );
  }

  if (!data) return null;

  const { 
    companyInfo,
    quickLinks,
    newsletter,
    socialMedia,
    companyLocations,
    legal
  } = data;

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Image
              src={companyInfo.logoSrc}
              alt="Company Logo"
              width={120}
              height={120}
              className="rounded-full"
            />
            <h3 className="text-2xl font-bold text-purple-400">{companyInfo.heading}</h3>
            <p className="text-gray-400">{companyInfo.description}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.link}
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <img 
                    src={legal.chevronIcon} 
                    alt="Chevron" 
                    className="w-4 h-4 mr-2" 
                  />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">{newsletter.heading}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {newsletter.buttonText}
                <img 
                  src={newsletter.buttonIcon} 
                  alt="Send" 
                  className="w-4 h-4" 
                />
              </button>
            </form>
          </div>
        </div>

        {/* Company Locations */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {companyLocations.map((location, index) => (
            <CompanyLocation key={index} {...location} />
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-12 flex justify-center space-x-6">
          {socialMedia.map((social) => (
            <SocialLink
              key={social.name}
              href={social.link}
              iconSrc={social.iconSrc}
              label={social.name}
            />
          ))}
        </div>

        {/* Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {legal.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href={legal.terms} className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href={legal.privacy} className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;