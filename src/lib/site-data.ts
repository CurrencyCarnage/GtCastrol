import type {
  BlogPost,
  CampaignLandingPage,
  LegalPage,
  Product,
  ProductCategory,
  ProductFamily,
  ServiceCenter,
  VehicleMake,
  VehicleModel,
  VehicleNeed,
} from "@/types/domain";

export const productCategories: ProductCategory[] = [
  {
    id: "cat-engine",
    slug: "engine-oils",
    name: "Engine Oils",
    description: "Premium passenger-car lubricants for daily driving, performance applications, and workshop upgrade paths.",
    segment: "passenger",
  },
  {
    id: "cat-ev",
    slug: "ev-and-hybrid-fluids",
    name: "EV & Hybrid Fluids",
    description: "Future-ready service products for electrified drivetrains and hybrid maintenance.",
    segment: "ev",
  },
  {
    id: "cat-commercial",
    slug: "commercial-and-driveline",
    name: "Commercial & Driveline",
    description: "Heavy-duty engine, transmission, and axle solutions for fleets, depots, and workshop partners.",
    segment: "commercial",
  },
];

export const productFamilies: ProductFamily[] = [
  { id: "fam-edge", slug: "edge", categorySlug: "engine-oils", name: "EDGE", eyebrow: "Performance line", description: "Flagship synthetic oil family for premium protection.", highlight: "OE-aligned, high-performance passenger vehicle range." },
  { id: "fam-magnatec", slug: "magnatec", categorySlug: "engine-oils", name: "MAGNATEC", eyebrow: "Urban protection", description: "Built for stop-start stress and everyday mixed driving.", highlight: "A natural hero for daily-driver recommendations." },
  { id: "fam-gtx", slug: "gtx", categorySlug: "engine-oils", name: "GTX", eyebrow: "Reliable maintenance", description: "Broad-coverage range for routine service and accessible upgrades.", highlight: "Great catalogue anchor for workshop and ecommerce entry." },
  { id: "fam-magnatec-hybrid", slug: "magnatec-hybrid", categorySlug: "ev-and-hybrid-fluids", name: "MAGNATEC Hybrid", eyebrow: "Hybrid-ready", description: "Hybrid-focused oils built for repeated start-stop cycles.", highlight: "Supports a specialist hybrid-service proposition." },
  { id: "fam-castrol-on", slug: "castrol-on", categorySlug: "ev-and-hybrid-fluids", name: "Castrol ON", eyebrow: "Electrified mobility", description: "EV transmission and future electrified thermal-fluid story.", highlight: "Future-facing platform for EV service journeys." },
  { id: "fam-vecton", slug: "vecton", categorySlug: "commercial-and-driveline", name: "Vecton", eyebrow: "Fleet performance", description: "Heavy-duty diesel protection built around uptime and drain intervals.", highlight: "Commercial flagship for transport and logistics operators." },
  { id: "fam-crb", slug: "crb", categorySlug: "commercial-and-driveline", name: "CRB", eyebrow: "Commercial reliability", description: "Versatile commercial engine-oil platform for broader fleet demand.", highlight: "Cost-conscious heavy-duty service line." },
  { id: "fam-transmax", slug: "transmax", categorySlug: "commercial-and-driveline", name: "Transmax", eyebrow: "Transmission care", description: "Driveline and ATF family for gearbox, axle, and transmission service.", highlight: "Strong bridge between finder, booking, and cart upsell." },
];

