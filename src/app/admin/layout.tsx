"use client"

import type React from "react"
import "./varial.css"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Home,
  Image,
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
}

const NavItem = ({ href, icon, label, isActive, isSidebarOpen }: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start gap-3 mb-1 transition-colors duration-200 hover:bg-primary/5",
                isActive ? "bg-primary/10 text-primary font-medium" : "",
                !isSidebarOpen && "justify-center p-2"
              )}
            >
              {icon}
              {isSidebarOpen && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {!isSidebarOpen && <TooltipContent side="right">{label}</TooltipContent>}
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
}

const NavDropdown = ({ label, icon, items, isSidebarOpen }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-1">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 transition-colors duration-200 hover:bg-primary/5",
                !isSidebarOpen && "justify-center p-2"
              )}
              onClick={() => isSidebarOpen && setIsOpen(!isOpen)}
            >
              {icon}
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {!isSidebarOpen && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      {isSidebarOpen && isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="w-full justify-start transition-colors duration-200 hover:bg-primary/5">
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/** Sidebar Component */
interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={cn(
        "bg-card h-screen sticky top-0 z-50 border-r shadow-md transition-all duration-300 flex flex-col overflow-x-hidden",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className={cn("flex items-center h-16 border-b px-4", isOpen ? "justify-between" : "justify-center")}>
        {isOpen && <h2 className="text-xl font-semibold">Admin</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={true}
            isSidebarOpen={isOpen}
          />
          <NavItem
            href="/admin/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            isSidebarOpen={isOpen}
          />
          <NavItem href="/admin/users" icon={<User className="h-5 w-5" />} label="Users" isSidebarOpen={isOpen} />
          <NavItem
            href="/admin/security"
            icon={<Shield className="h-5 w-5" />}
            label="Security"
            isSidebarOpen={isOpen}
          />
        </div>

        <div className="space-y-1">
          {isOpen && <div className="text-xs font-semibold text-muted-foreground px-2 py-2">CONTENT MANAGEMENT</div>}
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
          />
          <NavDropdown
            label="About Page"
            icon={<Image className="h-5 w-5" />}
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
          />
          <NavDropdown
            label="Service Pages"
            icon={<Image className="h-5 w-5" />}
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
          />
        </div>
      </div>
    </aside>
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
    <header className="bg-card border-b h-16 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Company Name</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} alt={user?.email} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
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
      <div className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex flex-1">
        <div className="w-64 border-r bg-card p-4">
          <Skeleton className="h-8 w-full mb-6" />
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
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
    <div className="flex bg-background">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
