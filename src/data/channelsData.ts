// ============= Channel System: foundational types & seed data =============
// Designed to be backend-ready: mirror this shape in DB tables (channels, posts, attachments).

export type ChannelType =
  | "official"
  | "department"
  | "course"
  | "lecturer"
  | "leadership"
  | "opportunity"
  | "service";

export type PostType = "announcement" | "resource" | "event" | "update" | "alert";

export type ChannelOwnerKind = "department" | "office" | "person" | "club";

export type Channel = {
  id: string;
  name: string;
  handle: string;
  type: ChannelType;
  category: string;
  owner: { name: string; kind: ChannelOwnerKind; verified: boolean };
  description: string;
  followers: number;
  lastActiveISO: string; // ISO timestamp
  pinnedPostIds?: string[];
};

export type PostAttachment =
  | { kind: "pdf"; label: string; url: string; sizeKb?: number }
  | { kind: "link"; label: string; url: string }
  | { kind: "image"; label: string; url: string };

// Strict, lightweight media — kept separate from attachments so the UI can render
// a clean preview gallery (images) or a single thumbnail-based player (video).
export type PostMedia =
  | { kind: "image"; url: string; alt?: string; width?: number; height?: number }
  | { kind: "video"; url: string; poster: string; durationSec?: number; alt?: string };

export type ReactionKind = "helpful" | "important" | "seen";

export type PostComment = {
  id: string;
  author: string;
  authorRole: string;
  verified?: boolean;
  body: string;
  publishedISO: string;
  parentId?: string; // threaded
};

export type Post = {
  id: string;
  channelId: string;
  type: PostType;
  title: string;
  body: string;
  authorName: string;
  authorRole: string;
  authorVerified?: boolean;
  publishedISO: string;
  pinned?: boolean;
  priority?: "normal" | "high" | "critical";
  attachments?: PostAttachment[];
  media?: PostMedia[];
  // optional structured metadata per type
  event?: { startISO: string; endISO?: string; location?: string };
  location?: { label: string; buildingId?: number };
  // engagement (kept minimal — no infinite social signals)
  saves?: number;
  reads?: number;
  reactions?: Partial<Record<ReactionKind, number>>;
  // controlled comments — default off; admins enable per post
  commentsEnabled?: boolean;
  comments?: PostComment[];
};

const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60_000).toISOString();
const future = (offsetMin: number) => new Date(now + offsetMin * 60_000).toISOString();

export const channels: Channel[] = [
  {
    id: "ch-upsa-official",
    name: "UPSA Official",
    handle: "upsa.official",
    type: "official",
    category: "University-wide",
    owner: { name: "Office of the Registrar", kind: "office", verified: true },
    description: "Authoritative announcements from the University of Professional Studies, Accra.",
    followers: 24812,
    lastActiveISO: iso(35),
    pinnedPostIds: ["p-1", "p-2"],
  },
  {
    id: "ch-it-dept",
    name: "IT Department",
    handle: "it.department",
    type: "department",
    category: "Faculty of IT & Communication Studies",
    owner: { name: "IT Department", kind: "department", verified: true },
    description: "Course updates, venue changes and resources for IT students.",
    followers: 1842,
    lastActiveISO: iso(120),
    pinnedPostIds: ["p-3"],
  },
  {
    id: "ch-info201",
    name: "INFO 201 — Database Systems",
    handle: "info201",
    type: "course",
    category: "Course · Level 200",
    owner: { name: "Dr. Ama Serwaa", kind: "person", verified: true },
    description: "Official course channel. Lecture notes, assignments, venue updates.",
    followers: 287,
    lastActiveISO: iso(45),
    pinnedPostIds: ["p-4"],
  },
  {
    id: "ch-bursary",
    name: "Bursary",
    handle: "bursary",
    type: "service",
    category: "Fees & Payments",
    owner: { name: "Bursary Office", kind: "office", verified: true },
    description: "Payment deadlines, fee structures, refunds and disbursements.",
    followers: 9203,
    lastActiveISO: iso(300),
  },
  {
    id: "ch-src",
    name: "SRC — Student Council",
    handle: "src",
    type: "leadership",
    category: "Student Leadership",
    owner: { name: "SRC Executive", kind: "club", verified: true },
    description: "Representing students. Hall meetings, elections, advocacy.",
    followers: 6421,
    lastActiveISO: iso(720),
  },
  {
    id: "ch-careers",
    name: "Career Services",
    handle: "careers",
    type: "opportunity",
    category: "Internships & Jobs",
    owner: { name: "Career Services Office", kind: "office", verified: true },
    description: "Internships, scholarships, graduate roles and competitions.",
    followers: 11240,
    lastActiveISO: iso(60),
  },
  {
    id: "ch-library",
    name: "Library Services",
    handle: "library",
    type: "service",
    category: "Academic Services",
    owner: { name: "UPSA Library", kind: "office", verified: true },
    description: "Opening hours, new acquisitions, study spaces and databases.",
    followers: 3120,
    lastActiveISO: iso(180),
  },
  {
    id: "ch-ict",
    name: "ICT Services",
    handle: "ict",
    type: "service",
    category: "IT Support",
    owner: { name: "ICT Directorate", kind: "office", verified: true },
    description: "Wi-Fi, accounts, portal status and IT help.",
    followers: 5012,
    lastActiveISO: iso(90),
  },
];

