import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { PublicLayout } from "./components/layout/PublicLayout";
import { Home } from "./pages/public/Home";
import { About } from "./pages/public/About";
import { Contact } from "./pages/public/Contact";
import { UserLogin } from "./pages/public/UserLogin";
import { NotFound } from "./pages/public/NotFound";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminPages } from "./pages/admin/AdminPages";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminMessages } from "./pages/admin/AdminMessages";

export function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes with Shared Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login Route (Public within admin namespace) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
