export const currentUser = {
  id: "STU-2024-0847",
  name: "Kofi Mensah",
  firstName: "Kofi",
  department: "Information Technology",
  level: "Level 300",
  email: "kofi.mensah@upsa.edu.gh",
  avatar: "",
  role: "student" as const,
  stats: { announcementsRead: 24, eventsJoined: 7, streak: 5 },
};

export const announcements = [
  { id: 1, title: "INFO 201 moved to LT3", body: "Effective immediately, all INFO 201 lectures will hold in LT3. Please take note.", type: "urgent" as const, time: "2h ago", department: "IT Department", read: false },
  { id: 2, title: "Registration closes Friday", body: "Course registration for the semester closes this Friday at 5:00 PM. Complete yours now.", type: "important" as const, time: "5h ago", department: "Academic Affairs", read: false },
  { id: 3, title: "Mid-semester timetable released", body: "The mid-semester examination timetable is now available on the student portal.", type: "info" as const, time: "1d ago", department: "Examinations Office", read: true },
  { id: 4, title: "Library extended hours", body: "The library will operate extended hours (7AM–10PM) during exam preparation week.", type: "info" as const, time: "2d ago", department: "Library Services", read: true },
  { id: 5, title: "Emergency: Water supply disruption", body: "Water supply to the main campus will be disrupted on Wednesday from 6AM to 2PM for maintenance.", type: "urgent" as const, time: "3h ago", department: "Facilities Management", read: false },
  { id: 6, title: "New WiFi zones activated", body: "Three new high-speed WiFi zones are now active at Banking Square, Sports Complex, and Student Center.", type: "info" as const, time: "3d ago", department: "ICT Services", read: true },
];

export const notifications = [
  { id: 1, type: "announcement" as const, title: "INFO 201 moved to LT3", body: "All lectures now in LT3", time: "2h ago", read: false, icon: "Megaphone" },
  { id: 2, type: "alert" as const, title: "Registration closes Friday", body: "Complete registration by 5:00 PM", time: "5h ago", read: false, icon: "AlertTriangle" },
  { id: 3, type: "event" as const, title: "Career Fair 2025 tomorrow", body: "Main Auditorium, 9:00 AM", time: "6h ago", read: false, icon: "Calendar" },
  { id: 4, type: "class" as const, title: "ACC 102 venue changed", body: "Now in LT5 instead of LT2", time: "1d ago", read: true, icon: "MapPin" },
  { id: 5, type: "system" as const, title: "Timetable updated", body: "Your mid-semester timetable is ready", time: "1d ago", read: true, icon: "Clock" },
  { id: 6, type: "announcement" as const, title: "Library extended hours", body: "7AM–10PM during exam week", time: "2d ago", read: true, icon: "BookOpen" },
  { id: 7, type: "alert" as const, title: "Emergency: Water disruption", body: "Wednesday 6AM-2PM maintenance", time: "3h ago", read: false, icon: "AlertTriangle" },
  { id: 8, type: "event" as const, title: "Coding Bootcamp registration", body: "ICT Lab, May 1 at 2:00 PM", time: "3d ago", read: true, icon: "Calendar" },
];

export const events = [
  { id: 1, title: "Career Fair 2025", date: "Apr 20", time: "9:00 AM", location: "Main Auditorium", category: "Career", attendees: 245 },
  { id: 2, title: "Leadership Summit", date: "Apr 25", time: "10:00 AM", location: "Conference Hall", category: "Leadership", attendees: 120 },
  { id: 3, title: "Coding Bootcamp", date: "May 1", time: "2:00 PM", location: "ICT Lab", category: "Tech", attendees: 80 },
  { id: 4, title: "Cultural Night", date: "May 5", time: "6:00 PM", location: "Sports Complex", category: "Social", attendees: 500 },
];

export const todaySchedule = [
  { id: 1, course: "INFO 201", title: "Database Systems", time: "8:00 AM – 10:00 AM", venue: "LT3", lecturer: "Dr. Ama Serwaa", status: "completed" as const },
  { id: 2, course: "INFO 205", title: "Software Engineering", time: "10:30 AM – 12:30 PM", venue: "LT1", lecturer: "Prof. Kwame Asante", status: "ongoing" as const },
  { id: 3, course: "ACC 102", title: "Financial Accounting", time: "2:00 PM – 4:00 PM", venue: "LT5", lecturer: "Mrs. Efua Dadzie", status: "upcoming" as const },
];

