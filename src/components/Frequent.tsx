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

export default function Frequent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [data, setData] = useState<FAQData | null>(null)
  const [loading, setLoading] = useState(true)
  const elementsRef = useRef<(HTMLDivElement | null)[]>([])
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

        if (error) throw error
        setData(faqData)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
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

    elementsRef.current.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [data]) // Re-run observer when data changes

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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full py-16 sm:py-20 md:py-24 relative overflow-hidden font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute left-1/3 -top-40 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-500/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div ref={(el) => (elementsRef.current[0] = el)} className="pb-8 sm:pb-10 md:pb-12 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white tracking-tight leading-tight">
            {data.section.heading}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {data.section.highlighted}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {data.section.description}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {data.faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => (elementsRef.current[index + 1] = el)}
              className="rounded-xl bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-xl shadow-slate-900/20 animate-fade-in"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className="text-base sm:text-lg md:text-xl font-medium text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 text-slate-400 group-hover:text-cyan-300 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </span>
              </button>

              <div
                ref={(el) => (answerRefs.current[index] = el)}
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  maxHeight: openIndex === index ? `${answerRefs.current[index]?.scrollHeight}px` : "0",
                  opacity: openIndex === index ? 1 : 0,
                  willChange: "max-height, opacity",
                }}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </section>
  )
}

