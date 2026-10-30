import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { api } from "../../api";

export function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll or fetch unread count for badge
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.data && isMounted) {
          setUnreadCount(res.data.unreadMessagesCount);
        }
      } catch (err) {
        // ignore
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    if (window.confirm("คุณต้องการออกจากระบบหลังบ้านใช่หรือไม่?")) {
      await logout();
      navigate("/admin/login");
    }
  };

  const navItems = [
    { to: "/admin", label: "Dashboard (ภาพรวม)", icon: LayoutDashboard, end: true },
    { to: "/admin/services", label: "จัดการสินค้า/บริการ (PC & Gear)", icon: Cpu },
    { to: "/admin/pages", label: "จัดการเนื้อหา & SEO", icon: FileText },
    { to: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings },
    { to: "/admin/messages", label: "ข้อความติดต่อ", icon: Mail, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Sidebar for Desktop (Clean White with Black text) */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-zinc-800 border-r border-zinc-200 shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-200 gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-black block">NEXUS BackOffice</span>
            <span className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-black text-white font-bold shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Public Site Link & User Profile */}
        <div className="p-4 border-t border-zinc-200 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 hover:text-black transition-colors border border-zinc-200"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-black" />
              <span>เปิดดูหน้าบ้าน (Public)</span>
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 text-black flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-black truncate">{admin?.name || "Admin"}</p>
                <p className="text-[10px] text-zinc-500 truncate">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white text-zinc-900 h-16 flex items-center justify-between px-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-black" />
            <span className="font-bold text-sm tracking-tight text-black">NEXUS Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="p-2 text-zinc-600 hover:text-black text-xs flex items-center gap-1"
            >
              <ExternalLink size={16} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-100"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white text-zinc-900 border-b border-zinc-200 px-4 py-4 space-y-1 animate-fadeIn shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? "bg-black text-white font-bold" : "text-zinc-700 hover:bg-zinc-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{admin?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 py-1 px-2 rounded-lg hover:bg-red-50"
              >
                <LogOut size={14} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Page Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto bg-zinc-50">
          <Outlet context={{ unreadCount, setUnreadCount }} />
        </main>
      </div>
    </div>
  );
}
