"use client";
import { Video, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Product: [
    { name: 'Browse Tools', href: '/' },
    { name: 'Categories', href: '/' },
    { name: 'Comparisons', href: '/' },
    { name: 'API Access', href: '/' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
  ],
  Resources: [
    { name: 'Documentation', href: '/' },
    { name: 'Help Center', href: '/contact' },
    { name: 'Community', href: '#' },
    { name: 'Status', href: '#' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Affiliate Disclosure', href: '/disclosure' },
    { name: 'Cookie Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[#E2E8F0] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d946ef] to-[#a21caf] flex items-center justify-center shadow-sm">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0F172A]">VidioPics</span>
            </Link>
            <p className="text-sm text-[#64748B] leading-relaxed mb-6">
              Curated video tools directory by NewtGroup — a Providence-based studio specializing in Voice, AR/VR, and immersive content creation.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:text-[#d946ef] hover:border-[#d946ef]/30 hover:bg-[#FAF5FF] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:text-[#d946ef] hover:border-[#d946ef]/30 hover:bg-[#FAF5FF] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:text-[#d946ef] hover:border-[#d946ef]/30 hover:bg-[#FAF5FF] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#64748B] hover:text-[#d946ef] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#94A3B8]">
            &copy; {new Date().getFullYear()} VidioPics by NewtGroup. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-[#94A3B8] hover:text-[#d946ef] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-[#94A3B8] hover:text-[#d946ef] transition-colors">
              Terms
            </Link>
            <a href="#" className="text-sm text-[#94A3B8] hover:text-[#d946ef] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
