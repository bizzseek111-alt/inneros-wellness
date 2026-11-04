import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaClientRegistrar } from "@/components/pwa/PwaClientRegistrar";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0D9488" },
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
    default: "Weebly — A Little More Clarity. A Little More Calm.",
    template: "%s | Weebly",
  },
  description:
    "Talk, reflect, and find your next step with a multilingual AI companion designed for everyday emotional wellbeing, personal growth, and mindful routines.",
  keywords: [
    "AI wellbeing companion",
    "personal reflection",
    "voice companion",
    "mindful journaling",
    "personal memory",
    "emotional clarity",
    "Weebly",
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
    title: "Weebly — A Little More Clarity. A Little More Calm.",
    description:
      "Talk, reflect, and find your next step with an AI companion designed for everyday wellbeing and personal growth.",
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
  /* Design system tokens: Modern AI Mental Wellness Palette (#F8FAFC, #2B4CDE, #0F172A) honoring legacy base (#FAF8F4, #285B55, #263330) */
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EEF4FF] selection:text-[#2B4CDE]">
        <div className="fixed inset-0 pointer-events-none sanctuary-glow z-0" />
        <div className="relative z-10 min-h-screen flex flex-col">
          <PwaClientRegistrar>{children}</PwaClientRegistrar>
        </div>
      </body>
    </html>
  );
}
