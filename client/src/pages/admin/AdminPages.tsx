import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Search,
  Globe,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { PageContent, HighlightItem } from "../../types";

export function AdminPages() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "contact">("home");
  const [pageData, setPageData] = useState<Record<string, PageContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current page form
  const current = pageData[activeTab] || { pageKey: activeTab };

  const loadAllPages = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getAdminPages();
      if (res.success && res.data) {
        const map: Record<string, PageContent> = {};
        res.data.forEach((p) => {
          map[p.pageKey] = p;
        });
        setPageData(map);
      }
    } catch (err) {
      setErrorMessage("ไม่สามารถโหลดข้อมูลเนื้อหาหน้าเว็บได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllPages();
  }, []);

  const handleFieldChange = (field: keyof PageContent, value: any) => {
    setPageData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        pageKey: activeTab,
        [field]: value,
      },
    }));
    setSaveSuccess(false);
  };

  // Highlights handlers
  const handleHighlightChange = (index: number, field: keyof HighlightItem, val: string) => {
    const list = [...(current.highlights || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: val };
      handleFieldChange("highlights", list);
    }
  };

  const handleAddHighlight = () => {
    const list = [...(current.highlights || [])];
    list.push({ icon: "Cpu", title: "จุดเด่นใหม่", description: "รายละเอียดจุดเด่น..." });
    handleFieldChange("highlights", list);
  };

  const handleRemoveHighlight = (index: number) => {
    const list = [...(current.highlights || [])];
    list.splice(index, 1);
    handleFieldChange("highlights", list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await api.updateAdminPage(activeTab, current);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.message || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดเนื้อหาและข้อมูล SEO..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
          จัดการเนื้อหา & SEO (Pages & SEO)
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          แก้ไขข้อความ Hero, จุดเด่นร้าน, เรื่องราวเกี่ยวกับเรา และการตั้งค่า Basic SEO แยกรายหน้า
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-2">
        <button
          onClick={() => {
            setActiveTab("home");
            setSaveSuccess(false);
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "home"
              ? "border-[black] text-black"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          หน้าแรก (Home Page)
        </button>
        <button
          onClick={() => {
            setActiveTab("about");
            setSaveSuccess(false);
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "about"
              ? "border-[black] text-black"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          เกี่ยวกับเรา (About Page)
        </button>
        <button
          onClick={() => {
            setActiveTab("contact");
            setSaveSuccess(false);
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "contact"
              ? "border-[black] text-black"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          ติดต่อเรา (Contact Page)
        </button>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">
            บันทึกการแก้ไขข้อมูลหน้า {activeTab.toUpperCase()} และ SEO สำเร็จแล้ว!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 animate-fadeIn">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm">
        {/* TAB 1: HOME PAGE CONTENT */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-black border-b border-zinc-200 pb-2">
                1. ข้อความและรูปภาพส่วน Hero (แบนเนอร์ด้านบนสุด)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  หัวข้อหลักของ Hero (Hero Title)
                </label>
                <input
                  type="text"
                  value={current.heroTitle || ""}
                  onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
                  placeholder="เช่น สัมผัสสุนทรียภาพแห่งกาแฟพิเศษ และเบเกอรี่อบสดใหม่"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  ข้อความรอง / คำบรรยาย (Hero Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={current.heroSubtitle || ""}
                  onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
                  placeholder="ข้อความบรรยายสั้นๆ ใต้หัวข้อ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    ข้อความบนปุ่มกด (Hero CTA Button Text)
                  </label>
                  <input
                    type="text"
                    value={current.heroCtaText || ""}
                    onChange={(e) => handleFieldChange("heroCtaText", e.target.value)}
                    placeholder="เช่น ติดต่อสอบถาม / สำรองที่นั่ง"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    URL รูปภาพพื้นหลัง Hero (Hero Background Image URL)
                  </label>
                  <input
                    type="url"
                    value={current.heroImageUrl || ""}
                    onChange={(e) => handleFieldChange("heroImageUrl", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none"
                  />
                </div>
              </div>

              {current.heroImageUrl && (
                <div className="relative h-40 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
                  <img src={current.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 text-white text-[10px]">
                    พรีวิวภาพพื้นหลัง Hero
                  </span>
                </div>
              )}
            </div>

            {/* Highlights Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h3 className="text-base font-bold text-black">
                  2. จุดเด่นประจำร้าน (Key Highlights 3-4 ข้อ)
                </h3>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-stone-200 text-xs font-semibold text-black cursor-pointer"
                >
                  <Plus size={14} />
                  <span>เพิ่มจุดเด่น</span>
                </button>
              </div>

              <div className="space-y-3">
                {current.highlights?.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black">ข้อที่ {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-zinc-500 hover:text-red-500 p-1"
                        title="ลบจุดเด่นนี้"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          ไอคอน (Icon Key)
                        </label>
                        <select
                          value={h.icon}
                          onChange={(e) => handleHighlightChange(idx, "icon", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white"
                        >
                          <option value="Cpu">Cpu (ซีพียู / สเปกแรง)</option>
                          <option value="ShieldCheck">ShieldCheck (ประกันศูนย์ไทย / มั่นใจได้)</option>
                          <option value="Zap">Zap (ประกอบไว / เทสต์ 100%)</option>
                          <option value="Wrench">Wrench (ทีมงานมืออาชีพ / อัปเกรดฟรี)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          หัวข้อจุดเด่น
                        </label>
                        <input
                          type="text"
                          value={h.title}
                          onChange={(e) => handleHighlightChange(idx, "title", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        คำบรรยายจุดเด่น
                      </label>
                      <input
                        type="text"
                        value={h.description}
                        onChange={(e) => handleHighlightChange(idx, "description", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT PAGE CONTENT */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-black border-b border-zinc-200 pb-2">
              เนื้อหาหน้าเกี่ยวกับเรา (About Story & Image)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                เรื่องราวความเป็นมาและปรัชญาของร้าน (About Story)
              </label>
              <textarea
                rows={8}
                value={current.aboutStory || ""}
                onChange={(e) => handleFieldChange("aboutStory", e.target.value)}
                placeholder="พิมพ์ข้อความยาวเกี่ยวกับประวัติ ความมุ่งมั่น และปรัชญาของร้าน..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                URL รูปภาพประกอบหน้า About (About Image URL)
              </label>
              <input
                type="url"
                value={current.aboutImageUrl || ""}
                onChange={(e) => handleFieldChange("aboutImageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none"
              />
            </div>

            {current.aboutImageUrl && (
              <div className="relative h-52 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
                <img src={current.aboutImageUrl} alt="About Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 text-white text-[10px]">
                  พรีวิวรูปภาพหน้า About
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT PAGE */}
        {activeTab === "contact" && (
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-stone-600">
            * ฟอร์มติดต่อและแผนที่ของหน้า Contact ดึงข้อมูลอัตโนมัติจากตาราง Messages และ Website Settings สามารถจัดการ SEO Meta ด้านล่างนี้ได้โดยตรง
          </div>
        )}

        {/* SEO SECTION (FOR ALL PAGES) */}
        <div className="space-y-5 pt-6 border-t border-zinc-200">
          <h3 className="text-base font-bold text-black flex items-center gap-2">
            <Globe size={18} className="text-black" />
            <span>การตั้งค่า Basic SEO รายหน้า ({activeTab.toUpperCase()})</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Page Meta Title (ชื่อที่จะแสดงบนแท็บเบราว์เซอร์และผลการค้นหา Google)
            </label>
            <input
              type="text"
              value={current.metaTitle || ""}
              onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
              placeholder="เช่น NEXUS Custom PC & Gaming Gear | จัดสเปกคอมประกอบแรงสะใจ"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Meta Description (คำอธิบายสั้นๆ สำหรับ Search Engine ไม่เกิน 160 ตัวอักษร)
            </label>
            <textarea
              rows={3}
              value={current.metaDescription || ""}
              onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
              placeholder="คำอธิบายสรุปเนื้อหาหน้านี้ เพื่อดึงดูดผู้ค้นหาใน Google..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Open Graph (OG) Image URL (ภาพตัวอย่างเมื่อแชร์ลิงก์ลง LINE / Facebook)
            </label>
            <input
              type="url"
              value={current.ogImageUrl || ""}
              onChange={(e) => handleFieldChange("ogImageUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] outline-none"
            />
          </div>

          {/* Google Search Snippet Preview */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              ตัวอย่างการแสดงผลบน Google Search (Snippet Preview)
            </span>
            <p className="text-xs text-stone-600 truncate">
              https://nexuspc.co.th/{activeTab === "home" ? "" : activeTab}
            </p>
            <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
              {current.metaTitle || "NEXUS Custom PC & Gaming Gear"}
            </h4>
            <p className="text-xs text-stone-600 line-clamp-2">
              {current.metaDescription || "คำอธิบายเว็บไซต์จะแสดงผลบริเวณนี้เมื่อมีการค้นหาผ่านเครื่องมือค้นหา..."}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-black text-white hover:bg-black text-white text-white text-sm font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังบันทึกข้อมูล...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>บันทึกข้อมูลหน้า {activeTab.toUpperCase()} & SEO</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
