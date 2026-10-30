import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Image as ImageIcon,
  ExternalLink,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../../api";
import { LoadingSpinner, ErrorState } from "../../components/common/LoadingSkeleton";
import type { WebsiteSettings } from "../../types";

export function AdminSettings() {
  const [form, setForm] = useState<WebsiteSettings>({
    storeName: "",
    tagline: "",
    logoUrl: "",
    phone: "",
    email: "",
    address: "",
    businessHours: "",
    lineId: "",
    lineUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    googleMapsUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getAdminSettings();
      if (res.success && res.data) {
        setForm({
          storeName: res.data.storeName || "",
          tagline: res.data.tagline || "",
          logoUrl: res.data.logoUrl || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
          businessHours: res.data.businessHours || "",
          lineId: res.data.lineId || "",
          lineUrl: res.data.lineUrl || "",
          facebookUrl: res.data.facebookUrl || "",
          instagramUrl: res.data.instagramUrl || "",
          googleMapsUrl: res.data.googleMapsUrl || "",
        });
      }
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการโหลดข้อมูลการตั้งค่า");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await api.updateAdminSettings(form);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.message || "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPassError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPassError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setPassLoading(true);
    try {
      const res = await api.changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.success) {
        setPassSuccess("เปลี่ยนรหัสผ่านแอดมินสำเร็จเรียบร้อย! สามารถใช้รหัสผ่านใหม่นี้ในการเข้าสู่ระบบครั้งถัดไปได้ทันที");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setTimeout(() => setPassSuccess(null), 5000);
      } else {
        setPassError(res.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้ ตรวจสอบรหัสผ่านปัจจุบันอีกครั้ง");
      }
    } catch (err) {
      setPassError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังโหลดการตั้งค่าเว็บไซต์..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
          ตั้งค่าเว็บไซต์ (Website Settings)
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          ฟอร์มเดียวสำหรับจัดการข้อมูลพื้นฐาน ข้อมูลติดต่อ โซเชียลมีเดีย และแผนที่ Google Maps
        </p>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว! ข้อมูลหน้าบ้านจะได้รับการอัปเดตทันที</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 animate-fadeIn">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Unified Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm">
        {/* Section 1: Brand & Logo */}
        <div className="space-y-5">
          <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Store size={18} className="text-black" />
            <span>ข้อมูลแบรนด์และโลโก้ร้าน</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                ชื่อร้านค้า / องค์กร <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                required
                placeholder="เช่น NEXUS Custom PC & Gaming Gear"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                สโลแกนร้าน (Tagline)
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline || ""}
                onChange={handleChange}
                placeholder="เช่น The Ultimate Custom Gaming PC & Hardware"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              URL รูปภาพโลโก้ร้าน (Logo Image URL)
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="url"
                name="logoUrl"
                value={form.logoUrl || ""}
                onChange={handleChange}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] focus:ring-2 focus:ring-[black]/20 outline-none"
              />
              {form.logoUrl && (
                <div className="w-11 h-11 rounded-full border border-zinc-200 overflow-hidden shrink-0 bg-zinc-50">
                  <img src={form.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="space-y-5">
          <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Phone size={18} className="text-black" />
            <span>ข้อมูลติดต่อและเวลาทำการ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                เบอร์โทรศัพท์ร้าน
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="02-712-9988"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] focus:ring-2 focus:ring-[black]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="contact@nexuspc.co.th"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                ที่อยู่ร้าน / สาขา
              </label>
              <textarea
                name="address"
                rows={3}
                value={form.address || ""}
                onChange={handleChange}
                placeholder="ระบุที่ตั้งสาขา ถนน แขวง เขต จังหวัด..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] focus:ring-2 focus:ring-[black]/20 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                เวลาทำการ
              </label>
              <textarea
                name="businessHours"
                rows={3}
                value={form.businessHours || ""}
                onChange={handleChange}
                placeholder="เช่น จันทร์ - อาทิตย์: 07:30 - 18:00 น."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] focus:ring-2 focus:ring-[black]/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Links & Floating LINE Button */}
        <div className="space-y-5">
          <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Globe size={18} className="text-black" />
            <span>ช่องทางโซเชียลมีเดีย & LINE Button</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                LINE ID (เช่น @nexuspc)
              </label>
              <input
                type="text"
                name="lineId"
                value={form.lineId || ""}
                onChange={handleChange}
                placeholder="@nexuspc"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                LINE URL (สำหรับปุ่ม Floating Line มุมขวาล่าง)
              </label>
              <input
                type="url"
                name="lineUrl"
                value={form.lineUrl || ""}
                onChange={handleChange}
                placeholder="https://line.me/ti/p/~nexuspc"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={form.facebookUrl || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/nexuspc.th"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Instagram Profile URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={form.instagramUrl || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/nexuspc.th"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Google Maps Embed URL */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-black flex items-center gap-2 border-b border-zinc-200 pb-3">
            <MapPin size={18} className="text-black" />
            <span>แผนที่ Google Maps (Embedded iframe URL)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Google Maps Embed URL (ใส่ URL ใน src ของ iframe)
            </label>
            <input
              type="text"
              name="googleMapsUrl"
              value={form.googleMapsUrl || ""}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[black] focus:ring-2 focus:ring-[black]/20 outline-none font-mono text-xs"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              * ไปที่ Google Maps &gt; แชร์ &gt; ฝังแผนที่ &gt; คัดลอก URL ในแอตทริบิวต์ src
            </p>
          </div>

          {form.googleMapsUrl && (
            <div className="rounded-xl overflow-hidden border border-zinc-200 h-48 bg-zinc-50">
              <iframe
                title="Preview Map"
                src={form.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
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
                <span>บันทึกการตั้งค่าทั้งหมด</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Change Password Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <KeyRound size={20} className="text-black" />
              <span>เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Change Admin Password)</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              คุณสามารถกำหนดรหัสผ่านใหม่สำหรับบัญชีแอดมินของคุณเองได้ที่นี่
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs font-semibold text-stone-600 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors w-fit cursor-pointer"
          >
            {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showPasswords ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}</span>
          </button>
        </div>

        {passSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 animate-fadeIn">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              รหัสผ่านปัจจุบัน (Current Password) <span className="text-red-500">*</span>
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              required
              placeholder="รหัสผ่านปัจจุบัน เช่น admin123456"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                รหัสผ่านใหม่ (New Password) <span className="text-red-500">*</span>
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                required
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                ยืนยันรหัสผ่านใหม่ (Confirm Password) <span className="text-red-500">*</span>
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                required
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:from-[#22D3EE] hover:to-[#60A5FA] text-white text-xs font-bold transition-all shadow-md shadow-[#06B6D4]/20 disabled:opacity-50 cursor-pointer"
            >
              {passLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังบันทึกรหัสผ่านใหม่...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>บันทึกรหัสผ่านใหม่ (Save New Password)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
