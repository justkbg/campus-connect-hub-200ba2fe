import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, GraduationCap, Wallet, CalendarCheck, Megaphone,
  MessageCircle, ChevronRight, TrendingUp, AlertTriangle, CreditCard,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { parentChild } from "@/data/alumniData";

export default function ParentPortalPage() {
  const navigate = useNavigate();
  const c = parentChild;
  const feesPct = Math.round((c.fees.paid / c.fees.total) * 100);
  const outstanding = c.fees.total - c.fees.paid;

  return (
    <PageShell>
      <div className="max-w-lg mx-auto pb-4">
        {/* Hero */}
        <div className="gradient-hero px-5 pt-12 pb-6 rounded-b-[2rem] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between mb-5">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-primary-foreground" />
            </button>
            <span className="text-[11px] font-semibold text-primary-foreground/80 tracking-wider uppercase">
              Parent Portal
            </span>
            <div className="w-10" />
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">{c.initials}</span>
            </div>
            <div>
              <p className="text-[11px] text-primary-foreground/70">Your child</p>
              <p className="text-lg font-bold text-primary-foreground leading-tight">{c.name}</p>
              <p className="text-[11px] text-primary-foreground/70">{c.programme} • {c.level}</p>
            </div>
          </motion.div>
        </div>

        {/* Attendance */}
        <div className="px-5 -mt-4">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-success" />
                </div>
                <p className="text-sm font-bold text-foreground">Attendance</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                <TrendingUp className="w-3 h-3" />{c.attendance.trend}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{c.attendance.rate}%</span>
              <span className="text-[11px] text-muted-foreground">
                {c.attendance.present} of {c.attendance.total} sessions
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${c.attendance.rate}%` }}
                transition={{ duration: 0.7 }}
                className="h-full bg-success"
              />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="px-5 mt-3">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-warning" />
                </div>
                <p className="text-sm font-bold text-foreground">Fees status</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-warning">
                {c.fees.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {c.fees.currency} {c.fees.paid.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground">
                of {c.fees.currency} {c.fees.total.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full gradient-primary" style={{ width: `${feesPct}%` }} />
            </div>
            <div className="mt-3 p-2.5 rounded-xl bg-warning/10 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
              <p className="text-[11px] text-foreground flex-1">
                <span className="font-semibold">{c.fees.currency} {outstanding.toLocaleString()}</span> due by {c.fees.nextDue}
              </p>
            </div>
            <div className="mt-3 space-y-1.5">
              {c.fees.breakdown.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className={`font-semibold ${b.paid >= b.amount ? "text-success" : "text-foreground"}`}>
                    {c.fees.currency} {b.paid.toLocaleString()} / {b.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5" /> Pay outstanding balance
            </button>
          </div>
        </div>

        {/* Upcoming exams */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Upcoming exams</h2>
          <div className="space-y-2">
            {c.exams.map((e) => (
              <div key={e.id} className="bg-card rounded-2xl p-3.5 shadow-card flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-semibold text-primary/70">{e.date.split(" ")[0]}</span>
                  <span className="text-sm font-bold text-primary leading-none">{e.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-primary">{e.course}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{e.title}</p>
                  <p className="text-[11px] text-muted-foreground">{e.time} • {e.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Recent announcements</h2>
          <div className="space-y-2">
            {c.announcements.map((a) => (
              <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lecturers */}
        <section className="px-5 mt-5 mb-4">
          <h2 className="text-sm font-bold text-foreground mb-3">Message a lecturer</h2>
          <div className="space-y-2">
            {c.lecturers.map((l) => (
              <a
                key={l.id}
                href={`mailto:${l.email}?subject=Concerning ${c.name} (${c.id})`}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{l.name}</p>
                  <p className="text-[11px] text-muted-foreground">{l.course}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
              </a>
            ))}
            <Link
              to="/inbox"
              className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Open notifications</p>
                <p className="text-[11px] text-muted-foreground">School-wide alerts and reminders</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
      <BottomNav />
    </PageShell>
  );
}
