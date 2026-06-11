import type { Metadata } from "next";
import "./globals.css";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import CookieBanner from "./components/CookieBanner";

export const metadata: Metadata = {
  title: "VidioPics — Best Video Creation & Editing Tools",
  description:
    "Compare top video creation, editing, and production tools with verified reviews, pricing breakdowns, and expert comparisons. Find the perfect video software for your content needs. Curated by NewtGroup.",
  keywords: [
    "video tools",
    "video editing",
    "video creation",
    "video software",
    "video editor comparison",
    "content creation tools",
    "video production",
    "editing platforms",
    "NewtGroup",
    "Providence studio",
  ],
  verification: {
    google: "T5bb4mZivi0CfaYYRiKZLSNIWmhvAX6_RVgDEyonTGo",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VidioPics",
    title: "VidioPics — Best Video Creation & Editing Tools",
    description:
      "Compare top video creation and editing tools with verified reviews, pricing breakdowns, and expert comparisons. Curated by NewtGroup.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-[#0F172A]">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
