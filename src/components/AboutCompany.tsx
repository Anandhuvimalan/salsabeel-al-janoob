"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"
import { supabase } from "@/lib/supabaseClient"

type AboutData = {
  hero: {
    title: {
      highlight: string
      subtitle: string
    }
    description: string[]
    button: {
      text: string
    }
    image: {
      src: string
      alt: string
    }
    imageOverlay: {
      text: string
      icon: string
    }
  }
  achievements: {
    value: number
    suffix: string
    label: string
    color: string
  }[]
  values: {
    title: string
    items: {
      icon: string
      title: string
      description: string
      iconColor: string
    }[]
    image: {
      src: string
      alt: string
    }
  }
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from("about_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setAboutData(data)
      } catch (err) {
        console.error("Failed to fetch about data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("about-section-images").getPublicUrl(path).data.publicUrl
  }

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          aria-label="Loading about section"
        />
      </main>
    )
  }

  if (error || !aboutData) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <article className="text-center p-8 max-w-md">
          <h2 role="alert" className="text-xl font-bold text-red-500 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Failed to load about section data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Retry loading about section"
          >
            Try Again
          </button>
        </article>
      </main>
    )
  }

  return (
    <main className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 font-sans">
      {/* Hero Section */}
      <section aria-labelledby="about-heading" className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <motion.article
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 flex-1"
          >
            <h2 id="about-heading" className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                {aboutData.hero.title.highlight}
              </span>
              <br />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {aboutData.hero.title.subtitle}
              </span>
            </h2>

            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
              {aboutData.hero.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg"
              aria-label={aboutData.hero.button.text}
            >
              {aboutData.hero.button.text}
            </motion.button>
          </motion.article>

          <motion.figure
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={getImageUrl(aboutData.hero.image.src)}
              alt={aboutData.hero.image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60" aria-hidden="true" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-4">
                {aboutData.hero.imageOverlay.icon && (
                  <img
                    src={getImageUrl(aboutData.hero.imageOverlay.icon)}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 text-teal-400"
                  />
                )}
                <h3 className="text-xl font-bold">{aboutData.hero.imageOverlay.text}</h3>
              </div>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* Achievements Section */}
      <section aria-labelledby="achievements-heading" className="py-24 px-6">
        <h2 id="achievements-heading" className="sr-only">Company Achievements</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutData.achievements.map((achievement, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              className="p-8 text-center"
              aria-labelledby={`achievement-${index}`}
            >
              <div id={`achievement-${index}`} className={`text-4xl font-bold ${achievement.color} mb-4`}>
                <CountUp
                  end={achievement.value}
                  duration={3}
                  suffix={achievement.suffix !== "None" ? achievement.suffix : ""}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                  aria-label={`${achievement.value}${achievement.suffix}`}
                />
              </div>
              <p className="text-lg font-medium">{achievement.label}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section aria-labelledby="values-heading" className="py-24 px-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <h2 id="values-heading" className="text-4xl md:text-5xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                  {aboutData.values.title}
                </span>
              </h2>

              <ul className="space-y-6">
                {aboutData.values.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-6">
                    {item.icon && (
                      <img
                        src={getImageUrl(item.icon)}
                        alt=""
                        aria-hidden="true"
                        className={`h-8 w-8 ${item.iconColor} flex-shrink-0`}
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={getImageUrl(aboutData.values.image.src)}
                alt={aboutData.values.image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60" aria-hidden="true" />
            </figure>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default AboutSection