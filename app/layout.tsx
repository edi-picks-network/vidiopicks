import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import CookieBanner from "./components/CookieBanner";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "VidioPicks — Best Video Creation & Editing Tools",
  description:
    "Compare top video creation, editing, and production tools with verified reviews, pricing breakdowns, and expert comparisons. Find the perfect video software for your content needs. Trusted by creators worldwide.",
  keywords: [
    "video tools",
    "video editing",
    "video creation",
    "video software",
    "video editor comparison",
    "content creation tools",
    "video production",
    "editing platforms",
  ],
  verification: {
    google: "T5bb4mZivi0CfaYYRiKZLSNIWmhvAX6_RVgDEyonTGo",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VidioPicks",
    title: "VidioPicks — Best Video Creation & Editing Tools",
    description:
      "Compare top video creation and editing tools with verified reviews, pricing breakdowns, and expert comparisons.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={`${nunito.className} min-h-screen antialiased`}>
        <div className="aurora-bg" />
        <div className="grid-pattern" />

        <Header />

        <main className="relative z-10">{children}</main>

        <Footer />

        <CookieBanner />
      </body>
    </html>
  );
}