export const weekSchedule = [
  { day: "Monday", classes: todaySchedule },
  { day: "Tuesday", classes: [
    { id: 4, course: "MKT 103", title: "Marketing Principles", time: "8:00 AM – 10:00 AM", venue: "LT2", lecturer: "Dr. Nana Osei", status: "upcoming" as const },
    { id: 5, course: "INFO 203", title: "Web Technologies", time: "1:00 PM – 3:00 PM", venue: "ICT Lab", lecturer: "Mr. Yaw Boateng", status: "upcoming" as const },
  ]},
  { day: "Wednesday", classes: [
    { id: 6, course: "INFO 201", title: "Database Systems", time: "8:00 AM – 10:00 AM", venue: "LT3", lecturer: "Dr. Ama Serwaa", status: "upcoming" as const },
    { id: 7, course: "ACC 102", title: "Financial Accounting", time: "2:00 PM – 4:00 PM", venue: "LT5", lecturer: "Mrs. Efua Dadzie", status: "upcoming" as const },
  ]},
  { day: "Thursday", classes: [
    { id: 8, course: "INFO 205", title: "Software Engineering", time: "10:00 AM – 12:00 PM", venue: "LT1", lecturer: "Prof. Kwame Asante", status: "upcoming" as const },
  ]},
  { day: "Friday", classes: [
    { id: 9, course: "MKT 103", title: "Marketing Principles", time: "8:00 AM – 10:00 AM", venue: "LT2", lecturer: "Dr. Nana Osei", status: "upcoming" as const },
    { id: 10, course: "INFO 203", title: "Web Technologies", time: "1:00 PM – 3:00 PM", venue: "ICT Lab", lecturer: "Mr. Yaw Boateng", status: "upcoming" as const },
  ]},
];

export const campusLocations = [
  { id: 1, name: "Lecture Theatre 1 (LT1)", category: "Academic", distance: "3 min walk", lat: 5.65, lng: -0.175 },
  { id: 2, name: "Lecture Theatre 3 (LT3)", category: "Academic", distance: "4 min walk", lat: 5.651, lng: -0.176 },
  { id: 3, name: "Main Library", category: "Academic", distance: "2 min walk", lat: 5.649, lng: -0.174 },
  { id: 4, name: "ICT Lab", category: "Academic", distance: "5 min walk", lat: 5.652, lng: -0.177 },
  { id: 5, name: "Admin Block", category: "Administrative", distance: "6 min walk", lat: 5.648, lng: -0.173 },
  { id: 6, name: "Banking Square", category: "Services", distance: "3 min walk", lat: 5.647, lng: -0.175 },
  { id: 7, name: "Print Hub", category: "Services", distance: "2 min walk", lat: 5.6495, lng: -0.1745 },
  { id: 8, name: "Student Center", category: "Social", distance: "4 min walk", lat: 5.651, lng: -0.174 },
  { id: 9, name: "Sports Complex", category: "Social", distance: "8 min walk", lat: 5.653, lng: -0.178 },
  { id: 10, name: "Cafeteria", category: "Services", distance: "1 min walk", lat: 5.6498, lng: -0.1748 },
];

export const services = [
  { id: 1, name: "Print Hub", category: "Printing", distance: "2 min", status: "open" as const, icon: "Printer" },
  { id: 2, name: "Academic Affairs", category: "Offices", distance: "6 min", status: "open" as const, icon: "Building2" },
  { id: 3, name: "ICT Help Desk", category: "Offices", distance: "5 min", status: "open" as const, icon: "Monitor" },
  { id: 4, name: "Library", category: "Academic", distance: "2 min", status: "open" as const, icon: "BookOpen" },
  { id: 5, name: "Student Affairs", category: "Offices", distance: "4 min", status: "busy" as const, icon: "Users" },
  { id: 6, name: "Washrooms (Main)", category: "Washrooms", distance: "1 min", status: "open" as const, icon: "Bath" },
  { id: 7, name: "WiFi Zone – Library", category: "WiFi Zones", distance: "2 min", status: "open" as const, icon: "Wifi" },
  { id: 8, name: "Banking Square ATM", category: "Services", distance: "3 min", status: "open" as const, icon: "CreditCard" },
  { id: 9, name: "Signatures Office", category: "Offices", distance: "7 min", status: "closed" as const, icon: "PenTool" },
];

