"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Plus } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`no-print fixed top-0 inset-x-0 z-30 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-ink-950/70 border-b border-white/5" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="relative inline-flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-cell-400/60 animate-spinSlow" />
            <span className="absolute inset-[3px] rounded-full border border-bio-400/50 animate-spinSlower" />
            <span className="h-1.5 w-1.5 rounded-full bg-cell-400 animate-pulseSoft" />
          </span>
          <span className="font-display text-lg tracking-tight text-parchment">Genexis</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70 font-body">
          <Link href="/#how-it-works" className="hover:text-parchment transition-colors">How it works</Link>
          <Link href="/#stack" className="hover:text-parchment transition-colors">Under the hood</Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-parchment transition-colors px-2 py-2"
          >
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </Link>
          <Link
            href="/predict"
            className="inline-flex items-center gap-1.5 rounded-full bg-cell-400 text-ink-950 px-3.5 sm:px-4 py-2 text-sm font-semibold hover:bg-cell-300 transition-colors"
          >
            <Plus size={15} className="sm:hidden" />
            <span className="hidden sm:inline">Run a calculation</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
