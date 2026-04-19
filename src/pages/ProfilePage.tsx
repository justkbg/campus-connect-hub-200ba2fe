import { motion } from "framer-motion";
import { Settings, Bell, HelpCircle, LogOut, Moon, ChevronRight, BookOpen, Calendar, Flame, ShoppingBag, FolderOpen, Users, Shield, UserCog } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { currentUser } from "@/data/mockData";
import { useRole, ROLE_PROFILES, AppRole } from "@/contexts/RoleContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const stats = [
    { icon: BookOpen, label: "Read", value: currentUser.stats.announcementsRead },
    { icon: Calendar, label: "Events", value: currentUser.stats.eventsJoined },
    { icon: Flame, label: "Streak", value: `${currentUser.stats.streak}d` },
  ];

  const menuItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: FolderOpen, label: "Resources", path: "/resources" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Settings, label: "Settings", path: "" },
    { icon: HelpCircle, label: "Support", path: "" },
  ];

  const portalItems = [
    { icon: Users, label: "Lecturer Portal", path: "/lecturer", desc: "Manage courses & students" },
    { icon: Users, label: "Course Rep Portal", path: "/course-rep", desc: "Class notices & polls" },
    { icon: Shield, label: "Admin Dashboard", path: "/admin", desc: "Campus management" },
  ];

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary-foreground">{currentUser.firstName[0]}{currentUser.name.split(" ")[1]?.[0]}</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">{currentUser.name}</h1>
            <p className="text-xs text-muted-foreground">{currentUser.department} • {currentUser.level}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{currentUser.id}</p>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-3 mt-5">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex-1 bg-card rounded-2xl p-3 shadow-card text-center">
                <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="px-5 space-y-2">
          {/* Dark mode toggle */}
          <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><Moon className="w-4 h-4 text-foreground" /></div>
            <span className="flex-1 text-sm font-medium text-foreground">Dark Mode</span>
            <button onClick={toggleDark}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${dark ? "bg-primary" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${dark ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {menuItems.map(({ icon: Icon, label, path }) => (
            path ? (
              <Link key={label} to={path} className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><Icon className="w-4 h-4 text-foreground" /></div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ) : (
              <button key={label} className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><Icon className="w-4 h-4 text-foreground" /></div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )
          ))}

          {/* Role portals */}
          <div className="pt-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Portals</p>
            {portalItems.map(({ icon: Icon, label, path, desc }) => (
              <Link key={label} to={path} className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground block">{label}</span>
                  <span className="text-[11px] text-muted-foreground">{desc}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <button onClick={() => navigate("/")} className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center gap-3 mt-2">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center"><LogOut className="w-4 h-4 text-destructive" /></div>
            <span className="flex-1 text-left text-sm font-medium text-destructive">Sign Out</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
