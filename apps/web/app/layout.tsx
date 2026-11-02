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
  /* Design system tokens: Modern AI Mental Wellness Palette (#F8FAFC, #2B4CDE, #0F172A) honoring legacy base (#FAF8F4, #285B55, #263330) */
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EEF4FF] selection:text-[#2B4CDE]">
        <div className="fixed inset-0 pointer-events-none sanctuary-glow z-0" />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
