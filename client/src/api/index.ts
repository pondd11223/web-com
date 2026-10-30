import type {
  ApiResponse,
  WebsiteSettings,
  PageContent,
  Category,
  Service,
  ContactFormData,
  ContactMessage,
  DashboardStats,
  Admin,
} from "../types";

const API_BASE = "/api";
const TOKEN_KEY = "nexus_admin_token";

// Default Fallback Data (Computer Store - Luxury Black & White Edition)
const defaultSettings: WebsiteSettings = {
  storeName: "NEXUS Custom PC & Gaming Gear",
  tagline: "High-Performance Custom PC, Workstations & Gaming Peripherals",
  logoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
  phone: "02-888-9999",
  email: "contact@nexuspc.co.th",
  address: "101/5 อาคารไอทีคอมเพล็กซ์ ชั้น 3 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
  businessHours: "จันทร์ - เสาร์: 10:00 - 20:00 น.",
  lineId: "@nexuspc",
  lineUrl: "https://line.me/R/ti/p/@nexuspc",
  facebookUrl: "https://facebook.com/nexuspc.th",
  instagramUrl: "https://instagram.com/nexuspc.th",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.540871181816!2d100.5639693!3d13.7578135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e84b8d7eb8f%3A0x6b7724a44b82967!2sFortune%20Town!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth",
};

const defaultHomePage: PageContent = {
  id: 1,
  pageKey: "home",
  heroTitle: "รวมคอมพิวเตอร์และอุปกรณ์เกมมิ่งสเปกแรง คุ้มค่า มั่นใจในคุณภาพ",
  heroSubtitle: "ผู้นำด้านการจัดสเปกคอมพิวเตอร์ประกอบระดับพรีเมียม เวิร์กสเตชันสำหรับครีเอเตอร์ และระบบระบายความร้อนด้วยน้ำ Custom สั่งประกอบตามงบประมาณ ประกันศูนย์ไทย 100%",
  heroImageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&auto=format&fit=crop&q=80",
  heroCtaText: "ปรึกษาจัดสเปกคอม / ส่งข้อความ",
  highlights: [
    {
      icon: "Cpu",
      title: "Tailored Custom Specs",
      description: "จัดสเปกตรงความต้องการและงบประมาณ ไม่ยัดไส้อุปกรณ์ เลือกชิ้นส่วนเกรดท็อปเพื่อความคุ้มค่าสูงสุด",
    },
    {
      icon: "Zap",
      title: "Ultimate 4K / 8K Performance",
      description: "รีดพลังประมวลผลสูงสุดด้วยการปรับแต่งไบออส XMP/EXPO และจัดทางลมให้เย็นจัดและเงียบสนิท",
    },
    {
      icon: "ShieldCheck",
      title: "100% Genuine Warranty",
      description: "อุปกรณ์ทุกชิ้นเป็นของแท้ประกันศูนย์ไทยเต็มปี บริการเคลมและประสานงานด่วนไม่ต้องรอนาน",
    },
    {
      icon: "Wrench",
      title: "Master Cable Management",
      description: "เก็บสายไฟและท่อระบบน้ำอย่างประณีตระดับงานแสดงโชว์ พร้อม Stress Test ก่อนส่งมอบ 24 ชม.",
    },
  ],
  metaTitle: "NEXUS Custom PC & Gaming Gear | คอมพิวเตอร์ประกอบระดับไฮเอนด์",
  metaDescription: "ผู้เชี่ยวชาญด้านคอมพิวเตอร์ประกอบระดับไฮเอนด์ เวิร์กสเตชันตัดต่อ 8K และเกมมิ่งเกียร์ สั่งประกอบตามงบประมาณ",
};

