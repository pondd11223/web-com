import React, { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  User,
  RefreshCw,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { ContactMessage } from "../../types";

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected message for details modal
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminMessages();
      if (res.success && res.data) {
        setMessages(res.data);
      } else {
        setError(res.message || "ไม่สามารถโหลดข้อความติดต่อได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // When clicking to view, automatically mark as read
  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);

    if (!msg.isRead) {
      try {
        const res = await api.getAdminMessage(msg.id);
        if (res.success && res.data) {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
          );
        }
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await api.deleteAdminMessage(deleteConfirmId);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== deleteConfirmId));
        if (activeMessage?.id === deleteConfirmId) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดข้อความติดต่อจากลูกค้า..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMessages} />;
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 selection:bg-black selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight flex items-center gap-2.5">
            <span>จัดการข้อความติดต่อ (Messages)</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                ใหม่ {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-zinc-600 mt-1 font-light">
            เรียงลำดับจากใหม่ไปเก่า ข้อความที่ยังไม่อ่านจะแสดงเป็นตัวหนา คลิกแถวเพื่อเปิดอ่านและเปลี่ยนสถานะอัตโนมัติ
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-300 hover:border-black text-xs font-semibold text-zinc-800 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* Messages Table Container */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 text-sm">
            <Mail size={36} className="mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-zinc-700">ยังไม่มีข้อความติดต่อเข้ามา</p>
            <p className="text-xs text-zinc-500 mt-1">
              เมื่อมีผู้ส่งแบบฟอร์มจากหน้า Contact ข้อความจะปรากฏขึ้นที่นี่โดยอัตโนมัติ
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / Laptop / Tablet Table (sm and up) - No Horizontal Scrollbar */}
            <div className="hidden sm:block w-full overflow-hidden">
              <table className="w-full table-fixed text-left text-xs sm:text-sm">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[18%]" />
                  <col className="w-[15%]" />
                  <col className="w-[28%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="bg-zinc-100 text-[11px] font-bold text-zinc-700 uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">สถานะ</th>
                    <th className="py-3 px-3 sm:px-4">ชื่อผู้ติดต่อ</th>
                    <th className="py-3 px-3 sm:px-4">เบอร์โทรศัพท์</th>
                    <th className="py-3 px-3 sm:px-4">หัวข้อข้อความ</th>
                    <th className="py-3 px-3 sm:px-4">วันเวลาที่ส่ง</th>
                    <th className="py-3 px-3 sm:px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {messages.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenMessage(item)}
                      className={`hover:bg-zinc-50 transition-colors cursor-pointer ${
                        !item.isRead
                          ? "font-bold text-black bg-zinc-50/60"
                          : "text-zinc-700 font-normal"
                      }`}
                    >
                      {/* Status */}
                      <td className="py-3 px-3 sm:px-4">
                        {!item.isRead ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                            <span>ใหม่</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 whitespace-nowrap">
                            <CheckCircle2 size={12} className="text-zinc-500 shrink-0" />
                            <span>อ่านแล้ว</span>
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="truncate font-semibold text-black" title={item.name}>
                          {item.name}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="truncate text-xs text-zinc-600 font-mono tracking-tight" title={item.phone}>
                          {item.phone}
                        </div>
                      </td>

                      {/* Subject / Snippet */}
                      <td className="py-3 px-3 sm:px-4">
                        <div
                          className="truncate text-zinc-800"
                          title={item.subject ? `${item.subject} - ${item.message}` : item.message}
                        >
                          <span className={!item.isRead ? "font-bold text-black" : "font-normal text-zinc-800"}>
                            {item.subject || "ข้อความทั่วไป"}
                          </span>
                          {item.message && (
                            <span className="text-zinc-400 font-light text-xs ml-1.5 hidden md:inline">
                              - {item.message}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="text-xs text-zinc-500 leading-tight">
                          <span className="block truncate font-medium">
                            {new Date(item.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </span>
                          <span className="text-[10px] text-zinc-400 block font-mono mt-0.5">
                            {new Date(item.createdAt).toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} น.
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMessage(item);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                            title="เปิดดูรายละเอียดข้อความ"
                          >
                            <Eye size={13} className="shrink-0" />
                            <span className="hidden lg:inline text-[11px]">เปิดดู</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(item.id);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="ลบข้อความ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (< sm) */}
            <div className="block sm:hidden divide-y divide-zinc-200">
              {messages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenMessage(item)}
                  className={`p-4 space-y-3 cursor-pointer hover:bg-zinc-50 transition-colors ${
                    !item.isRead ? "bg-zinc-50/70" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!item.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          ใหม่
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 shrink-0">
                          <CheckCircle2 size={11} />
                          อ่านแล้ว
                        </span>
                      )}
                      <span className="font-bold text-sm text-black truncate">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono shrink-0">
                      {new Date(item.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div>
                    <p className={`text-xs ${!item.isRead ? "font-bold text-black" : "text-zinc-800"} line-clamp-1`}>
                      {item.subject || "ข้อความทั่วไป"}
                    </p>
                    <p className="text-xs text-zinc-500 font-light line-clamp-2 mt-0.5">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-xs">
                    <span className="text-zinc-500 font-mono text-xs">{item.phone}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMessage(item);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold shadow-sm"
                      >
                        <Eye size={13} />
                        <span>เปิดดู</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(item.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Message Reader Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-black">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-xs text-zinc-500">เปิดอ่านข้อความติดต่อ</span>
                <h3 className="text-lg font-bold text-black">{activeMessage.subject || "ข้อความทั่วไป"}</h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User size={15} className="text-black" />
                <span className="font-semibold text-zinc-600">ผู้ส่ง:</span>
                <span className="text-black font-bold">{activeMessage.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-black" />
                <span className="font-semibold text-zinc-600">เบอร์โทร:</span>
                <a href={`tel:${activeMessage.phone}`} className="text-black font-bold underline">
                  {activeMessage.phone}
                </a>
              </div>
              {activeMessage.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-black" />
                  <span className="font-semibold text-zinc-600">อีเมล:</span>
                  <a href={`mailto:${activeMessage.email}`} className="text-black underline font-semibold">
                    {activeMessage.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-zinc-400 pt-1">
                <Clock size={13} />
                <span>ส่งเมื่อ: {new Date(activeMessage.createdAt).toLocaleString("th-TH")}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-black block mb-1.5">
                เนื้อหาข้อความ:
              </span>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {activeMessage.message}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setDeleteConfirmId(activeMessage.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
                <span>ลบข้อความนี้</span>
              </button>

              <button
                onClick={() => setActiveMessage(null)}
                className="px-6 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-300 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-black">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-black">ยืนยันการลบข้อความ</h4>
              <p className="text-xs text-zinc-500 mt-1">
                การลบข้อความนี้จะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
