"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto", className)}
    >
      {children}
    </motion.div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}: PropsWithChildren<{
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}>) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-2xl group/bento hover:shadow-2xl transition-all duration-300",
        "backdrop-blur-sm bg-gray-800/50",
        "border border-gray-700",
        "flex flex-col min-h-[24rem]",
        className,
      )}
    >
      {header && <div className="flex-1 p-6 md:p-8 overflow-hidden">{header}</div>}
      {children && <div className="flex-1 p-6 md:p-8">{children}</div>}

      {(title || description || icon) && (
        <motion.div
          className="p-6 md:p-8 pt-0 mt-auto group-hover/bento:translate-x-2 transition-transform duration-300 ease-out"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 rounded-full bg-gray-700">{icon}</div>}
            {title && <h3 className="font-semibold text-lg text-gray-200">{title}</h3>}
          </div>
          {description && <p className="text-gray-400 text-sm mt-4 leading-relaxed">{description}</p>}
        </motion.div>
      )}
    </motion.div>
  )
}

export const BentoHeader = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl py-2 font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}