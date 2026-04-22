import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import ChannelCard from "@/components/channels/ChannelCard";
import {
  channels,
  channelTypeLabel,
  followStore,
  getTodaysKeyUpdates,
  type ChannelType,
} from "@/data/channelsData";
import PostCard from "@/components/channels/PostCard";

const FILTERS: ("all" | "following" | ChannelType)[] = [
  "all",
  "following",
  "official",
  "department",
  "course",
  "service",
  "leadership",
  "opportunity",
];

export default function ChannelsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const followed = useMemo(() => new Set(followStore.list()), []);
  const keyUpdates = useMemo(() => getTodaysKeyUpdates(2), []);

  const filtered = useMemo(() => {
    return channels.filter((c) => {
      if (filter === "following" && !followed.has(c.id)) return false;
      if (filter !== "all" && filter !== "following" && c.type !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.owner.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, filter, followed]);

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="px-5 pt-12 pb-4 bg-card border-b border-border/50 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/home" className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Channels</h1>
              <p className="text-[11px] text-muted-foreground">
                Verified communication. The official source of truth.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels, departments, services…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 mt-3 -mx-5 px-5 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "following"
                  ? "Following"
                  : channelTypeLabel[f as ChannelType]}
              </button>
            ))}
          </div>
        </header>

        {/* Today's Key Updates */}
        {keyUpdates.length > 0 && (
          <section className="px-5 mt-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <h2 className="text-[13px] font-bold text-foreground">
                Today's Key Updates
              </h2>
            </div>
            <div className="space-y-2.5">
              {keyUpdates.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Channel list */}
        <section className="px-5 mt-6 mb-4">
          <h2 className="text-[13px] font-bold text-foreground mb-2.5">
            {filter === "following" ? "Channels you follow" : "Browse channels"}
          </h2>
          {filtered.length === 0 ? (
            <div className="bg-card rounded-2xl p-6 text-center text-sm text-muted-foreground shadow-card">
              {filter === "following"
                ? "You're not following any channels yet. Tap any channel to follow."
                : "No channels match your search."}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((c) => (
                <ChannelCard key={c.id} channel={c} />
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />
    </PageShell>
  );
}