export const marketplaceItems = [
  { id: 1, title: "Database Systems Textbook", category: "Textbooks", price: "GH₵ 85", seller: "Ama K.", condition: "Like New", image: "", posted: "1d ago" },
  { id: 2, title: "HP Laptop – 8GB RAM", category: "Gadgets", price: "GH₵ 2,800", seller: "Kwesi M.", condition: "Used – Good", image: "", posted: "2d ago" },
  { id: 3, title: "Calculus Tutoring", category: "Tutoring", price: "GH₵ 50/hr", seller: "Nana A.", condition: "Service", image: "", posted: "3h ago" },
  { id: 4, title: "Scientific Calculator", category: "Gadgets", price: "GH₵ 120", seller: "Efua D.", condition: "New", image: "", posted: "5h ago" },
  { id: 5, title: "Marketing Principles Notes", category: "Textbooks", price: "GH₵ 25", seller: "Yaw B.", condition: "Digital", image: "", posted: "1d ago" },
  { id: 6, title: "Graphic Design Services", category: "Services", price: "GH₵ 100", seller: "Akua R.", condition: "Service", image: "", posted: "4d ago" },
  { id: 7, title: "Accounting Past Questions", category: "Textbooks", price: "GH₵ 15", seller: "Kofi T.", condition: "Digital", image: "", posted: "2d ago" },
  { id: 8, title: "Internship Opportunity – FinTech", category: "Opportunities", price: "Free", seller: "Career Office", condition: "Listing", image: "", posted: "6h ago" },
];

export const resources = [
  { id: 1, title: "INFO 201 – Lecture Notes Week 1-6", category: "Lecture Notes", course: "INFO 201", type: "PDF", downloads: 342, uploadedBy: "Dr. Ama Serwaa" },
  { id: 2, title: "ACC 102 Past Questions 2023", category: "Past Questions", course: "ACC 102", type: "PDF", downloads: 567, uploadedBy: "Student Rep" },
  { id: 3, title: "Course Registration Form", category: "Forms", course: "General", type: "Form", downloads: 1200, uploadedBy: "Academic Affairs" },
  { id: 4, title: "MKT 103 – Mid-Sem Study Guide", category: "Lecture Notes", course: "MKT 103", type: "PDF", downloads: 189, uploadedBy: "Dr. Nana Osei" },
  { id: 5, title: "Student Portal Guide", category: "Guides", course: "General", type: "PDF", downloads: 890, uploadedBy: "ICT Services" },
  { id: 6, title: "INFO 205 – Lab Manual", category: "Lecture Notes", course: "INFO 205", type: "PDF", downloads: 234, uploadedBy: "Prof. Kwame Asante" },
  { id: 7, title: "Exam Deferral Application", category: "Forms", course: "General", type: "Form", downloads: 445, uploadedBy: "Examinations Office" },
  { id: 8, title: "UPSA Student Handbook 2024/25", category: "Guides", course: "General", type: "PDF", downloads: 2100, uploadedBy: "Student Affairs" },
];

export const officialLinks = [
  { id: 1, title: "Student Portal", url: "#", icon: "ExternalLink" },
  { id: 2, title: "E-Learning Platform", url: "#", icon: "Monitor" },
  { id: 3, title: "Library Catalog", url: "#", icon: "BookOpen" },
  { id: 4, title: "Fees Payment", url: "#", icon: "CreditCard" },
  { id: 5, title: "UPSA Website", url: "#", icon: "Globe" },
  { id: 6, title: "Results Checker", url: "#", icon: "FileCheck" },
];

export const adminStats = {
  activeUsers: 2847,
  announcementsSent: 156,
  engagementRate: 73,
  upcomingEvents: 12,
  weeklyEngagement: [65, 72, 68, 80, 73, 55, 48],
  growthTrend: [1200, 1450, 1680, 1920, 2100, 2450, 2847],
  recentActivity: [
    { action: "Announcement sent", detail: "INFO 201 venue change", time: "2h ago" },
    { action: "Event created", detail: "Career Fair 2025", time: "5h ago" },
    { action: "User registered", detail: "15 new students", time: "1d ago" },
    { action: "Report generated", detail: "Weekly engagement report", time: "2d ago" },
    { action: "Emergency alert", detail: "Water supply disruption", time: "3h ago" },
  ],
};

