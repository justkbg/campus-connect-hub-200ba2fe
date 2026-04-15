import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Megaphone, Upload, Link2, Bell, Clock, MapPin, Users, Send, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";

const lecturerCourses = [
  { id: 1, code: "INFO 201", title: "Database Systems", students: 145, venue: "LT3", time: "Mon & Wed, 8:00 AM" },
  { id: 2, code: "INFO 205", title: "Software Engineering", students: 120, venue: "LT1", time: "Tue & Thu, 10:00 AM" },
];

const recentActions = [
  { action: "Announced venue change", course: "INFO 201", time: "2h ago" },
  { action: "Uploaded lecture notes", course: "INFO 205", time: "1d ago" },
  { action: "Sent class reminder", course: "INFO 201", time: "2d ago" },
];

const quickActions = [
  { icon: Megaphone, label: "Post Announcement", color: "bg-primary/10 text-primary" },
  { icon: Upload, label: "Upload Notes", color: "bg-accent/10 text-accent" },
  { icon: Link2, label: "Share Link", color: "bg-success/10 text-success" },
  { icon: Bell, label: "Send Reminder", color: "bg-warning/10 text-warning" },
  { icon: Clock, label: "Office Hours", color: "bg-primary/10 text-primary" },
  { icon: MapPin, label: "Change Venue", color: "bg-destructive/10 text-destructive" },
];

export default function LecturerPortalPage() {
  const [selectedCourse, setSelectedCourse] = useState(lecturerCourses[0]);

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="gradient-hero px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Lecturer Portal</h1>
              <p className="text-xs text-primary-foreground/60">Dr. Ama Serwaa • IT Department</p>
            </div>
          </div>

          {/* Course selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {lecturerCourses.map((c) => (
              <button key={c.id} onClick={() => setSelectedCourse(c)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCourse.id === c.id
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/10"
                }`}>
                {c.code} — {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Course stats */}
        <div className="px-5 -mt-4">
          <div className="bg-card rounded-2xl p-4 shadow-card grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">{selectedCourse.students}</p>
              <p className="text-[11px] text-muted-foreground">Students</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{selectedCourse.venue}</p>
              <p className="text-[11px] text-muted-foreground">Venue</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selectedCourse.time.split(",")[0]}</p>
              <p className="text-[11px] text-muted-foreground">Schedule</p>
            </div>
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

        {/* Quick message */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Send Class Update</h2>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <textarea
              placeholder={`Message ${selectedCourse.code} students…`}
              className="w-full h-20 bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{selectedCourse.students} recipients</span>
              </div>
              <button className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-premium active:scale-95 transition-transform">
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="px-5 mt-5 mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {recentActions.map((a, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground">{a.course} • {a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