export const products: Product[] = [
  {
    id: "prod-edge-5w30-ll",
    slug: "edge-5w-30-ll",
    familySlug: "edge",
    categorySlug: "engine-oils",
    name: "EDGE 5W-30 LL",
    headline: "Premium synthetic protection for modern European passenger vehicles.",
    description: "Derived from the client catalogue family structure and positioned as a premium, OE-grade product detail anchor.",
    segment: "passenger",
    featured: true,
    applications: ["Premium passenger vehicles", "Long-life service packages", "Workshop premium upsell"],
    tags: ["ACEA C3", "BMW Longlife-04", "VW 504 00 / 507 00"],
    packSizes: [
      { id: "edge-1l", label: "1L", volumeLiters: 1, sku: "EDGE-530LL-1", priceLabel: "From 39 GEL", inventoryStatus: "in-stock" },
      { id: "edge-4l", label: "4L", volumeLiters: 4, sku: "EDGE-530LL-4", priceLabel: "From 129 GEL", inventoryStatus: "in-stock" },
      { id: "edge-5l", label: "5L", volumeLiters: 5, sku: "EDGE-530LL-5", priceLabel: "From 149 GEL", inventoryStatus: "limited" },
    ],
    specs: [
      { label: "ACEA", value: "C3" },
      { label: "BMW", value: "Longlife-04" },
      { label: "VW", value: "504 00 / 507 00" },
      { label: "Porsche", value: "C30" },
    ],
  },
  {
    id: "prod-magnatec-5w30-dx",
    slug: "magnatec-5w-30-dx",
    familySlug: "magnatec",
    categorySlug: "engine-oils",
    name: "MAGNATEC 5W-30 DX",
    headline: "Daily-driver protection tuned for urban stop-start traffic.",
    description: "Passenger range positioned around real-world city use and strong workshop recommendation logic.",
    segment: "passenger",
    featured: true,
    applications: ["City driving", "Routine servicing", "Ford and GM-aligned applications"],
    tags: ["API SP", "ILSAC GF-6", "dexos1 Gen 3"],
    packSizes: [
      { id: "mag-1l", label: "1L", volumeLiters: 1, sku: "MAG-DX-1", priceLabel: "From 31 GEL", inventoryStatus: "in-stock" },
      { id: "mag-4l", label: "4L", volumeLiters: 4, sku: "MAG-DX-4", priceLabel: "From 102 GEL", inventoryStatus: "in-stock" },
      { id: "mag-5l", label: "5L", volumeLiters: 5, sku: "MAG-DX-5", priceLabel: "From 119 GEL", inventoryStatus: "in-stock" },
    ],
    specs: [
      { label: "API", value: "SP" },
      { label: "ILSAC", value: "GF-6" },
      { label: "GM", value: "dexos1 Gen 3" },
      { label: "Ford", value: "WSS-M2C946-A/B1" },
    ],
  },
  {
    id: "prod-gtx-5w40",
    slug: "gtx-5w-40-a3-b4",
    familySlug: "gtx",
    categorySlug: "engine-oils",
    name: "GTX 5W-40 A3/B4",
    headline: "Reliable engine-oil option for broad passenger-car maintenance.",
    description: "Accessible product family built to support entry-level ecommerce and service-center upgrades.",
    segment: "passenger",
    featured: false,
    applications: ["Independent workshop service", "Everyday passenger-car maintenance"],
    tags: ["ACEA A3/B4", "API SP", "MB 229.3"],
    packSizes: [
      { id: "gtx-1l", label: "1L", volumeLiters: 1, sku: "GTX-540-1", priceLabel: "From 25 GEL", inventoryStatus: "in-stock" },
      { id: "gtx-4l", label: "4L", volumeLiters: 4, sku: "GTX-540-4", priceLabel: "From 89 GEL", inventoryStatus: "in-stock" },
      { id: "gtx-5l", label: "5L", volumeLiters: 5, sku: "GTX-540-5", priceLabel: "From 103 GEL", inventoryStatus: "limited" },
    ],
    specs: [
      { label: "ACEA", value: "A3/B4" },
      { label: "API", value: "SP" },
      { label: "VW", value: "502 00 / 505 00" },
    ],
  },
  {
    id: "prod-hybrid",
    slug: "magnatec-hybrid-0w-20",
    familySlug: "magnatec-hybrid",
    categorySlug: "ev-and-hybrid-fluids",
    name: "MAGNATEC Hybrid 0W-20",
    headline: "Hybrid-focused engine oil for low-viscosity service plans.",
    description: "Supports the hybrid branch of the finder and booking journeys without hardcoding the logic into UI components.",
    segment: "ev",
    featured: true,
    applications: ["Hybrid passenger vehicles", "Low-viscosity oil service", "Specialist maintenance upsell"],
    tags: ["API SP", "ILSAC GF-6"],
    packSizes: [
      { id: "hybrid-1l", label: "1L", volumeLiters: 1, sku: "HYB-020-1", priceLabel: "From 34 GEL", inventoryStatus: "in-stock" },
      { id: "hybrid-4l", label: "4L", volumeLiters: 4, sku: "HYB-020-4", priceLabel: "From 115 GEL", inventoryStatus: "limited" },
    ],
    specs: [
      { label: "API", value: "SP" },
      { label: "ILSAC", value: "GF-6" },
    ],
  },
  {
    id: "prod-on-d2",
    slug: "castrol-on-ev-transmission-fluid-d2",
    familySlug: "castrol-on",
    categorySlug: "ev-and-hybrid-fluids",
    name: "Castrol ON EV Transmission Fluid D2",
    headline: "EV driveline fluid path for future electrified service operations.",
    description: "Structured as a special-order product to reflect realistic first-pass availability and branch-routing behavior.",
    segment: "ev",
    featured: true,
    applications: ["EV transmission service", "Electrified workshop offering"],
    tags: ["EV", "Transmission", "Special order"],
    packSizes: [{ id: "on-1l", label: "1L", volumeLiters: 1, sku: "ON-D2-1", priceLabel: "Request quote", inventoryStatus: "special-order" }],
    specs: [
      { label: "Use case", value: "EV transmission fluid" },
      { label: "Availability", value: "Professional use / special order" },
    ],
  },
  {
    id: "prod-vecton",
    slug: "vecton-10w-40-e4-e7",
    familySlug: "vecton",
    categorySlug: "commercial-and-driveline",
    name: "Vecton 10W-40 E4/E7",
    headline: "Fleet-first heavy-duty diesel engine protection.",
    description: "Anchors the B2B and heavy-duty branch of the platform with bulk-pack and workshop-led buying logic.",
    segment: "commercial",
    featured: true,
    applications: ["Fleet maintenance", "Heavy-duty diesel service", "Bulk workshop supply"],
    tags: ["ACEA E4/E7", "API CI-4", "20L / 208L"],
    packSizes: [
      { id: "vecton-20l", label: "20L", volumeLiters: 20, sku: "VEC-1040-20", priceLabel: "Workshop quote", inventoryStatus: "in-stock" },
      { id: "vecton-208l", label: "208L", volumeLiters: 208, sku: "VEC-1040-208", priceLabel: "Bulk quote", inventoryStatus: "limited" },
    ],
    specs: [
      { label: "ACEA", value: "E4 / E7" },
      { label: "API", value: "CI-4" },
      { label: "OEMs", value: "Cummins, Volvo, DTFR" },
    ],
  },
  {
    id: "prod-crb",
    slug: "crb-cng-15w-40-la",
    familySlug: "crb",
    categorySlug: "commercial-and-driveline",
    name: "CRB CNG 15W-40 LA",
    headline: "Commercial gas-engine lubrication for specialist fleet cases.",
    description: "Provides a clear commercial edge case for the product finder and branch inventory model.",
    segment: "commercial",
    featured: false,
    applications: ["CNG vehicles", "Municipal fleets", "Industrial transport"],
    tags: ["API CF", "Commercial"],
    packSizes: [
      { id: "crb-4l", label: "4L", volumeLiters: 4, sku: "CRB-CNG-4", priceLabel: "From 128 GEL", inventoryStatus: "limited" },
      { id: "crb-16l", label: "16L", volumeLiters: 16, sku: "CRB-CNG-16", priceLabel: "Workshop quote", inventoryStatus: "in-stock" },
    ],
    specs: [{ label: "API", value: "CF" }],
  },
  {
    id: "prod-transmax",
    slug: "transmax-atf-dexron-vi-mercon-lv-multivehicle",
    familySlug: "transmax",
    categorySlug: "commercial-and-driveline",
    name: "Transmax ATF DEXRON VI MERCON LV Multivehicle",
    headline: "Multi-vehicle ATF built for gearbox and driveline service upsell.",
    description: "Cross-segment product that ties catalogue, service booking, and ecommerce structure together.",
    segment: "driveline",
    featured: true,
    applications: ["Automatic transmission service", "Passenger and commercial driveline maintenance"],
    tags: ["DEXRON VI", "MERCON LV", "Multivehicle"],
    packSizes: [
      { id: "trans-1l", label: "1L", volumeLiters: 1, sku: "TMX-ATF-1", priceLabel: "From 44 GEL", inventoryStatus: "in-stock" },
      { id: "trans-4l", label: "4L", volumeLiters: 4, sku: "TMX-ATF-4", priceLabel: "From 149 GEL", inventoryStatus: "in-stock" },
      { id: "trans-20l", label: "20L", volumeLiters: 20, sku: "TMX-ATF-20", priceLabel: "Workshop quote", inventoryStatus: "limited" },
    ],
    specs: [
      { label: "GM", value: "DEXRON VI" },
      { label: "Ford", value: "MERCON LV" },
    ],
  },
];

