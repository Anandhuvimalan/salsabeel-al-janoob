import type React from "react"
import type { Metadata } from "next"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://salsabeelaljanoobimpexp.com"),
  title: {
    default: "Salsabeel Al Janoob ImpExp | Your Gateway to International Markets",
    template: "%s | Salsabeel Al Janoob ImpExp",
  },
  description:
    "Leading Oman-India cross-border trade experts offering end-to-end import-export solutions, customs clearance, and logistics management between Gulf countries and South Asia.",
  keywords: [
    // Geo-Specific Keywords
    "Oman India import export company",
    "Muscat to Coimbatore trade services",
    "Gulf-India logistics solutions",
    "Sohar port shipping services",
    "Chennai maritime logistics",
    
    // Service Keywords
    "customs brokerage Oman India",
    "freight forwarding Muscat to Mumbai",
    "FTA benefits Oman India trade",
    "cross-border documentation experts",
    "cold chain logistics Gulf region",

    // Industry Terms
    "international trade consultancy Oman",
    "global shipping solutions India",
    "air sea cargo consolidation",
    "project cargo handling specialists",
    "trade compliance advisory",

    // Product Keywords
    "general cargo services",
    "perishables logistics Oman",
    "construction materials shipping",
    "textile export specialists India",
    "petrochemicals transportation",

    // Long-Tail Keywords
    "best import export company in Oman",
    "how to export from India to GCC",
    "reliable freight forwarders Muscat",
    "customs clearance agents Coimbatore",
    "Oman India trade agreement experts"
  ],
  authors: [{ name: "Salsabeel Al Janoob ImpExp" }],
  creator: "Salsabeel Al Janoob ImpExp",
  publisher: "Salsabeel Al Janoob ImpExp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com",
    siteName: "Salsabeel Al Janoob ImpExp",
    title: "Oman-India Trade Solutions | Salsabeel Al Janoob ImpExp",
    description: "Your trusted partner for cross-border trade between Oman and India - Customs clearance, logistics management, and export-import consultancy",
    images: [
      {
        url: "/oman-india-trade-og.webp",
        width: 1200,
        height: 630,
        alt: "Oman-India Trade Bridge - Salsabeel Al Janoob ImpExp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oman-India Trade Experts | Salsabeel Al Janoob ImpExp",
    description: "Streamlining cross-border commerce between Gulf countries and South Asia",
    images: ["/oman-india-trade-twitter.webp"],
    creator: "@salsabeelaljanoob",
    site: "@salsabeelaljanoob",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      'en': 'https://salsabeelaljanoobimpexp.com',
      'ar': 'https://salsabeelaljanoobimpexp.com/ar',
    },
  },
  category: "International Trade",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
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
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+968-XXXX-XXXX",
                contactType: "Oman Office",
                areaServed: ["OM", "IN"],
                availableLanguage: ["English", "Arabic", "Hindi"]
              },
              {
                "@type": "ContactPoint",
                telephone: "+91-93494-74746",
                contactType: "India Office",
                areaServed: ["IN", "AE"],
                availableLanguage: ["English", "Tamil", "Malayalam"]
              }
            ],
            address: [
              {
                "@type": "PostalAddress",
                streetAddress: "Al Khuwair Office",
                addressLocality: "Muscat",
                addressCountry: "OM",
                description: "Oman Headquarters"
              },
              {
                "@type": "PostalAddress",
                streetAddress: "Jwala Complex, Marappalam",
                addressLocality: "Coimbatore",
                addressCountry: "IN",
                description: "India Operations Center"
              }
            ],
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