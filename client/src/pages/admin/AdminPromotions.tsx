import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  X,
  Save,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { PromotionItem } from "../../types";

export function AdminPromotions() {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromotionItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<Partial<PromotionItem>>({
    title: "",
    specs: "",
    tag: "ลด ฿10,000",
    price: "฿0",
    originalPrice: "",
    image: "",
    badge: "🔥 สเปกเรือธง",
    sortOrder: 1,
    isActive: true,
  });

  const loadPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminPromotions();
      if (res.success && res.data) {
        setPromotions(res.data);
      } else {
        setError(res.message || "ไม่สามารถโหลดข้อมูลโปรโมชั่นได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      specs: "",
      tag: "ลด ฿10,000",
      price: "",
      originalPrice: "",
      image: "",
      badge: "🔥 สเปกเรือธง",
      sortOrder: promotions.length + 1,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PromotionItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      specs: item.specs,
      tag: item.tag,
      price: item.price,
      originalPrice: item.originalPrice || "",
      image: item.image,
      badge: item.badge,
      sortOrder: item.sortOrder ?? 1,
      isActive: item.isActive ?? true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title?.trim()) {
      setFormError("กรุณากรอกชื่อโปรโมชั่น/สินค้า");
      return;
    }
    if (!formData.specs?.trim()) {
      setFormError("กรุณากรอกรายละเอียดสเปก");
      return;
    }
    if (!formData.price?.trim()) {
      setFormError("กรุณากรอกราคาโปรโมชั่น");
      return;
    }
    if (!formData.image?.trim()) {
      setFormError("กรุณากรอก URL รูปภาพสินค้า");
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await api.updateAdminPromotion(editingItem.id, formData);
        if (res.success) {
          setSuccessMessage("อัปเดตข้อมูลโปรโมชั่นเรียบร้อยแล้ว");
          setTimeout(() => setSuccessMessage(null), 3500);
          closeModal();
          loadPromotions();
        } else {
          setFormError(res.message || "เกิดข้อผิดพลาดในการอัปเดต");
        }
      } else {
        const res = await api.createAdminPromotion(formData);
        if (res.success) {
          setSuccessMessage("เพิ่มโปรโมชั่นใหม่สำเร็จแล้ว");
          setTimeout(() => setSuccessMessage(null), 3500);
          closeModal();
          loadPromotions();
        } else {
          setFormError(res.message || "เกิดข้อผิดพลาดในการบันทึก");
        }
      }
    } catch (err) {
      setFormError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`คุณต้องการลบโปรโมชั่น "${title}" ใช่หรือไม่?`)) {
      return;
    }

    try {
      const res = await api.deleteAdminPromotion(id);
      if (res.success) {
        setSuccessMessage("ลบโปรโมชั่นเรียบร้อยแล้ว");
        setTimeout(() => setSuccessMessage(null), 3500);
        loadPromotions();
      } else {
        alert(res.message || "ไม่สามารถลบโปรโมชั่นได้");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleToggleActive = async (item: PromotionItem) => {
    try {
      const res = await api.updateAdminPromotion(item.id, { isActive: !item.isActive });
      if (res.success) {
        loadPromotions();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดรายการโปรโมชั่น..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadPromotions} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight flex items-center gap-2.5">
            <Flame className="text-red-600" />
            <span>จัดการโปรโมชั่น (Promotions & Hot Deals)</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            แก้ไข เพิ่ม ลบ รายการโปรโมชั่นที่แสดงผลบนแถบเลื่อนหน้าแรก (Right-scrolling ads) และแบนเนอร์ข้อเสนอพิเศษ
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>เพิ่มโปรโมชั่นใหม่</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Promotions List Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
            รายการโปรโมชั่นทั้งหมด ({promotions.length} รายการ)
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            * แสดงผลเลื่อนไปทางขวาในหน้าหลัก
          </span>
        </div>

        {promotions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag size={40} className="text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-black">ยังไม่มีรายการโปรโมชั่น</h3>
            <p className="text-xs text-zinc-500">คลิกที่ปุ่ม &quot;เพิ่มโปรโมชั่นใหม่&quot; เพื่อสร้างโปรโมชั่นแรกของคุณ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3 px-4">รูปภาพ</th>
                  <th className="py-3 px-4">ชื่อโปรโมชั่น / สเปก</th>
                  <th className="py-3 px-4">ป้าย / ส่วนลด</th>
                  <th className="py-3 px-4">ราคาโปรโมชั่น</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  <th className="py-3 px-4 text-center">ลำดับ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {promotions.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Image */}
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Title & Specs */}
                    <td className="py-3 px-4 max-w-xs">
                      <h4 className="font-bold text-black text-sm">{item.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5 font-light">{item.specs}</p>
                    </td>

                    {/* Badge & Tag */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black text-white">
                          {item.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          {item.tag}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.originalPrice && (
                        <span className="text-[11px] text-zinc-400 line-through block">
                          {item.originalPrice}
                        </span>
                      )}
                      <span className="font-black text-black text-sm">{item.price}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          item.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                        }`}
                      >
                        {item.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.isActive ? "แสดง" : "ซ่อน"}</span>
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td className="py-3 px-4 text-center text-xs font-semibold text-zinc-600">
                      {item.sortOrder ?? "-"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                          title="แก้ไขโปรโมชั่น"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="ลบโปรโมชั่น"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-red-600" />
                <h3 className="text-base font-bold text-black">
                  {editingItem ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่นใหม่"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-full text-zinc-400 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ชื่อโปรโมชั่น / สินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น NEXUS CyberBeast RTX 4090"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none"
                  required
                />
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  รายละเอียดสเปกย่อ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.specs || ""}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="เช่น i9-14900KS • RTX 4090 • 64GB DDR5 • Custom Loop Water"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none resize-none"
                  required
                />
              </div>

              {/* Tag & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    แท็กส่วนลด (Tag) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tag || ""}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="เช่น ลด ฿20,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ป้ายกำกับ (Badge) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="เช่น 🔥 สเปกเรือธง หรือ ⚡ ยอดนิยม"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none"
                    required
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ราคาโปรโมชั่น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="เช่น ฿139,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none font-bold text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ราคาปกติ (ขีดฆ่า)
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="เช่น ฿159,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none text-zinc-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  URL รูปภาพสินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none"
                  required
                />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px]">
                    พรีวิวภาพ
                  </span>
                </div>
              )}

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ลำดับการแสดงผล (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 1}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-black outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-zinc-800 cursor-pointer">
                    เปิดใช้งานโปรโมชั่นนี้
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>บันทึกข้อมูล</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

