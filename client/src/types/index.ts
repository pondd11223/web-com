export interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  servicesCount?: number;
  createdAt?: string;
}

export interface Service {
  id: number;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteSettings {
  id?: number;
  storeName: string;
  tagline?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  businessHours?: string | null;
  lineId?: string | null;
  lineUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  googleMapsUrl?: string | null;
  updatedAt?: string;
}

export interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

export interface PageContent {
  id?: number;
  pageKey: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImageUrl?: string | null;
  heroCtaText?: string | null;
  aboutStory?: string | null;
  aboutImageUrl?: string | null;
  highlights?: HighlightItem[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  updatedAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export interface DashboardStats {
  unreadMessagesCount: number;
  totalServicesCount: number;
  totalCategoriesCount: number;
  latestMessages: ContactMessage[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  admin?: any;
  token?: string;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
