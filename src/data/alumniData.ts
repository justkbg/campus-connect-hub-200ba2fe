export type AlumniIndustry =
  | "Tech" | "Finance" | "Consulting" | "Public Sector" | "Healthcare"
  | "Education" | "Media" | "Energy" | "Entrepreneur" | "Other";

export type Alumnus = {
  id: string;
  name: string;
  initials: string;
  gradYear: number;
  programme: string;
  role: string;
  company: string;
  industry: AlumniIndustry;
  city: string;
  mentor: boolean;
  bio: string;
};

export const alumni: Alumnus[] = [
  { id: "a1", name: "Akosua Boateng", initials: "AB", gradYear: 2014, programme: "BSc IT", role: "Senior Engineer", company: "Hubtel", industry: "Tech", city: "Accra", mentor: true, bio: "Building payment rails. Open to mentoring final-year IT students." },
  { id: "a2", name: "Daniel Owusu", initials: "DO", gradYear: 2018, programme: "BBA Finance", role: "Investment Analyst", company: "Databank", industry: "Finance", city: "Accra", mentor: true, bio: "Capital markets, equity research." },
  { id: "a3", name: "Selina Quartey", initials: "SQ", gradYear: 2016, programme: "BSc Marketing", role: "Brand Director", company: "MTN Ghana", industry: "Media", city: "Accra", mentor: true, bio: "Brand storytelling and growth." },
  { id: "a4", name: "Kwabena Asare", initials: "KA", gradYear: 2010, programme: "BSc Accounting", role: "Partner", company: "PwC", industry: "Consulting", city: "London", mentor: true, bio: "Audit & advisory. Happy to chat ACCA paths." },
  { id: "a5", name: "Gifty Nyarko", initials: "GN", gradYear: 2020, programme: "BSc IT", role: "Product Manager", company: "Flutterwave", industry: "Tech", city: "Lagos", mentor: true, bio: "PM-craft, fintech, career switching into product." },
  { id: "a6", name: "Yaw Mensah", initials: "YM", gradYear: 2012, programme: "BBA HR", role: "Director of People", company: "Vodafone", industry: "Tech", city: "Accra", mentor: false, bio: "" },
  { id: "a7", name: "Naa Adoley", initials: "NA", gradYear: 2019, programme: "BSc Banking", role: "Risk Analyst", company: "Bank of Ghana", industry: "Public Sector", city: "Accra", mentor: true, bio: "Macro risk and policy." },
  { id: "a8", name: "Kojo Tetteh", initials: "KT", gradYear: 2008, programme: "BBA Marketing", role: "Founder", company: "OkadaMart", industry: "Entrepreneur", city: "Kumasi", mentor: true, bio: "Bootstrapped a logistics SME from scratch." },
  { id: "a9", name: "Ama Frempong", initials: "AF", gradYear: 2022, programme: "BSc IT", role: "Software Engineer", company: "Google", industry: "Tech", city: "Dublin", mentor: true, bio: "Distributed systems. Ask me about interview prep." },
  { id: "a10", name: "Felix Adjei", initials: "FA", gradYear: 2015, programme: "BSc Energy", role: "Project Lead", company: "Tullow Oil", industry: "Energy", city: "Takoradi", mentor: false, bio: "" },
  { id: "a11", name: "Mavis Antwi", initials: "MA", gradYear: 2017, programme: "BSc Health Admin", role: "Hospital Administrator", company: "Korle Bu", industry: "Healthcare", city: "Accra", mentor: true, bio: "Operations in public health." },
  { id: "a12", name: "Joseph Annan", initials: "JA", gradYear: 2011, programme: "BSc Education", role: "School Principal", company: "Achimota School", industry: "Education", city: "Accra", mentor: true, bio: "Curriculum design & EdTech." },
];

export const alumniIndustries: AlumniIndustry[] = [
  "Tech", "Finance", "Consulting", "Public Sector", "Healthcare", "Education", "Media", "Energy", "Entrepreneur", "Other",
];

export const reunionEvents = [
  { id: "r1", title: "Class of 2014 — 10 Year Reunion", date: "Jun 14", time: "6:00 PM", venue: "Conference Hall", going: 87, cohort: "2014" },
  { id: "r2", title: "Homecoming Weekend", date: "Aug 23", time: "All day", venue: "Main Campus", going: 312, cohort: "All cohorts" },
  { id: "r3", title: "Alumni × Industry Mixer", date: "May 30", time: "5:30 PM", venue: "Banking Square", going: 64, cohort: "2010–2020" },
  { id: "r4", title: "Founders Circle Dinner", date: "Jul 12", time: "7:00 PM", venue: "Auditorium", going: 28, cohort: "Entrepreneurs" },
];

