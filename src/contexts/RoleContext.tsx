import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type AppRole =
  | "student"
  | "lecturer"
  | "course_rep"
  | "admin"
  | "leadership"
  | "visitor"
  | "applicant"
  | "parent"
  | "alumni"
  | "vendor";

export type RoleProfile = {
  id: AppRole;
  label: string;
  emoji: string;
  homePath: string;
  description: string;
  permissions: {
    canSeePersonalSchedule: boolean;
    canSeeAdmin: boolean;
    canSeeQueues: boolean;
    canSeeMarketplace: boolean;
    canSeeOpportunities: boolean;
    isPublicOnly: boolean;
  };
};

export const ROLE_PROFILES: Record<AppRole, RoleProfile> = {
  student: {
    id: "student", label: "Student", emoji: "🎓", homePath: "/home",
    description: "Personal timetable, queues, opportunities, AI concierge.",
    permissions: { canSeePersonalSchedule: true, canSeeAdmin: false, canSeeQueues: true, canSeeMarketplace: true, canSeeOpportunities: true, isPublicOnly: false },
  },
  lecturer: {
    id: "lecturer", label: "Lecturer", emoji: "👨‍🏫", homePath: "/lecturer",
    description: "Manage courses, attendance, materials, student requests.",
    permissions: { canSeePersonalSchedule: true, canSeeAdmin: false, canSeeQueues: true, canSeeMarketplace: false, canSeeOpportunities: true, isPublicOnly: false },
  },
  course_rep: {
    id: "course_rep", label: "Course Rep", emoji: "📣", homePath: "/course-rep",
    description: "Class notices, polls, attendance proxy, resource sharing.",
    permissions: { canSeePersonalSchedule: true, canSeeAdmin: false, canSeeQueues: true, canSeeMarketplace: true, canSeeOpportunities: true, isPublicOnly: false },
  },
  admin: {
    id: "admin", label: "Admin Staff", emoji: "🛡️", homePath: "/admin",
    description: "Operate offices, manage queues, respond to incidents.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: true, canSeeQueues: true, canSeeMarketplace: false, canSeeOpportunities: false, isPublicOnly: false },
  },
  leadership: {
    id: "leadership", label: "Leadership", emoji: "📊", homePath: "/command-center",
    description: "Live KPIs, bottlenecks, engagement, critical alerts.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: true, canSeeQueues: true, canSeeMarketplace: false, canSeeOpportunities: true, isPublicOnly: false },
  },
  visitor: {
    id: "visitor", label: "Visitor", emoji: "🧭", homePath: "/visit",
    description: "Map, parking, offices, public notices, help desk.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: false, canSeeQueues: false, canSeeMarketplace: false, canSeeOpportunities: false, isPublicOnly: true },
  },
  applicant: {
    id: "applicant", label: "Applicant", emoji: "📝", homePath: "/visit",
    description: "Programmes, admissions tour, fees, application help.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: false, canSeeQueues: true, canSeeMarketplace: false, canSeeOpportunities: true, isPublicOnly: true },
  },
  parent: {
    id: "parent", label: "Parent", emoji: "👪", homePath: "/visit",
    description: "Child progress hub, fees, events, campus directions.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: false, canSeeQueues: false, canSeeMarketplace: false, canSeeOpportunities: false, isPublicOnly: true },
  },
  alumni: {
    id: "alumni", label: "Alumni", emoji: "🎖️", homePath: "/home",
    description: "Reunions, mentorship, giving back, network.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: false, canSeeQueues: false, canSeeMarketplace: true, canSeeOpportunities: true, isPublicOnly: false },
  },
  vendor: {
    id: "vendor", label: "Vendor", emoji: "🛍️", homePath: "/home",
    description: "Campus deliveries, gate access, billing, listings.",
    permissions: { canSeePersonalSchedule: false, canSeeAdmin: false, canSeeQueues: false, canSeeMarketplace: true, canSeeOpportunities: false, isPublicOnly: false },
  },
};

const STORAGE_KEY = "cis.activeRole";

type Ctx = {
  role: AppRole;
  profile: RoleProfile;
  setRole: (r: AppRole) => void;
  isPublic: boolean;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>(() => {
    if (typeof window === "undefined") return "student";
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppRole | null;
    return stored && stored in ROLE_PROFILES ? stored : "student";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // ignore
    }
  }, [role]);

  const value = useMemo<Ctx>(() => {
    const profile = ROLE_PROFILES[role];
    return { role, profile, setRole: setRoleState, isPublic: profile.permissions.isPublicOnly };
  }, [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
