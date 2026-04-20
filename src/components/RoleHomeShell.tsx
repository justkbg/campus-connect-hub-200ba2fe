import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";

export type RoleQuickAction = {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
};

export type RoleHeroStat = { label: string; value: string | number; tone?: "default" | "success" | "warning" | "danger" };

type Props = {
  greeting: string;
  name: string;
  subtitle: string;
  emoji: string;
  badge: string;
  stats?: RoleHeroStat[];
  quickActions: RoleQuickAction[];
  primaryCta?: { label: string; path: string; icon?: LucideIcon };
  children?: ReactNode;
};

const toneClass: Record<NonNullable<RoleHeroStat["tone"]>, string> = {
  default: "text-primary-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export default function RoleHomeShell({
  greeting, name, subtitle, emoji, badge, stats = [], quickActions, primaryCta, children,
}: Props) {
  return (
    <div className="max-w-lg mx-auto">
      {/* Hero */}
      <div className="gradient-hero px-5 pt-12 pb-7 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-foreground/15 backdrop-blur text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
              <span>{emoji}</span> {badge}
            </span>
            <Link to="/profile" className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">{name[0]}</span>
            </Link>
          </div>
          <p className="text-primary-foreground/70 text-xs">{greeting}</p>
          <h1 className="text-2xl font-bold text-primary-foreground leading-tight mt-0.5">{name}</h1>
          <p className="text-sm text-primary-foreground/70 mt-1 max-w-xs">{subtitle}</p>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl px-3 py-2.5 text-center">
                  <p className={`text-base font-bold ${toneClass[s.tone ?? "default"]}`}>{s.value}</p>
                  <p className="text-[10px] text-primary-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {primaryCta && (
            <Link
              to={primaryCta.path}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary rounded-xl py-2.5 text-xs font-semibold shadow-premium active:scale-[0.98] transition-transform"
            >
              {primaryCta.icon && <primaryCta.icon className="w-3.5 h-3.5" />}
              {primaryCta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 -mt-4">
        <div className={`grid gap-2.5 ${quickActions.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
          {quickActions.map(({ icon: Icon, label, path, color }) => (
            <Link key={label} to={path}
              className="flex flex-col items-center gap-1.5 bg-card rounded-2xl p-3 shadow-card active:scale-95 transition-transform">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-foreground text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-5 space-y-3 pb-4">
        {children}
      </motion.div>
    </div>
  );
}

export function SectionCard({ title, action, children }: { title: string; action?: { label: string; path: string }; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {action && (
          <Link to={action.path} className="text-[11px] text-primary font-semibold inline-flex items-center gap-0.5">
            {action.label} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
