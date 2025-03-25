import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' https: 'unsafe-inline' 'unsafe-eval'" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Salsabeel Al Janoob ImpExp",
            url: "https://salsabeelaljanoobimpexp.com",
            logo: "https://salsabeelaljanoobimpexp.com/logo.svg",
            sameAs: ["https://facebook.com/yourpage", "https://linkedin.com/company/yourcompany"],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+968-9171-8606",
              contactType: "Customer Service",
              availableLanguage: "English"
            },
            foundingDate: "1975-01-01",
            description: "Specialists in Oman-India trade solutions with 45+ years experience in cross-border logistics",
            keywords: "Oman-India trade, GCC logistics, customs clearance, freight forwarding, export documentation"
          })}
        </script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VS910V1G3D"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VS910V1G3D', {
                'anonymize_ip': true,
                'page_path': window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:text-black focus:z-50">
          Skip to main content
        </a>
        <main role="main" id="main-content" className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  )
}