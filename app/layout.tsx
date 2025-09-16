import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/AuthProvider";

export const metadata = {
  title: "Triple Technologies | Software Dev't, Digital Marketing",
  description: "Triple Technologies offers professional software development, IT training, CCTV installation, and social media management services in Ethiopia.",
  keywords: "Triple Technologies,Software, mobile app, software development Ethiopia, IT training, CCTV installation, digital marketing services Ethiopia",
  robots: "index, follow",
  author: "Getachew Zemene",
  openGraph: {
    title: "Triple Technologies | Software Dev't, Digital Marketing",
    description: "Triple Technologies offers professional software development, IT training, CCTV installation, and social media management services in Ethiopia.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@GetachewZemene",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}