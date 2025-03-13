"use client"

import type React from "react"
import "./varial.css"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Home,
  X,
  Briefcase,
  GraduationCap,
  Building2,
  PhoneIncoming,
  Mailbox,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

/** Custom hook to manage authentication and redirect if not logged in */
function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/login")
      } else {
        setUser(session.user)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  return { user, loading }
}

/** Sidebar Navigation Item */
interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  isSidebarOpen: boolean
  onClick?: () => void
  showTooltips?: boolean
}

const NavItem = ({ href, icon, label, isActive, isSidebarOpen, onClick, showTooltips = true }: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} onClick={onClick}>
            <motion.div
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(var(--primary-rgb), 0.15)",
                transition: { duration: 0.2 },
              }}
              className="relative"
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 mb-1 transition-all duration-300 rounded-lg",
                  isActive ? "nav-item-active" : "text-foreground hover:text-primary",
                  !isSidebarOpen && "justify-center p-2",
                )}
              >
                <motion.div
                  animate={{
                    color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                  whileHover={{
                    color: "hsl(var(--primary))",
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  {icon}
                </motion.div>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="font-medium"
                  >
                    {label}
                  </motion.span>
                )}
              </Button>
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary glow-effect"
                    style={{ display: isSidebarOpen ? "block" : "none" }}
                  />
                </>
              )}
            </motion.div>
          </Link>
        </TooltipTrigger>
        {!isSidebarOpen && showTooltips && (
          <TooltipContent side="right" className="glass-card text-card-foreground border-none" sideOffset={5}>
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

/** Sidebar Dropdown Navigation */
interface NavDropdownProps {
  label: string
  icon: React.ReactNode
  items: { href: string; label: string }[]
  isSidebarOpen: boolean
  onItemClick?: () => void
  toggleSidebar: () => void
  isActive?: boolean
  showTooltips?: boolean
}

const NavDropdown = ({
  label,
  icon,
  items,
  isSidebarOpen,
  onItemClick,
  toggleSidebar,
  isActive,
  showTooltips = true,
}: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Check if any child route is active
  const hasActiveChild = items.some((item) => pathname === item.href)

  // Open dropdown automatically if a child is active
  useEffect(() => {
    if (hasActiveChild && isSidebarOpen) {
      setIsOpen(true)
    }
  }, [hasActiveChild, isSidebarOpen, pathname])

  const handleClick = () => {
    if (!isSidebarOpen) {
      toggleSidebar()
      // Delay opening the dropdown to allow sidebar to open first
      setTimeout(() => setIsOpen(true), 300)
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="mb-1">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(var(--primary-rgb), 0.15)",
                transition: { duration: 0.2 },
              }}
              className="relative rounded-lg"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 transition-all duration-300 text-foreground rounded-lg hover:text-primary",
                  (isActive || hasActiveChild) && "text-primary font-medium",
                  !isSidebarOpen && "justify-center p-2",
                )}
                onClick={handleClick}
              >
                <motion.div
                  animate={{
                    color: isActive || hasActiveChild ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                  whileHover={{
                    color: "hsl(var(--primary))",
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  {icon}
                </motion.div>
                {isSidebarOpen && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex-1 text-left font-medium"
                    >
                      {label}
                    </motion.span>
                    <motion.div
                      animate={{
                        rotate: isOpen ? 90 : 0,
                        color: isOpen ? "hsl(var(--primary))" : "inherit",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </Button>
              {(isActive || hasActiveChild) && (
                <>
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary glow-effect"
                    style={{ display: isSidebarOpen ? "block" : "none" }}
                  />
                </>
              )}
            </motion.div>
          </TooltipTrigger>
          {!isSidebarOpen && showTooltips && (
            <TooltipContent side="right" className="glass-card text-card-foreground border-none" sideOffset={5}>
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isSidebarOpen && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="ml-8 mt-1 space-y-1 border-l border-primary/20 pl-2"
          >
            {items.map((item) => {
              const isItemActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href} onClick={onItemClick}>
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(var(--primary-rgb), 0.15)",
                      color: "hsl(var(--primary))",
                      transition: { duration: 0.2 },
                    }}
                    className="relative rounded-lg"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start transition-all duration-300 text-sm rounded-lg",
                        isItemActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      {item.label}
                      {isItemActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary glow-effect" />
                      )}
                    </Button>
                    {isItemActive && (
                      <motion.div
                        layoutId="subActiveIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Sidebar Component */
interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname()
  const [showTooltips, setShowTooltips] = useState(!isOpen)

  useEffect(() => {
    if (isOpen) {
      setShowTooltips(false)
    } else {
      // Delay enabling tooltips until after the sidebar animation completes
      const timer = setTimeout(() => setShowTooltips(true), 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const sidebarVariants = {
    open: {
      width: "256px",
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
    closed: {
      width: "70px",
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
  }

  return (
    <motion.aside
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="bg-sidebar h-screen sticky top-0 z-50 shadow-lg transition-all flex flex-col overflow-x-hidden"
    >
      <div className={cn("flex items-center h-16 px-4", isOpen ? "justify-between" : "justify-center")}>
        <AnimatePresence>
          {isOpen && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-bold gradient-text logo-text"
            >
              Admin
            </motion.h2>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="toggle-btn">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={pathname === "/admin"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            isActive={pathname === "/admin/settings"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/users"
            icon={<User className="h-5 w-5" />}
            label="Users"
            isActive={pathname === "/admin/users"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/security"
            icon={<Shield className="h-5 w-5" />}
            label="Security"
            isActive={pathname === "/admin/security"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
        </div>

        <div className="space-y-1">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-semibold text-primary uppercase tracking-wider px-2 py-2"
              >
                Content Management
              </motion.div>
            )}
          </AnimatePresence>

          <NavDropdown
            label="Homepage"
            icon={<Home className="h-5 w-5" />}
            items={[
              { href: "/admin/hero-section", label: "Hero Section" },
              { href: "/admin/features", label: "Features" },
              { href: "/admin/aboutsection", label: "About Section" },
              { href: "/admin/servicesection", label: "Service Section" },
              { href: "/admin/processsection", label: "Work Process Section" },
              { href: "/admin/faqsection", label: "FAQ Section" },
              { href: "/admin/whatwedosection", label: "What We Do Section" },
              { href: "/admin/testimonialsection", label: "Testimonial Section" },
              { href: "/admin/footersection", label: "Footer Section" },
            ]}
            isSidebarOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isActive={
              pathname.includes("/admin/hero-section") ||
              pathname.includes("/admin/features") ||
              pathname.includes("/admin/aboutsection") ||
              pathname.includes("/admin/servicesection") ||
              pathname.includes("/admin/processsection") ||
              pathname.includes("/admin/faqsection") ||
              pathname.includes("/admin/whatwedosection") ||
              pathname.includes("/admin/testimonialsection") ||
              pathname.includes("/admin/footersection")
            }
            showTooltips={showTooltips}
          />
          <NavDropdown
            label="About Page"
            icon={<Building2 className="h-5 w-5" />}
            items={[
              { href: "/admin/aboutpagehero", label: "Hero Section" },
              { href: "/admin/companyabout", label: "Company About" },
              { href: "/admin/leadership", label: "Leadership" },
              { href: "/admin/values", label: "Values Section" },
              { href: "/admin/ourmission", label: "Our Mission" },
              { href: "/admin/aboutcta", label: "CTA about" },
              { href: "/admin/longtestimonial", label: "Testimonials" },
              { href: "/admin/memorial", label: "Memorial" },
            ]}
            isSidebarOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isActive={pathname.includes("/admin/aboutpage")}
            showTooltips={showTooltips}
          />
          <NavDropdown
            label="Service Pages"
            icon={<Briefcase className="h-5 w-5" />}
            items={[
              { href: "/admin/chemicalwaste", label: "Chemical Waste Management" },
              { href: "/admin/allwaste", label: "All Waste Management" },
              { href: "/admin/civil", label: "Civil Contracts" },
              { href: "/admin/laundry", label: "Laundry" },
              { href: "/admin/retail", label: "Retail" },
              { href: "/admin/education", label: "Education" },
              { href: "/admin/foriegn", label: "Language Learning" },
              { href: "/admin/vasthu", label: "Vasthu Consulting" },
              { href: "/admin/marriage", label: "Marriage & Family Consulting" },
              { href: "/admin/drug", label: "Drug Addition Counselling" },
            ]}
            isSidebarOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isActive={
              pathname.includes("/admin/chemical") ||
              pathname.includes("/admin/allwaste") ||
              pathname.includes("/admin/civil") ||
              pathname.includes("/admin/laundry") ||
              pathname.includes("/admin/retail") ||
              pathname.includes("/admin/education") ||
              pathname.includes("/admin/foriegn") ||
              pathname.includes("/admin/vasthu") ||
              pathname.includes("/admin/marriage") ||
              pathname.includes("/admin/drug")
            }
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/contact"
            icon={<PhoneIncoming className="h-5 w-5" />}
            label="Contact"
            isActive={pathname === "/admin/contact"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/career"
            icon={<GraduationCap className="h-5 w-5" />}
            label="Career"
            isActive={pathname === "/admin/career"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
          <NavItem
            href="/admin/newsletter"
            icon={<Mailbox className="h-5 w-5" />}
            label="Newsletter"
            isActive={pathname === "/admin/newsletter"}
            isSidebarOpen={isOpen}
            showTooltips={showTooltips}
          />
        </div>
      </div>
    </motion.aside>
  )
}

/** Header Component */
interface HeaderProps {
  user: any
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="bg-card h-16 px-6 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold gradient-text logo-text">Salsabeel al janoob Imp Exp</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 glow-effect">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
                    alt={user?.email}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-card text-card-foreground border-none w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="dropdown-item-hover">
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="dropdown-item-hover">
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

/** Loading State Component */
const LoadingState = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <div className="h-16 bg-card px-6 flex items-center justify-between shadow-md">
        <Skeleton className="h-8 w-40 bg-muted/20 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full bg-muted/20" />
      </div>
      <div className="flex flex-1">
        <div className="w-64 bg-sidebar p-4">
          <Skeleton className="h-8 w-full mb-6 bg-muted/20 rounded-md" />
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-muted/20 rounded-md" />
              ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/4 bg-muted/20 rounded-md" />
            <Skeleton className="h-32 w-full bg-muted/20 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full bg-muted/20 rounded-lg" />
              <Skeleton className="h-32 w-full bg-muted/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Main Admin Layout Component */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (loading) {
    return <LoadingState />
  }

  if (!user) {
    return null // Prevents rendering anything if the user is not logged in
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}

