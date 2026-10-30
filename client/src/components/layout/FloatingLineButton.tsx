import React, { useState } from "react";
import type { WebsiteSettings } from "../../types";

interface FloatingLineButtonProps {
  settings: WebsiteSettings | null;
}

export function FloatingLineButton({ settings }: FloatingLineButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const lineUrl = settings?.lineUrl || (settings?.lineId ? `https://line.me/ti/p/~${settings.lineId.replace("@", "")}` : "https://line.me");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="hidden sm:block bg-white text-zinc-900 text-xs py-1.5 px-3 rounded-xl shadow-xl border border-zinc-200 animate-fadeIn whitespace-nowrap">
          <span className="font-bold text-black">● LINE:</span>
          <span className="font-medium ml-1 text-zinc-700">ปรึกษาจัดสเปกคอมฟรี</span>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-t border-r border-zinc-200" />
        </div>
      )}

      {/* Button */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ติดต่อเราผ่าน LINE Official"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-black/10 hover:ring-black/20"
      >
        {/* Pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-black opacity-20 group-hover:animate-ping pointer-events-none" />

        {/* LINE Chat Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current drop-shadow-sm transition-transform group-hover:rotate-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 5.82 2 10.53c0 2.92 1.74 5.48 4.4 7.02-.19.7-.69 2.54-.79 2.92-.12.48.17.47.37.34.15-.1 2.37-1.58 3.32-2.23.89.15 1.83.23 2.7.23 5.52 0 10-3.82 10-8.53C22 5.82 17.52 2 12 2zm-4.7 10.82H5.66c-.22 0-.4-.18-.4-.4V8.58c0-.22.18-.4.4-.4h1.64c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4H6.38v1.12h1.16c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4h-1.16v1.12h1.36c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4zm2.84 0h-.72c-.22 0-.4-.18-.4-.4V8.58c0-.22.18-.4.4-.4h.72c.22 0 .4.18.4.4v3.84c0 .22-.18.4-.4.4zm3.95 0h-.68c-.14 0-.27-.07-.34-.19l-1.93-2.67v2.46c0 .22-.18.4-.4.4h-.72c-.22 0-.4-.18-.4-.4V8.58c0-.22.18-.4.4-.4h.68c.14 0 .27.07.34.19l1.93 2.67V8.58c0-.22.18-.4.4-.4h.72c.22 0 .4.18.4.4v3.84c0 .22-.18.4-.4.4zm3.62-2.58h-1.63v1.12h1.63c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4h-2.35c-.22 0-.4-.18-.4-.4V8.58c0-.22.18-.4.4-.4h2.35c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4h-1.63v1.12h1.63c.22 0 .4.18.4.4v.53c0 .22-.18.4-.4.4z" />
        </svg>
      </a>
    </div>
  );
}
