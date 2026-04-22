import type { ChannelType } from "@/data/channelsData";
import { Building2, GraduationCap, BookOpen, User, Users, Briefcase, Wrench, Landmark } from "lucide-react";

const ICONS: Record<ChannelType, any> = {
  official: Landmark,
  department: Building2,
  course: BookOpen,
  lecturer: User,
  leadership: Users,
  opportunity: Briefcase,
  service: Wrench,
};

const TONES: Record<ChannelType, string> = {
  official: "bg-primary/10 text-primary",
  department: "bg-accent/10 text-accent",
  course: "bg-success/10 text-success",
  lecturer: "bg-navy/10 text-navy",
  leadership: "bg-warning/15 text-warning",
  opportunity: "bg-primary/10 text-primary",
  service: "bg-muted text-foreground",
};

export default function ChannelAvatar({
  type,
  size = 40,
}: {
  type: ChannelType;
  size?: number;
}) {
  const Icon = ICONS[type] ?? GraduationCap;
  return (
    <div
      className={`rounded-2xl flex items-center justify-center flex-shrink-0 ${TONES[type]}`}
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size * 0.45, height: size * 0.45 }} />
    </div>
  );
}
