import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pin,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  MapPin,
  ExternalLink,
  FileText,
  AlertTriangle,
  Megaphone,
  BookOpen,
  Calendar as CalendarIcon,
  RefreshCw,
} from "lucide-react";
import {
  type Post,
  postTypeLabel,
  relativeTime,
  saveStore,
} from "@/data/channelsData";
import MediaGallery from "./MediaGallery";
import Reactions from "./Reactions";
import Comments from "./Comments";
import VerifiedBadge from "./VerifiedBadge";

const TYPE_META: Record<
  Post["type"],
  { icon: any; tone: string; ring: string }
> = {
  alert: {
    icon: AlertTriangle,
    tone: "bg-destructive/10 text-destructive",
    ring: "border-l-destructive",
  },
  announcement: {
    icon: Megaphone,
    tone: "bg-warning/15 text-warning",
    ring: "border-l-warning",
  },
  resource: {
    icon: BookOpen,
    tone: "bg-success/10 text-success",
    ring: "border-l-success",
  },
  event: {
    icon: CalendarIcon,
    tone: "bg-accent/10 text-accent",
    ring: "border-l-accent",
  },
  update: {
    icon: RefreshCw,
    tone: "bg-primary/10 text-primary",
    ring: "border-l-primary",
  },
};

function buildIcsHref(post: Post) {
  if (!post.event) return "#";
  const start = new Date(post.event.startISO);
  const end = post.event.endISO
    ? new Date(post.event.endISO)
    : new Date(start.getTime() + 60 * 60_000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${post.id}@cis.upsa`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${post.title}`,
    `DESCRIPTION:${post.body.replace(/\n/g, " ")}`,
    post.event.location ? `LOCATION:${post.event.location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\n");
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

export default function PostCard({ post }: { post: Post }) {
  const meta = TYPE_META[post.type];
  const Icon = meta.icon;
  const [saved, setSaved] = useState(() => saveStore.has(post.id));
  const isCritical = post.priority === "critical";
  const isHigh = post.priority === "high";

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-card rounded-2xl shadow-card border-l-[3px] ${meta.ring} ${
        isCritical ? "ring-1 ring-destructive/30" : ""
      }`}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.tone}`}
          >
            <Icon className="w-3 h-3" />
            {postTypeLabel[post.type]}
          </span>
          {post.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
              <Pin className="w-3 h-3" />
              Pinned
            </span>
          )}
          {isCritical && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
              Critical
            </span>
          )}
          {isHigh && !isCritical && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning text-warning-foreground">
              High priority
            </span>
          )}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {relativeTime(post.publishedISO)}
          </span>
        </div>

        {/* Title + body */}
        <h3 className="text-[15px] font-semibold text-foreground leading-snug">
          {post.title}
        </h3>
        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
          {post.body}
        </p>

        {/* Media */}
        {post.media && post.media.length > 0 && <MediaGallery media={post.media} />}

        {/* Event meta */}
        {post.event && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-foreground bg-muted rounded-xl px-3 py-2">
            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">
              {new Date(post.event.startISO).toLocaleString("en-GB", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {post.event.location && (
              <span className="text-muted-foreground">
                · {post.event.location}
              </span>
            )}
          </div>
        )}

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {post.attachments.map((a, i) => (
              <a
                key={i}
                href={a.url}
                className="flex items-center gap-2 text-[12px] text-foreground bg-muted/60 hover:bg-muted rounded-xl px-3 py-2 transition-colors"
              >
                {a.kind === "link" ? (
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-primary" />
                )}
                <span className="font-medium truncate flex-1">{a.label}</span>
                {"sizeKb" in a && a.sizeKb && (
                  <span className="text-[10px] text-muted-foreground">
                    {a.sizeKb} KB
                  </span>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Footer: author + actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground truncate inline-flex items-center gap-1">
            <span className="truncate">{post.authorName}</span>
            {post.authorVerified && <VerifiedBadge />}
            <span className="text-muted-foreground/70">· {post.authorRole}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved(saveStore.toggle(post.id))}
              aria-label={saved ? "Unsave post" : "Save post"}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {post.event && (
              <a
                href={buildIcsHref(post)}
                download={`${post.title}.ics`}
                aria-label="Add to calendar"
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <CalendarPlus className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
            {post.location?.buildingId && (
              <Link
                to={`/map?to=${post.location.buildingId}`}
                aria-label="View location on map"
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </Link>
            )}
          </div>
        </div>

        {/* Minimal reactions */}
        <Reactions post={post} />

        {/* Controlled comments */}
        <Comments post={post} />
      </div>
    </motion.article>
  );
}
