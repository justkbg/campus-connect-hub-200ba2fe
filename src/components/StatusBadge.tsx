import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "open" | "busy" | "closed" | "urgent" | "important" | "info" | "completed" | "ongoing" | "upcoming";
  children?: ReactNode;
}

const styles: Record<string, string> = {
  open: "bg-success/10 text-success",
  busy: "bg-warning/10 text-warning",
  closed: "bg-destructive/10 text-destructive",
  urgent: "bg-destructive/10 text-destructive",
  important: "bg-warning/10 text-warning",
  info: "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
  ongoing: "bg-success/10 text-success",
  upcoming: "bg-accent/10 text-accent",
};

const labels: Record<string, string> = {
  open: "Open",
  busy: "Busy",
  closed: "Closed",
  urgent: "Urgent",
  important: "Important",
  info: "Info",
  completed: "Done",
  ongoing: "Now",
  upcoming: "Next",
};

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${styles[status]}`}>
      {children || labels[status]}
    </span>
  );
}
