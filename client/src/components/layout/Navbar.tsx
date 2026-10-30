import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Cpu } from "lucide-react";
import type { WebsiteSettings } from "../../types";

interface NavbarProps {
  settings: WebsiteSettings | null;
}

export function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "หน้าแรก (Home)" },
    { to: "/about", label: "เกี่ยวกับเรา & สินค้าทั้งหมด (PC & Gear)" },
    { to: "/contact", label: "ติดต่อจัดสเปกคอม (Contact)" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || "NEXUS"}
                className="w-11 h-11 rounded-xl object-cover border-2 border-zinc-300 group-hover:border-black transition-colors shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Cpu size={22} className="text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-zinc-950 group-hover:text-black transition-colors flex items-center gap-2">
                <span>{settings?.storeName?.split("&")[0]?.trim() || "NEXUS"}</span>
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              </span>
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                {settings?.storeName?.includes("&")
                  ? settings.storeName.substring(settings.storeName.indexOf("&"))
                  : "Custom PC & Gear"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-full border border-zinc-250 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white font-bold shadow-sm"
                      : "text-zinc-600 hover:text-black hover:bg-zinc-200/70"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-zinc-800 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white font-bold shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
