import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingLineButton } from "./FloatingLineButton";
import { api } from "../../api";
import type { WebsiteSettings } from "../../types";

export function PublicLayout() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        if (res.success && res.data && isMounted) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load settings in layout:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-black selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar settings={settings} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet context={{ settings }} />
      </main>

      {/* Dynamic Footer */}
      <Footer settings={settings} />

      {/* Floating Line Contact Button */}
      <FloatingLineButton settings={settings} />
    </div>
  );
}
