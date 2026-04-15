import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Megaphone, BarChart3, Calendar, Bell, MessageSquare, Users, Send, CheckCircle2, Vote } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";

const quickActions = [
  { icon: Megaphone, label: "Class Notice", color: "bg-primary/10 text-primary" },
  { icon: Vote, label: "Create Poll", color: "bg-accent/10 text-accent" },
  { icon: Calendar, label: "Plan Event", color: "bg-success/10 text-success" },
  { icon: Bell, label: "Reminder", color: "bg-warning/10 text-warning" },
  { icon: MessageSquare, label: "Feedback", color: "bg-primary/10 text-primary" },
  { icon: BarChart3, label: "View Results", color: "bg-accent/10 text-accent" },
];

const activePoll = {
  question: "Preferred study session day for mid-sem prep?",
  options: [
    { label: "Saturday", votes: 45, percent: 38 },
    { label: "Sunday", votes: 52, percent: 44 },
    { label: "Weekday evening", votes: 21, percent: 18 },
  ],
  totalVotes: 118,
};

const recentNotices = [
  { title: "Mid-sem prep session this Saturday", time: "3h ago", reach: "89% read" },
  { title: "Lecturer office hours changed to 2-4 PM", time: "1d ago", reach: "76% read" },
  { title: "Class photo session – wear department attire", time: "3d ago", reach: "92% read" },
];

export default function CourseRepPortalPage() {
  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="gradient-hero px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Course Rep Portal</h1>
              <p className="text-xs text-primary-foreground/60">IT Level 300 • 145 classmates</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Classmates", value: "145" },
              { label: "Notices Sent", value: "23" },
              { label: "Polls Active", value: "1" },
            ].map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/15 rounded-2xl p-3 text-center border border-primary-foreground/10">
                <p className="text-lg font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-[10px] text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {quickActions.map(({ icon: Icon, label, color }) => (
              <button key={label}
                className="flex flex-col items-center gap-1.5 bg-card rounded-2xl p-3 shadow-card active:scale-95 transition-transform">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Active Poll */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Active Poll</h2>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-sm font-semibold text-foreground mb-3">{activePoll.question}</p>
            <div className="space-y-2">
              {activePoll.options.map((opt) => (
                <div key={opt.label} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.percent}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opt.percent}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">{activePoll.totalVotes} votes • Ends in 2 days</p>
          </div>
        </section>

        {/* Send class message */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Send Class Notice</h2>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <textarea
              placeholder="Write a notice for your class…"
              className="w-full h-20 bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">145 classmates</span>
              </div>
              <button className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-premium active:scale-95 transition-transform">
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Recent Notices */}
        <section className="px-5 mt-5 mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3">Recent Notices</h2>
          <div className="space-y-2">
            {recentNotices.map((n, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground">{n.time} • {n.reach}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
