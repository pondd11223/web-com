import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  ShieldCheck,
  Zap,
  Wrench,
  Monitor,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Gamepad2,
  X,
  Clock,
  Tag,
  Gift,
  CheckCircle2,
  Flame,
  ArrowRightCircle,
  Search,
  Pause,
  Play,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "../../api";
import { SEOHead } from "../../components/common/SEOHead";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { PageContent, Service, PromotionItem } from "../../types";

// Computer Icon mapping helper (White Background + Black Text)
function renderHighlightIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case "cpu":
      return <Cpu className="w-6 h-6 text-black" />;
    case "shieldcheck":
      return <ShieldCheck className="w-6 h-6 text-black" />;
    case "zap":
      return <Zap className="w-6 h-6 text-black" />;
    case "wrench":
      return <Wrench className="w-6 h-6 text-black" />;
    default:
      return <Monitor className="w-6 h-6 text-black" />;
  }
}

// Continuous Scrolling Product Advertisement List
const promoAds = [
  {
    id: 1,
    title: "NEXUS CyberBeast RTX 4090",
    specs: "i9-14900KS • RTX 4090 • 64GB DDR5 • Custom Loop Water",
    tag: "ลด ฿20,000",
    price: "฿139,000",
    originalPrice: "฿159,000",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    badge: "🔥 สเปกเรือธง",
  },
  {
    id: 2,
    title: "PRO-STUDIO Workstation 8K",
    specs: "Threadripper 7960X • RTX 4080 Super • 128GB ECC",
    tag: "ลด ฿15,000",
    price: "฿115,000",
    originalPrice: "฿130,000",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    badge: "⚡ สำหรับครีเอเตอร์",
  },
  {
    id: 3,
    title: "ULTRA-VIEW 34\" Curved QD-OLED",
    specs: "34 นิ้ว 175Hz • 0.03ms • WQHD 21:9 • HDR True Black",
    tag: "ลด ฿5,000",
    price: "฿29,900",
    originalPrice: "฿34,900",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    badge: "⭐ จอระดับโปร",
  },
  {
    id: 4,
    title: "NEXUS Apex Pro Wireless Keyboard",
    specs: "Full CNC Aluminum • Custom Linear Switches • Hot-Swap",
    tag: "ลด ฿1,000",
    price: "฿4,890",
    originalPrice: "฿5,890",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    badge: "🎁 ยอดนิยม",
  },
  {
    id: 5,
    title: "NEXUS Vortex Air i7 + RTX 4070 Ti",
    specs: "i7-14700KF • RTX 4070 Ti Super • AIO 360mm • 32GB",
    tag: "ลด ฿7,000",
    price: "฿64,900",
    originalPrice: "฿71,900",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    badge: "💥 คุ้มค่าที่สุด",
  },
  {
    id: 6,
    title: "NEXUS Ghost White Mini-ITX",
    specs: "Ryzen 7 7800X3D • RTX 4070 Super White • 32GB DDR5",
    tag: "ลด ฿6,000",
    price: "฿52,900",
    originalPrice: "฿58,900",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    badge: "🤍 มินิมอลขาวล้วน",
  },
  {
    id: 7,
    title: "AERO-LIGHT Wireless Mouse 49g",
    specs: "PAW3395 26K DPI • 4K Polling Rate • Optical Switch",
    tag: "ลด ฿800",
    price: "฿2,990",
    originalPrice: "฿3,790",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    badge: "🎯 แม่นยำสูง",
  },
  {
    id: 8,
    title: "GEN5 HyperSpeed NVMe SSD 2TB",
    specs: "สปีดอ่าน 12,400 MB/s • เขียน 11,800 MB/s • PCIe 5.0",
    tag: "ลด ฿1,200",
    price: "฿7,890",
    originalPrice: "฿9,090",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    badge: "🚀 เร็วที่สุด",
  },
];

