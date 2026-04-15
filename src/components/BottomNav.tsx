import { Link, useLocation } from "react-router-dom";
import { Home, Map, MessageSquare, Calendar, User, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { notifications } from "@/data/mockData";

const unreadCount = notifications.filter(n => !n.read).length;

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/map", icon: Map, label: "Map" },
  { path: "/bot", icon: MessageSquare, label: "Bot" },
  { path: "/schedule", icon: Calendar, label: "Schedule" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
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
                {/* Notification badge on Home icon */}
                {path === "/home" && unreadCount > 0 && (
                  <Link to="/notifications" onClick={(e) => e.stopPropagation()}>
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center z-20">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </Link>
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