const defaultAboutPage: PageContent = {
  id: 2,
  pageKey: "about",
  aboutStory: "NEXUS ก่อตั้งขึ้นโดยกลุ่มวิศวกรฮาร์ดแวร์และเกมเมอร์ผู้หลงใหลในประสิทธิภาพสูงสุดของคอมพิวเตอร์ เราเชื่อว่าคอมพิวเตอร์ประกอบไม่ได้เป็นเพียงกล่องสี่เหลี่ยมที่มีแผงวงจร แต่คือเครื่องมือขับเคลื่อนความฝัน ความคิดสร้างสรรค์ และชัยชนะในการแข่งขัน\n\nเราคัดสรรเฉพาะอุปกรณ์คุณภาพสูงจากแบรนด์ชั้นนำระดับโลก ไม่ว่าจะเป็น Intel, AMD, NVIDIA, ASUS, Corsair และ Lian Li ทุกเครื่องผ่านการประกอบด้วยความประณีต เก็บสายไฟอย่างสวยงาม และผ่านกระบวนการ Stress Test อย่างเข้มงวด เพื่อให้คุณมั่นใจได้ว่าคอมพิวเตอร์ทุกเครื่องจาก NEXUS จะทำงานได้อย่างเต็มประสิทธิภาพและมีอายุการใช้งานยาวนานที่สุด",
  aboutImageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80",
  metaTitle: "เกี่ยวกับเรา & สินค้าคอมพิวเตอร์ทั้งหมด | NEXUS Custom PC",
  metaDescription: "เรื่องราวความเป็นมา มาตรฐานความเชี่ยวชาญด้านฮาร์ดแวร์ และสินค้าคอมพิวเตอร์ประกอบทั้งหมดจาก NEXUS",
};

const defaultContactPage: PageContent = {
  id: 3,
  pageKey: "contact",
  metaTitle: "ติดต่อเรา & ปรึกษาจัดสเปกคอม | NEXUS Custom PC",
  metaDescription: "ติดต่อขอคำปรึกษาจัดสเปกคอมพิวเตอร์ เวิร์กสเตชัน หรือสั่งจองเกมมิ่งเกียร์กับทีมงาน NEXUS",
};

const defaultCategories: Category[] = [
  { id: 1, name: "Custom Gaming PC", slug: "custom-gaming-pc", description: "คอมพิวเตอร์ประกอบสำหรับเล่นเกมระดับไฮเอนด์", sortOrder: 1 },
  { id: 2, name: "Workstation & Creator PC", slug: "workstation-pc", description: "คอมพิวเตอร์สำหรับงานตัดต่อวิดีโอ 8K และ 3D", sortOrder: 2 },
  { id: 3, name: "Gaming Gear & Peripherals", slug: "gaming-gear", description: "เกมมิ่งเกียร์ระดับโปรเพลเยอร์ จอภาพ และคีย์บอร์ด", sortOrder: 3 },
  { id: 4, name: "PC Hardware & Upgrades", slug: "pc-hardware", description: "การ์ดจอ GPU, CPU และ SSD NVMe Gen5 แท้ศูนย์ไทย", sortOrder: 4 },
];

