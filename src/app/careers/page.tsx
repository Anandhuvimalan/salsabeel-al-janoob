import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import JobList from "@/components/carrercomp/job-list"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Careers | Salsabeel Al Janoob ImpExp",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Join our team and be part of our mission to provide exceptional services across multiple industries. Discover career opportunities, growth, and a dynamic work environment.",
  keywords: [
    "careers",
    "jobs",
    "employment opportunities",
    "join our team",
    "career growth",
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com/careers",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Careers | Salsabeel Al Janoob ImpExp",
    description:
      "Join our team and be part of our mission to provide exceptional services across multiple industries.",
    images: [
      {
        url: "/careers-og.webp",
        width: 1200,
        height: 630,
        alt: "Careers at Salsabeel Al Janoob ImpExp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Salsabeel Al Janoob ImpExp",
    description:
      "Join our team and be part of our mission to deliver exceptional services. Explore career opportunities with Salsabeel Al Janoob.",
    images: ["/careers-og.webp"],
    creator: "@salsabeelaljanoob",
    site: "@salsabeelaljanoob",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/careers",
    languages: {
      en: "https://salsabeelaljanoobimpexp.com/careers",
      ar: "https://salsabeelaljanoobimpexp.com/ar/careers",
    },
  },
  category: "Employment",
  manifest: "/site.webmanifest",
}

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Navbar />
      <section className="relative bg-[#0e1116] text-white overflow-hidden py-16">
        <div className="absolute inset-0 bg-[#0e1116] z-0"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl">
            <div className="text-[#38bdf8] text-sm font-medium mb-4">Careers</div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
              Enable a <span className="text-[#38bdf8]">million</span> people to <br />
              build <span className="text-[#38bdf8]">exceptional services</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl">
              Join the team building Salsabeel Al Janoob, one of the fastest growing import and export companies with
              specialized services in waste management, consultancy, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white" asChild>
                <a href="#open-positions">View Open Positions</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 bg-white text-black hover:bg-zinc-100 hover:text-black"
                asChild
              >
                <a href="/about">Learn About Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section id="why-join-us" className="py-16 bg-[#0e1116] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Join Salsabeel Al Janoob?</h2>
            <p className="text-lg text-zinc-400">
              We offer a dynamic work environment with opportunities for growth and development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              title="Professional Growth"
              description="Continuous learning and career advancement opportunities."
            />
            <BenefitCard
              title="Diverse Environment"
              description="Work with professionals from various industries and backgrounds."
            />
            <BenefitCard
              title="Global Impact"
              description="Contribute to projects that make a difference across multiple sectors."
            />
            <BenefitCard
              title="Competitive Compensation"
              description="Attractive salary packages and performance bonuses."
            />
            <BenefitCard title="Work-Life Balance" description="Flexible schedules and supportive company culture." />
            <BenefitCard
              title="Innovation Focus"
              description="Opportunity to implement creative solutions to complex challenges."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-[#0e1116] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Team Says</h2>
            <p className="text-lg text-zinc-400">Hear from our leadership about our values and work culture.</p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                <img src="/Pramod-Haridasan.jpg" alt="Employee" className="w-full h-full object-cover" />
              </div>
              <div>
                <blockquote className="text-xl md:text-2xl font-medium mb-4">
                  "At Salsabeel Al Janoob, we're building a team of innovators who thrive on challenges. We value
                  expertise, collaborative thinking, and the unique perspectives each team member brings. Join us to
                  grow your career in an environment where your contributions truly matter."
                </blockquote>
                <div>
                  <p className="font-semibold">Pramod-Haridasan</p>
                  <p className="text-zinc-400">Managing Director & General Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="bg-[#0e1116] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Open Positions</h2>
            <p className="text-lg text-zinc-400">Browse our current job openings and find the perfect role for you</p>
          </div>

          <JobList />
        </div>
        <Footer />
      </section>
    </div>
  )
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-[#38bdf8]/50 transition-colors">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-zinc-300">{description}</p>
    </div>
  )
}
