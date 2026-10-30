import React, { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { Service, Category } from "../../types";

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Category Manager Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);

  const fetchServices = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.getAdminServices({
        search,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        page,
        limit: 10,
      });

      if (res.success && res.data) {
        setServices(res.data.items);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getAdminCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices(1);
  }, [search, selectedCategory]);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Open Create Service Modal
  const handleOpenCreateService = () => {
    setEditingService({
      name: "",
      categoryId: categories[0]?.id || 1,
      description: "",
      price: "",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    });
    setIsServiceModalOpen(true);
  };

  // Open Edit Service Modal
  const handleOpenEditService = (item: Service) => {
    setEditingService({ ...item });
    setIsServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      if (editingService.id) {
        const res = await api.updateAdminService(editingService.id, editingService);
        if (res.success) {
          showNotification("success", "แก้ไขสินค้า/บริการเรียบร้อยแล้ว");
        } else {
          showNotification("error", res.message || "เกิดข้อผิดพลาดในการแก้ไข");
          return;
        }
      } else {
        const res = await api.createAdminService(editingService);
        if (res.success) {
          showNotification("success", "เพิ่มสินค้า/บริการใหม่สำเร็จ");
        } else {
          showNotification("error", res.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
          return;
        }
      }
      setIsServiceModalOpen(false);
      fetchServices(pagination.page);
    } catch (err) {
      showNotification("error", "ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  // Delete Service
  const handleDeleteService = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await api.deleteAdminService(deleteConfirmId);
      if (res.success) {
        showNotification("success", "ลบสินค้า/บริการเรียบร้อยแล้ว");
        fetchServices(pagination.page);
      } else {
        showNotification("error", res.message || "ไม่สามารถลบสินค้าได้");
      }
    } catch (err) {
      showNotification("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategoryDeleteError(null);

    try {
      if (editingCategory.id) {
        const res = await api.updateAdminCategory(editingCategory.id, editingCategory);
        if (res.success) {
          fetchCategories();
          setEditingCategory(null);
        } else {
          setCategoryDeleteError(res.message || "ไม่สามารถแก้ไขหมวดหมู่ได้");
        }
      } else {
        const res = await api.createAdminCategory({
          name: editingCategory.name || "",
          slug: editingCategory.slug || "",
          description: editingCategory.description || "",
          sortOrder: editingCategory.sortOrder || 0,
        });
        if (res.success) {
          fetchCategories();
          setEditingCategory(null);
        } else {
          setCategoryDeleteError(res.message || "ไม่สามารถเพิ่มหมวดหมู่ได้");
        }
      }
    } catch (err) {
      setCategoryDeleteError("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setCategoryDeleteError(null);
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?")) return;

    try {
      const res = await api.deleteAdminCategory(id);
      if (res.success) {
        fetchCategories();
      } else {
        // Spec rule: "ห้ามลบหมวดหมู่ที่มีสินค้าผูกอยู่"
        setCategoryDeleteError(res.message || "ไม่สามารถลบหมวดหมู่ที่มีสินค้าผูกอยู่ได้");
      }
    } catch (err) {
      setCategoryDeleteError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            จัดการสินค้า/บริการ (Products & Services)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            เพิ่ม แก้ไข ลบ จัดการการแสดงผลหน้าแรก และหมวดหมู่สินค้า
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCategoryDeleteError(null);
              setIsCategoryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Layers size={16} className="text-black" />
            <span>จัดการหมวดหมู่ ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreateService}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-black text-white text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>เพิ่มสินค้า/บริการใหม่</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="ค้นหาตามชื่อสินค้า/บริการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black]"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-zinc-500 whitespace-nowrap">หมวดหมู่:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white outline-none focus:border-[black]"
          >
            <option value="all">ทั้งหมด (All Categories)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner text="กำลังโหลดรายการสินค้า..." />
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            <Cpu size={32} className="mx-auto mb-2 opacity-40 text-black" />
            <p>ไม่พบรายการสินค้าที่ค้นหา</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">รูปภาพ</th>
                  <th className="py-3 px-4">ชื่อสินค้า/บริการ</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">ราคา (฿)</th>
                  <th className="py-3 px-4 text-center">แสดงหน้าแรก</th>
                  <th className="py-3 px-4 text-center">สถานะแสดงผล</th>
                  <th className="py-3 px-4 text-center">ลำดับ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-black line-clamp-1">{item.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-50 text-zinc-800">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-black">
                      ฿{Number(item.price).toLocaleString("th-TH", { minimumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {item.isFeatured ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          ⭐ หน้าแรก
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {item.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-50 text-zinc-500">
                          ปิดใช้งาน
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-zinc-500 font-mono">
                      {item.sortOrder}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEditService(item)}
                        className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-lg cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar (10 per page as required) */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div>
            แสดง {services.length} จากทั้งหมด {pagination.total} รายการ (หน้า {pagination.page} จาก{" "}
            {pagination.totalPages})
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchServices(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 font-semibold">{pagination.page}</span>
            <button
              onClick={() => fetchServices(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT SERVICE MODAL */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-lg font-bold text-black">
                {editingService.id ? "แก้ไขสินค้า/บริการ" : "เพิ่มสินค้า/บริการใหม่"}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-800 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    ชื่อสินค้า/บริการ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name || ""}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    placeholder="เช่น Geisha Panama Single Origin"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    หมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingService.categoryId}
                    onChange={(e) =>
                      setEditingService({ ...editingService, categoryId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  รายละเอียดสินค้า/บริการ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="รสชาติ โน้ตกาแฟ หรือส่วนผสม..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    ราคา (บาท) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editingService.price || ""}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    placeholder="150"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    ลำดับการแสดงผล (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={editingService.sortOrder || 0}
                    onChange={(e) =>
                      setEditingService({ ...editingService, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  URL รูปภาพสินค้า <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={editingService.imageUrl || ""}
                    onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[black]"
                  />
                  {editingService.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50">
                      <img src={editingService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={editingService.isFeatured || false}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isFeatured: e.target.checked })
                    }
                    className="rounded text-black focus:ring-[black]"
                  />
                  <span className="text-xs font-semibold text-black">⭐ แสดงหน้าแรก (Featured)</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={editingService.isActive !== false}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isActive: e.target.checked })
                    }
                    className="rounded text-black focus:ring-[black]"
                  />
                  <span className="text-xs font-semibold text-black">เปิดการแสดงผล (Active)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-stone-600 hover:bg-zinc-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-black text-white hover:bg-black text-white text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-black">ยืนยันการลบสินค้า/บริการ</h4>
              <p className="text-xs text-zinc-500 mt-1">
                การลบรายการนี้จะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-stone-600 hover:bg-zinc-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteService}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGER MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-black" />
                <h3 className="text-lg font-bold text-black">จัดการหมวดหมู่สินค้า/บริการ</h3>
              </div>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="p-1.5 text-zinc-500 hover:text-zinc-800 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {categoryDeleteError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{categoryDeleteError}</span>
              </div>
            )}

            {/* Category Form */}
            <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800 uppercase">
                {editingCategory?.id ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="ชื่อหมวดหมู่ (เช่น Custom Gaming PC)"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...(editingCategory || {}), name: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white outline-none focus:border-[#06B6D4]"
                />
                <input
                  type="text"
                  required
                  placeholder="Slug (เช่น custom-gaming-pc)"
                  value={editingCategory?.slug || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...(editingCategory || {}), slug: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white outline-none focus:border-[#06B6D4]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="คำอธิบายหมวดหมู่สั้นๆ..."
                  value={editingCategory?.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...(editingCategory || {}), description: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white outline-none focus:border-[black]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white text-white hover:bg-black text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                >
                  {editingCategory?.id ? "อัปเดต" : "เพิ่มหมวด"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:bg-stone-200 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>

            {/* Category List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase">หมวดหมู่ที่มีอยู่:</span>
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                {categories.map((c) => (
                  <div key={c.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-zinc-50">
                    <div>
                      <p className="font-bold text-black">{c.name}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        slug: {c.slug} • จำนวนสินค้า: {c.servicesCount || 0} รายการ
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCategory({ ...c })}
                        className="p-1.5 text-zinc-500 hover:text-stone-800 rounded-lg hover:bg-zinc-50 cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="ลบหมวดหมู่ (ห้ามมีสินค้าผูกอยู่)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
