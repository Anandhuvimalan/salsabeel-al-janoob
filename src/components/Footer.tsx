"use client"
import { Fragment, useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

interface FooterData {
  company_info: {
    logoSrc: string
    heading: string
    description: string
  }
  quick_links: Array<{ name: string; link: string }>
  newsletter: {
    heading: string
    placeholder: string
    buttonText: string
    buttonIcon: string
  }
  social_media: Array<{ iconSrc: string; name: string; link: string }>
  company_locations: Array<{
    name: string
    operation: string
    address: string
    phoneNumbers: string[]
    mapSrc: string
  }>
  legal: {
    terms: string
    privacy: string
    copyright: string
    chevronIcon: string
  }
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: FooterData = {
  company_info: {
    logoSrc: "footer-company_info-logoSrc-1741719946352-aomd14ginj.svg",
    heading: "Salsabeel Al Janoob Group",
    description: "Trusted import-export solutions since 1975, committed to excellence in India and Oman.",
  },
  quick_links: [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ],
  newsletter: {
    heading: "Newsletter",
    placeholder: "Your email",
    buttonText: "Subscribe",
    buttonIcon: "footer-newsletter-buttonIcon-1741719946353-qqapepvaee.svg",
  },
  social_media: [
    {
      iconSrc: "footer-social_media-0-iconSrc-1741719946353-7uzmele7j9.svg",
      name: "Instagram",
      link: "https://instagram.com",
    },
    {
      iconSrc: "footer-social_media-1-iconSrc-1741719946353-h70304r0884.svg",
      name: "LinkedIn",
      link: "https://linkedin.com",
    },
    {
      iconSrc: "footer-social_media-2-iconSrc-1741719946353-8r97pj0mw49.svg",
      name: "facebook",
      link: "https://linkedin.com",
    },
  ],
  company_locations: [
    {
      name: "Salsabeel Al Janoob ImpExp",
      operation: "Indian Operation",
      address: "Jwala Complex, Marappalam, PO Madukarai 641105, Coimbatore, Tamilnadu",
      phoneNumbers: ["0422-4547438", "+91 93494 74746", "+91 7550350680"],
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.6876352401074!2d76.9376869!3d10.901638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080a289e1ac9f5%3A0x3a0d5bbdd4e3e8b9!2s10%C2%B054%2705.9%22N%2076%C2%B056%2724.9%22E!5e0!3m2!1sen!2sus!4v1690035458611!5m2!1sen!2sus",
    },
    {
      name: "Salsabeel Al Janoob Trad & Cont. Est",
      operation: "Oman Operation",
      address: "Post Box no : 730, postal code : 111, Dhofar-Salala, sultanate of oman",
      phoneNumbers: ["+968 9171 8606", "+96899779771"],
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.2799402184333!2d57.5234353!3d23.734253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f7e47c7d52f1d6f%3A0x8d1f2a7fa76c8e0c!2s23%C2%B044'03.3%22N%2057%C2%B031'33.6%22E!5e0!3m2!1sen!2s!4v1690035458611!5m2!1sen!2s",
    },
  ],
  legal: {
    terms: "/terms",
    privacy: "/privacy-policy",
    copyright: "© {year} Salsabeel Al Janoob Group. All rights reserved.",
    chevronIcon: "footer-legal-chevronIcon-1741719946353-yjp0a69bdb.svg",
  },
}

const SocialLink = ({
  href,
  iconSrc,
  label,
}: {
  href: string
  iconSrc: string
  label: string
}) => (
  <a
    href={href}
    className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit our ${label} profile`}
  >
    <img src={getImageUrl(iconSrc) || "/placeholder.svg"} alt="" className="w-6 h-6" aria-hidden="true" />
    <span className="ml-2 sr-only">{label}</span>
  </a>
)

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
      aria-label={title}
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  </div>
)

const CompanyLocation = ({
  name,
  operation,
  address,
  phoneNumbers,
  mapSrc,
}: {
  name: string
  operation: string
  address: string
  phoneNumbers: string[]
  mapSrc: string
}) => (
  <article className="space-y-4">
    <h3 className="text-lg font-semibold text-purple-400">{name}</h3>
    <p className="text-gray-300">{operation}</p>
    <address className="text-gray-400 not-italic">{address}</address>
    <div className="flex items-start">
      <img src="/phone.svg" alt="" className="w-5 h-5 mr-2 mt-1" aria-hidden="true" />
      <div className="flex flex-wrap">
        {phoneNumbers.map((phone, index) => (
          <Fragment key={index}>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-gray-300 hover:text-white transition-colors duration-300 whitespace-nowrap"
              aria-label={`Call ${phone}`}
            >
              {phone}
            </a>
            {index !== phoneNumbers.length - 1 && <span className="mr-1">,</span>}
          </Fragment>
        ))}
      </div>
    </div>
    <LocationMap src={mapSrc} title={`${name} Location`} />
  </article>
)

const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http") || path.startsWith("/")) return path
  return supabase.storage.from("footer-images").getPublicUrl(path).data.publicUrl
}

const Footer = () => {
  const [email, setEmail] = useState("")
  const [data, setData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"success" | "error" | null>(null)
  const [subscriptionMessage, setSubscriptionMessage] = useState<string>("")

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const { data: footerData, error } = await supabase
          .from("footer_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with image URLs
          const transformedFallbackData = {
            company_info: {
              ...FALLBACK_DATA.company_info,
              logoSrc: getImageUrl(FALLBACK_DATA.company_info.logoSrc),
            },
            quick_links: FALLBACK_DATA.quick_links,
            newsletter: {
              ...FALLBACK_DATA.newsletter,
              buttonIcon: getImageUrl(FALLBACK_DATA.newsletter.buttonIcon),
            },
            social_media: FALLBACK_DATA.social_media.map((item) => ({
              ...item,
              iconSrc: getImageUrl(item.iconSrc),
            })),
            company_locations: FALLBACK_DATA.company_locations,
            legal: {
              ...FALLBACK_DATA.legal,
              chevronIcon: getImageUrl(FALLBACK_DATA.legal.chevronIcon),
            },
          }

          setData(transformedFallbackData)
          return
        }

        const transformedData = {
          company_info: {
            ...footerData.company_info,
            logoSrc: getImageUrl(footerData.company_info.logoSrc),
          },
          quick_links: footerData.quick_links,
          newsletter: {
            ...footerData.newsletter,
            buttonIcon: getImageUrl(footerData.newsletter.buttonIcon),
          },
          social_media: footerData.social_media.map((item: any) => ({
            ...item,
            iconSrc: getImageUrl(item.iconSrc),
          })),
          company_locations: footerData.company_locations,
          legal: {
            ...footerData.legal,
            chevronIcon: getImageUrl(footerData.legal.chevronIcon),
          },
        }

        setData(transformedData)
      } catch (err) {
        console.error("Error fetching footer data:", err)
        console.log("Using fallback data due to fetch error")

        // Process fallback data with image URLs
        const transformedFallbackData = {
          company_info: {
            ...FALLBACK_DATA.company_info,
            logoSrc: getImageUrl(FALLBACK_DATA.company_info.logoSrc),
          },
          quick_links: FALLBACK_DATA.quick_links,
          newsletter: {
            ...FALLBACK_DATA.newsletter,
            buttonIcon: getImageUrl(FALLBACK_DATA.newsletter.buttonIcon),
          },
          social_media: FALLBACK_DATA.social_media.map((item) => ({
            ...item,
            iconSrc: getImageUrl(item.iconSrc),
          })),
          company_locations: FALLBACK_DATA.company_locations,
          legal: {
            ...FALLBACK_DATA.legal,
            chevronIcon: getImageUrl(FALLBACK_DATA.legal.chevronIcon),
          },
        }

        setData(transformedFallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  useEffect(() => {
    if (subscriptionStatus) {
      const timer = setTimeout(() => {
        setSubscriptionStatus(null)
        setSubscriptionMessage("")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [subscriptionStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

      if (error) {
        if (error.code === "23505") {
          setSubscriptionStatus("error")
          setSubscriptionMessage("You are already subscribed to our newsletter!")
        } else {
          console.error("Error subscribing:", error)
          setSubscriptionStatus("error")
          setSubscriptionMessage("Subscription failed. Please try again.")
        }
      } else {
        setSubscriptionStatus("success")
        setSubscriptionMessage("Thank you for subscribing!")
        setEmail("")
      }
    } catch (err) {
      console.error("Subscription error:", err)
      setSubscriptionStatus("error")
      setSubscriptionMessage("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
      <main
        aria-label="Loading footer"
        className="bg-gradient-to-b from-gray-900 to-black min-h-[500px] flex items-center justify-center"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"
          aria-hidden="true"
        />
      </main>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!data) {
    return null // This should never happen with fallback data
  }

  const {
    company_info: companyInfo,
    quick_links: quickLinks,
    newsletter,
    social_media: socialMedia,
    company_locations: companyLocations,
    legal,
  } = data

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Image
              src={companyInfo.logoSrc || "/placeholder.svg"}
              alt={`${companyInfo.heading} logo`}
              width={120}
              height={120}
              className="rounded-full"
              loading="lazy"
            />
            <h2 className="text-2xl font-bold text-purple-400">{companyInfo.heading}</h2>
            <p className="text-gray-400">{companyInfo.description}</p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400">Quick Links</h3>
              <ul className="flex flex-col space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.link}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <img
                        src={legal.chevronIcon || "/placeholder.svg"}
                        alt=""
                        className="w-4 h-4 mr-2"
                        aria-hidden="true"
                      />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Newsletter */}
          <section aria-label="Newsletter subscription">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400">{newsletter.heading}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
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
                  aria-label="Subscribe to newsletter"
                >
                  {newsletter.buttonText}
                  <img
                    src={newsletter.buttonIcon || "/placeholder.svg"}
                    alt=""
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </button>

                {subscriptionStatus && (
                  <div
                    role="alert"
                    className={`mt-2 p-2 rounded text-sm ${
                      subscriptionStatus === "success"
                        ? "bg-green-900/50 text-green-300 border border-green-700"
                        : "bg-red-900/50 text-red-300 border border-red-700"
                    }`}
                  >
                    {subscriptionMessage}
                  </div>
                )}
              </form>
            </div>
          </section>
        </div>

        {/* Company Locations */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {companyLocations.map((location, index) => (
            <CompanyLocation key={index} {...location} />
          ))}
        </div>

        {/* Social Links */}
        <nav aria-label="Social media links">
          <div className="mt-12 flex justify-center space-x-6">
            {socialMedia.map((social) => (
              <SocialLink key={social.name} href={social.link} iconSrc={social.iconSrc} label={social.name} />
            ))}
          </div>
        </nav>

        {/* Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {legal.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <nav aria-label="Legal links">
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href={legal.terms}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href={legal.privacy}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

