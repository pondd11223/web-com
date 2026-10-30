import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../api";
import type { Admin } from "../types";

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.getMe();
      const adminData = res.data || (res as any).admin;
      if (res.success && adminData) {
        setAdmin(adminData);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.login(credentials);
      const adminData = res.data || (res as any).admin;
      if (res.success && adminData) {
        setAdmin({
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
        });
        return { success: true };
      }
      return { success: false, message: res.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    } catch {
      return { success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
