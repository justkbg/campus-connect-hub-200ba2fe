import { useState } from "react";
import { ThumbsUp, AlertCircle, Eye } from "lucide-react";
import {
  type Post,
  type ReactionKind,
  reactionStore,
  reactionMeta,
} from "@/data/channelsData";

const ICONS: Record<ReactionKind, any> = {
  helpful: ThumbsUp,
  important: AlertCircle,
  seen: Eye,
};

const ORDER: ReactionKind[] = ["helpful", "important", "seen"];

/**
 * Minimal reactions: Helpful · Important · Seen.
 * Single-select. No emoji clutter, no follower-count vanity.
 */
export default function Reactions({ post }: { post: Post }) {
  const [active, setActive] = useState<ReactionKind | null>(() =>
    reactionStore.get(post.id)
  );
  const [counts, setCounts] = useState<Partial<Record<ReactionKind, number>>>(
    () => ({ ...(post.reactions || {}) })
  );

  const toggle = (k: ReactionKind) => {
    const wasActive = active === k;
    const next = reactionStore.set(post.id, wasActive ? null : k);
    setCounts((prev) => {
      const out = { ...prev };
      // remove previous
      if (active && active !== k) {
        out[active] = Math.max(0, (out[active] || 1) - 1);
      }
      if (wasActive) {
        out[k] = Math.max(0, (out[k] || 1) - 1);
      } else if (!active || active !== k) {
        out[k] = (out[k] || 0) + 1;
      }
      return out;
    });
    setActive(next);
  };

  return (
    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
      {ORDER.map((k) => {
        const Icon = ICONS[k];
        const isActive = active === k;
        const n = counts[k] ?? 0;
        return (
          <button
            key={k}
            onClick={() => toggle(k)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all active:scale-95 ${
              isActive
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <Icon className={`w-3 h-3 ${isActive ? "" : reactionMeta[k].tone}`} />
            <span>{reactionMeta[k].label}</span>
            {n > 0 && (
              <span className={isActive ? "text-primary" : "text-muted-foreground/80"}>
                · {n > 999 ? `${(n / 1000).toFixed(1)}k` : n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