export const botSuggestions = [
  "Where is LT3?",
  "Where can I print?",
  "What's my next class?",
  "Any events today?",
  "Library opening hours?",
  "WiFi zones nearby?",
];

export const botResponses: Record<string, string> = {
  "where is lt3": "📍 **Lecture Theatre 3 (LT3)** is located on the east wing of the academic block, near the ICT Lab.\n\n🚶 **4 min walk** from your current location.\n\n💡 *Your next class INFO 201 starts here at 2:00 PM.*",
  "where can i print": "🖨️ **Print Hub** is located near the Main Library.\n\n🚶 **2 min walk** • Currently **Open**\n\n**Services:** B&W printing (₵0.50/page), Color printing (₵2.00/page), Binding, Lamination\n\n💡 *Tap to view route on map.*",
  "what's my next class": "📚 Your next class is **ACC 102 – Financial Accounting**\n\n🕐 **2:00 PM – 4:00 PM**\n📍 **LT5** • 5 min walk\n👩‍🏫 **Mrs. Efua Dadzie**\n\n💡 *You have about 1 hour before it starts.*",
  "any events today": "🎉 Here are today's events:\n\n1. **Career Fair 2025** – 9:00 AM at Main Auditorium (245 attending)\n2. **Leadership Summit** – 10:00 AM at Conference Hall\n\n💡 *Tap an event to RSVP or get directions.*",
  "library opening hours": "📖 **Main Library Hours:**\n\n🕐 Monday – Friday: **7:00 AM – 8:00 PM**\n🕐 Saturday: **9:00 AM – 5:00 PM**\n🕐 Sunday: **Closed**\n\n💡 *Extended hours (7AM–10PM) during exam week.*",
  "wifi zones nearby": "📶 **WiFi Zones Near You:**\n\n1. **Library WiFi** – 2 min walk • Strong signal\n2. **Student Center** – 4 min walk • Good signal\n3. **ICT Lab** – 5 min walk • Strong signal\n\n💡 *Connect with your student ID credentials.*",
};

// ============= Digital Queue System =============
export type QueueOffice = {
  id: string;
  name: string;
  category: string;
  icon: string;
  buildingId: number;
  hours: string;
  counters: { id: string; label: string; serving: string; status: "active" | "paused" | "closed" }[];
  nowServing: string;
  averageWaitMin: number;
  inQueue: number;
  ticketPrefix: string;
  nextNumber: number;
  recentCalls: { number: string; counter: string; time: string }[];
};

