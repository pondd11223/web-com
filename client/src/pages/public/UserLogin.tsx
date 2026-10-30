import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import { SEOHead } from "../../components/common/SEOHead";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface UnifiedLoginProps {
  defaultRole?: "admin" | "customer";
}

export function UserLogin({ defaultRole }: UnifiedLoginProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { admin, login: adminLogin } = useAdminAuth();

  // If defaultRole is provided, use it. Otherwise, default strictly to "customer"
  const isExplicitAdmin = defaultRole === "admin" || searchParams.get("role") === "admin";
  const [activeRole] = useState<"admin" | "customer">(isExplicitAdmin ? "admin" : "customer");

  // Auto redirect if already logged in as admin and role is admin
  useEffect(() => {
    if (admin && (defaultRole === "admin" || activeRole === "admin")) {
      navigate("/admin", { replace: true });
    }
  }, [admin, defaultRole, activeRole, navigate]);

  // Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Customer form state
  const [isRegister, setIsRegister] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerConfirmPassword, setCustomerConfirmPassword] = useState("");
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSuccess, setCustomerSuccess] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Quick fill Demo Customer
  const handleAutoFillCustomer = () => {
    setCustomerEmail("customer@nexuspc.co.th");
    setCustomerPassword("nexus123456");
    setCustomerName("คุณพงศกร สตรีมเมอร์");
    setCustomerError(null);
  };

  // Handle Admin Login submission
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const emailTrim = adminEmail.trim();
    const passTrim = adminPassword.trim();

    if (!emailTrim || !passTrim) {
      setAdminError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await adminLogin({ email: emailTrim, password: adminPassword });
      if (res.success) {
        navigate("/admin", { replace: true });
      } else {
        setAdminError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setAdminError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle Customer Login / Register submission
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError(null);
    setCustomerSuccess(null);

    if (!customerEmail.trim() || !customerPassword.trim()) {
      setCustomerError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    if (isRegister) {
      if (!customerName.trim()) {
        setCustomerError("กรุณาระบุชื่อ-นามสกุลของคุณ");
        return;
      }
      if (customerPassword !== customerConfirmPassword) {
        setCustomerError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
        return;
      }
    }

    setCustomerLoading(true);
    setTimeout(() => {
      setCustomerLoading(false);
      setCustomerSuccess(
        isRegister
          ? "สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ครอบครัว NEXUS Tech Community"
          : "เข้าสู่ระบบสมาชิกสำเร็จ! กำลังนำคุณสู่หน้าหลัก..."
      );
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-white text-zinc-900 selection:bg-black selection:text-white">
      <SEOHead
        title={
          activeRole === "admin"
            ? "เข้าสู่ระบบผู้ดูแลระบบ (Admin Login) | NEXUS Custom PC"
            : isRegister
            ? "สมัครสมาชิก | NEXUS Custom PC"
            : "เข้าสู่ระบบสมาชิก (Member Login) | NEXUS Custom PC"
        }
        description="ศูนย์รวมการเข้าสู่ระบบ NEXUS สำหรับสมาชิกและสั่งประกอบคอมพิวเตอร์"
      />

      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-zinc-200 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md bg-black text-white">
            {activeRole === "admin" ? <Cpu size={28} className="text-white" /> : <User size={28} className="text-white stroke-[2.5]" />}
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            {activeRole === "admin" ? "เข้าสู่ระบบผู้ดูแลระบบ (Admin)" : "เข้าสู่ระบบสมาชิก (Member)"}
          </h1>
          <p className="text-xs text-zinc-500">
            {activeRole === "admin"
              ? "จัดการแคตตาล็อกสินค้า สเปกคอม ข้อมูลติดต่อ และบทความร้านค้า"
              : "เข้าสู่ระบบเพื่อติดตามสถานะการจัดสเปกคอมพิวเตอร์และสิทธิพิเศษ"}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ROLE 1: ADMIN LOGIN FORM (Only when accessed via /admin/login) */}
        {/* ------------------------------------------------------------- */}
        {activeRole === "admin" && (
          <div className="space-y-4 animate-fadeIn">
            {admin && (
              <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs text-black flex items-center justify-between">
                <span>คุณเข้าสู่ระบบในชื่อ {admin.email} แล้ว</span>
                <Link
                  to="/admin"
                  className="px-2.5 py-1 rounded-lg bg-black text-white font-bold text-[11px] hover:bg-zinc-800"
                >
                  ไปหลังบ้าน →
                </Link>
              </div>
            )}

            {adminError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
                <ShieldAlert size={16} className="shrink-0 text-red-600" />
                <span className="font-semibold">{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  อีเมลแอดมิน (Admin Email) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="admin-email-input"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@nexuspc.co.th"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                  />
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">
                    รหัสผ่านแอดมิน (Admin Password) <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    id="admin-password-input"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                  />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                    title={showAdminPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="admin-submit-btn"
                  disabled={adminLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {adminLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>กำลังตรวจสอบข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <span>เข้าสู่ระบบแอดมิน (Sign In as Admin)</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ROLE 2: CUSTOMER LOGIN & REGISTER                             */}
        {/* ------------------------------------------------------------- */}
        {activeRole === "customer" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Customer Sub-tab (Sign In / Register) */}
            <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setCustomerError(null);
                  setCustomerSuccess(null);
                }}
                className={`py-2 font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegister
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                เข้าสู่ระบบ (Sign In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setCustomerError(null);
                  setCustomerSuccess(null);
                }}
                className={`py-2 font-bold rounded-lg transition-all cursor-pointer ${
                  isRegister
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                สมัครสมาชิก (Register)
              </button>
            </div>

            {/* Notifications */}
            {customerSuccess && (
              <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-300 text-black text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0 text-black" />
                <span className="font-semibold">{customerSuccess}</span>
              </div>
            )}

            {customerError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
                <ShieldAlert size={16} className="shrink-0 text-red-600" />
                <span className="font-semibold">{customerError}</span>
              </div>
            )}

            <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="เช่น คุณพงศกร สตรีมเมอร์"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                    />
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  อีเมล (Email) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                  />
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  รหัสผ่าน (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCustomerPassword ? "text" : "password"}
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                  />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                  >
                    {showCustomerPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ยืนยันรหัสผ่าน (Confirm Password) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={customerConfirmPassword}
                      onChange={(e) => setCustomerConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 text-black border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black/20 text-xs outline-none transition-all"
                    />
                    <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-black"
                    />
                    <span>จดจำการเข้าสู่ระบบ</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("กรุณาติดต่อทีมงานผ่านทาง LINE Official เพื่อขอรีเซ็ตรหัสผ่านครับ");
                    }}
                    className="text-zinc-800 hover:text-black hover:underline font-semibold"
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={customerLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {customerLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>กำลังดำเนินการ...</span>
                    </>
                  ) : (
                    <>
                      <span>{isRegister ? "ยืนยันการสมัครสมาชิก" : "เข้าสู่ระบบสมาชิก"}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {!isRegister && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAutoFillCustomer}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black text-zinc-800 hover:text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={14} className="text-zinc-600" />
                  <span>คลิกเพื่อกรอกบัญชีผู้ใช้ทดสอบ (Demo User)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-200">
          <Link to="/" className="text-zinc-600 hover:text-black transition-colors font-medium">
            ← กลับสู่หน้าหลักของเว็บไซต์ (Back to Home)
          </Link>
        </div>
      </div>
    </div>
  );
}