export const givingCauses = [
  { id: "g1", title: "Need-based Scholarship Fund", goal: 250000, raised: 138400, donors: 412, currency: "GHS" },
  { id: "g2", title: "ICT Lab Equipment Drive", goal: 80000, raised: 64200, donors: 196, currency: "GHS" },
  { id: "g3", title: "Library Modernisation", goal: 150000, raised: 41200, donors: 97, currency: "GHS" },
];

// ===== Parent Portal mock =====
export const parentChild = {
  id: "STU-2024-0847",
  name: "Kofi Mensah",
  initials: "KM",
  programme: "BSc Information Technology",
  level: "Level 300",
  attendance: { rate: 92, present: 46, total: 50, trend: "+3%" },
  fees: {
    total: 8400, paid: 6200, currency: "GHS",
    nextDue: "May 15", status: "partial" as const,
    breakdown: [
      { label: "Tuition", amount: 6000, paid: 6000 },
      { label: "Hostel", amount: 1800, paid: 200 },
      { label: "Library & Tech levy", amount: 600, paid: 0 },
    ],
  },
  exams: [
    { id: "e1", course: "INFO 201", title: "Database Systems", date: "May 12", time: "9:00 AM", venue: "LT3" },
    { id: "e2", course: "INFO 205", title: "Software Engineering", date: "May 15", time: "1:00 PM", venue: "LT1" },
    { id: "e3", course: "ACC 102", title: "Financial Accounting", date: "May 18", time: "9:00 AM", venue: "LT5" },
  ],
  announcements: [
    { id: "p1", title: "Mid-semester results published", body: "Login to the parent portal to view results.", time: "1d ago" },
    { id: "p2", title: "Parents' day — Jun 7", body: "Open day with lecturer one-on-ones.", time: "3d ago" },
    { id: "p3", title: "Hostel balance reminder", body: "GHS 1,600 outstanding on hostel fees.", time: "5d ago" },
  ],
  lecturers: [
    { id: "l1", name: "Dr. Ama Serwaa", course: "INFO 201", email: "ama.serwaa@upsa.edu.gh" },
    { id: "l2", name: "Prof. Kwame Asante", course: "INFO 205", email: "kwame.asante@upsa.edu.gh" },
    { id: "l3", name: "Mrs. Efua Dadzie", course: "ACC 102", email: "efua.dadzie@upsa.edu.gh" },
  ],
};

// ===== Live Campus Density (per building) =====
export type DensityLevel = "low" | "medium" | "high" | "peak";

export const campusDensity: Array<{ id: string; name: string; pct: number; level: DensityLevel; people: number }> = [
  { id: "lib", name: "Main Library", pct: 88, level: "peak", people: 412 },
  { id: "lt1", name: "Lecture Theatre 1", pct: 72, level: "high", people: 198 },
  { id: "lt3", name: "Lecture Theatre 3", pct: 64, level: "high", people: 174 },
  { id: "ict", name: "ICT Lab", pct: 51, level: "medium", people: 96 },
  { id: "caf", name: "Cafeteria", pct: 47, level: "medium", people: 142 },
  { id: "bank", name: "Banking Square", pct: 28, level: "low", people: 38 },
  { id: "admin", name: "Admin Block", pct: 35, level: "medium", people: 52 },
  { id: "sport", name: "Sports Complex", pct: 18, level: "low", people: 24 },
];

export const topServicesInDemand = [
  { id: "s1", name: "Bursary", waiting: 24, eta: "~32 min" },
  { id: "s2", name: "Registrar", waiting: 18, eta: "~24 min" },
  { id: "s3", name: "ICT Help Desk", waiting: 9, eta: "~12 min" },
  { id: "s4", name: "Library Loans", waiting: 6, eta: "~7 min" },
];

export const liveAlerts = [
  { id: "la1", title: "Water disruption · Wed 6AM-2PM", severity: "critical" as const, source: "Facilities" },
  { id: "la2", title: "Bursary queue surging", severity: "high" as const, source: "Operations" },
];