export const posts: Post[] = [
  {
    id: "p-1",
    channelId: "ch-upsa-official",
    type: "alert",
    title: "Water supply disruption — Wednesday 6 AM to 2 PM",
    body: "Planned maintenance will affect main campus water supply on Wednesday. Please store water in advance. Affected zones: Admin block, LT1–LT5, Library.",
    authorName: "Facilities Management",
    authorRole: "Office",
    publishedISO: iso(180),
    pinned: true,
    priority: "critical",
  },
  {
    id: "p-2",
    channelId: "ch-upsa-official",
    type: "announcement",
    title: "Mid-semester examination timetable released",
    body: "The mid-semester examination timetable is now available. Students should confirm venues 24 hours before each paper.",
    authorName: "Examinations Office",
    authorRole: "Office",
    publishedISO: iso(1440),
    pinned: true,
    attachments: [{ kind: "pdf", label: "Mid-Sem Timetable.pdf", url: "#", sizeKb: 412 }],
  },
  {
    id: "p-3",
    channelId: "ch-it-dept",
    type: "update",
    title: "INFO 201 lectures relocated to LT3",
    body: "Effective immediately, all INFO 201 lectures will hold in LT3 until further notice. ICT Lab remains for tutorials.",
    authorName: "Dr. Ama Serwaa",
    authorRole: "Course Lecturer",
    publishedISO: iso(120),
    pinned: true,
    priority: "high",
    location: { label: "Lecture Theatre 3 (LT3)", buildingId: 2 },
  },
  {
    id: "p-4",
    channelId: "ch-info201",
    type: "resource",
    title: "Lecture notes — Weeks 1 to 6",
    body: "Consolidated notes covering relational models, normalisation and SQL fundamentals. Use these to prepare for the mid-semester assessment.",
    authorName: "Dr. Ama Serwaa",
    authorRole: "Course Lecturer",
    publishedISO: iso(2880),
    pinned: true,
    attachments: [
      { kind: "pdf", label: "INFO201-Notes-W1-W6.pdf", url: "#", sizeKb: 1840 },
      { kind: "link", label: "Recommended reading", url: "#" },
    ],
  },
  {
    id: "p-5",
    channelId: "ch-info201",
    type: "event",
    title: "Database Systems revision class",
    body: "Optional revision before the mid-semester assessment. Bring questions and your laptop.",
    authorName: "Dr. Ama Serwaa",
    authorRole: "Course Lecturer",
    publishedISO: iso(60),
    event: { startISO: future(60 * 24), endISO: future(60 * 26), location: "LT3" },
    location: { label: "Lecture Theatre 3 (LT3)", buildingId: 2 },
    media: [
      {
        kind: "image",
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=70&auto=format&fit=crop",
        alt: "Lecture theatre seating with projection screen",
      },
    ],
    reactions: { helpful: 42, important: 18, seen: 156 },
    commentsEnabled: true,
    authorVerified: true,
    comments: [
      {
        id: "c-5-1",
        author: "Kofi M.",
        authorRole: "Student · Level 300",
        body: "Will the recording be shared for those who can't attend?",
        publishedISO: iso(45),
      },
      {
        id: "c-5-2",
        author: "Dr. Ama Serwaa",
        authorRole: "Course Lecturer",
        verified: true,
        body: "Yes — I'll upload it under Resources within 24h of the session.",
        publishedISO: iso(40),
        parentId: "c-5-1",
      },
    ],
  },
  {
    id: "p-6",
    channelId: "ch-bursary",
    type: "announcement",
    title: "Fee payment deadline — Friday 5:00 PM",
    body: "Outstanding balances must be cleared by Friday 5:00 PM to avoid examination hold. Pay via the student portal or any partner bank.",
    authorName: "Bursary Office",
    authorRole: "Office",
    authorVerified: true,
    publishedISO: iso(300),
    priority: "high",
    reactions: { important: 88, seen: 412 },
  },
  {
    id: "p-7",
    channelId: "ch-careers",
    type: "event",
    title: "Career Fair 2025 — Main Auditorium",
    body: "Over 40 employers across finance, tech and consulting. Bring printed CVs. Dress code: business formal.",
    authorName: "Career Services Office",
    authorRole: "Office",
    authorVerified: true,
    publishedISO: iso(360),
    event: { startISO: future(60 * 18), endISO: future(60 * 24), location: "Main Auditorium" },
    location: { label: "Main Auditorium", buildingId: 8 },
    attachments: [{ kind: "link", label: "Participating employers", url: "#" }],
    media: [
      {
        kind: "image",
        url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=70&auto=format&fit=crop",
        alt: "Career fair attendees networking",
      },
      {
        kind: "image",
        url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=70&auto=format&fit=crop",
        alt: "Employer booth at career event",
      },
    ],
    reactions: { helpful: 64, important: 31, seen: 280 },
  },
  {
    id: "p-8",
    channelId: "ch-careers",
    type: "resource",
    title: "Scholarship application toolkit",
    body: "CV templates, essay guidance and a checklist for the most common scholarship applications.",
    authorName: "Career Services Office",
    authorRole: "Office",
    publishedISO: iso(720),
    attachments: [{ kind: "pdf", label: "Scholarship Toolkit.pdf", url: "#", sizeKb: 980 }],
  },
  {
    id: "p-9",
    channelId: "ch-library",
    type: "update",
    title: "Extended hours during examination week",
    body: "The Main Library will operate from 7:00 AM to 10:00 PM during the examination preparation week.",
    authorName: "UPSA Library",
    authorRole: "Office",
    publishedISO: iso(2880),
  },
  {
    id: "p-10",
    channelId: "ch-ict",
    type: "update",
    title: "New high-speed Wi-Fi zones activated",
    body: "Banking Square, Sports Complex and Student Center now have high-speed Wi-Fi. Use your student credentials to connect.",
    authorName: "ICT Directorate",
    authorRole: "Office",
    publishedISO: iso(4320),
  },
  {
    id: "p-11",
    channelId: "ch-src",
    type: "announcement",
    title: "Hall meeting — Thursday 6:00 PM",
    body: "Agenda includes hostel allocations, student welfare fund and updates from the Vice-Chancellor's engagement.",
    authorName: "SRC Executive",
    authorRole: "Student Leadership",
    publishedISO: iso(900),
    event: { startISO: future(60 * 30), location: "Conference Hall" },
  },
];

