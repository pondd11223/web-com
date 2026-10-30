import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Cpu,
} from "lucide-react";
import { api } from "../../api";
import { SEOHead } from "../../components/common/SEOHead";
import { LoadingSpinner } from "../../components/common/LoadingSkeleton";
import type { WebsiteSettings, PageContent, ContactFormData } from "../../types";

export function Contact() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [setRes, pageRes] = await Promise.all([
          api.getSettings(),
          api.getPageContent("contact"),
        ]);
        if (isMounted) {
          if (setRes.success && setRes.data) setSettings(setRes.data);
          if (pageRes.success && pageRes.data) setContent(pageRes.data);
        }
      } catch (err) {
        console.error("Failed to load contact data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "กรุณากรอกชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)";
    }
    if (!form.phone.trim() || form.phone.trim().length < 9) {
      errors.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9 หลัก)";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      errors.message = "กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.sendContactMessage(form);
      if (res.success) {
        setSuccessMessage(res.message || "ส่งข้อความติดต่อเรียบร้อยแล้ว ทีมงานวิศวกรจะติดต่อกลับโดยเร็วที่สุด");
        setForm({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
        setFieldErrors({});
      } else {
        setServerError(res.message || "เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง");
        if (res.errors) {
          const apiErrors: Record<string, string> = {};
          res.errors.forEach((e) => {
            apiErrors[e.field] = e.message;
          });
          setFieldErrors(apiErrors);
        }
      }
    } catch (err: any) {
      setServerError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="กำลังเตรียมข้อมูลติดต่อและแผนที่..." />;
  }

  return (
    <div className="space-y-16 pb-24 bg-white text-zinc-900 selection:bg-black selection:text-white">
      <SEOHead
        title={content?.metaTitle || "ติดต่อเรา & ปรึกษาจัดสเปกคอม | NEXUS Custom PC"}
        description={content?.metaDescription}
        ogImage={content?.ogImageUrl}
      />

      {/* Header Banner */}
      <section className="bg-zinc-50 text-zinc-900 py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-white" />
            <span>CONTACT & CUSTOM SPEC INQUIRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            ติดต่อสอบถาม & ปรึกษาจัดสเปกคอมพิวเตอร์
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto font-light leading-relaxed">
            มีโจทย์การใช้งาน งบประมาณที่กำหนด หรือต้องการจัดเซ็ตคอมสำหรับสตูดิโอและแข่งขันอีสปอร์ต
            กรอกแบบฟอร์มด้านล่าง หรือติดต่อผู้เชี่ยวชาญของเราได้ทันที
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-zinc-200">
            <h2 className="text-xl sm:text-2xl font-black text-black mb-2">ส่งข้อความติดต่อทีมงาน NEXUS</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mb-6 font-light">
              กรุณากรอกข้อมูลให้ครบถ้วน ข้อมูลที่มีเครื่องหมายดอกจัน (*) จำเป็นต้องระบุ
            </p>

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-zinc-100 border border-zinc-300 flex items-start gap-3 animate-fadeIn">
                <CheckCircle className="text-black shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-black">ส่งข้อความสำเร็จ!</h4>
                  <p className="text-xs text-zinc-600 mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {serverError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-red-700">ไม่สามารถส่งข้อความได้</h4>
                  <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="เช่น คุณกิตติศักดิ์ เจริญสุข"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-black bg-zinc-50 outline-none transition-all ${
                      fieldErrors.name
                        ? "border-red-500 focus:ring-1 focus:ring-red-500/30"
                        : "border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="เช่น 081-234-5678"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-black bg-zinc-50 outline-none transition-all ${
                      fieldErrors.phone
                        ? "border-red-500 focus:ring-1 focus:ring-red-500/30"
                        : "border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    อีเมล (ไม่บังคับ)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="เช่น contact@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-black bg-zinc-50 outline-none transition-all ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-1 focus:ring-red-500/30"
                        : "border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    หัวข้อเรื่อง
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="เช่น ปรึกษาจัดสเปกคอมสำหรับงานตัดต่อ งบ 60,000"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-sm text-black bg-zinc-50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  รายละเอียดที่ต้องการสอบถาม <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="ระบุงบประมาณ โปรแกรมหรือเกมที่ต้องการใช้งาน หรือชิ้นส่วนที่อยากได้เป็นพิเศษ..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-black bg-zinc-50 outline-none transition-all resize-none ${
                    fieldErrors.message
                      ? "border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>กำลังบันทึกข้อมูล...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>ส่งข้อความปรึกษาจัดสเปก</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details & Embedded Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 space-y-6">
              <h3 className="text-xl font-bold text-black flex items-center gap-2">
                <Cpu size={20} className="text-black" />
                <span>ข้อมูลติดต่อหน้าร้าน</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">ที่ตั้งหน้าร้าน</h5>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5 leading-relaxed font-light">
                      {settings?.address || "101/5 อาคารไอทีคอมเพล็กซ์ พระราม 9 กรุงเทพฯ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">เบอร์โทรศัพท์ติดต่อ</h5>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
                      <a href={`tel:${settings?.phone}`} className="hover:text-black font-medium">
                        {settings?.phone || "02-888-9999"}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">อีเมล</h5>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
                      <a href={`mailto:${settings?.email}`} className="hover:text-black">
                        {settings?.email || "contact@nexuspc.co.th"}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">เวลาเปิดให้บริการ</h5>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5 font-light">
                      {settings?.businessHours || "จันทร์ - เสาร์: 10:00 - 20:00 น."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embedded iframe */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-zinc-200 h-72">
              {settings?.googleMapsUrl ? (
                <iframe
                  title="Google Maps Location"
                  src={settings.googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-500 p-6 text-center">
                  <MapPin size={32} className="text-black mb-2" />
                  <p className="text-sm font-medium">ยังไม่มีลิงก์แผนที่ Google Maps</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
