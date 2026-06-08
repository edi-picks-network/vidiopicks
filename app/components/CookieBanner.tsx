"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-[1200px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-4 md:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-[#475569] flex-1 leading-relaxed">
          We use cookies to improve your experience and show relevant ads.{" "}
          <a
            href="/privacy"
            className="text-[#7C3AED] hover:underline font-medium"
          >
            Read our Privacy Policy
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:border-[#7C3AED]/30 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:shadow-lg hover:shadow-[#7C3AED]/30 rounded-xl transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
