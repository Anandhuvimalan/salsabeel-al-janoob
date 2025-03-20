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

        if (error) throw error
        setData(faqData)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        setError(error instanceof Error ? error.message : "Failed to load FAQs")
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
      { threshold: 0.1, rootMargin: "50px" }
    )

    const currentElements = elementsRef.current.filter(Boolean)
    currentElements.forEach(element => element && observer.observe(element))

    return () => {
      currentElements.forEach(element => element && observer.unobserve(element))
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
      <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center" 
            aria-label="Loading FAQs">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"
          aria-hidden="true"
        />
      </main>
    )
  }

  if (error || !data) {
    return (
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center" 
               role="alert" 
               aria-label="FAQ error">
        <article className="text-center p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">Loading Error</h2>
          <p className="text-slate-300 mb-6">{error || "Failed to load FAQ data"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            aria-label="Retry loading FAQs"
          >
            Try Again
          </button>
        </article>
      </section>
    )
  }

  return (
    <section aria-labelledby="faq-heading" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full py-20 lg:py-28 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" 
           aria-hidden="true">
        <div className="absolute left-1/3 -top-40 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-500/20 blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative">
        <header 
          ref={(el) => (elementsRef.current[0] = el)} 
          className="pb-12 text-center animate-fade-in"
        >
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" 
           aria-hidden="true" />
    </section>
  )
}