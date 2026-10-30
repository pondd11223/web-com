import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { WebsiteSettings } from "../../types";

interface FooterProps {
  settings: WebsiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 text-zinc-700 pt-16 pb-12 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName || "NEXUS"}
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-300 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-md">
                  <Cpu size={20} className="text-white" />
                </div>
              )}
              <span className="text-xl font-black tracking-tight text-black">
                {settings?.storeName || "NEXUS Custom PC"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              {settings?.tagline ||
                "ผู้เชี่ยวชาญด้านคอมพิวเตอร์ประกอบระดับไฮเอนด์ เวิร์กสเตชันตัดต่อ 8K และเกมมิ่งเกียร์ สั่งประกอบตามงบประมาณ ประกันศูนย์ไทยแท้ 100%"}
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings?.lineUrl && (
                <a
                  href={settings.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LINE Official"
                  className="w-9 h-9 rounded-full bg-white border border-zinc-300 text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                  <span className="text-xs font-bold">LINE</span>
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  className="w-9 h-9 rounded-full bg-white border border-zinc-300 text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                  <span className="text-xs font-bold">fb</span>
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="w-9 h-9 rounded-full bg-white border border-zinc-300 text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-black mb-4">
              หมวดหมู่สินค้า & เมนู
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 font-light">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  หน้าแรก (Home)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-black transition-colors">
                  เกี่ยวกับเรา & ความเชี่ยวชาญ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-black transition-colors">
                  สเปกคอมพิวเตอร์และสินค้าทั้งหมด
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black transition-colors">
                  ปรึกษาจัดสเปก / ส่งข้อความ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-black mb-4">
              ข้อมูลติดต่อหน้าร้าน
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 font-light">
              {settings?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-black shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-black transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-black shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-black transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-black shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Operating Hours & Warranty */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-black mb-4">
              เวลาเปิดบริการ & ประกัน
            </h4>
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-900 font-medium text-xs">
                <Clock size={14} className="text-black" />
                <span className="font-bold">เวลาเปิดทำการ</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 font-medium">
                {settings?.businessHours || "จันทร์ - เสาร์: 10:00 - 20:00 น."}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 pt-1">
                <ShieldCheck size={14} className="text-black" />
                <span>อุปกรณ์ทุกชิ้นประกันศูนย์ไทย 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} {settings?.storeName || "NEXUS Custom PC & Gaming Gear"}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-zinc-600 font-medium">
            <CheckCircle2 size={13} className="text-black" />
            <span>High-Performance Custom Builds • 100% Quality Assurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
