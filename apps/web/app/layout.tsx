import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InnerOS — Personal Emotional Wellbeing & Life Companion",
  description: "An evidence-informed, consent-governed sanctuary for emotional clarity, mindful reflection, and personal growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-emerald-800/40 selection:text-emerald-100">
        <div className="fixed inset-0 pointer-events-none sanctuary-glow z-0" />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