export const queueOffices: QueueOffice[] = [
  {
    id: "registrar",
    name: "Registrar's Office",
    category: "Academic Records",
    icon: "FileText",
    buildingId: 5,
    hours: "8:00 AM – 4:30 PM",
    counters: [
      { id: "R1", label: "Counter 1 · Transcripts", serving: "R-042", status: "active" },
      { id: "R2", label: "Counter 2 · Verifications", serving: "R-040", status: "active" },
      { id: "R3", label: "Counter 3 · Enrollment", serving: "R-038", status: "paused" },
    ],
    nowServing: "R-042",
    averageWaitMin: 18,
    inQueue: 14,
    ticketPrefix: "R",
    nextNumber: 56,
    recentCalls: [
      { number: "R-042", counter: "Counter 1", time: "just now" },
      { number: "R-041", counter: "Counter 2", time: "2 min ago" },
      { number: "R-040", counter: "Counter 2", time: "5 min ago" },
      { number: "R-039", counter: "Counter 1", time: "9 min ago" },
    ],
  },
  {
    id: "bursary",
    name: "Bursary",
    category: "Fees & Payments",
    icon: "CreditCard",
    buildingId: 5,
    hours: "8:30 AM – 4:00 PM",
    counters: [
      { id: "B1", label: "Counter 1 · Fees", serving: "B-128", status: "active" },
      { id: "B2", label: "Counter 2 · Refunds", serving: "B-126", status: "active" },
    ],
    nowServing: "B-128",
    averageWaitMin: 26,
    inQueue: 21,
    ticketPrefix: "B",
    nextNumber: 150,
    recentCalls: [
      { number: "B-128", counter: "Counter 1", time: "just now" },
      { number: "B-127", counter: "Counter 1", time: "4 min ago" },
      { number: "B-126", counter: "Counter 2", time: "7 min ago" },
    ],
  },
  {
    id: "ict",
    name: "ICT Help Desk",
    category: "IT Support",
    icon: "Monitor",
    buildingId: 4,
    hours: "8:00 AM – 6:00 PM",
    counters: [
      { id: "I1", label: "Counter 1 · Accounts", serving: "I-073", status: "active" },
      { id: "I2", label: "Counter 2 · Devices", serving: "I-070", status: "active" },
    ],
    nowServing: "I-073",
    averageWaitMin: 8,
    inQueue: 5,
    ticketPrefix: "I",
    nextNumber: 79,
    recentCalls: [
      { number: "I-073", counter: "Counter 1", time: "just now" },
      { number: "I-072", counter: "Counter 2", time: "3 min ago" },
      { number: "I-071", counter: "Counter 1", time: "6 min ago" },
    ],
  },
  {
    id: "studentaffairs",
    name: "Student Affairs",
    category: "Welfare & ID",
    icon: "Users",
    buildingId: 8,
    hours: "9:00 AM – 4:00 PM",
    counters: [
      { id: "S1", label: "Counter 1 · ID Cards", serving: "S-019", status: "active" },
      { id: "S2", label: "Counter 2 · Welfare", serving: "S-017", status: "closed" },
    ],
    nowServing: "S-019",
    averageWaitMin: 12,
    inQueue: 8,
    ticketPrefix: "S",
    nextNumber: 28,
    recentCalls: [
      { number: "S-019", counter: "Counter 1", time: "1 min ago" },
      { number: "S-018", counter: "Counter 1", time: "8 min ago" },
    ],
  },
];

// ============= Incident Reporting =============
export type IncidentStatus = "submitted" | "in-progress" | "resolved";
export type Incident = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  buildingId?: number;
  status: IncidentStatus;
  reportedBy: string;
  reportedAt: string;
  updates: { status: IncidentStatus; note: string; time: string }[];
  photo?: string;
};

export const incidentCategories = [
  { key: "facilities", label: "Facilities", icon: "Wrench" },
  { key: "security", label: "Security", icon: "Shield" },
  { key: "wifi", label: "WiFi / IT", icon: "Wifi" },
  { key: "cleaning", label: "Cleaning", icon: "Sparkles" },
  { key: "electrical", label: "Electrical", icon: "Zap" },
  { key: "plumbing", label: "Plumbing", icon: "Droplet" },
  { key: "other", label: "Other", icon: "AlertCircle" },
];

export const incidents: Incident[] = [
  {
    id: "INC-2841",
    category: "Electrical",
    title: "Flickering lights in LT3",
    description: "Front-row ceiling lights flicker during lectures.",
    location: "Lecture Theatre 3 (LT3)",
    buildingId: 2,
    status: "in-progress",
    reportedBy: "Kofi M.",
    reportedAt: "Today · 10:14",
    updates: [
      { status: "submitted", note: "Report received", time: "10:14" },
      { status: "in-progress", note: "Maintenance team dispatched", time: "11:02" },
    ],
  },
  {
    id: "INC-2837",
    category: "Plumbing",
    title: "Washroom tap leaking",
    description: "Tap near Library entrance leaking continuously.",
    location: "Main Library — Ground Floor",
    buildingId: 3,
    status: "resolved",
    reportedBy: "Ama K.",
    reportedAt: "Yesterday · 14:22",
    updates: [
      { status: "submitted", note: "Report received", time: "Yesterday 14:22" },
      { status: "in-progress", note: "Plumber dispatched", time: "Yesterday 15:40" },
      { status: "resolved", note: "Tap replaced", time: "Yesterday 17:05" },
    ],
  },
  {
    id: "INC-2830",
    category: "WiFi / IT",
    title: "Slow WiFi at Student Center",
    description: "Speeds drop to <1 Mbps during peak hours.",
    location: "Student Center",
    buildingId: 8,
    status: "submitted",
    reportedBy: "Yaw B.",
    reportedAt: "Today · 09:01",
    updates: [
      { status: "submitted", note: "Report received", time: "09:01" },
    ],
  },
];

