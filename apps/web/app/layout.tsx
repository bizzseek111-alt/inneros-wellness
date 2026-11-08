import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaClientRegistrar } from "@/components/pwa/PwaClientRegistrar";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: {
    default: "Weebly — Voice-First Learning, Creativity & Child Development",
    template: "%s | Weebly",
  },
  description:
    "A calm, joyful multilingual learning world where children talk with caring AI companions, explore six interactive learning worlds, and grow with parent and school support in English, Urdu, and Punjabi.",
  keywords: [
    "Weebly learning world",
    "voice-first child education",
    "multilingual kids learning",
    "Urdu Punjabi English education",
    "parent teacher child development",
    "safe AI learning companions",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Weebly",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Weebly — Voice-First Learning, Creativity & Child Development",
    description:
      "A calm, joyful multilingual learning world where children talk, learn, create, and grow—supported by parents and teachers.",
    type: "website",
    locale: "en_US",
    siteName: "Weebly",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-[#FAF7F2] text-[#0F172A] selection:bg-[#EDE9FE] selection:text-[#0F172A]">
        <div className="fixed inset-0 pointer-events-none sanctuary-glow z-0" />
        <div className="relative z-10 min-h-screen flex flex-col">
          <PwaClientRegistrar>{children}</PwaClientRegistrar>
        </div>
      </body>
    </html>
  );
}
