import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Bell, BellOff, Info, Calendar as CalendarIcon, BookOpen, MessageSquare, Users } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import ChannelAvatar from "@/components/channels/ChannelAvatar";
import VerifiedBadge from "@/components/channels/VerifiedBadge";
import PostCard from "@/components/channels/PostCard";
import {
  channelById,
  postsForChannel,
  channelTypeLabel,
  followStore,
  relativeTime,
} from "@/data/channelsData";

type Tab = "feed" | "resources" | "events" | "info";
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "feed", label: "Feed", icon: MessageSquare },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "events", label: "Events", icon: CalendarIcon },
  { id: "info", label: "Info", icon: Info },
];

export default function ChannelDetailPage() {
  const { id = "" } = useParams();
  const channel = channelById(id);
  const [tab, setTab] = useState<Tab>("feed");
  const [following, setFollowing] = useState(() => followStore.has(id));

  const allPosts = useMemo(() => (channel ? postsForChannel(channel.id) : []), [channel]);

  if (!channel) return <Navigate to="/channels" replace />;

  const pinned = allPosts.filter((p) => p.pinned);
  const unpinned = allPosts.filter((p) => !p.pinned);
  const resources = allPosts.filter((p) => p.type === "resource");
  const events = allPosts.filter((p) => p.type === "event");

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="px-5 pt-12 pb-5 bg-card border-b border-border/50">
          <Link to="/channels" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> All channels
          </Link>
          <div className="flex items-start gap-3">
            <ChannelAvatar type={channel.type} size={56} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-foreground truncate">{channel.name}</h1>
                {channel.owner.verified && <VerifiedBadge />}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {channelTypeLabel[channel.type]} · {channel.owner.name}
              </p>
              <p className="text-[11px] text-muted-foreground/80 mt-0.5 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {channel.followers.toLocaleString()} followers · Active {relativeTime(channel.lastActiveISO)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFollowing(followStore.toggle(channel.id))}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-colors ${
              following
                ? "bg-muted text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {following ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {following ? "Following" : "Follow channel"}
          </button>

          {/* Tabs */}
          <div className="mt-4 flex items-center gap-1 bg-muted rounded-xl p-1">
            {TABS.map(({ id: t, label, icon: Icon }) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* Body */}
        <section className="px-5 mt-4 mb-4 space-y-3">
          {tab === "feed" && (
            <>
              {pinned.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                    Pinned
                  </p>
                  {pinned.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              )}
              {unpinned.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                    Latest
                  </p>
                  {unpinned.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              )}
              {allPosts.length === 0 && <EmptyState label="No posts yet" />}
            </>
          )}

          {tab === "resources" && (
            <>
              {resources.length === 0 ? (
                <EmptyState label="No resources shared yet" />
              ) : (
                resources.map((p) => <PostCard key={p.id} post={p} />)
              )}
            </>
          )}

          {tab === "events" && (
            <>
              {events.length === 0 ? (
                <EmptyState label="No events scheduled" />
              ) : (
                events.map((p) => <PostCard key={p.id} post={p} />)
              )}
            </>
          )}

          {tab === "info" && (
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
              <Row label="About" value={channel.description} />
              <Row label="Category" value={channel.category} />
              <Row label="Owner" value={`${channel.owner.name} (${channel.owner.kind})`} />
              <Row
                label="Verification"
                value={channel.owner.verified ? "Verified by UPSA" : "Unverified"}
              />
              <Row label="Followers" value={channel.followers.toLocaleString()} />
              <Row label="Last active" value={relativeTime(channel.lastActiveISO)} />
            </div>
          )}
        </section>
      </div>
      <BottomNav />
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-[13px] text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-card rounded-2xl p-8 text-center text-sm text-muted-foreground shadow-card">
      {label}
    </div>
  );
}
