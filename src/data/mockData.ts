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
  { id: 1, title: "INFO 201 moved to LT3", body: "Effective immediately, all INFO 201 lectures will hold in LT3. Please take note.", type: "urgent" as const, time: "2h ago", department: "IT Department" },
  { id: 2, title: "Registration closes Friday", body: "Course registration for the semester closes this Friday at 5:00 PM. Complete yours now.", type: "important" as const, time: "5h ago", department: "Academic Affairs" },
  { id: 3, title: "Mid-semester timetable released", body: "The mid-semester examination timetable is now available on the student portal.", type: "info" as const, time: "1d ago", department: "Examinations Office" },
  { id: 4, title: "Library extended hours", body: "The library will operate extended hours (7AM–10PM) during exam preparation week.", type: "info" as const, time: "2d ago", department: "Library Services" },
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
