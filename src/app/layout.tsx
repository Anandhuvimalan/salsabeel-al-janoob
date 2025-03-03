import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://salsabeelaljanoobimpexp.com'),
  title: {
    default: "Salsabeel Al Janoob ImpExp | Leading Import Export Company in India",
    template: "%s | Salsabeel Al Janoob ImpExp"
  },
  description: "Your trusted partner in global trade. Professional import-export services, logistics solutions, and international trade consultancy in India.",
  keywords: [
    "import export company India",
    "international trade services",
    "global logistics solutions",
    "customs clearance India",
    "freight forwarding services"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://salsabeelaljanoobimpexp.com",
    siteName: "Salsabeel Al Janoob ImpExp",
    images: [{
      url: "/import&export-og.webp",
      width: 1200,
      height: 630,
      alt: "Salsabeel Al Janoob ImpExp - Global Trade Experts",
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Salsabeel Al Janoob ImpExp | International Trade Leaders",
    description: "Connecting Indian businesses to global markets through expert trade solutions",
    images: ["https://salsabeelaljanoobimpexp.com/import&export-og.webp"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "/",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' https: 'unsafe-inline' 'unsafe-eval'" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Salsabeel Al Janoob ImpExp",
            "url": "https://salsabeelaljanoobimpexp.com",
            "logo": "https://salsabeelaljanoobimpexp.com/logo.svg",
            "sameAs": [
              "https://facebook.com/yourpage",
              "https://linkedin.com/company/yourcompany"
            ],
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+91-93494-74746",
              "contactType": "customer service",
              "areaServed": "IN"
            }],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Jwala Complex, Marappalam",
              "addressLocality": "Coimbatore",
              "postalCode": "641105",
              "addressRegion": "Tamil Nadu",
              "addressCountry": "IN"
            },
            "founder": {
              "@type": "Person",
              "name": "Founder Name"
            },
            "foundingDate": "1975-01-01",
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "value": "50"
            }
          })}
        </script>
        
        {/* Preload Critical Assets */}
        <link rel="preload" href="/hero-image.jpg" as="image" type="image/jpeg" />
        {/* <link rel="preload" href={geistSans.url} as="font" type="font/woff2" crossOrigin="anonymous" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXX');
          `}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main role="main" id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}