export function Home() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>(promoAds as PromotionItem[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advertisement & All Promotions Modal State
  const [showAdModal, setShowAdModal] = useState(false);
  const [showAllPromosModal, setShowAllPromosModal] = useState(false);
  const [promoViewMode, setPromoViewMode] = useState<"slider" | "grid">("slider");
  const [isPaused, setIsPaused] = useState(false);
  const [promoSearchQuery, setPromoSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");

  const promoScrollRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<any>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pageRes, servicesRes, promoRes] = await Promise.all([
        api.getPageContent("home"),
        api.getFeaturedServices(),
        api.getPromotions(),
      ]);

      if (pageRes.success && pageRes.data) {
        setContent(pageRes.data);
      }
      if (servicesRes.success && servicesRes.data) {
        setFeaturedServices(servicesRes.data);
      }
      if (promoRes.success && promoRes.data && promoRes.data.length > 0) {
        setPromotions(promoRes.data);
      }
    } catch (err: any) {
      setError("ไม่สามารถโหลดข้อมูลหน้าแรกได้ในขณะนี้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Show Advertisement popup after 700ms on initial visit if not dismissed
    const hasSeenAd = sessionStorage.getItem("nexus_ad_shown");
    if (!hasSeenAd) {
      const timer = setTimeout(() => {
        setShowAdModal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Countdown timer ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseAd = () => {
    setShowAdModal(false);
    sessionStorage.setItem("nexus_ad_shown", "true");
  };

  // Auto-scroll loop for Promotions slider
  useEffect(() => {
    if (promoViewMode !== "slider") return;
    const container = promoScrollRef.current;
    if (!container) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused && container) {
        container.scrollLeft += 40 * dt;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += halfWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, promoViewMode, promotions]);

  // Handle native mouse wheel horizontal scrolling on the slider
  useEffect(() => {
    const container = promoScrollRef.current;
    if (!container || promoViewMode !== "slider") return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        container.scrollLeft += delta * 1.3;
        setIsPaused(true);

        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          setIsPaused(false);
        }, 2500);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [promoViewMode, promotions]);

  const scrollPromos = (direction: "left" | "right") => {
    const container = promoScrollRef.current;
    if (!container) return;
    const amount = direction === "left" ? -340 : 340;
    container.scrollBy({ left: amount, behavior: "smooth" });
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = promoScrollRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = promoScrollRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Keyboard shortcut for closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAllPromosModal) setShowAllPromosModal(false);
        if (showAdModal) handleCloseAd();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAdModal, showAllPromosModal]);

  if (loading) {
    return <LoadingSpinner text="กำลังเชื่อมต่อระบบและโหลดสเปกคอมพิวเตอร์..." />;
  }

  if (error || !content) {
    return <ErrorState message={error || "ไม่พบข้อมูลเนื้อหา"} onRetry={fetchData} />;
  }

  // Requested Headline: "รวมคอมพิวเตอร์และอุปกรณ์เกมมิ่งสเปกแรง คุ้มค่า มั่นใจในคุณภาพ"
  const heroHeadline = "รวมคอมพิวเตอร์และอุปกรณ์เกมมิ่งสเปกแรง คุ้มค่า มั่นใจในคุณภาพ";

  return (
    <div className="space-y-20 pb-20 bg-white text-zinc-900 selection:bg-black selection:text-white">
      <SEOHead
        title={content.metaTitle || `${heroHeadline} | NEXUS`}
        description={content.metaDescription}
        ogImage={content.ogImageUrl}
      />

      {/* ============================================================== */}
      {/* 1. HERO SECTION (WHITE BACKGROUND + BOLD BLACK TYPOGRAPHY)     */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-gradient-to-b from-zinc-50 via-white to-white overflow-hidden">
        {content.heroImageUrl && (
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img src={content.heroImageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md">
            <Sparkles size={14} className="text-white" />
            <span>High-Performance Custom PC & Gaming Gear Store</span>
          </div>

          {/* Requested Main Headline (from Admin content or default) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight text-black">
            {content.heroTitle || heroHeadline}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg lg:text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed font-light">
            {content.heroSubtitle ||
              "ผู้นำด้านการจัดสเปกคอมพิวเตอร์ประกอบระดับพรีเมียม เวิร์กสเตชันสำหรับครีเอเตอร์ และระบบระบายความร้อนด้วยน้ำ Custom สั่งประกอบตามงบประมาณ ประกันศูนย์ไทย 100%"}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-black hover:bg-zinc-800 text-white transition-all font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{content.heroCtaText || "ปรึกษาจัดสเปกคอม / ส่งข้อความ"}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-zinc-100 text-black border-2 border-zinc-300 hover:border-black transition-all font-bold text-base shadow-sm hover:-translate-y-0.5"
            >
              <Gamepad2 size={18} className="text-black" />
              <span>ดูสเปกและสินค้าทั้งหมด</span>
            </Link>

            {/* Quick Trigger Button for Ad Modal */}
            <button
              type="button"
              onClick={() => setShowAdModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-zinc-100 hover:bg-black hover:text-white text-zinc-900 border border-zinc-300 transition-all font-semibold text-sm cursor-pointer shadow-sm"
            >
              <Flame size={16} />
              <span>เปิดดูโฆษณาดีลพิเศษ</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CONTINUOUS & WHEEL-SCROLLABLE PRODUCT ADVERTISEMENT TICKER  */}
      {/*    (เลื่อนอัตโนมัติ + ใช้ลูกกลิ้งเมาส์เลื่อนได้ + ดูทั้งหมดได้)    */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <span>โฆษณาสินค้าโปรโมชั่นพิเศษ</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">HOT DEALS</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
              {promotions.length} รายการ
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View Mode Toggle: Slider vs Grid */}
            <div className="inline-flex rounded-xl bg-zinc-100 p-0.5 border border-zinc-200">
              <button
                type="button"
                onClick={() => setPromoViewMode("slider")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  promoViewMode === "slider"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-black"
                }`}
                title="โหมดแถบเลื่อนอัตโนมัติ (ใช้ลูกกลิ้งเมาส์เลื่อนได้)"
              >
                <span>สไลเดอร์</span>
              </button>
              <button
                type="button"
                onClick={() => setPromoViewMode("grid")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  promoViewMode === "grid"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-black"
                }`}
                title="โหมดแสดงสินค้าทั้งหมดแบบตาราง"
              >
                <LayoutGrid size={13} />
                <span>ตาราง</span>
              </button>
            </div>

            {/* Slider Navigation Arrows (shown only in slider mode) */}
            {promoViewMode === "slider" && (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-xl border border-zinc-200 hover:border-black bg-white text-zinc-700 hover:text-black transition-colors cursor-pointer"
                  title={isPaused ? "เล่นการเลื่อนต่อ" : "หยุดการเลื่อนชั่วคราว"}
                >
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => scrollPromos("left")}
                  className="p-1.5 rounded-xl border border-zinc-200 hover:border-black bg-white text-zinc-700 hover:text-black transition-colors cursor-pointer"
                  title="เลื่อนไปทางซ้าย"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPromos("right")}
                  className="p-1.5 rounded-xl border border-zinc-200 hover:border-black bg-white text-zinc-700 hover:text-black transition-colors cursor-pointer"
                  title="เลื่อนไปทางขวา"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* View All Promotions Button */}
            <button
              type="button"
              onClick={() => setShowAllPromosModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white font-bold hover:bg-zinc-800 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer ml-1"
            >
              <Flame size={13} className="text-red-400" />
              <span>ดูโปรโมชั่นทั้งหมด</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                {promotions.length}
              </span>
            </button>
          </div>
        </div>

        {/* Scroll hint helper */}
        {promoViewMode === "slider" && (
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <span>💡</span>
              <span className="text-zinc-600 font-semibold">สามารถใช้ลูกกลิ้งเมาส์ (Mouse Wheel) เลื่อนดูซ้าย-ขวาได้อย่างอิสระ</span>
              <span>หรือคลิกปุ่มลูกศรเพื่อเลื่อนดูดีลได้ทันที</span>
            </span>
            <span className="hidden sm:inline text-zinc-400">
              {isPaused ? "⏸ หยุดเลื่อนอยู่" : "▶ เลื่อนอัตโนมัติ"}
            </span>
          </div>
        )}

        {/* View Mode: SLIDER (with mouse-wheel horizontal scrolling) */}
        {promoViewMode === "slider" ? (
          <div className="relative group w-full py-2 bg-zinc-50/70 rounded-3xl border border-zinc-200">
            {/* Subtle edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-50 via-zinc-50/60 to-transparent z-10 pointer-events-none rounded-l-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-50 via-zinc-50/60 to-transparent z-10 pointer-events-none rounded-r-3xl" />

            {/* Left & Right floating click buttons on hover */}
            <button
              type="button"
              onClick={() => scrollPromos("left")}
              aria-label="เลื่อนซ้าย"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-zinc-300 text-black shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollPromos("right")}
              aria-label="เลื่อนขวา"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-zinc-300 text-black shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            {/* Scrollable Container with Mouse Wheel Support */}
            <div
              ref={promoScrollRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => {
                handleMouseUpOrLeave();
                setIsPaused(false);
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth px-4 select-none cursor-grab active:cursor-grabbing"
              style={{ scrollBehavior: "auto" }}
            >
              {[...promotions, ...promotions, ...promotions].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-72 shrink-0 bg-white rounded-2xl border border-zinc-200 hover:border-black p-3.5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group/card"
                >
                  {/* Product Image - reduced by ~20% for elegant proportion */}
                  <div className="relative h-36 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 mb-2.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/90 text-white shadow-sm backdrop-blur-xs">
                      {item.badge}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-sm">
                      {item.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-sm text-black group-hover/card:text-zinc-700 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-light line-clamp-2 leading-relaxed">
                      {item.specs}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2.5 mt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      {item.originalPrice && (
                        <span className="text-[10px] text-zinc-400 line-through block font-medium">
                          {item.originalPrice}
                        </span>
                      )}
                      <span className="text-base font-black text-black">
                        {item.price}
                      </span>
                    </div>

                    <Link
                      to={`/contact?product=${encodeURIComponent(item.title)}`}
                      state={{
                        selectedProduct: {
                          name: item.title,
                          price: item.price,
                          imageUrl: item.image,
                          tag: item.tag,
                          badge: item.badge,
                          description: item.specs,
                        },
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>สั่งจอง</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* View Mode: GRID (All Promotions on page) */
          <div className="bg-zinc-50/70 rounded-3xl border border-zinc-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {promotions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-zinc-200 hover:border-black p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-36 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 mb-2.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/90 text-white shadow-sm backdrop-blur-xs">
                      {item.badge}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-sm">
                      {item.tag}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-bold text-sm text-black group-hover:text-zinc-700 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-light line-clamp-2 leading-relaxed">
                      {item.specs}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      {item.originalPrice && (
                        <span className="text-[10px] text-zinc-400 line-through block font-medium">
                          {item.originalPrice}
                        </span>
                      )}
                      <span className="text-base font-black text-black">
                        {item.price}
                      </span>
                    </div>

                    <Link
                      to={`/contact?product=${encodeURIComponent(item.title)}`}
                      state={{
                        selectedProduct: {
                          name: item.title,
                          price: item.price,
                          imageUrl: item.image,
                          tag: item.tag,
                          badge: item.badge,
                          description: item.specs,
                        },
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>สั่งจองโปรนี้</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. HIGHLIGHTS SECTION (จุดเด่น 4 ข้อ - พื้นขาว ข้อความดำ)       */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            WHY CHOOSE NEXUS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-2">
            มาตรฐานระดับมืออาชีพที่คุณวางใจได้
          </h2>
          <div className="w-12 h-1 bg-black mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.highlights?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 group-hover:bg-black group-hover:text-white flex items-center justify-center mb-5 transition-colors shadow-sm">
                <div className="group-hover:filter group-hover:invert transition-all">
                  {renderHighlightIcon(item.icon)}
                </div>
              </div>
              <h3 className="text-base font-bold text-black mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED COMPUTER BUILDS (สเปกแนะนำ 3 รายการ)                */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              RECOMMENDED BUILDS & GEAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-2">
              สเปกคอมพิวเตอร์และเกมมิ่งเกียร์ไฮไลต์
            </h2>
            <p className="text-sm text-zinc-600 mt-1 font-light">
              คัดเลือกเซ็ตประกอบยอดนิยมและฮาร์ดแวร์ที่คุ้มค่าที่สุดในตลาดขณะนี้
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-black hover:underline transition-all mt-4 md:mt-0"
          >
            <span>ดูรายการสินค้าและสเปกทั้งหมด</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-black shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image - reduced by 20% for elegant proportion */}
              <div className="relative h-52 overflow-hidden bg-zinc-50 border-b border-zinc-100">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.categoryName && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-zinc-900 border border-zinc-200 shadow-sm backdrop-blur-md">
                    {service.categoryName}
                  </span>
                )}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black text-white shadow-md">
                  ★ สเปกแนะนำ
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-black group-hover:text-zinc-700 transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed line-clamp-3 font-light">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">ราคาเริ่มต้น</span>
                    <span className="text-xl font-black text-black">
                      ฿{Number(service.price).toLocaleString("th-TH", { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/contact?serviceId=${service.id}`}
                      state={{
                        selectedProduct: {
                          id: service.id,
                          name: service.name,
                          price: `฿${Number(service.price).toLocaleString("th-TH")}`,
                          imageUrl: service.imageUrl,
                          categoryName: service.categoryName,
                          description: service.description,
                        },
                      }}
                      className="px-3.5 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      ปรึกษาสเปกนี้
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CALL TO ACTION BANNER (พื้นขาว/เทาอ่อน ข้อความดำ คมชัด)        */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-100 border-2 border-zinc-300 text-black p-8 sm:p-12 lg:p-16 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
              BUILD YOUR DREAM SETUP
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-black">
              อยากจัดสเปกคอมให้ตอบโจทย์งบประมาณ หรือสเปกงานเฉพาะทาง?
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-light">
              ทีมงานผู้เชี่ยวชาญของ NEXUS พร้อมให้คำปรึกษาจัดสเปก อัปเกรดชิ้นส่วน
              และคำนวณงบประมาณให้คุณแบบละเอียดโดยไม่มีค่าใช้จ่าย
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black hover:bg-zinc-800 text-white transition-all font-bold text-sm shadow-md hover:shadow-lg"
              >
                <span>ติดต่อจัดสเปกคอมพิวเตอร์</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black transition-colors font-bold text-sm border-2 border-zinc-300"
              >
                <span>สำรวจสเปกทั้งหมด</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FLOATING REOPEN AD BUTTON (BOTTOM-LEFT)                      */}
      {/* ============================================================== */}
      {!showAdModal && (
        <button
          type="button"
          onClick={() => setShowAdModal(true)}
          className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black border-2 border-black hover:bg-black hover:text-white font-bold text-xs shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <Flame size={14} className="text-red-600 group-hover:text-white" />
          <span>โฆษณาโปรโมชันพิเศษ (ลด ฿20,000)</span>
        </button>
      )}

      {/* ============================================================== */}
      {/* 7. ALL PROMOTIONS FULL GALLERY MODAL (ดูโปรโมชั่นทั้งหมด)        */}
      {/* ============================================================== */}
      {showAllPromosModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowAllPromosModal(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-white border-2 border-black rounded-3xl overflow-hidden shadow-2xl animate-pop-in text-black max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                  <Flame size={20} className="text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-black">
                      โปรโมชั่น & Hot Deals ทั้งหมด
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                      {promotions.length} รายการ
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-light">
                    รวมเซ็ตคอมประกอบและอุปกรณ์เกมมิ่งราคาพิเศษ จัดส่งฟรีพร้อมประกันศูนย์ไทยแท้
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllPromosModal(false)}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="ปิดหน้าต่างโปรโมชั่น"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-zinc-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={promoSearchQuery}
                  onChange={(e) => setPromoSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อโปรโมชั่น, สเปก (เช่น RTX 4090, i9, 32GB)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                />
                {promoSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPromoSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Tag Filters */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    selectedTagFilter === "all"
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
                  }`}
                >
                  ทั้งหมด ({promotions.length})
                </button>
                {Array.from(new Set(promotions.map((p) => p.badge || p.tag))).slice(0, 4).map((tagStr) => (
                  <button
                    key={tagStr}
                    type="button"
                    onClick={() => setSelectedTagFilter(tagStr)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      selectedTagFilter === tagStr
                        ? "bg-black text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
                    }`}
                  >
                    {tagStr}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {promotions.filter((item) => {
                const q = promoSearchQuery.toLowerCase();
                const matchesSearch =
                  !q ||
                  item.title.toLowerCase().includes(q) ||
                  item.specs.toLowerCase().includes(q) ||
                  item.badge.toLowerCase().includes(q) ||
                  item.tag.toLowerCase().includes(q);
                const matchesTag =
                  selectedTagFilter === "all" ||
                  item.tag === selectedTagFilter ||
                  item.badge === selectedTagFilter;
                return matchesSearch && matchesTag;
              }).length === 0 ? (
                <div className="py-16 text-center text-zinc-500 space-y-2">
                  <Flame size={32} className="mx-auto text-zinc-300" />
                  <p className="font-bold text-sm text-black">ไม่พบโปรโมชั่นที่ตรงกับคำค้นหา</p>
                  <p className="text-xs text-zinc-400">ลองเปลี่ยนคำค้นหาหรือเลือกดูทั้งหมด</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoSearchQuery("");
                      setSelectedTagFilter("all");
                    }}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-zinc-100 hover:bg-black hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {promotions
                    .filter((item) => {
                      const q = promoSearchQuery.toLowerCase();
                      const matchesSearch =
                        !q ||
                        item.title.toLowerCase().includes(q) ||
                        item.specs.toLowerCase().includes(q) ||
                        item.badge.toLowerCase().includes(q) ||
                        item.tag.toLowerCase().includes(q);
                      const matchesTag =
                        selectedTagFilter === "all" ||
                        item.tag === selectedTagFilter ||
                        item.badge === selectedTagFilter;
                      return matchesSearch && matchesTag;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-zinc-200 hover:border-black p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                      >
                        {/* Image */}
                        <div className="relative h-36 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 mb-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/90 backdrop-blur-md text-white shadow-sm">
                            {item.badge}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/90 backdrop-blur-md text-white shadow-sm">
                            {item.tag}
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2 flex-1">
                          <h4 className="font-bold text-sm text-black group-hover:text-zinc-700 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-light line-clamp-3 leading-relaxed">
                            {item.specs}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3.5 mt-3 border-t border-zinc-100 flex items-center justify-between">
                          <div>
                            {item.originalPrice && (
                              <span className="text-[11px] text-zinc-400 line-through block font-medium">
                                {item.originalPrice}
                              </span>
                            )}
                            <span className="text-lg font-black text-black">
                              {item.price}
                            </span>
                          </div>

                          <Link
                            to={`/contact?product=${encodeURIComponent(item.title)}`}
                            state={{
                              selectedProduct: {
                                name: item.title,
                                price: item.price,
                                imageUrl: item.image,
                                tag: item.tag,
                                badge: item.badge,
                                description: item.specs,
                              },
                            }}
                            onClick={() => setShowAllPromosModal(false)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                          >
                            <span>สั่งจองโปรนี้</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-zinc-50 px-6 py-3.5 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-black" />
                <span>สินค้าทุกเครื่องผ่านการ Stress Test 24 ชั่วโมง พร้อมรับประกันศูนย์ไทย 100%</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAllPromosModal(false)}
                className="px-4 py-1.5 rounded-xl border border-zinc-300 hover:border-black font-semibold text-black bg-white transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. ADVERTISEMENT POPUP MODAL (CLEAN WHITE THEME + BLACK TEXT)  */}
      {/* ============================================================== */}
      {showAdModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseAd}
        >
          <div
            className="relative w-full max-w-2xl bg-white border-2 border-black rounded-3xl overflow-hidden shadow-2xl animate-pop-in text-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-zinc-100 px-6 py-3.5 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-xs font-black tracking-wider uppercase text-black">
                  ข้อเสนอโฆษณาพิเศษจำกัดเวลา (LIMITED TIME AD)
                </span>
              </div>

              {/* Countdown Ticker */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-black bg-white px-3 py-1 rounded-full border border-zinc-300 font-bold">
                <Clock size={12} className="text-black" />
                <span>
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseAd}
                className="p-1.5 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                aria-label="ปิดโฆษณา"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Product Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-100 aspect-[16/9] border border-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80"
                  alt="NEXUS Flagship Custom Build"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-lg">
                    🔥 HOT PROMOTION
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
                      Flagship Monster Specs
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      NEXUS TITAN MONOLITH EDITION
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-300 line-through block">฿169,000</span>
                    <span className="text-xl sm:text-2xl font-black text-white">฿149,000</span>
                  </div>
                </div>
              </div>

              {/* Ad Description */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-light">
                  พบกับคอมพิวเตอร์ประกอบตัวท็อปแห่งปี สำหรับงานหนัก สตรีมเมอร์ และเกมเมอร์ระดับฮาร์ดคอร์ ลดพิเศษ ฿20,000 เฉพาะสั่งจองผ่านโฆษณาหน้านี้เท่านั้น!
                </p>

                {/* Specs List Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">CPU</span>
                    <span className="font-bold text-black">Intel i9-14900KS</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">VGA</span>
                    <span className="font-bold text-black">RTX 4090 24GB</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">RAM</span>
                    <span className="font-bold text-black">64GB DDR5 6000MHz</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">SSD</span>
                    <span className="font-bold text-black">2TB Gen4 NVMe</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Cooling</span>
                    <span className="font-bold text-black">Custom Loop Water</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">PSU</span>
                    <span className="font-bold text-black">1200W Platinum</span>
                  </div>
                </div>

                {/* Free Gifts Banner */}
                <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-300 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shrink-0">
                    <Gift size={20} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-black block">ของแถมพรีเมียมพิเศษสำหรับคุณ:</span>
                    <span className="text-zinc-600">
                      ฟรี! เซ็ตแมคคานิคอลคีย์บอร์ด + เมาส์เกมมิ่งเกียร์ไร้สาย + แผ่นรองเมาส์ XXL (มูลค่า ฿7,900)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to={`/contact?product=${encodeURIComponent("NEXUS TITAN MONOLITH EDITION")}`}
                  state={{
                    selectedProduct: {
                      name: "NEXUS TITAN MONOLITH EDITION",
                      price: "฿149,000",
                      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80",
                      tag: "ลด ฿20,000",
                      badge: "🔥 HOT PROMOTION",
                      description: "i9-14900KS • RTX 4090 24GB • 64GB DDR5 6000MHz • 2TB Gen4 NVMe • Custom Loop Water",
                    },
                  }}
                  onClick={handleCloseAd}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>รับสิทธิ์โปรโมชัน / ปรึกษาสั่งซื้อทันที</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/about"
                  onClick={handleCloseAd}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-black border-2 border-zinc-300 font-bold text-xs sm:text-sm transition-all"
                >
                  <span>ดูสเปกทั้งหมด</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCloseAd}
                  className="w-full sm:w-auto py-3 px-4 text-xs text-zinc-500 hover:text-black transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
