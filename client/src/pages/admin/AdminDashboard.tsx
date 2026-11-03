import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  ExternalLink,
  Settings,
  FileText,
  Cpu,
  Flame,
  Tag,
  Sparkles,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { DashboardStats, ContactMessage } from "../../types";

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [promotionsCount, setPromotionsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected message for quick modal view
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, promoRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAdminPromotions(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        setError(statsRes.message || "ไม่สามารถโหลดข้อมูลแดชบอร์ดได้");
      }

      if (promoRes.success && promoRes.data) {
        setPromotionsCount(promoRes.data.length);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await api.getAdminMessage(msg.id);
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          unreadMessagesCount: Math.max(0, prev.unreadMessagesCount - 1),
          latestMessages: prev.latestMessages.map((m) =>
            m.id === msg.id ? { ...m, isRead: true } : m
          ),
        };
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดข้อมูลสรุปแดชบอร์ด..." />;
  }

  if (error || !stats) {
    return <ErrorState message={error || "ไม่พบข้อมูล"} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto selection:bg-black selection:text-white">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            แดชบอร์ดภาพรวม (Dashboard)
          </h1>
          <p className="text-sm text-zinc-600 mt-1 font-light">
            ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูลเว็บไซต์ NEXUS Custom PC & Gaming Gear
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/promotions"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Flame size={15} />
            <span>จัดการโปรโมชั่น (Hot Deals)</span>
          </Link>
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-sm"
          >
            <span>จัดการสินค้า/สเปกคอม</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Unread Messages */}
        <Link
          to="/admin/messages"
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              ข้อความยังไม่ได้อ่าน
            </span>
            <p className="text-3xl font-black text-black">{stats.unreadMessagesCount}</p>
            <p className="text-[11px] text-zinc-500">
              {stats.unreadMessagesCount > 0 ? "มีข้อความขอจัดสเปกใหม่" : "อ่านครบทั้งหมดแล้ว"}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              stats.unreadMessagesCount > 0
                ? "bg-red-50 text-red-600 border border-red-200 group-hover:bg-red-600 group-hover:text-white"
                : "bg-zinc-100 text-zinc-700 border border-zinc-200"
            }`}
          >
            <Mail size={22} />
          </div>
        </Link>

        {/* Metric 2: Total Services */}
        <Link
          to="/admin/services"
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              สินค้า & สเปกคอม
            </span>
            <p className="text-3xl font-black text-black">{stats.totalServicesCount}</p>
            <p className="text-[11px] text-zinc-500">รายการคอมประกอบทั้งหมด</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 text-black group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
            <Cpu size={22} />
          </div>
        </Link>

        {/* Metric 3: Promotions & Hot Deals */}
        <Link
          to="/admin/promotions"
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-red-600 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} />
              <span>โปรโมชั่น & ดีลพิเศษ</span>
            </span>
            <p className="text-3xl font-black text-black">{promotionsCount}</p>
            <p className="text-[11px] text-zinc-500">แสดงผลเลื่อนในหน้าแรก</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-colors">
            <Flame size={22} />
          </div>
        </Link>

        {/* Metric 4: Total Categories */}
        <Link
          to="/admin/services"
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-black transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              หมวดหมู่สินค้า
            </span>
            <p className="text-3xl font-black text-black">{stats.totalCategoriesCount}</p>
            <p className="text-[11px] text-zinc-500">หมวดหมู่ที่เปิดใช้งาน</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 text-black group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
            <Layers size={22} />
          </div>
        </Link>
      </div>

      {/* Latest 5 Messages Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">ข้อความติดต่อล่าสุด 5 รายการ</h2>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">คลิกที่รายการเพื่อเปิดดูรายละเอียดฉบับเต็ม</p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1"
          >
            <span>ดูข้อความทั้งหมด</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.latestMessages.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            <Mail size={32} className="mx-auto mb-2 opacity-40" />
            <p>ยังไม่มีข้อความติดต่อเข้ามาในขณะนี้</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[18%]" />
                <col className="w-[30%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead className="bg-zinc-100 text-[11px] font-bold text-zinc-700 uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4">ผู้ติดต่อ</th>
                  <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                  <th className="py-3 px-4">หัวข้อเรื่อง</th>
                  <th className="py-3 px-4 text-right">วันที่ส่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {stats.latestMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`hover:bg-zinc-50 transition-colors cursor-pointer ${
                      !msg.isRead ? "font-bold text-black bg-zinc-50/50" : "text-zinc-700"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {!msg.isRead ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          ยังไม่อ่าน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 whitespace-nowrap">
                          <CheckCircle2 size={12} />
                          อ่านแล้ว
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 truncate font-semibold text-black" title={msg.name}>
                      {msg.name}
                    </td>
                    <td className="py-3.5 px-4 truncate text-xs text-zinc-600 font-mono" title={msg.phone}>
                      {msg.phone}
                    </td>
                    <td className="py-3.5 px-4 truncate text-zinc-800" title={msg.subject || msg.message}>
                      {msg.subject || "ข้อความทั่วไป"}
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/promotions"
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-red-600 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
            <Flame size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-black flex items-center gap-1.5">
              <span>จัดการโปรโมชั่น</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">HOT</span>
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">เพิ่ม/แก้ไขดีลพิเศษและแถบเลื่อนหน้าแรก</p>
          </div>
        </Link>

        <Link
          to="/admin/pages"
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-black transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-black">จัดการเนื้อหา & SEO</h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">แก้ไข Hero, จุดเด่น และ Meta Tags</p>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-black transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-black">ตั้งค่าเว็บไซต์</h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">แก้ไขข้อมูลติดต่อ แผนที่ และ Social</p>
          </div>
        </Link>

        <Link
          to="/"
          target="_blank"
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-black transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
            <ExternalLink size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-black">เปิดดูเว็บไซต์จริง</h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">ตรวจสอบการแสดงผลหน้าบ้าน</p>
          </div>
        </Link>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-black">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <span className="text-xs text-zinc-500">รายละเอียดข้อความติดต่อ</span>
                <h3 className="text-lg font-bold text-black">{selectedMessage.subject || "ข้อความทั่วไป"}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1">
                <p className="text-xs text-zinc-700">
                  <span className="font-semibold text-black">ผู้ส่ง:</span> {selectedMessage.name}
                </p>
                <p className="text-xs text-zinc-700">
                  <span className="font-semibold text-black">เบอร์โทรศัพท์:</span>{" "}
                  <a href={`tel:${selectedMessage.phone}`} className="text-black font-bold underline">
                    {selectedMessage.phone}
                  </a>
                </p>
                {selectedMessage.email && (
                  <p className="text-xs text-zinc-700">
                    <span className="font-semibold text-black">อีเมล:</span> {selectedMessage.email}
                  </p>
                )}
                <p className="text-xs text-zinc-400 pt-1">
                  ส่งเมื่อ: {new Date(selectedMessage.createdAt).toLocaleString("th-TH")}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-black block mb-1">เนื้อหาข้อความ:</span>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-800 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