export const vehicleMakes: VehicleMake[] = [
  { id: "make-toyota", slug: "toyota", name: "Toyota" },
  { id: "make-bmw", slug: "bmw", name: "BMW" },
  { id: "make-ford", slug: "ford", name: "Ford" },
  { id: "make-mercedes", slug: "mercedes-benz", name: "Mercedes-Benz" },
];

export const vehicleModels: VehicleModel[] = [
  { id: "model-corolla", makeSlug: "toyota", slug: "corolla", name: "Corolla", yearRange: "2019-2026" },
  { id: "model-rav4-hybrid", makeSlug: "toyota", slug: "rav4-hybrid", name: "RAV4 Hybrid", yearRange: "2019-2026" },
  { id: "model-x5", makeSlug: "bmw", slug: "x5", name: "X5", yearRange: "2019-2026" },
  { id: "model-focus", makeSlug: "ford", slug: "focus", name: "Focus", yearRange: "2018-2026" },
  { id: "model-actros", makeSlug: "mercedes-benz", slug: "actros", name: "Actros", yearRange: "2019-2026" },
];

export const vehicleNeeds: VehicleNeed[] = [
  { id: "need-engine", slug: "engine-oil-change", name: "Engine Oil Change", description: "Find the right engine oil and related service." },
  { id: "need-transmission", slug: "transmission-service", name: "Transmission Service", description: "Find suitable transmission fluids and branch-ready service options." },
  { id: "need-hybrid", slug: "hybrid-maintenance", name: "Hybrid Maintenance", description: "Hybrid-focused engine oil and EV-aligned service recommendations." },
  { id: "need-fleet", slug: "fleet-heavy-duty", name: "Fleet Heavy Duty Service", description: "Commercial branch for fleets, depots, and heavy-duty operations." },
];

