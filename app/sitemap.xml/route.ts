import { MetadataRoute } from "next";

const BLOG_SLUGS = [
  "best-video-editing-software-2026-comparison",
    "best-live-streaming-software-2026-comparison",
    "ai-video-editing-tools-2026",
    "youtube-studio-vs-premiere-pro-vs-davinci-resolve-best-video-editor-for-creators",
    "screen-recording-software-2026-obs-loom-camtasia-screenflow",
    "ai-video-generation-tools-2026-synthesia-heygen-runway-pika",
    "best-live-streaming-software-2026-obs-streamlabs-vmix",
] as const;

const TOOL_SLUGS = [
  "akamai",
    "alibaba-cloud",
    "amazoncloudfront",
    "amazon-rds",
    "amazon-route-53",
    "ansible",
    "aws",
    "azure",
    "azurecdn",
    "azure-dns",
    "bunnynet",
    "chef",
    "civo",
    "cloudflare",
    "cloudflare-registrar",
    "cockpit",
    "contabo",
    "cpanel",
    "datadog",
    "digitalocean",
    "fastly",
    "gcp",
    "godaddy",
    "googlecloudcdn",
    "google-cloud-dns",
    "grafana",
    "greencloudvps",
    "hetzner",
    "ibm-cloud",
    "interserver",
    "ionos",
    "kamatera",
    "keycdn",
    "let's-encrypt",
    "linode",
    "mongodb-atlas",
    "namecheap",
    "neon",
    "new-relic",
    "oracle-cloud",
    "ovhcloud",
    "planetscale",
    "plesk",
    "porkbun",
    "prometheus",
    "pulumi",
    "puppet",
    "railway",
    "salt-project",
    "scaleway",
    "sectigo",
    "ssl.com",
    "stackpath",
    "supabase",
    "tencent-cloud",
    "terraform",
    "upcloud",
    "vultr",
    "webmin",
] as const;

const CATEGORY_SLUGS = [
  "cdn-and-dns",
    "cloud-platforms",
    "domain-and-ssl",
    "monitoring-and-databases",
    "server-management-and-devops",
    "vps-and-dedicated-servers",
] as const;

export async function GET() {
  const baseUrl = "https://vidiopics.com";

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
