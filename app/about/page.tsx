import type { Metadata } from "next";
import Link from "next/link";
import { Microscope, Headphones, Monitor, MapPin, Users, Rocket, Sparkles, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About — VidioPics by NewtGroup",
  description:
    "NewtGroup is Studio #48 — a 7-person team based in Providence, RI specializing in Voice, AR/VR, and immersive experiences. We built VidioPics to curate the best video tools for creators.",
};

const TEAM_VALUES = [
  {
    icon: Microscope,
    title: "Voice-First Research",
    desc: "Our team includes voice interaction specialists who test every tool for speech recognition, voiceover workflows, and audio quality — because great video starts with great sound.",
  },
  {
    icon: Headphones,
    title: "AR/VR Expertise",
    desc: "With deep experience in spatial computing, we evaluate tools through the lens of immersive content creation — from 360° video to mixed reality production pipelines.",
  },
  {
    icon: Monitor,
    title: "Video-Centric Curation",
    desc: "Seven specialists bring diverse perspectives: editing, motion graphics, color grading, streaming, compression, AI-assisted production, and interactive video.",
  },
  {
    icon: HeartHandshake,
    title: "Community Over Hype",
    desc: "We don't accept sponsorships for rankings. Every review is based on hands-on testing, real workflows, and honest feedback from our studio's daily production work.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#d946ef] bg-[#FAF5FF] px-3 py-1.5 rounded-md mb-4">
            About — Studio #48
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6">
            Built by{' '}
            <span className="gradient-text">NewtGroup</span>
          </h1>
          <p className="text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto">
            We&apos;re a 7-person team in Providence, Rhode Island with a shared obsession: 
            making video creation accessible, powerful, and human. VidioPics is our curated 
            guide to the tools that make it happen.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Our Story</h2>
          <div className="space-y-4 text-[#475569] leading-relaxed">
            <p>
              NewtGroup started in a small studio above a coffee shop on Westminster Street in 
              Providence, RI. We were five friends — voice designers, XR developers, and video 
              producers — who kept running into the same problem: finding reliable information 
              about video tools was harder than using the tools themselves.
            </p>
            <p>
              So we built our own solution. VidioPics started as an internal spreadsheet that 
              grew into a full directory. Today, our team of seven covers everything from 
              classic video editing suites to cutting-edge AI video generators, AR/VR capture 
              tools, and voice-driven production software.
            </p>
            <p>
              What makes us different? We test tools the way creators actually use them — 
              under deadline, across operating systems, and in real production pipelines. 
              Our voice and AR/VR specialists ensure coverage of emerging modalities that 
              most review sites ignore.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-6 card-hover shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#FAF5FF] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#d946ef]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{value.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team stats */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Studio #48</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Team Size", value: "7 members" },
              { icon: MapPin, label: "Location", value: "Providence, RI" },
              { icon: Sparkles, label: "Specialty", value: "Voice / AR / VR" },
              { icon: Rocket, label: "Founded", value: "2024" },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="bg-[#FAF5FF] border border-[#E2E8F0] rounded-xl p-5 text-center">
                  <div className="w-10 h-10 rounded-lg bg-white mx-auto mb-3 flex items-center justify-center shadow-sm">
                    <StatIcon className="w-5 h-5 text-[#d946ef]" />
                  </div>
                  <div className="text-xl font-bold text-[#0F172A]">{stat.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-[#FAF5FF] to-[#FDF4FF] border border-[#E2E8F0] rounded-xl p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
            Got a tool we should review?
          </h2>
          <p className="text-[#64748B] mb-6 max-w-lg mx-auto">
            We&apos;re always testing new video, voice, and XR tools. If you&apos;re building 
            something that helps creators, we want to hear about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#d946ef] hover:bg-[#c026d3] text-white font-medium rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@newtgroup.space"
              className="px-6 py-3 border border-[#E2E8F0] hover:border-[#d946ef]/40 text-[#475569] hover:text-[#d946ef] font-medium rounded-lg transition-all"
            >
              hello@newtgroup.space
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