export const serviceCenters: ServiceCenter[] = [
  {
    id: "sc-tbilisi",
    slug: "tbilisi-central",
    name: "Castrol Service Tbilisi Central",
    city: "Tbilisi",
    district: "Didube",
    address: "Aghmashenebeli Alley, Tbilisi",
    geolocation: { lat: 41.7502, lng: 44.7791 },
    openingHours: "Mon-Sat 09:00-19:00",
    phone: "+995 599 00 10 10",
    trustBadges: ["OEM-grade handling", "Booking priority", "Fleet-ready"],
    services: [
      { id: "svc-oil", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-gear", slug: "gearbox-service", name: "Transmission Service", durationMinutes: 75 },
      { id: "svc-check", slug: "diagnostic-check", name: "Fluid & Maintenance Check", durationMinutes: 30 },
    ],
    inventory: [
      { familySlug: "edge", status: "in-stock" },
      { familySlug: "magnatec", status: "in-stock" },
      { familySlug: "transmax", status: "in-stock" },
      { familySlug: "castrol-on", status: "special-order" },
    ],
  },
  {
    id: "sc-kutaisi",
    slug: "kutaisi-west",
    name: "Castrol Service Kutaisi West",
    city: "Kutaisi",
    district: "Auto Corridor",
    address: "Avtomshenebeli Street, Kutaisi",
    geolocation: { lat: 42.2502, lng: 42.6997 },
    openingHours: "Mon-Sat 09:00-18:00",
    phone: "+995 599 00 20 20",
    trustBadges: ["Regional coverage", "Fast-lane service"],
    services: [
      { id: "svc-oil-k", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-check-k", slug: "diagnostic-check", name: "Fluid & Maintenance Check", durationMinutes: 30 },
    ],
    inventory: [
      { familySlug: "magnatec", status: "in-stock" },
      { familySlug: "gtx", status: "in-stock" },
      { familySlug: "transmax", status: "limited" },
    ],
  },
  {
    id: "sc-batumi",
    slug: "batumi-coastal",
    name: "Castrol Service Batumi Coastal",
    city: "Batumi",
    district: "Airport Zone",
    address: "Airport Highway, Batumi",
    geolocation: { lat: 41.6134, lng: 41.6004 },
    openingHours: "Mon-Sun 10:00-19:00",
    phone: "+995 599 00 30 30",
    trustBadges: ["Weekend booking", "Tourist corridor support"],
    services: [
      { id: "svc-oil-b", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-hybrid-b", slug: "hybrid-service", name: "Hybrid Maintenance", durationMinutes: 60 },
    ],
    inventory: [
      { familySlug: "edge", status: "limited" },
      { familySlug: "magnatec-hybrid", status: "in-stock" },
      { familySlug: "castrol-on", status: "special-order" },
    ],
  },
  {
    id: "sc-marneuli",
    slug: "marneuli-fleet",
    name: "Castrol Service Marneuli Fleet Point",
    city: "Marneuli",
    district: "Logistics Belt",
    address: "Rustavi Road, Marneuli",
    geolocation: { lat: 41.4787, lng: 44.8085 },
    openingHours: "Mon-Sat 08:30-18:30",
    phone: "+995 599 00 40 40",
    trustBadges: ["Heavy-duty support", "Bulk-pack handling"],
    services: [
      { id: "svc-fleet-m", slug: "fleet-service", name: "Fleet Service", durationMinutes: 90 },
      { id: "svc-oil-m", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
    ],
    inventory: [
      { familySlug: "vecton", status: "in-stock" },
      { familySlug: "crb", status: "in-stock" },
      { familySlug: "transmax", status: "limited" },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-engine-oil-in-georgia",
    title: "How to Choose Engine Oil for Georgia's Driving Conditions",
    excerpt: "A practical guide to approvals, viscosity, and the product-finder path.",
    category: "Maintenance",
    publishedAt: "2026-03-24",
    readTime: "5 min",
    body: [
      "Choosing the right lubricant starts with approvals and operating conditions, not just the viscosity label.",
      "Traffic-heavy urban routes make stop-start protection and cleaner-running formulations more valuable.",
      "A strong digital product finder should shorten the path from compatibility to booking or purchase.",
    ],
  },
  {
    slug: "fleet-lubrication-playbook",
    title: "Fleet Lubrication Playbook",
    excerpt: "Why heavy-duty customers need branch-aware inventory, booking, and bulk-buying flows.",
    category: "B2B",
    publishedAt: "2026-03-20",
    readTime: "4 min",
    body: [
      "Fleet buyers optimize for uptime, service predictability, and stock certainty.",
      "Commercial product pages need very different trust and CTA patterns from passenger products.",
    ],
  },
];

export const campaignPages: CampaignLandingPage[] = [
  {
    slug: "spring-service-check",
    title: "Spring Service Check",
    summary: "Landing-page template for campaign traffic, booking conversion, and catalogue-led upsell.",
    ctaLabel: "Book Spring Service",
  },
  {
    slug: "fleet-readiness",
    title: "Fleet Readiness Program",
    summary: "Lead-focused landing page for workshops, fleet managers, and commercial lubricants.",
    ctaLabel: "Talk to Fleet Team",
  },
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How lead, booking, and commerce data should be handled by the platform.",
    sections: [
      { heading: "Data Collection", body: "Booking, contact, and ecommerce flows should only collect operationally necessary information." },
      { heading: "CRM Readiness", body: "Typed event hooks and lead structures are separated from UI so CRM and analytics tooling can be added later." },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary: "Operational placeholder for bookings, product information, and future transactions.",
    sections: [
      { heading: "Booking", body: "Submitted requests are subject to branch capacity, service availability, and product stock confirmation." },
      { heading: "Pricing", body: "Displayed prices in this build are placeholders until backend commerce pricing is connected." },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "Analytics and tracking foundations for campaign and conversion attribution.",
    sections: [
      { heading: "Event Tracking", body: "The application is designed for typed Meta, GA4, CRM, order, and lead-level events." },
      { heading: "Consent", body: "Consent management remains a later milestone and is not wired in this first implementation pass." },
    ],
  },
];

export function getFamily(slug: string) {
  return productFamilies.find((family) => family.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByFamily(slug: string) {
  return products.filter((product) => product.familySlug === slug);
}

export function getServiceCenter(slug: string) {
  return serviceCenters.find((center) => center.slug === slug);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getCampaign(slug: string) {
  return campaignPages.find((page) => page.slug === slug);
}

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
