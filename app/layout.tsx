import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Fonts are loaded at runtime via the <link> tags below (see
// GoogleFontsLink) rather than next/font/google, so the production build
// never depends on reaching fonts.googleapis.com at build time. The CSS
// variables they populate (--font-fraunces etc.) are defined in
// globals.css and referenced from tailwind.config.ts.

export const metadata: Metadata = {
  title: "Genexis — Epigenetic Aging Reversal Predictor",
  description:
    "Estimate your biological age from a photo and clinical biomarkers, see the gap against your chronological age, and get an explainable, prioritized action plan.",
  metadataBase: new URL("https://genexis.example.com"),
  openGraph: {
    title: "Genexis — Epigenetic Aging Reversal Predictor",
    description:
      "Two ages run in parallel. Genexis measures the one that actually predicts your health.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-ink-950 min-h-screen relative">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="fixed inset-0 -z-10 bg-aurora" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
