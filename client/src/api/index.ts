import type {
  ApiResponse,
  WebsiteSettings,
  PageContent,
  Category,
  Service,
  PromotionItem,
  ContactFormData,
  ContactMessage,
  DashboardStats,
  Admin,
} from "../types";

const API_BASE = "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Rely strictly on secure httpOnly cookie (no localStorage token)
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `เกิดข้อผิดพลาด (${response.status})`,
        errors: data.errors,
      };
    }
    return data;
  } catch (err: any) {
    console.error(`❌ [API Error] Failed request to ${endpoint}:`, err);
    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (${err?.message || "Connection Error"}) กรุณาตรวจสอบสถานะระบบที่ /api/health`,
    };
  }
}

// -------------------------------------------------------------
// PUBLIC & ADMIN API (Purely Cookie-Based Authentication)
// -------------------------------------------------------------
export const api = {
  // Public
  getSettings: () => request<WebsiteSettings>("/public/settings"),
  getPageContent: (key: string) => request<PageContent>(`/public/pages/${key}`),
  getCategories: () => request<Category[]>("/public/categories"),
  getPromotions: () => request<PromotionItem[]>("/public/promotions"),
  getServices: (categoryId?: number) =>
    request<Service[]>(`/public/services${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getFeaturedServices: () => request<Service[]>("/public/featured-services"),
  sendContactMessage: (form: ContactFormData) =>
    request<{ id: number }>("/public/contact", {
      method: "POST",
      body: JSON.stringify(form),
    }),

  // Auth (httpOnly cookie managed by server)
  login: async (credentials: { email: string; password: string }) => {
    return await request<{ id: number; email: string; name: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  logout: async () => {
    return request("/auth/logout", { method: "POST" });
  },
  getMe: () => request<Admin>("/auth/me"),

  // Admin Dashboard
  getDashboardStats: () => request<DashboardStats>("/admin/dashboard"),

  // Admin Settings
  getAdminSettings: () => request<WebsiteSettings>("/admin/settings"),
  updateAdminSettings: (data: Partial<WebsiteSettings>) =>
    request<WebsiteSettings>("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Admin Pages & SEO
  getAdminPages: () => request<PageContent[]>("/admin/pages"),
  getAdminPage: (key: string) => request<PageContent>(`/admin/pages/${key}`),
  updateAdminPage: (key: string, data: Partial<PageContent>) =>
    request<PageContent>(`/admin/pages/${key}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Admin Services
  getAdminServices: (params: { search?: string; categoryId?: string | number; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.categoryId !== undefined) query.set("categoryId", String(params.categoryId));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return request<{ items: Service[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      `/admin/services?${query.toString()}`
    );
  },
  createAdminService: (data: Partial<Service>) =>
    request<Service>("/admin/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminService: (id: number, data: Partial<Service>) =>
    request<Service>(`/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAdminService: (id: number) =>
    request(`/admin/services/${id}`, {
      method: "DELETE",
    }),

  // Admin Categories
  getAdminCategories: () => request<Category[]>("/admin/categories"),
  createAdminCategory: (data: { name: string; slug: string; description?: string; sortOrder?: number }) =>
    request<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminCategory: (id: number, data: Partial<Category>) =>
    request<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAdminCategory: (id: number) =>
    request(`/admin/categories/${id}`, {
      method: "DELETE",
    }),

  // Admin Messages
  getAdminMessages: () => request<ContactMessage[]>("/admin/messages"),
  getAdminMessage: (id: number) => request<ContactMessage>(`/admin/messages/${id}`),
  deleteAdminMessage: (id: number) =>
    request(`/admin/messages/${id}`, {
      method: "DELETE",
    }),

  // Admin Promotions
  getAdminPromotions: () => request<PromotionItem[]>("/admin/promotions"),
  createAdminPromotion: (data: Partial<PromotionItem>) =>
    request<PromotionItem>("/admin/promotions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminPromotion: (id: number, data: Partial<PromotionItem>) =>
    request<PromotionItem>(`/admin/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAdminPromotion: (id: number) =>
    request(`/admin/promotions/${id}`, {
      method: "DELETE",
    }),

  // Change Admin Password
  changeAdminPassword: (data: { currentPassword: string; newPassword: string }) =>
    request("/admin/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