// ============= Empty Space Finder =============
export type SpaceType = "classroom" | "study" | "lab";
export type CampusSpace = {
  id: string;
  name: string;
  type: SpaceType;
  buildingId: number;
  capacity: number;
  occupied: number;
  nextBookedAt?: string;
  amenities: string[];
  reservable: boolean;
  walkingMin: number;
  noise: "quiet" | "moderate" | "lively";
};

export const campusSpaces: CampusSpace[] = [
  { id: "sp-1", name: "LT1 — Main Hall", type: "classroom", buildingId: 1, capacity: 120, occupied: 0, nextBookedAt: "2:00 PM (ACC 102)", amenities: ["Projector", "AC"], reservable: false, walkingMin: 3, noise: "quiet" },
  { id: "sp-2", name: "LT3 — North Wing", type: "classroom", buildingId: 2, capacity: 90, occupied: 12, nextBookedAt: "10:30 AM", amenities: ["Projector", "Whiteboard"], reservable: true, walkingMin: 4, noise: "quiet" },
  { id: "sp-3", name: "Library — Silent Pods", type: "study", buildingId: 3, capacity: 24, occupied: 18, amenities: ["Power", "Wi-Fi", "Silent"], reservable: true, walkingMin: 2, noise: "quiet" },
  { id: "sp-4", name: "Library — Group Room A", type: "study", buildingId: 3, capacity: 8, occupied: 0, nextBookedAt: "1:00 PM", amenities: ["Whiteboard", "Display"], reservable: true, walkingMin: 2, noise: "moderate" },
  { id: "sp-5", name: "ICT Lab 2", type: "lab", buildingId: 4, capacity: 40, occupied: 6, amenities: ["Workstations", "Wi-Fi", "AC"], reservable: false, walkingMin: 5, noise: "moderate" },
  { id: "sp-6", name: "ICT Lab 3", type: "lab", buildingId: 4, capacity: 40, occupied: 36, amenities: ["Workstations", "Wi-Fi"], reservable: false, walkingMin: 5, noise: "lively" },
  { id: "sp-7", name: "Student Center — Lounge", type: "study", buildingId: 8, capacity: 30, occupied: 11, amenities: ["Wi-Fi", "Cafe nearby"], reservable: false, walkingMin: 4, noise: "lively" },
  { id: "sp-8", name: "LT3 — Tutorial Room B", type: "classroom", buildingId: 2, capacity: 30, occupied: 2, nextBookedAt: "3:00 PM", amenities: ["Whiteboard"], reservable: true, walkingMin: 4, noise: "quiet" },
];

