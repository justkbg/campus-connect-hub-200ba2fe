import { motion } from "framer-motion";
import { ArrowLeft, Users, Megaphone, TrendingUp, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { adminStats } from "@/data/mockData";

const statCards = [
  { icon: Users, label: "Active Users", value: adminStats.activeUsers.toLocaleString(), color: "bg-accent/10 text-accent" },
  { icon: Megaphone, label: "Announcements", value: adminStats.announcementsSent.toString(), color: "bg-primary/10 text-primary" },
  { icon: TrendingUp, label: "Engagement", value: `${adminStats.engagementRate}%`, color: "bg-success/10 text-success" },
  { icon: Calendar, label: "Events", value: adminStats.upcomingEvents.toString(), color: "bg-warning/10 text-warning" },
];

export default function AdminPage() {
  const maxEngagement = Math.max(...adminStats.weeklyEngagement);
  const maxGrowth = Math.max(...adminStats.growthTrend);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <PageShell padBottom={false}>
      <div className="max-w-2xl mx-auto px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Campus Intelligence Overview</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Engagement Chart */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
          <h2 className="text-sm font-bold text-foreground mb-4">Weekly Engagement</h2>
          <div className="flex items-end gap-2 h-32">
            {adminStats.weeklyEngagement.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / maxEngagement) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="w-full rounded-lg gradient-primary min-h-[4px]"
                />
                <span className="text-[10px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
          <h2 className="text-sm font-bold text-foreground mb-4">User Growth</h2>
          <div className="flex items-end gap-2 h-28">
            {adminStats.growthTrend.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / maxGrowth) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="w-full rounded-lg bg-accent/80 min-h-[4px]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="text-sm font-bold text-foreground mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {adminStats.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail} • {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
