import { Check } from "lucide-react";

export default function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Verified channel"
      aria-label="Verified channel"
      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground ${className}`}
    >
      <Check className="w-2.5 h-2.5" strokeWidth={3} />
    </span>
  );
}
