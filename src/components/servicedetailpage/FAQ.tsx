"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FAQ = {
  question: string
  answer: string
}

interface FAQProps {
  faqs: FAQ[]
  title?: string
  highlightWord?: string
  description?: string
}

export default function Frequent({ 
  faqs,
  title = "Frequently Asked",
  highlightWord = "Questions",
  description = "Get answers to common queries about our services"
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white w-full py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "linear",
          }}
          className="absolute left-1/3 -top-40 h-96 w-96 rounded-full bg-gradient-to-r from-amber-400/10 to-amber-600/10 blur-3xl"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="pb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {title}{" "}
            <span className="text-amber-600">{highlightWord}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-white border border-gray-200 hover:border-amber-400 transition-all duration-300 shadow-xl"
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 sm:p-7 text-left focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg sm:text-xl font-medium text-gray-900 group-hover:text-amber-600 transition-colors duration-300 pr-4">
                  {faq.question}
                </span>
                <motion.span
                  initial={false}
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0 text-gray-500"
                >
                  <ChevronDown size={24} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                        opacity: { duration: 0.2 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
      />
    </section>
  )
}