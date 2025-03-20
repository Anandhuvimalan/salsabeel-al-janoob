"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Building2, Briefcase, PhoneIncoming, GraduationCap, Mailbox } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"



export default function Dashboard() {
  // Animation variants for the cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Content management items with distinct colors
  const contentNavItems = [
    {
      title: "Homepage",
      icon: Home,
      href: "/admin/hero-section",
      iconColor: "text-blue-500",
      description: "Manage hero, features, about, services, and more",
    },
    {
      title: "About Page",
      icon: Building2,
      href: "/admin/aboutpagehero",
      iconColor: "text-emerald-500",
      description: "Edit company info, leadership, values, and mission",
    },
    {
      title: "Service Pages",
      icon: Briefcase,
      href: "/admin/chemicalwaste",
      iconColor: "text-violet-500",
      description: "Update service offerings and details",
    },
    {
      title: "Contact",
      icon: PhoneIncoming,
      href: "/admin/contact",
      iconColor: "text-amber-500",
      description: "Manage contact information and form",
    },
    {
      title: "Career",
      icon: GraduationCap,
      href: "/admin/career",
      iconColor: "text-rose-500",
      description: "Update job listings and requirements",
    },
    {
      title: "Newsletter",
      icon: Mailbox,
      href: "/admin/newsletter",
      iconColor: "text-cyan-500",
      description: "Manage subscribers and email content",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg font-semibold text-foreground uppercase tracking-wider mb-4"
      >
        Content Management
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {contentNavItems.map((item, index) => (
          <motion.div key={item.title} custom={index} variants={cardVariants}>
            <Link href={item.href} className="block h-full">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full border border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium text-foreground">{item.title}</CardTitle>
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

