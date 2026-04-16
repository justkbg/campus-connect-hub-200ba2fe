import { motion } from "framer-motion";
import { Bell, Search, MapPin, MessageSquare, Calendar, Briefcase, ChevronRight, Clock, AlertTriangle, Megaphone, BookOpen, ShoppingBag, Link2, FolderOpen, Navigation } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import StatusBadge from "@/components/StatusBadge";
import { currentUser, announcements, events, todaySchedule, notifications } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";
import { Link } from "react-router-dom";

const quickActions = [
  { icon: MessageSquare, label: "Ask Bot", path: "/bot", color: "bg-primary/10 text-primary" },
  { icon: MapPin, label: "Map", path: "/map", color: "bg-accent/10 text-accent" },
  { icon: Calendar, label: "Timetable", path: "/schedule", color: "bg-success/10 text-success" },
  { icon: Briefcase, label: "Services", path: "/services", color: "bg-warning/10 text-warning" },
  { icon: FolderOpen, label: "Resources", path: "/resources", color: "bg-primary/10 text-primary" },
  { icon: ShoppingBag, label: "Market", path: "/marketplace", color: "bg-accent/10 text-accent" },
  { icon: Link2, label: "Links", path: "/resources", color: "bg-success/10 text-success" },
  { icon: BookOpen, label: "Notes", path: "/resources", color: "bg-warning/10 text-warning" },
];

const announcementIcons = { urgent: AlertTriangle, important: Megaphone, info: Bell };

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const unreadCount = notifications.filter(n => !n.read).length;

export default function HomePage() {
  const nextClass = todaySchedule.find((c) => c.status === "upcoming" || c.status === "ongoing");
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Hero */}
        <div className="gradient-hero px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-primary-foreground/60 text-xs font-medium">{now.toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" })}</p>
              <h1 className="text-xl font-bold text-primary-foreground mt-0.5">{greeting}, {currentUser.firstName} 👋</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/notifications" className="relative w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-primary-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center border-2 border-primary">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">{currentUser.firstName[0]}</span>
              </Link>
            </div>
          </div>

          {/* Next class card */}
          {nextClass && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary-foreground/15 backdrop-blur-xl rounded-2xl p-4 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-primary-foreground/70" />
                <span className="text-[11px] font-medium text-primary-foreground/70">
                  {nextClass.status === "ongoing" ? "Happening now" : "Up next"}
                </span>
                <StatusBadge status={nextClass.status} />
              </div>
              <p className="text-sm font-semibold text-primary-foreground">{nextClass.course} — {nextClass.title}</p>
              <p className="text-xs text-primary-foreground/60 mt-1">{nextClass.time} • {nextClass.venue} • {nextClass.lecturer}</p>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-5 -mt-4">
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map(({ icon: Icon, label, path, color }) => (
              <Link key={label} to={path}
                className="flex flex-col items-center gap-1.5 bg-card rounded-2xl p-3 shadow-card active:scale-95 transition-transform">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-5 mt-5">
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search campus, courses, events…</span>
          </div>
        </div>

        {/* Announcements */}
        <motion.section variants={stagger} initial="hidden" animate="show" className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Announcements</h2>
            <Link to="/notifications" className="text-xs text-primary font-medium">See all</Link>
          </div>
          <div className="space-y-2.5">
            {announcements.slice(0, 3).map((a) => {
              const Icon = announcementIcons[a.type];
              return (
                <motion.div key={a.id} variants={fadeUp} className="bg-card rounded-2xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      a.type === "urgent" ? "bg-destructive/10" : a.type === "important" ? "bg-warning/10" : "bg-accent/10"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        a.type === "urgent" ? "text-destructive" : a.type === "important" ? "text-warning" : "text-accent"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <StatusBadge status={a.type} />
                        <span className="text-[11px] text-muted-foreground">{a.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.department}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Events */}
        <section className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Upcoming Events</h2>
            <span className="text-xs text-primary font-medium">See all</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {events.map((e) => (
              <div key={e.id} className="min-w-[200px] bg-card rounded-2xl p-4 shadow-card flex-shrink-0">
                <div className="text-xs font-semibold text-primary mb-2">{e.date}</div>
                <p className="text-sm font-semibold text-foreground mb-1">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.time} • {e.location}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-muted border-2 border-card" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground ml-1">{e.attendees} going</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="mt-6 px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Today's Classes</h2>
            <Link to="/schedule" className="text-xs text-primary font-medium">Full schedule</Link>
          </div>
          <div className="space-y-2">
            {todaySchedule.map((c) => (
              <div key={c.id} className={`bg-card rounded-2xl p-4 shadow-card border-l-[3px] ${
                c.status === "ongoing" ? "border-l-success" : c.status === "upcoming" ? "border-l-accent" : "border-l-muted"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-primary">{c.course}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.time} • {c.venue}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNav />
    </PageShell>
  );
}
