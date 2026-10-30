import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { api } from "../../api";
import { SEOHead } from "../../components/common/SEOHead";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { PageContent, Service, Category } from "../../types";

export function About() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pageRes, catRes, srvRes] = await Promise.all([
        api.getPageContent("about"),
        api.getCategories(),
        api.getServices(),
      ]);

      if (pageRes.success && pageRes.data) {
        setContent(pageRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
      if (srvRes.success && srvRes.data) {
        setServices(srvRes.data);
      }
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลหน้านี้ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleCategoryChange = async (catId: number | "all") => {
    setSelectedCategory(catId);
    setLoadingServices(true);
    try {
      const res = await api.getServices(catId === "all" ? undefined : catId);
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error("Filter error:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const filteredServices = services.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดข้อมูลฮาร์ดแวร์และเรื่องราวของ NEXUS..." />;
  }

  if (error || !content) {
    return <ErrorState message={error || "ไม่พบข้อมูลเนื้อหา"} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-24 pb-24 bg-white text-zinc-900 selection:bg-black selection:text-white">
      <SEOHead
        title={content.metaTitle || "เกี่ยวกับเรา & สินค้าคอมพิวเตอร์ทั้งหมด | NEXUS Custom PC"}
        description={content.metaDescription}
        ogImage={content.ogImageUrl}
      />

      {/* 1. ABOUT STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-xs font-bold tracking-wider uppercase shadow-sm">
              <Sparkles size={14} className="text-white" />
              <span>CRAFTING DIGITAL MASTERY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
              ศิลปะแห่งการประกอบคอมพิวเตอร์ และขุมพลังไร้ขีดจำกัด
            </h1>

            <div className="text-sm sm:text-base text-zinc-600 leading-relaxed space-y-4 whitespace-pre-line font-light">
              {content.aboutStory ||
                "NEXUS ก่อตั้งขึ้นโดยกลุ่มวิศวกรฮาร์ดแวร์และเกมเมอร์ผู้หลงใหลในประสิทธิภาพสูงสุดของคอมพิวเตอร์ เราเชื่อว่าคอมพิวเตอร์ประกอบไม่ได้เป็นเพียงกล่องสี่เหลี่ยมที่มีแผงวงจร แต่คือเครื่องมือขับเคลื่อนความฝัน ความคิดสร้างสรรค์ และชัยชนะในการแข่งขัน\n\nเราคัดสรรเฉพาะอุปกรณ์คุณภาพสูงจากแบรนด์ชั้นนำระดับโลก ไม่ว่าจะเป็น Intel, AMD, NVIDIA, ASUS, Corsair และ Lian Li ทุกเครื่องผ่านการประกอบด้วยความประณีต เก็บสายไฟอย่างสวยงาม และผ่านกระบวนการ Stress Test อย่างเข้มงวด เพื่อให้คุณมั่นใจได้ว่าคอมพิวเตอร์ทุกเครื่องจาก NEXUS จะทำงานได้อย่างเต็มประสิทธิภาพและมีอายุการใช้งานยาวนานที่สุด"}
            </div>

            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-200">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <span className="block text-2xl font-black text-black">100%</span>
                <span className="text-xs text-zinc-500 font-medium">อุปกรณ์แท้ศูนย์ไทย</span>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <span className="block text-2xl font-black text-black">24 Hrs</span>
                <span className="text-xs text-zinc-500 font-medium">Full Stress Test เสถียร</span>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <span className="block text-2xl font-black text-black">Lifetime</span>
                <span className="text-xs text-zinc-500 font-medium">บริการซัพพอร์ตตลอดชีพ</span>
              </div>
            </div>
          </div>

          {/* Story Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-xl border-2 border-zinc-200 bg-zinc-100">
              <img
                src={
                  content.aboutImageUrl ||
                  "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80"
                }
                alt="NEXUS Hardware Lab"
                className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 text-zinc-900 shadow-lg">
                <p className="font-bold text-sm text-black">NEXUS Tech Lab Bangkok</p>
                <p className="text-zinc-600 mt-0.5">ไอทีคอมเพล็กซ์ พระราม 9 • เปิด จันทร์-เสาร์ 10:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES & PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" id="menu">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            EXPLORE OUR PRODUCTS & BUILDS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black mt-2">
            สเปกคอมพิวเตอร์และสินค้าทั้งหมด
          </h2>
          <p className="text-sm text-zinc-600 mt-2 font-light">
            เลือกดูสเปกคอมพิวเตอร์ประกอบ เวิร์กสเตชัน หรืออุปกรณ์เกมมิ่งเกียร์ที่ต้องการ
          </p>
        </div>

        {/* Filter Controls: Search & Category Tabs */}
        <div className="space-y-4 mb-10">
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="ค้นหาสเปกคอมพิวเตอร์ การ์ดจอ ซีพียู หรืออุปกรณ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-zinc-50 border border-zinc-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-xs sm:text-sm text-black transition-all shadow-sm"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-black font-semibold cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-black text-white shadow-md"
                  : "bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 border border-zinc-200"
              }`}
            >
              ทั้งหมด (All Hardware)
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-black text-white shadow-md"
                    : "bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 border border-zinc-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services / Hardware Cards Grid */}
        {loadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-zinc-100 rounded-3xl animate-pulse border border-zinc-200" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-300 max-w-lg mx-auto p-8">
            <Cpu size={40} className="text-zinc-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-black">ไม่พบสินค้าหรือสเปกที่คุณค้นหา</h3>
            <p className="text-xs text-zinc-500 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกดูหมวดหมู่อื่น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-black shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-zinc-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.categoryName && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-md text-zinc-900 border border-zinc-200 shadow-sm">
                      {item.categoryName}
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black text-white shadow-sm">
                      ★ แนะนำ
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-black group-hover:text-zinc-700 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed line-clamp-3 font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">ราคา</span>
                      <p className="text-lg font-black text-black">
                        ฿{Number(item.price).toLocaleString("th-TH", { minimumFractionDigits: 0 })}
                      </p>
                    </div>

                    <Link
                      to="/contact"
                      className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-xs font-bold text-white transition-all shadow-sm hover:scale-105 active:scale-95"
                    >
                      สั่งจอง / ปรึกษา
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
