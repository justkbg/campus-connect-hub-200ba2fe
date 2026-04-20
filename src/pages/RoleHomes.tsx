import {
  GraduationCap, Users, ClipboardList, BookOpen, Bell, Calendar, Megaphone,
  ShieldCheck, Ticket, AlertOctagon, Building, Activity, LayoutDashboard,
  Briefcase, Heart, Gift, Wallet, ShoppingBag, Truck, MapPin, MessageSquare,
  CreditCard, FileText, Compass, Award,
} from "lucide-react";
import RoleHomeShell, { SectionCard } from "@/components/RoleHomeShell";
import LiveCampusDashboard from "@/components/LiveCampusDashboard";
import BottomNav from "@/components/BottomNav";
import PageShell from "@/components/PageShell";
import { Link } from "react-router-dom";
import { todaySchedule, announcements, events, services } from "@/data/mockData";
import { reunionEvents, parentChild } from "@/data/alumniData";
import StatusBadge from "@/components/StatusBadge";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

// ============== LECTURER ==============
export function LecturerHome() {
  const next = todaySchedule.find((c) => c.status === "upcoming" || c.status === "ongoing");
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Prof. Kwame Asante"
        subtitle="Your teaching day at a glance — classes, attendance, and student requests."
        emoji="👨‍🏫" badge="Lecturer"
        stats={[
          { label: "Today", value: todaySchedule.length },
          { label: "Pending", value: 4, tone: "warning" },
          { label: "Office hrs", value: "2:00 PM" },
        ]}
        quickActions={[
          { icon: Users, label: "Attendance", path: "/lecturer", color: "bg-primary/10 text-primary" },
          { icon: BookOpen, label: "Materials", path: "/resources", color: "bg-accent/10 text-accent" },
          { icon: ClipboardList, label: "Requests", path: "/inbox", color: "bg-warning/10 text-warning" },
          { icon: Calendar, label: "Schedule", path: "/schedule", color: "bg-success/10 text-success" },
        ]}
        primaryCta={next ? { label: `Take attendance · ${next.course}`, path: "/lecturer", icon: GraduationCap } : undefined}
      >
        <SectionCard title="Today's classes" action={{ label: "Full week", path: "/schedule" }}>
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
                <p className="text-[11px] text-muted-foreground">{c.time} • {c.venue}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== ADMIN STAFF ==============
export function AdminHome() {
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Operations Desk"
        subtitle="Manage queues, respond to incidents, keep the campus running."
        emoji="🛡️" badge="Admin Staff"
        stats={[
          { label: "Live tickets", value: 36, tone: "warning" },
          { label: "Open issues", value: 12, tone: "danger" },
          { label: "Resolved", value: "84%", tone: "success" },
        ]}
        quickActions={[
          { icon: Ticket, label: "Queues", path: "/queues", color: "bg-primary/10 text-primary" },
          { icon: AlertOctagon, label: "Incidents", path: "/incidents", color: "bg-destructive/10 text-destructive" },
          { icon: ShieldCheck, label: "Admin", path: "/admin", color: "bg-accent/10 text-accent" },
          { icon: Bell, label: "Inbox", path: "/inbox", color: "bg-warning/10 text-warning" },
        ]}
        primaryCta={{ label: "Open Admin Dashboard", path: "/admin", icon: ShieldCheck }}
      >
        <LiveCampusDashboard variant="full" title="Live operations" />
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== LEADERSHIP ==============
export function LeadershipHome() {
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Dr. Esi Annan"
        subtitle="Live KPIs, bottlenecks, and the pulse of the institution."
        emoji="📊" badge="Leadership"
        stats={[
          { label: "Active users", value: "2.1k", tone: "success" },
          { label: "Bottlenecks", value: 3, tone: "warning" },
          { label: "Critical", value: 1, tone: "danger" },
        ]}
        quickActions={[
          { icon: LayoutDashboard, label: "Command", path: "/command-center", color: "bg-primary/10 text-primary" },
          { icon: Activity, label: "Live", path: "/visit", color: "bg-success/10 text-success" },
          { icon: ShieldCheck, label: "Operations", path: "/admin", color: "bg-accent/10 text-accent" },
          { icon: Bell, label: "Alerts", path: "/inbox", color: "bg-destructive/10 text-destructive" },
        ]}
        primaryCta={{ label: "Open Campus Command Center", path: "/command-center", icon: LayoutDashboard }}
      >
        <LiveCampusDashboard variant="full" title="Campus pulse" />
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== ALUMNI ==============
export function AlumniHome() {
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Akosua Boateng"
        subtitle="Reconnect, mentor, and grow with the UPSA family."
        emoji="🎖️" badge="Alumni · Class of '14"
        stats={[
          { label: "Reunions", value: reunionEvents.length },
          { label: "Mentees", value: 3, tone: "success" },
          { label: "Given", value: "GHS 1.2k" },
        ]}
        quickActions={[
          { icon: Users, label: "Network", path: "/alumni", color: "bg-primary/10 text-primary" },
          { icon: Heart, label: "Mentor", path: "/alumni", color: "bg-destructive/10 text-destructive" },
          { icon: Gift, label: "Give", path: "/alumni", color: "bg-warning/10 text-warning" },
          { icon: Briefcase, label: "Jobs", path: "/opportunities", color: "bg-accent/10 text-accent" },
        ]}
        primaryCta={{ label: "Open Alumni Hub", path: "/alumni", icon: Users }}
      >
        <SectionCard title="Upcoming reunions" action={{ label: "All", path: "/alumni" }}>
          <div className="space-y-2">
            {reunionEvents.slice(0, 2).map((e) => (
              <div key={e.id} className="bg-card rounded-2xl p-3.5 shadow-card flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl gradient-primary flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-primary-foreground/70">{e.date.split(" ")[0]}</span>
                  <span className="text-sm font-bold text-primary-foreground leading-none">{e.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{e.title}</p>
                  <p className="text-[11px] text-muted-foreground">{e.time} • {e.venue} • {e.going} going</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== PARENT ==============
export function ParentHome() {
  const c = parentChild;
  const outstanding = c.fees.total - c.fees.paid;
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Mrs. Mensah"
        subtitle={`${c.name} • ${c.programme}`}
        emoji="👪" badge="Parent"
        stats={[
          { label: "Attendance", value: `${c.attendance.rate}%`, tone: "success" },
          { label: "Outstanding", value: `${c.fees.currency} ${outstanding}`, tone: "warning" },
          { label: "Next exam", value: c.exams[0].date },
        ]}
        quickActions={[
          { icon: GraduationCap, label: "Child", path: "/parent", color: "bg-primary/10 text-primary" },
          { icon: Wallet, label: "Fees", path: "/parent", color: "bg-warning/10 text-warning" },
          { icon: MessageSquare, label: "Lecturer", path: "/parent", color: "bg-accent/10 text-accent" },
          { icon: Calendar, label: "Exams", path: "/parent", color: "bg-success/10 text-success" },
        ]}
        primaryCta={{ label: "Open Parent Portal", path: "/parent", icon: GraduationCap }}
      >
        <SectionCard title="Latest from school">
          <div className="space-y-2">
            {c.announcements.slice(0, 2).map((a) => (
              <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== APPLICANT ==============
export function ApplicantHome() {
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Future Pioneer"
        subtitle="Programmes, admissions, fees, and a campus tour — all in one place."
        emoji="📝" badge="Applicant"
        stats={[
          { label: "Programmes", value: 24 },
          { label: "Deadlines", value: 3, tone: "warning" },
          { label: "Open days", value: 2, tone: "success" },
        ]}
        quickActions={[
          { icon: FileText, label: "Apply", path: "/opportunities", color: "bg-primary/10 text-primary" },
          { icon: Compass, label: "Tour", path: "/visit", color: "bg-accent/10 text-accent" },
          { icon: Award, label: "Scholarships", path: "/opportunities", color: "bg-warning/10 text-warning" },
          { icon: MessageSquare, label: "Ask", path: "/bot", color: "bg-success/10 text-success" },
        ]}
        primaryCta={{ label: "Start your application", path: "/opportunities", icon: FileText }}
      >
        <SectionCard title="Open events on campus" action={{ label: "Visit", path: "/visit" }}>
          <div className="space-y-2">
            {events.slice(0, 2).map((e) => (
              <div key={e.id} className="bg-card rounded-2xl p-4 shadow-card">
                <p className="text-sm font-semibold text-foreground">{e.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{e.date} • {e.time} • {e.location}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}

// ============== VENDOR ==============
export function VendorHome() {
  return (
    <PageShell>
      <RoleHomeShell
        greeting={greeting()}
        name="Campus Bites"
        subtitle="Manage listings, deliveries, and gate access."
        emoji="🛍️" badge="Vendor"
        stats={[
          { label: "Orders", value: 12, tone: "success" },
          { label: "Pending", value: 3, tone: "warning" },
          { label: "Revenue", value: "GHS 480" },
        ]}
        quickActions={[
          { icon: ShoppingBag, label: "Listings", path: "/marketplace", color: "bg-primary/10 text-primary" },
          { icon: Truck, label: "Deliveries", path: "/queues", color: "bg-accent/10 text-accent" },
          { icon: CreditCard, label: "Billing", path: "/profile", color: "bg-warning/10 text-warning" },
          { icon: MapPin, label: "Gate access", path: "/arrival", color: "bg-success/10 text-success" },
        ]}
        primaryCta={{ label: "Open Marketplace", path: "/marketplace", icon: ShoppingBag }}
      >
        <SectionCard title="Today's orders">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-sm font-semibold text-foreground">3 pending pickups at Banking Square</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Avg fulfilment time: 14 min</p>
          </div>
        </SectionCard>
      </RoleHomeShell>
      <BottomNav />
    </PageShell>
  );
}
