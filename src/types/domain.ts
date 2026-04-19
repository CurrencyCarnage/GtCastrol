export type CustomerType = "b2c" | "b2b";
export type InventoryStatus = "in-stock" | "limited" | "special-order";
export type ProductSegment = "passenger" | "commercial" | "driveline" | "ev";

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  segment: ProductSegment;
}

export interface ProductFamily {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  eyebrow: string;
  description: string;
  highlight: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  volumeLiters: number;
  sku: string;
  priceLabel: string;
  inventoryStatus: InventoryStatus;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  familySlug: string;
  categorySlug: string;
  name: string;
  headline: string;
  description: string;
  segment: ProductSegment;
  packSizes: ProductVariant[];
  specs: ProductSpec[];
  applications: string[];
  tags: string[];
  featured: boolean;
}

export interface ServiceOffering {
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
}

export interface ServiceCenter {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  address: string;
  geolocation: { lat: number; lng: number };
  googlePlaceId?: string;
  openingHours: string;
  phone: string;
  trustBadges: string[];
  services: ServiceOffering[];
  inventory: Array<{ familySlug: string; status: InventoryStatus }>;
  source?: "static" | "affiliate";
}

export interface VehicleMake {
  id: string;
  slug: string;
  name: string;
}

export interface VehicleModel {
  id: string;
  makeSlug: string;
  slug: string;
  name: string;
  yearRange: string;
}

export interface VehicleNeed {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  body: string[];
}

export interface CampaignLandingPage {
  slug: string;
  title: string;
  summary: string;
  ctaLabel: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
}

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "finder_started"
  | "finder_step_completed"
  | "recommendation_viewed"
  | "service_center_viewed"
  | "booking_started"
  | "booking_completed"
  | "add_to_cart"
  | "checkout_started"
  | "lead_submitted"
  | "campaign_cta_clicked";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload: Record<string, string | number | boolean | undefined>;
}
