import { Link, useLocation } from "react-router-dom";
import {
  Home, Map, MessageSquare, Calendar, User, Bell, Compass,
  LayoutDashboard, ShieldCheck, Briefcase, GraduationCap, Heart, Users,
  Building2, Megaphone, Wallet, ShoppingBag, Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
import { notifications } from "@/data/mockData";
import { useRole, type AppRole } from "@/contexts/RoleContext";

const unreadCount = notifications.filter(n => !n.read).length;

type Tab = { path: string; icon: any; label: string };

const TABS_BY_ROLE: Record<AppRole, Tab[]> = {
  student: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/map", icon: Map, label: "Map" },
    { path: "/bot", icon: MessageSquare, label: "Bot" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  lecturer: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/lecturer", icon: GraduationCap, label: "Teach" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/inbox", icon: Bell, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  course_rep: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/course-rep", icon: Megaphone, label: "Class" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/inbox", icon: Bell, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  admin: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/admin", icon: ShieldCheck, label: "Admin" },
    { path: "/queues", icon: Ticket, label: "Queues" },
    { path: "/inbox", icon: Bell, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  leadership: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/command-center", icon: LayoutDashboard, label: "Center" },
    { path: "/admin", icon: ShieldCheck, label: "Ops" },
    { path: "/inbox", icon: Bell, label: "Alerts" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  visitor: [
    { path: "/visit", icon: Home, label: "Home" },
    { path: "/map", icon: Map, label: "Map" },
    { path: "/arrival", icon: Compass, label: "Arrive" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  applicant: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/visit", icon: Building2, label: "Campus" },
    { path: "/opportunities", icon: Briefcase, label: "Apply" },
    { path: "/bot", icon: MessageSquare, label: "Bot" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  parent: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/parent", icon: GraduationCap, label: "Child" },
    { path: "/inbox", icon: Bell, label: "Updates" },
    { path: "/visit", icon: Map, label: "Campus" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  alumni: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/alumni", icon: Users, label: "Network" },
    { path: "/opportunities", icon: Briefcase, label: "Jobs" },
    { path: "/inbox", icon: Bell, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
  vendor: [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/marketplace", icon: ShoppingBag, label: "Listings" },
    { path: "/queues", icon: Wallet, label: "Orders" },
    { path: "/inbox", icon: Bell, label: "Inbox" },
    { path: "/profile", icon: User, label: "Profile" },
  ],
};

export default function BottomNav() {
  const { pathname } = useLocation();
  const { role } = useRole();
  const tabs = TABS_BY_ROLE[role] ?? TABS_BY_ROLE.student;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          const isHome = path === "/home" || path === "/visit";
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 relative px-3 py-1">
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 rounded-xl gradient-primary opacity-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                {isHome && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center z-20">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
