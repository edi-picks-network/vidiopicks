"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an AI video generator and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI video generators use machine learning models to create or edit video content from text prompts, images, or existing footage. Tools like Runway ML, Pika Labs, and Synthesia can generate realistic video clips, animate still images, create AI avatars that speak your script, or transform text into full video presentations. They work by training on massive datasets of video content, learning visual patterns, and generating new frames that match your description. Results range from artistic stylized clips to photorealistic scenes.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a desktop video editor and an online video editor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Desktop editors like DaVinci Resolve, Premiere Pro, and Final Cut Pro run locally on your computer — offering maximum performance, advanced color grading, unlimited timeline complexity, and no file size limits. Online editors like Canva Video, Clipchamp, and Kapwing run in your browser — requiring no installation, enabling team collaboration, and automatically saving to the cloud. Online editors are best for quick edits, social media content, and beginners. Desktop editors are essential for professional production, feature films, and complex multi-layer projects.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the right video editing tool for my content?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consider: (1) Your content type — short-form vertical videos (TikTok/Reels), YouTube long-form, or professional productions. (2) Skill level — beginner-friendly tools like CapCut and iMovie vs professional suites. (3) Platform — mobile editing for on-the-go vs desktop for detailed work. (4) Features needed — green screen, motion tracking, color grading, text animations. (5) Budget — free tools like DaVinci Resolve are powerful but have learning curves; paid tools like Final Cut Pro offer streamlined workflows. Browse VidioPicks for detailed comparisons.",
      },
    },
    {
      "@type": "Question",
      name: "How much do AI video tools typically cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI video tool pricing ranges broadly: text-to-video generators like Runway ML start at $15–$30/month, AI avatar tools like Synthesia at $30–$60/month, AI video enhancement tools (upscaling, frame interpolation) at $10–$50/month. Free tiers usually have watermarks, limited exports, or lower resolution. Professional plans with commercial licenses, 4K export, and longer video durations range from $50–$200/month. Enterprise plans with custom models and API access can exceed $500/month.",
      },
    },
    {
      "@type": "Question",
      name: "What's the best video editing software for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top beginner-friendly video editors include: CapCut (free, great for social media vertical videos), DaVinci Resolve (free, professional-grade with a learning curve), iMovie (free for Mac users, intuitive interface), Canva Video (browser-based, drag-and-drop, excellent for beginners), and Filmora (affordable, template-rich, easy timeline editing). For absolute beginners starting with social media content, CapCut and Canva Video offer the fastest learning curve while still producing quality results.",
      },
    },
    {
      "@type": "Question",
      name: "How can I use AI tools in my video production workflow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI tools can enhance every stage of video production: scriptwriting (ChatGPT, Jasper), text-to-speech voiceovers (ElevenLabs, Murf), automatic captioning (Descript, Rev), video upscaling and enhancement (Topaz Video AI), background removal (Remove.bg Video, Runway), motion tracking and rotoscoping, color grading assistance, and automated editing that finds your best takes. Using AI for repetitive tasks frees up time for creative decisions. A typical workflow might combine 2–3 AI tools alongside your main editing software.",
      },
    },
    {
      "@type": "Question",
      name: "What tools are essential for live streaming and webcasting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Essential live streaming tools include: OBS Studio (free, industry-standard streaming software), Streamlabs (OBS with built-in alerts and overlays), Restream (multi-platform streaming to Twitch, YouTube, Facebook simultaneously), vMix (professional live production with switching, chroma key, and replay), Ecamm Live (Mac-focused with guest invites), and Telestream Wirecast. For hardware, a good webcam or DSLR, quality microphone, and capture card (for console streaming) complete the setup.",
      },
    },
    {
      "@type": "Question",
      name: "How do video collaboration tools help remote editing teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Video collaboration tools like Frame.io, Wipster, and Descript allow teams to review, comment, and approve video projects without downloading huge files. Features include: frame-accurate comments, version comparison, real-time timeline collaboration (Premiere Pro Productions with shared storage), automated proxy generation for smooth playback, and approval workflows. These tools eliminate the back-and-forth of sending video files via email or cloud storage, reducing review cycles from days to hours.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best tools for creating video thumbnails and social media clips?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top thumbnail and clip creation tools: Canva (massive template library, easy text overlays, brand kits), Photoshop for custom designs, Snappa (quick thumbnails with stock photos), and specialized tools like Thumbnail Blaster. For repurposing long videos into short clips, tools like Opus Clip, Repurpose.io, and Veed.io automatically identify highlight moments and format them for TikTok, Reels, and YouTube Shorts. Good thumbnails can increase click-through rates by 30–50%.",
      },
    },
    {
      "@type": "Question",
      name: "How do I ensure my video tools integrate well together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Check for: import/export compatibility (common codecs like H.264, ProRes, DNxHD), plugin ecosystems (After Effects plugins for Premiere, OpenFX for DaVinci), cloud storage integration (Google Drive, Dropbox, Frame.io), and API access for automation. Many modern tools support direct round-tripping — for example, editing audio in Adobe Audition from Premiere Pro, or sending color grades between DaVinci Resolve and Final Cut Pro via XML/EDL. VidioPicks lists integration details for every tool in our directory.",
      },
    },
    {
      "@type": "Question",
      name: "Are free video editing tools good enough for professional content?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely — DaVinci Resolve is used in Hollywood productions and offers professional color grading, Fusion visual effects, and Fairlight audio post-production at no cost. CapCut produces excellent short-form content for social media. However, free tools may lack: team collaboration features, premium templates and effects, advanced motion tracking, cloud backups, priority technical support, and commercial licenses for certain assets. Many professional YouTubers and creators use a combination of free software (DaVinci) with one or two paid specialized tools.",
      },
    },
    {
      "@type": "Question",
      name: "What is the future of video production tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The video production landscape is being transformed by real-time AI video generation, neural rendering for photorealistic CGI, automated editing powered by content-aware algorithms, cloud-based collaborative editing replacing local workflows, and real-time ray tracing for virtual production. Generative AI is making it possible to create studio-quality video from just a script or idea. The global video editing software market is projected to reach $2.5 billion by 2030, with AI-powered features being the primary growth driver.",
      },
    },
  ],
};

const FAQ_ITEMS = FAQ_SCHEMA.mainEntity.map((item) => ({
  question: item.name,
  answer: item.acceptedAnswer.text,
}));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#EC4899] bg-[#162540] px-3 py-1.5 rounded-md mb-4">
            FAQ
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F0F2FE] tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-[#839BBE] text-lg">
            Everything you need to know about video editing, AI video tools, and content creation.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-[#0F1F2D] border border-[#1E3A5F] rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-[#F0F2FE] font-semibold text-sm pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#839BBE] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 text-[#839BBE] text-sm leading-relaxed border-t border-[#1E3A5F] pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