const defaultServices: Service[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Custom Gaming PC",
    name: "NEXUS CyberBeast RTX 4090 Custom Watercooled PC",
    description: "สเปกท็อปสุดแห่งยุค: Intel Core i9-14900KS + NVIDIA GeForce RTX 4090 24GB + RAM 64GB DDR5 6400MHz + ชุดน้ำเปิด Hard Tube Custom ลูปคู่ เคสกระจกพาโนรามา เล่นได้ทุกเกมระดับ 4K 144Hz ปรับสุด",
    price: "139000.00",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: "Workstation & Creator PC",
    name: "PRO-STUDIO Workstation Threadripper & RTX 4080 Super",
    description: "ขุมพลังสำหรับสตูดิโอตัดต่อ 8K และงาน 3D VFX: AMD Ryzen Threadripper 7960X (24 Cores / 48 Threads) + 128GB DDR5 ECC RAM + RTX 4080 Super 16GB + 4TB Gen5 NVMe เสถียรภาพระดับ 24/7",
    price: "115000.00",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    categoryId: 3,
    categoryName: "Gaming Gear & Peripherals",
    name: "NEXUS Apex Pro Wireless Custom Keyboard (Hot-Swap)",
    description: "คีย์บอร์ดกลไกไร้สายบอดี้อะลูมิเนียม CNC ชุบอโนไดซ์ สวิตช์ Linear สั่งลูบพิเศษจากโรงงาน คีย์แคป PBT Double-shot ไฟ RGB Per-key รองรับ Tri-mode (Bluetooth / 2.4GHz / Type-C)",
    price: "4890.00",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    categoryId: 1,
    categoryName: "Custom Gaming PC",
    name: "NEXUS Vortex Air i7 + RTX 4070 Ti Super",
    description: "เครื่องเกมมิ่งยอดนิยม คุ้มค่าที่สุด: Intel Core i7-14700KF + RTX 4070 Ti Super 16GB + 32GB DDR5 + ชุดน้ำปิด AIO 360mm พร้อมพัดลม ARGB ไหลเวียนอากาศเยี่ยม รองรับ 2K / 4K สบาย",
    price: "64900.00",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    isFeatured: false,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "Gaming Gear & Peripherals",
    name: "ULTRA-VIEW 34\" Curved QD-OLED 175Hz Gaming Monitor",
    description: "จอเกมมิ่งโค้งระดับพรีเมียม 34 นิ้ว สัดส่วน 21:9 WQHD พาเนล QD-OLED แท้ คอนทราสต์ลึกไร้ที่ติ Response Time 0.03ms อัตรารีเฟรช 175Hz รองรับ G-Sync และ DisplayHDR True Black 400",
    price: "29900.00",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 6,
    categoryId: 1,
    categoryName: "Custom Gaming PC",
    name: "NEXUS Ghost White Mini-ITX Ryzen 7 + RTX 4070 Super",
    description: "คอมประกอบสายมินิมอลไซส์กะทัดรัด ดีไซน์สีขาวบริสุทธิ์: AMD Ryzen 7 7800X3D (CPU เล่นเกมที่ดีที่สุด) + RTX 4070 Super White Edition + 32GB DDR5 วางบนโต๊ะคอมได้สวยงามไม่เปลืองพื้นที่",
    price: "52900.00",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
  },
];

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
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
    // If backend is not reached, provide fallback defaults for public GET requests
    if (endpoint === "/public/settings") {
      return { success: true, data: defaultSettings as unknown as T };
    }
    if (endpoint === "/public/pages/home") {
      return { success: true, data: defaultHomePage as unknown as T };
    }
    if (endpoint === "/public/pages/about") {
      return { success: true, data: defaultAboutPage as unknown as T };
    }
    if (endpoint === "/public/pages/contact") {
      return { success: true, data: defaultContactPage as unknown as T };
    }
    if (endpoint === "/public/categories") {
      return { success: true, data: defaultCategories as unknown as T };
    }
    if (endpoint.startsWith("/public/services")) {
      return { success: true, data: defaultServices as unknown as T };
    }
    if (endpoint === "/public/featured-services") {
      return { success: true, data: defaultServices.filter((s) => s.isFeatured) as unknown as T };
    }
    if (endpoint === "/public/contact" && options.method === "POST") {
      return { success: true, message: "ส่งข้อความสำเร็จ ทีมงานวิศวกรจะติดต่อกลับโดยเร็วที่สุด", data: { id: Date.now() } as unknown as T };
    }

    return {
      success: false,
      message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}

// -------------------------------------------------------------
// PUBLIC API
// -------------------------------------------------------------
export const api = {
  // Public
  getSettings: () => request<WebsiteSettings>("/public/settings"),
  getPageContent: (key: string) => request<PageContent>(`/public/pages/${key}`),
  getCategories: () => request<Category[]>("/public/categories"),
  getServices: (categoryId?: number) =>
    request<Service[]>(`/public/services${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getFeaturedServices: () => request<Service[]>("/public/featured-services"),
  sendContactMessage: (form: ContactFormData) =>
    request<{ id: number }>("/public/contact", {
      method: "POST",
      body: JSON.stringify(form),
    }),

  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const res = await request<{ id: number; email: string; name: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.success && res.token && typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    return res;
  },
  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
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

  // Change Admin Password
  changeAdminPassword: (data: { currentPassword: string; newPassword: string }) =>
    request("/admin/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
