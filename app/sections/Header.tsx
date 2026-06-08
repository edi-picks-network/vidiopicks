"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Video, Search } from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'All Tools', href: '/' },
  { label: 'Categories', href: '/#categories' },
  { label: "Editor's Picks", href: '/#editors-picks' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center shadow-sm">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] group-hover:text-[#7C3AED] transition-colors">
            VidioPicks
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#7C3AED] rounded-lg hover:bg-[#F5F3FF] transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#475569] hover:text-[#7C3AED] rounded-lg hover:bg-[#F5F3FF] transition-all"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
          <Link
            href="/all-tools"
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:shadow-lg hover:shadow-[#7C3AED]/30 rounded-xl transition-all hover:-translate-y-0.5"
          >
            Explore Tools
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[#475569] hover:text-[#7C3AED]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm"
        >
          <nav className="px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm font-medium text-[#475569] hover:text-[#7C3AED] hover:bg-[#F5F3FF] rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/all-tools"
              className="mt-2 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] rounded-xl text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Tools
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
