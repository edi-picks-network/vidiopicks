import { MetadataRoute } from "next";

const BLOG_SLUGS = [
  "best-video-editing-software-2026-comparison",
  "how-ai-is-transforming-video-marketing-in-2026",
  "youtube-vs-vimeo-vs-wistia-vs-streamable-2026",
  "best-screen-recording-software-2026-comprehensive-guide",
  "how-we-tested-video-hosting-platforms-for-startup",
  "animation-tools-for-social-media-creators-2026",
  "ai-video-generation-tools-2026-complete-guide",
  "ai-video-editing-workflows-2026-professional-editors-guide",
  "best-video-compression-tools-2026",
  "ai-video-tools-in-2026",
  "multicam-editing-workflow-guide-2026",
  "video-production-workflow-ai-tools-2026-practical-diary",
  "review-ai-video-generators-2026-pika-runway",
  "best-ai-video-tools-creators-2026-comparison",
  "stock-video-platforms-2026-comparison-guide",
  "best-video-encoding-tools-2026-handbrake-ffmpeg-adobe-davinci",
  "data-driven-video-strategy-analytics-metrics-2026",
  "screen-recording-software-2026-obs-vs-camtasia-vs-screenflow-vs-loom",
  "live-streaming-beginners-guide-2026-equipment-software",
  "video-editing-tips-professional-workflow-2026",
  "open-source-video-editing-2026-shotcut-olive-kdenlive",
  "best-free-video-editing-software-2026-guide",
  "color-grading-beginners-guide-2026-davinci-premiere-fcp",
  "multi-platform-video-workflow-ai-tools-2026-diary",
  "best-ai-video-tools-for-marketing-in-2026",
  "youtube-thumbnail-design-guide-2026-click-through-rate",
  "cloud-video-editing-workflows-2026-remote-post-production",
  "how-to-start-gaming-youtube-channel-tools-setup-2026",
  "video-pre-production-tools-2026-scriptwriting-storyboarding",
  "best-ai-video-generation-tools-2026-comparison",
  "best-free-video-editing-tools-2026-detailed-review",
  "ai-video-captioning-tools-2026-comparison",
  "video-collaboration-review-platforms-2026-frameio-wipster-vimeo",
  "video-marketing-small-business-2026-tools-strategies",
  "podcast-recording-editing-tools-2026-comparison",
  "video-seo-guide-2026-optimize-videos-for-search",
  "best-free-video-editors-2026-comparison",
  "best-screen-recording-software-2026-comparison",
  "handbrake-vs-ffmpeg-vs-shutter-encoder",
  "ai-powered-video-tools-time-savers-2026",
  "h266-vvc-vs-av1-vs-hevc-2026",
  "creating-video-course-2026-camtasia-capcut-screenflow",
] as const;
const TOOL_SLUGS = [
  "adobe-premiere-pro",
    "final-cut-pro",
    "davinci-resolve",
    "capcut",
    "adobe-after-effects",
    "blender",
    "cinema-4d",
    "toon-boom-harmony",
    "obs-studio",
    "camtasia",
    "screenflow",
    "loom",
    "runway-ml",
    "pika-labs",
    "synthesia",
    "heygen",
    "vimeo",
    "wistia",
    "brightcove",
    "youtube-studio",
    "envato-elements",
    "artgrid",
    "storyblocks",
    "pond5",
] as const;

const CATEGORY_SLUGS = [
  "video-editing",
    "motion-graphics-and-animation",
    "screen-recording",
    "ai-video-tools",
    "video-hosting-and-streaming",
    "stock-video-and-assets",
] as const;

export async function GET() {
  const baseUrl = "https://vidiopicks.com";

  const urls: string[] = [];

  urls.push(`<url><loc>${baseUrl}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/disclosure</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);

  for (const slug of CATEGORY_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/category/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  }

  for (const slug of BLOG_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/blog/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  }

  for (const slug of TOOL_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/tools/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
