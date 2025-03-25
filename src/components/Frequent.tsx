"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

type FAQ = {
  question: string
  answer: string
}

interface FAQData {
  section: {
    heading: string
    highlighted: string
    description: string
  }
  faqs: FAQ[]
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: FAQData = {
  section: {
    heading: "Frequently Asked",
    highlighted: "Questions",
    description: "Get answers to common queries about our services and operations",
  },
  faqs: [
    {
      question: "What is Salsabeel Al Janoob?",
      answer:
        "Salsabeel Al Janoob is a service provider with operations in the Sultanate of Oman and India, offering import-export services along with a range of other solutions like waste management, civil contracts, and consultancy services.",
    },
    {
      question: "Where are your operations based?",
      answer:
        "Our Sultanate of Oman operations are based in Salalah and Barka, while our India operations are headquartered in Coimbatore, Tamilnadu.",
    },
    {
      question: "What services do you provide?",
      answer:
        "We offer services such as export & import, specialized chemical waste management, civil contracts, retail consultancy, educational and career guidance, and much more. Visit our Services section for detailed information.",
    },
    {
      question: "Can you manage specialized chemical waste?",
      answer: "Yes, we specialize in chemical waste management, ensuring environmentally compliant solutions.",
    },
    {
      question: "Do you offer retail consultancy?",
      answer:
        "Yes, we provide consultancy for setting up and managing 24x7 convenience stores, cake shops, fast food stalls, restaurants, supermarkets, and more.",
    },
    {
      question: "What kind of civil contracts do you handle?",
      answer:
        "We handle design to construction, demolition of old buildings, landscaping, fencing, boulder laying, painting, electric works, solar panel connections, and all types of annual maintenance contracts.",
    },
    {
      question: "Do you provide educational and career guidance?",
      answer:
        "Yes, we guide students with career counseling, foreign language learning, and provide vasthu and family counseling services.",
    },
    {
      question: "How can I contact your team?",
      answer:
        "You can reach us via email at info@salsabeelaljanoobimpexp.com or through phone/WhatsApp. Visit our Contact section for more details.",
    },
  ],
}

export default function Frequent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [data, setData] = useState<FAQData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const elementsRef = useRef<(HTMLElement | null)[]>([])
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: faqData, error } = await supabase
          .from("faqs_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")
          setData(FALLBACK_DATA)
          return
        }

        setData(faqData)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        console.log("Using fallback data due to fetch error")
        setData(FALLBACK_DATA)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    const currentElements = elementsRef.current.filter(Boolean)
    currentElements.forEach((element) => element && observer.observe(element))

    return () => {
      currentElements.forEach((element) => element && observer.unobserve(element))
      observer.disconnect()
    }
  }, [data])

  const toggleFAQ = (index: number): void => {
    if (openIndex === index) {
      const answerElement = answerRefs.current[index]
      if (answerElement) {
        answerElement.style.maxHeight = "0"
        answerElement.style.opacity = "0"
      }
      setTimeout(() => setOpenIndex(null), 300)
    } else {
      setOpenIndex(index)
      setTimeout(() => {
        const answerElement = answerRefs.current[index]
        if (answerElement) {
          const contentHeight = answerElement.scrollHeight + 32
          answerElement.style.maxHeight = `${contentHeight}px`
          answerElement.style.opacity = "1"
        }
      }, 10)
    }
  }

  if (loading) {
    return (
      <main
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center"
        aria-label="Loading FAQs"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" aria-hidden="true" />
      </main>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!data) {
    return null // This should never happen with fallback data
  }

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full py-20 lg:py-28 relative overflow-hidden font-sans"
    >
      <div
        className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        aria-hidden="true"
      >
        <div className="absolute left-1/3 -top-40 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-500/20 blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative">
        <header ref={(el) => (elementsRef.current[0] = el)} className="pb-12 text-center animate-fade-in">
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {data.section.heading}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {data.section.highlighted}
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">{data.section.description}</p>
        </header>

        <div role="list" className="space-y-4">
          {data.faqs.map((faq, index) => (
            <article
              key={index}
              ref={(el) => (elementsRef.current[index + 1] = el)}
              role="listitem"
              className="rounded-xl bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-xl shadow-slate-900/20 animate-fade-in"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 sm:p-7 text-left focus:outline-none group"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-lg sm:text-xl font-medium text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 text-slate-400 group-hover:text-cyan-300 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown size={24} />
                </span>
              </button>

              <div
                ref={(el) => (answerRefs.current[index] = el)}
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  maxHeight: openIndex === index ? `${answerRefs.current[index]?.scrollHeight}px` : "0",
                  opacity: openIndex === index ? 1 : 0,
                  willChange: "max-height, opacity",
                }}
              >
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 text-slate-300 leading-relaxed">{faq.answer}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}

