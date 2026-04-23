// ============= Student Marketplace =============
// Trusted, structured listings — verified students only, with safety features.

export type ListingCategory =
  | "Textbooks"
  | "Gadgets"
  | "Tutoring"
  | "Services"
  | "Hostel"
  | "Fashion";

export type ListingCondition = "New" | "Like New" | "Good" | "Fair" | "Service" | "Digital";

export type UrgencyTag = "today" | "deal" | "negotiable" | "fixed";

export type Seller = {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean; // verified UPSA student
  department?: string;
  level?: string;
  rating: number; // 0–5
  reviewCount: number;
  responseMin: number; // typical response time
  joinedYear: number;
};

export type Listing = {
  id: string;
  title: string;
  category: ListingCategory;
  price: string; // formatted (e.g. "GH₵ 85")
  priceValue: number;
  condition: ListingCondition;
  description: string;
  images: string[];
  seller: Seller;
  location: string; // on/near campus
  buildingId?: number; // optional deep-link to map
  postedISO: string;
  urgency?: UrgencyTag[];
  // safety
  reportCount?: number;
};

const now = Date.now();
const isoAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

const sellers: Record<string, Seller> = {
  ama: {
    id: "u-ama",
    name: "Ama Konadu",
    verified: true,
    department: "Information Technology",
    level: "Level 300",
    rating: 4.9,
    reviewCount: 27,
    responseMin: 8,
    joinedYear: 2023,
  },
  kwesi: {
    id: "u-kwesi",
    name: "Kwesi Mensah",
    verified: true,
    department: "Banking & Finance",
    level: "Level 400",
    rating: 4.7,
    reviewCount: 41,
    responseMin: 15,
    joinedYear: 2022,
  },
  nana: {
    id: "u-nana",
    name: "Nana Adwoa",
    verified: true,
    department: "Accounting",
    level: "Level 200",
    rating: 5.0,
    reviewCount: 12,
    responseMin: 5,
    joinedYear: 2024,
  },
  efua: {
    id: "u-efua",
    name: "Efua Darko",
    verified: true,
    department: "Marketing",
    level: "Level 300",
    rating: 4.8,
    reviewCount: 18,
    responseMin: 22,
    joinedYear: 2023,
  },
  yaw: {
    id: "u-yaw",
    name: "Yaw Boateng",
    verified: false,
    department: "Business Admin",
    level: "Level 100",
    rating: 4.2,
    reviewCount: 3,
    responseMin: 60,
    joinedYear: 2025,
  },
  akua: {
    id: "u-akua",
    name: "Akua Pokuaa",
    verified: true,
    department: "IT — Graphic Design Minor",
    level: "Level 400",
    rating: 4.95,
    reviewCount: 56,
    responseMin: 11,
    joinedYear: 2022,
  },
};

