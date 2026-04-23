import { ShieldCheck } from "lucide-react";

/** UPSA-verified student/seller badge — concise, premium. */
export default function VerifiedSellerBadge({
  size = "sm",
}: {
  size?: "sm" | "md";
}) {
  const cls =
    size === "md" ? "text-[11px] px-2 py-0.5" : "text-[9px] px-1.5 py-0.5";
  return (
    <span
      title="Verified UPSA student"
      className={`inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary font-semibold ${cls}`}
    >
      <ShieldCheck className={size === "md" ? "w-3 h-3" : "w-2.5 h-2.5"} />
      Verified
    </span>
  );
}