// ============= Opportunity Feed =============
export type OpportunityType = "internship" | "scholarship" | "job" | "competition";
export type Opportunity = {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  location: string;
  stipend?: string;
  deadline: string; // ISO date
  postedAt: string;
  tags: string[];
  description: string;
  applyUrl: string;
  logoColor: string; // tailwind gradient suffix
  featured?: boolean;
  eligibility?: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "OPP-101",
    type: "internship",
    title: "Software Engineering Intern",
    organization: "MTN Ghana",
    location: "Accra · Hybrid",
    stipend: "GH₵ 2,500/mo",
    deadline: "2025-05-02",
    postedAt: "2d ago",
    tags: ["React", "Node.js", "3 months"],
    description: "Join the Digital Products squad to ship customer-facing features for MyMTN.",
    applyUrl: "https://careers.mtn.com",
    logoColor: "from-warning to-primary",
    featured: true,
    eligibility: "Level 300+ · IT, CS",
  },
  {
    id: "OPP-102",
    type: "scholarship",
    title: "MasterCard Foundation Scholars Program",
    organization: "MasterCard Foundation",
    location: "Full tuition + stipend",
    deadline: "2025-05-15",
    postedAt: "5h ago",
    tags: ["Full ride", "Leadership"],
    description: "Comprehensive scholarship for academically talented yet economically disadvantaged students.",
    applyUrl: "https://mastercardfdn.org/scholars",
    logoColor: "from-accent to-primary",
    featured: true,
    eligibility: "All faculties · GPA 3.5+",
  },
  {
    id: "OPP-103",
    type: "job",
    title: "Junior Data Analyst",
    organization: "Stanbic Bank Ghana",
    location: "Accra · On-site",
    stipend: "GH₵ 4,200/mo",
    deadline: "2025-04-28",
    postedAt: "1d ago",
    tags: ["SQL", "Power BI", "Entry-level"],
    description: "Support the Risk team with reporting dashboards and ad-hoc analysis.",
    applyUrl: "https://stanbicbank.com.gh/careers",
    logoColor: "from-success to-accent",
    eligibility: "BSc graduates · Class of 2024/25",
  },
  {
    id: "OPP-104",
    type: "competition",
    title: "Ghana FinTech Hackathon 2025",
    organization: "Bank of Ghana × Ashesi",
    location: "Accra · 48 hours",
    stipend: "GH₵ 50,000 prize pool",
    deadline: "2025-05-10",
    postedAt: "3d ago",
    tags: ["Team of 4", "FinTech", "Pitch"],
    description: "Build the next generation of inclusive financial products. Mentorship + investor demo day.",
    applyUrl: "https://fintechgh.org/hack",
    logoColor: "from-primary to-accent",
    featured: true,
    eligibility: "Open to all students",
  },
  {
    id: "OPP-105",
    type: "internship",
    title: "Marketing & Brand Intern",
    organization: "Unilever Ghana",
    location: "Tema · On-site",
    stipend: "GH₵ 1,800/mo",
    deadline: "2025-05-20",
    postedAt: "6h ago",
    tags: ["Brand", "Social", "6 weeks"],
    description: "Support the Beauty & Personal Care brand team for the summer campaign window.",
    applyUrl: "https://unilever.com.gh/careers",
    logoColor: "from-accent to-warning",
    eligibility: "Marketing, Communications",
  },
  {
    id: "OPP-106",
    type: "scholarship",
    title: "GETFund Postgraduate Award",
    organization: "Government of Ghana",
    location: "Tuition support",
    deadline: "2025-06-01",
    postedAt: "1w ago",
    tags: ["Postgraduate", "Need-based"],
    description: "Tuition grant for outstanding final-year students proceeding to MSc/MPhil programs.",
    applyUrl: "https://getfund.gov.gh",
    logoColor: "from-success to-primary",
    eligibility: "Final-year, GPA 3.0+",
  },
  {
    id: "OPP-107",
    type: "job",
    title: "Customer Success Associate",
    organization: "Hubtel",
    location: "Accra · Hybrid",
    stipend: "GH₵ 3,500/mo",
    deadline: "2025-05-05",
    postedAt: "12h ago",
    tags: ["B2B SaaS", "Communication"],
    description: "Own the post-sale relationship with Hubtel's mid-market merchants.",
    applyUrl: "https://hubtel.com/careers",
    logoColor: "from-primary to-success",
    eligibility: "Any discipline",
  },
  {
    id: "OPP-108",
    type: "competition",
    title: "UPSA Innovation Challenge",
    organization: "UPSA Entrepreneurship Hub",
    location: "On-campus",
    stipend: "GH₵ 15,000 + incubation",
    deadline: "2025-04-30",
    postedAt: "4d ago",
    tags: ["Solo or team", "Pitch deck"],
    description: "Pitch your venture idea to the UPSA Innovation Board for incubation and seed support.",
    applyUrl: "https://upsa.edu.gh/innovate",
    logoColor: "from-warning to-destructive",
    eligibility: "All UPSA students",
  },
];

// ============= Smart Notification Engine =============
export type NotifPriority = "critical" | "high" | "normal" | "low";
export type NotifCategory = "class" | "deadline" | "queue" | "location" | "announcement" | "opportunity";
export type SmartNotif = {
  id: string;
  category: NotifCategory;
  priority: NotifPriority;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  actionLabel?: string;
  actionPath?: string;
};