export const listings: Listing[] = [
  {
    id: "L-1001",
    title: "Database Systems by Elmasri — 7th Edition",
    category: "Textbooks",
    price: "GH₵ 85",
    priceValue: 85,
    condition: "Like New",
    description:
      "Used for one semester. No highlights or torn pages. Perfect for INFO 201 / 301. Pickup near Library.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.ama,
    location: "Main Library area",
    buildingId: 3,
    postedISO: isoAgo(20),
    urgency: ["negotiable"],
  },
  {
    id: "L-1002",
    title: "HP Pavilion 14 — 8GB / 256GB SSD",
    category: "Gadgets",
    price: "GH₵ 2,800",
    priceValue: 2800,
    condition: "Good",
    description:
      "Reliable for coursework, light coding and design. Battery holds ~4hrs. Comes with original charger and sleeve.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=70&auto=format&fit=crop",
    ],
    seller: sellers.kwesi,
    location: "Banking Square",
    buildingId: 6,
    postedISO: isoAgo(40),
    urgency: ["deal"],
  },
  {
    id: "L-1003",
    title: "1:1 Calculus & Statistics Tutoring",
    category: "Tutoring",
    price: "GH₵ 50/hr",
    priceValue: 50,
    condition: "Service",
    description:
      "Final-year tutor. Group rates available. Specialised in MAT 101/201 and intro statistics. Library group rooms or online.",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.nana,
    location: "On-campus or online",
    buildingId: 3,
    postedISO: isoAgo(3),
    urgency: ["today"],
  },
  {
    id: "L-1004",
    title: "Casio FX-991EX Scientific Calculator",
    category: "Gadgets",
    price: "GH₵ 120",
    priceValue: 120,
    condition: "New",
    description:
      "Sealed box, original receipt available. Approved for all UPSA examinations.",
    images: [
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.efua,
    location: "Student Center",
    buildingId: 8,
    postedISO: isoAgo(5),
    urgency: ["fixed"],
  },
  {
    id: "L-1005",
    title: "Marketing Principles — Comprehensive Notes",
    category: "Textbooks",
    price: "GH₵ 25",
    priceValue: 25,
    condition: "Digital",
    description:
      "PDF notes covering MKT 103 weeks 1–12 with sample questions. Instant delivery via email after payment.",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.efua,
    location: "Digital delivery",
    postedISO: isoAgo(28),
    urgency: ["fixed"],
  },
  {
    id: "L-1006",
    title: "Logo Design & Brand Identity",
    category: "Services",
    price: "GH₵ 100",
    priceValue: 100,
    condition: "Service",
    description:
      "Clean, modern logo + colour palette + 1 social pack. 48-hour turnaround for student businesses and clubs.",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.akua,
    location: "Remote",
    postedISO: isoAgo(96),
    urgency: ["negotiable"],
  },
  {
    id: "L-1007",
    title: "Single-Room Hostel — 5 min walk to campus",
    category: "Hostel",
    price: "GH₵ 4,500/sem",
    priceValue: 4500,
    condition: "Good",
    description:
      "Furnished, prepaid water, 24h security. Sharing one room — looking for a quiet, focused roommate. Photos on request.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=70&auto=format&fit=crop",
    ],
    seller: sellers.kwesi,
    location: "Madina · 5 min walk",
    postedISO: isoAgo(48),
    urgency: ["today", "deal"],
  },
  {
    id: "L-1008",
    title: "Vintage Denim Jacket — Size M",
    category: "Fashion",
    price: "GH₵ 90",
    priceValue: 90,
    condition: "Good",
    description: "Lightly worn, no rips. Great with everything. Pickup at Student Center.",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=900&q=70&auto=format&fit=crop",
    ],
    seller: sellers.yaw,
    location: "Student Center",
    buildingId: 8,
    postedISO: isoAgo(15),
    urgency: ["negotiable"],
  },
];

export const listingCategories: ListingCategory[] = [
  "Textbooks",
  "Gadgets",
  "Tutoring",
  "Services",
  "Hostel",
  "Fashion",
];

export const listingById = (id: string) => listings.find((l) => l.id === id);

// ===== Local persistence: saved + reported listings =====
const SAVE_KEY = "cis.listings.saved";
const REPORT_KEY = "cis.listings.reported";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}
function writeSet(key: string, s: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(s)));
  } catch {
    /* ignore */
  }
}

export const listingSaveStore = {
  has: (id: string) => readSet(SAVE_KEY).has(id),
  list: () => Array.from(readSet(SAVE_KEY)),
  toggle: (id: string) => {
    const s = readSet(SAVE_KEY);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    writeSet(SAVE_KEY, s);
    return s.has(id);
  },
};

export const listingReportStore = {
  has: (id: string) => readSet(REPORT_KEY).has(id),
  add: (id: string) => {
    const s = readSet(REPORT_KEY);
    s.add(id);
    writeSet(REPORT_KEY, s);
  },
};

export function relativeListed(iso: string) {
  const min = Math.round((Date.now() - +new Date(iso)) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

// ===== Intelligent suggestions =====
// Naive scorer combining recency, verified seller, rating and urgency.
export function suggestedListings(limit = 4): Listing[] {
  return [...listings]
    .map((l) => {
      let score = 0;
      score += l.seller.verified ? 30 : 0;
      score += l.seller.rating * 5;
      score += Math.max(0, 24 - (Date.now() - +new Date(l.postedISO)) / 3600_000);
      if (l.urgency?.includes("today")) score += 20;
      if (l.urgency?.includes("deal")) score += 12;
      return { l, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.l);
}
