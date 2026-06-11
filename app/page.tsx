"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, ArrowRight, Layers, Camera, Film,
  Grid3X3, List, Clock, Bookmark, ChevronRight, Zap,
  Sparkles, Users, PlayCircle, CheckCircle2, TrendingUp,
  Quote, Video, MonitorPlay, Clapperboard, Tv, PlaySquare
} from "lucide-react";
import Link from "next/link";

import { ALL_TOOLS } from "@/data/tools";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const m = new Map<string, { count: number; avgRating: number }>();
    for (const t of ALL_TOOLS) {
      if (!m.has(t.category)) m.set(t.category, { count: 0, avgRating: 0 });
      const s = m.get(t.category)!;
      s.count++;
      s.avgRating += t.rating;
    }
    return [...m.entries()]
      .map(([name, s]) => ({
        name,
        count: s.count,
        avgRating: Math.round((s.avgRating / s.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const displayTools = useMemo(() => {
    let filtered = [...ALL_TOOLS];
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    return filtered.sort((a: any, b: any) => b.rating - a.rating);
  }, [selectedCategory]);

  const editorPicks = useMemo(
    () => [...ALL_TOOLS].sort((a: any, b: any) => b.rating - a.rating).slice(0, 8),
    []
  );

  const latestPosts = useMemo(
    () => [...BLOG_POSTS]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4),
    []
  );

  const catIcons = [Film, Camera, Layers, Zap, Users, PlayCircle];
  const videoIcons = [MonitorPlay, Clapperboard, Tv, PlaySquare, Film, Video, Camera, PlayCircle];

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Decorative blobs - purple-pink */}
        <div className="hero-glow w-[500px] h-[500px] -top-40 -right-20 bg-[#d946ef]" />
        <div className="hero-glow w-[400px] h-[400px] -bottom-40 -left-20 bg-[#e879f9]" />
        <div className="hero-glow w-[300px] h-[300px] top-20 left-1/2 bg-[#c084fc]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#E2E8F0] shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#d946ef]" />
              <span className="text-sm font-medium text-[#475569]">
                Curated by NewtGroup · Studio #48
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-4">
              Video tools,{' '}
              <span className="gradient-text">
                reviewed by creators
              </span>
            </h1>

            <p className="text-lg text-[#475569] max-w-xl mb-8 leading-relaxed">
              Hand-picked video creation and editing tools, tested by our 7-person studio in Providence.
              Voice, AR/VR, and everything in between.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/all-tools" className="btn-primary">
                Browse All Tools <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/blog" className="btn-outline">
                <Bookmark className="w-4 h-4" /> Read Our Blog
              </Link>
            </div>
          </div>

          {/* Floating stat badges */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 space-y-3">
            <div className="bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#d946ef]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F172A]">{ALL_TOOLS.length}+</div>
                  <div className="text-xs text-[#64748B]">Tools Reviewed</div>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FDF4FF] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#d946ef]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F172A]">{BLOG_POSTS.length}</div>
                  <div className="text-xs text-[#64748B]">Articles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY GRID ==================== */}
      <section className="px-6 py-12" id="categories">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle mt-1">Find exactly what you need</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {categories.slice(0, 6).map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.name
                      ? "bg-[#d946ef] text-white shadow-md"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat, i) => {
              const Icon = catIcons[i % catIcons.length];
              const colors = [
                { bg: "#FAF5FF", icon: "#d946ef", border: "#f0abfc" },
                { bg: "#FDF4FF", icon: "#e879f9", border: "#f5d0fe" },
                { bg: "#F5F3FF", icon: "#c084fc", border: "#d8b4fe" },
                { bg: "#FFF7ED", icon: "#F97316", border: "#FDBA74" },
                { bg: "#F0FDF4", icon: "#10B981", border: "#6EE7B7" },
                { bg: "#FEFCE8", icon: "#EAB308", border: "#FDE68A" },
              ];
              const color = colors[i % 6];
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase().replace(/ /g, "-")}`}
                  className="card group"
                >
                  <div className="p-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: color.icon }} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#d946ef] transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#94A3B8]">{cat.count} tools</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-xs font-medium text-[#475569]">{cat.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== VIDEO GALLERY (Large Cards) ==================== */}
      <section className="px-6 py-12" id="editors-picks">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="section-title">
                {selectedCategory || "Video Gallery"}
              </h2>
              <span className="badge badge-primary">{displayTools.length} tools</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" ? "bg-white text-[#d946ef] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" ? "bg-white text-[#d946ef] shadow-sm" : "text-[#94A3B8] hover:text-[#475569]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            : "space-y-3"}>
            {editorPicks.map((tool, i) => {
              const colors = [
                { bg: "from-[#FAF5FF] to-[#FDF4FF]", border: "border-[#f0abfc]/50", iconBg: "#FAF5FF" },
                { bg: "from-[#FDF4FF] to-[#F5F3FF]", border: "border-[#f5d0fe]/50", iconBg: "#FDF4FF" },
                { bg: "from-[#F5F3FF] to-[#EEF2FF]", border: "border-[#d8b4fe]/50", iconBg: "#F5F3FF" },
                { bg: "from-[#FFF7ED] to-[#FFEDD5]", border: "border-[#FDBA74]/50", iconBg: "#FFF7ED" },
              ];
              const color = colors[i % 4];
              const VideoIcon = videoIcons[i % videoIcons.length];

              return viewMode === "grid" ? (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className={`card group overflow-hidden ${color.border} flex flex-col`}
                >
                  {/* Large video-style card */}
                  <div className={`aspect-[16/10] bg-gradient-to-br ${color.bg} flex items-center justify-center relative`}>
                    {/* Large video icon overlay */}
                    <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-white">
                      <VideoIcon className="w-8 h-8 text-[#d946ef]" />
                    </div>
                    {i < 2 && (
                      <span className="absolute top-3 right-3 badge badge-pink shadow-sm text-[10px]">
                        <Zap className="w-3 h-3" /> Editor&apos;s Pick
                      </span>
                    )}
                    {/* Play button accent */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <PlayCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] text-white font-medium">Review</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#d946ef] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2 flex-1">{tool.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8F0]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-xs font-semibold text-[#0F172A]">{tool.rating}</span>
                        <span className="text-xs text-[#94A3B8]">({tool.reviewCount || 0})</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-medium">
                        {tool.pricing || "$"}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="card flex items-center gap-4 p-4 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center flex-shrink-0`}>
                    <VideoIcon className="w-6 h-6 text-[#d946ef]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#0F172A]">{tool.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#0F172A]">{tool.rating}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#d946ef] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== TOP RATED ==================== */}
      <section className="px-6 py-12 bg-[#FAFAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#d946ef]" />
                Top Rated Tools
              </h2>
              <p className="section-subtitle mt-1">Highest rated by our community</p>
            </div>
            <Link href="/all-tools" className="btn-outline text-xs">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...ALL_TOOLS]
              .sort((a: any, b: any) => b.rating - a.rating)
              .slice(0, 3)
              .map((tool, i) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="card p-5 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#d946ef] text-sm font-bold">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#d946ef] transition-colors truncate">
                        {tool.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-bold text-[#0F172A]">{tool.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{tool.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary text-[10px]">{tool.category}</span>
                    <span className="badge badge-cyan text-[10px]">{tool.pricing || "Free"}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ==================== BLOG ==================== */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#d946ef]" />
                  Latest Insights
                </h2>
                <p className="section-subtitle mt-1">Guides, comparisons & reviews</p>
              </div>
              <Link href="/blog" className="btn-outline text-xs">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {latestPosts.map((post: any, i: number) => (
                <Link
                  key={post.slug || i}
                  href={`/blog/${post.slug}`}
                  className="card p-5 group flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] flex items-center justify-center flex-shrink-0">
                    <Quote className="w-5 h-5 text-[#d946ef]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-primary text-[10px]">{post.category || "Article"}</span>
                      <span className="text-[10px] text-[#94A3B8]">{post.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#d946ef] transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#94A3B8]">
                      <span>By {post.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime || 3} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl p-10 md:p-14 text-center overflow-hidden hero-gradient border border-[#E2E8F0]">
            <div className="hero-glow w-[400px] h-[400px] -top-20 right-0 bg-[#d946ef]" />
            <div className="hero-glow w-[300px] h-[300px] -bottom-20 left-0 bg-[#e879f9]" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white shadow-lg border border-[#E2E8F0] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-[#d946ef]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-3">
                Ready to find your perfect video tools?
              </h2>
              <p className="text-[#475569] mb-8 max-w-lg mx-auto">
                Browse our full collection of {ALL_TOOLS.length} curated video creation and editing tools.
                Tested by NewtGroup&apos;s studio team of 7.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/all-tools" className="btn-primary">
                  Browse All Tools <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/blog" className="btn-outline">
                  <Bookmark className="w-4 h-4" /> Read Our Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL QUOTE ==================== */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5FF] mb-4">
            <Quote className="w-6 h-6 text-[#d946ef]" />
          </div>
          <blockquote className="text-lg md:text-xl text-[#475569] leading-relaxed italic">
            &ldquo;VidioPics saved me hours of research. The team at NewtGroup actually
            tests these tools in real production — not just read the spec sheets.&rdquo;
          </blockquote>
          <div className="mt-4 text-sm font-medium text-[#0F172A]">
            — Maya Rodriguez, Content Director
          </div>
        </div>
      </section>
    </div>
  );
}
