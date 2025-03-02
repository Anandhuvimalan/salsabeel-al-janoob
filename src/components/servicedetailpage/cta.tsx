"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface CTAProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  background?: string
  buttonColor?: string
  hoverButtonColor?: string
}

export default function CTASection({
  title,
  description,
  buttonText,
  buttonLink,
  background = "bg-gradient-to-br from-amber-50 to-white",
  buttonColor = "bg-amber-600",
  hoverButtonColor = "hover:bg-amber-700"
}: CTAProps) {
  return (
    <section className={`${background} w-full py-20 lg:py-28 relative overflow-hidden`}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <Link href={buttonLink}>
            <span className={`inline-block ${buttonColor} ${hoverButtonColor} text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer`}>
              {buttonText}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}