export const smartNotifications: SmartNotif[] = [
  { id: "n-1", category: "class", priority: "critical", title: "INFO 205 starts in 12 min", body: "LT1 · Prof. Kwame Asante. 4 min walk from your location.", time: "now", read: false, icon: "Timer", actionLabel: "Navigate", actionPath: "/map?to=1" },
  { id: "n-2", category: "queue", priority: "high", title: "You're #3 in the Bursary queue", body: "Estimated wait: 6 min. Counter 1 currently serving B-128.", time: "2 min ago", read: false, icon: "Ticket", actionLabel: "View ticket", actionPath: "/queues" },
  { id: "n-3", category: "deadline", priority: "high", title: "Course registration closes Friday", body: "5:00 PM hard deadline. 2 outstanding courses on your record.", time: "1h ago", read: false, icon: "AlertTriangle", actionLabel: "Open portal", actionPath: "/resources" },
  { id: "n-4", category: "opportunity", priority: "high", title: "MTN Internship deadline in 13 days", body: "Matches your IT major and Level 300 status.", time: "3h ago", read: false, icon: "Briefcase", actionLabel: "Apply", actionPath: "/opportunities" },
  { id: "n-5", category: "location", priority: "normal", title: "Library — Group Room A is free", body: "You bookmarked this space yesterday. 2 min walk.", time: "20 min ago", read: false, icon: "MapPin", actionLabel: "Reserve", actionPath: "/spaces" },
  { id: "n-6", category: "class", priority: "normal", title: "ACC 102 venue confirmed: LT5", body: "No room change today. Lecture begins 2:00 PM.", time: "4h ago", read: true, icon: "Calendar" },
  { id: "n-7", category: "announcement", priority: "normal", title: "New WiFi zone live at Sports Complex", body: "Connect with your student credentials.", time: "1d ago", read: true, icon: "Wifi" },
  { id: "n-8", category: "deadline", priority: "low", title: "Library book due in 3 days", body: "Database Systems (Elmasri) — return or renew online.", time: "1d ago", read: true, icon: "BookOpen", actionLabel: "Renew", actionPath: "/resources" },
  { id: "n-9", category: "location", priority: "low", title: "Print Hub queue cleared", body: "No wait right now if you need to print.", time: "2d ago", read: true, icon: "Printer" },
];

// ============= Command Center metrics =============
export const commandCenter = {
  liveActiveUsers: 1247,
  activeUsersTrend: [820, 910, 1080, 1190, 1340, 1420, 1247],
  classesInSession: 38,
  classesTotalToday: 142,
  hourlyActivity: [
    { hour: "7", value: 120 }, { hour: "8", value: 480 }, { hour: "9", value: 920 },
    { hour: "10", value: 1180 }, { hour: "11", value: 1320 }, { hour: "12", value: 980 },
    { hour: "13", value: 760 }, { hour: "14", value: 1240 }, { hour: "15", value: 1180 },
    { hour: "16", value: 920 }, { hour: "17", value: 540 }, { hour: "18", value: 220 },
  ],
  engagementByFeature: [
    { feature: "Map", pct: 78 },
    { feature: "Schedule", pct: 71 },
    { feature: "Bot", pct: 64 },
    { feature: "Queues", pct: 52 },
    { feature: "Resources", pct: 47 },
    { feature: "Spaces", pct: 39 },
  ],
  bottlenecks: [
    { id: "b-1", label: "Bursary queue", detail: "21 in line · avg wait 26 min", severity: "critical" as const, path: "/queues" },
    { id: "b-2", label: "WiFi at Student Center", detail: "12 reports in 2h", severity: "high" as const, path: "/incidents" },
    { id: "b-3", label: "ICT Lab 3 occupancy", detail: "36 / 40 seats taken", severity: "high" as const, path: "/spaces" },
    { id: "b-4", label: "Print Hub paper out", detail: "Reported 8 min ago", severity: "medium" as const, path: "/incidents" },
  ],
  criticalAlerts: [
    { id: "a-1", title: "Water disruption — Wed 6AM-2PM", source: "Facilities", time: "3h ago", severity: "critical" as const },
    { id: "a-2", title: "Registration closes Friday 5PM", source: "Academic Affairs", time: "5h ago", severity: "high" as const },
    { id: "a-3", title: "Career Fair tomorrow 9AM", source: "Career Office", time: "6h ago", severity: "info" as const },
  ],
  topReportedIssues: [
    { label: "WiFi / IT", count: 18, pct: 32 },
    { label: "Electrical", count: 11, pct: 20 },
    { label: "Plumbing", count: 9, pct: 16 },
    { label: "Cleaning", count: 8, pct: 14 },
    { label: "Facilities", count: 6, pct: 11 },
    { label: "Other", count: 4, pct: 7 },
  ],
};

