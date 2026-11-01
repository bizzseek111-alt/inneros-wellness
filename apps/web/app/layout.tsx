import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "InnerOS — A Little More Clarity. A Little More Calm.",
    template: "%s | InnerOS",
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
    "InnerOS",
  ],
  openGraph: {
    title: "InnerOS — A Little More Clarity. A Little More Calm.",
    description:
      "Talk, reflect, and find your next step with an AI companion designed for everyday wellbeing and personal growth.",
    type: "website",
    locale: "en_US",
    siteName: "InnerOS",
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
      <body className="antialiased bg-[#FAF8F4] text-[#263330] selection:bg-[#E8F1EB] selection:text-[#285B55]">
        <div className="fixed inset-0 pointer-events-none sanctuary-glow z-0" />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