// ===== Lookup helpers =====
export const channelById = (id: string) => channels.find((c) => c.id === id);
export const postsForChannel = (id: string) =>
  posts
    .filter((p) => p.channelId === id)
    .sort((a, b) => +new Date(b.publishedISO) - +new Date(a.publishedISO));

export const channelTypeLabel: Record<ChannelType, string> = {
  official: "Official",
  department: "Department",
  course: "Course",
  lecturer: "Lecturer",
  leadership: "Leadership",
  opportunity: "Opportunities",
  service: "Service",
};

export const postTypeLabel: Record<PostType, string> = {
  announcement: "Announcement",
  resource: "Resource",
  event: "Event",
  update: "Update",
  alert: "Alert",
};

// ===== Local persistence (saves & follows) — backend-ready =====
const FOLLOW_KEY = "cis.channels.followed";
const SAVE_KEY = "cis.posts.saved";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function writeSet(key: string, set: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}

export const followStore = {
  list: () => Array.from(readSet(FOLLOW_KEY)),
  has: (id: string) => readSet(FOLLOW_KEY).has(id),
  toggle: (id: string) => {
    const s = readSet(FOLLOW_KEY);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    writeSet(FOLLOW_KEY, s);
    return s.has(id);
  },
};

export const saveStore = {
  list: () => Array.from(readSet(SAVE_KEY)),
  has: (id: string) => readSet(SAVE_KEY).has(id),
  toggle: (id: string) => {
    const s = readSet(SAVE_KEY);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    writeSet(SAVE_KEY, s);
    return s.has(id);
  },
};

// ===== Intelligence: Today's Key Updates =====
// Surface critical/high-priority and time-sensitive posts from the last 24h.
export function getTodaysKeyUpdates(limit = 3): Post[] {
  const cutoff = Date.now() - 24 * 60 * 60_000;
  const score = (p: Post) => {
    let s = 0;
    if (p.priority === "critical") s += 100;
    if (p.priority === "high") s += 60;
    if (p.type === "alert") s += 50;
    if (p.type === "announcement") s += 20;
    if (p.event && +new Date(p.event.startISO) - Date.now() < 60 * 60_000 * 24) s += 30;
    // recency boost
    s += Math.max(0, 24 - (Date.now() - +new Date(p.publishedISO)) / 3_600_000);
    return s;
  };
  return [...posts]
    .filter((p) => +new Date(p.publishedISO) >= cutoff || p.priority === "critical")
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
