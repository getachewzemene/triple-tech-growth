import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProviderClient from "@/components/ThemeProviderClient";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { AuthModalProvider } from "./providers/AuthModalProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tripletechnologies.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Triple Technologies | Software Development, Digital Marketing & IT Training",
    template: "%s | Triple Technologies",
  },
  description:
    "Triple Technologies offers professional software development, IT training, CCTV installation, and social media management services in Ethiopia. Expert solutions for your digital transformation.",
  keywords: [
    "Triple Technologies",
    "Software development Ethiopia",
    "Mobile app development",
    "IT training",
    "CCTV installation",
    "Digital marketing services",
    "Web development",
    "Social media management",
    "Tech solutions Ethiopia",
  ],
  authors: [{ name: "Getachew Zemene" }],
  creator: "Getachew Zemene",
  publisher: "Triple Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title:
      "Triple Technologies | Software Development, Digital Marketing & IT Training",
    description:
      "Triple Technologies offers professional software development, IT training, CCTV installation, and social media management services in Ethiopia.",
    siteName: "Triple Technologies",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Triple Technologies - Your Tech Solutions Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Triple Technologies | Software Development & Digital Marketing",
    description:
      "Professional tech solutions in Ethiopia. Software development, IT training, CCTV installation, and digital marketing services.",
    site: "@GetachewZemene",
    creator: "@GetachewZemene",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "Business",
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1d4ed8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preload critical images for faster LCP */}
        <link rel="preload" as="image" href="/og-image.jpg" />
        <link rel="preload" as="image" href="/logo.png" />

        {/* theme-color helps browsers paint the address bar on mobile for faster perceived load */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1d4ed8" />

        {/* JSON-LD Organization structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Triple Technologies",
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              sameAs: [
                "https://www.facebook.com/",
                "https://twitter.com/",
                "https://www.instagram.com/",
                "https://www.linkedin.com/"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+251997466952",
                  contactType: "customer service",
                  areaServed: "ET",
                  availableLanguage: ["English", "Amharic"]
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeProviderClient>
          <LanguageProvider>
            <AuthProvider>
                <AuthModalProvider>
              <TooltipProvider>
                  {children}
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
                </AuthModalProvider>
            
            </AuthProvider>
          </LanguageProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
