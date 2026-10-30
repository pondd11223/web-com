import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { LoadingSpinner } from "../common/LoadingSkeleton";

export function AdminProtectedRoute() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner text="กำลังตรวจสอบสิทธิ์การเข้าใช้งานระบบหลังบ้าน..." />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
