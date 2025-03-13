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
  >
    <img src={getImageUrl(iconSrc) || "/placeholder.svg"} alt={label} className="w-6 h-6" />
    <span className="ml-2">{label}</span>
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
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-purple-400">{name}</h4>
    <p className="text-gray-300">{operation}</p>
    <p className="text-gray-400">{address}</p>
    <div className="flex items-start">
      <img src="/phone.svg" alt="Phone" className="w-5 h-5 mr-2 mt-1" />
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
)

// Helper function to get public URL for images
const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg"

  // If the path is already a full URL or starts with /, return it as is
  if (path.startsWith("http") || path.startsWith("/")) {
    return path
  }

  // Otherwise, get the public URL from Supabase storage
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

        if (error) throw error

        // Transform data to match component expectations
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
        setError(err instanceof Error ? err.message : "Failed to load footer data")
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  useEffect(() => {
    // When subscription status changes and is not null
    if (subscriptionStatus) {
      // Set a timeout to clear the message after 2 seconds
      const timer = setTimeout(() => {
        setSubscriptionStatus(null)
        setSubscriptionMessage("")
      }, 2000)

      // Clean up the timeout if the component unmounts or status changes
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
          // Unique violation - email already exists
          setSubscriptionStatus("error")
          setSubscriptionMessage("You are already subscribed to our newsletter!")
        } else {
          console.error("Error subscribing to newsletter:", error)
          setSubscriptionStatus("error")
          setSubscriptionMessage("Failed to subscribe. Please try again later.")
        }
      } else {
        setSubscriptionStatus("success")
        setSubscriptionMessage("Thank you for subscribing to our newsletter!")
        setEmail("")
      }
    } catch (err) {
      console.error("Error in subscription process:", err)
      setSubscriptionStatus("error")
      setSubscriptionMessage("An unexpected error occurred. Please try again later.")
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-gradient-to-b from-gray-900 to-black text-red-400 text-center py-20">Error: {error}</div>
  }

  if (!data) return null

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
                  <img src={legal.chevronIcon || "/placeholder.svg"} alt="Chevron" className="w-4 h-4 mr-2" />
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
                <img src={newsletter.buttonIcon || "/placeholder.svg"} alt="Send" className="w-4 h-4" />
              </button>

              {subscriptionStatus && (
                <div
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
            <SocialLink key={social.name} href={social.link} iconSrc={social.iconSrc} label={social.name} />
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
            <Link
              href={legal.privacy}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

