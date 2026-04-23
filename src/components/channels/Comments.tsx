import { useMemo, useState } from "react";
import { MessageSquare, Send, Lock, ChevronDown, ChevronUp } from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";
import {
  type Post,
  type PostComment,
  relativeTime,
} from "@/data/channelsData";

/**
 * Controlled comments.
 * Default: read-only (admin must enable). Threaded one level deep.
 * Local-only persistence, intentionally simple — not social media.
 */
export default function Comments({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<PostComment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const all = useMemo<PostComment[]>(
    () => [...(post.comments || []), ...extra],
    [post.comments, extra]
  );
  const roots = all.filter((c) => !c.parentId);
  const repliesOf = (id: string) => all.filter((c) => c.parentId === id);

  if (!post.commentsEnabled) {
    return (
      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
        <Lock className="w-3 h-3" />
        Comments are read-only on this post.
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim().slice(0, 500);
    if (!trimmed) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `c-local-${Date.now()}`,
        author: "You",
        authorRole: "Student",
        body: trimmed,
        publishedISO: new Date().toISOString(),
        parentId: replyTo || undefined,
      },
    ]);
    setDraft("");
    setReplyTo(null);
  };

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-[12px] font-semibold text-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          Discussion ({all.length})
        </span>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {roots.length === 0 && (
            <p className="text-[11px] text-muted-foreground">
              No comments yet — start the discussion respectfully.
            </p>
          )}
          {roots.map((c) => (
            <div key={c.id} className="space-y-2">
              <CommentRow comment={c} onReply={() => setReplyTo(c.id)} />
              {repliesOf(c.id).map((r) => (
                <div key={r.id} className="ml-7">
                  <CommentRow comment={r} compact />
                </div>
              ))}
            </div>
          ))}

          <form onSubmit={submit} className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              maxLength={500}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                replyTo ? "Reply to comment…" : "Share something useful…"
              }
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className="w-9 h-9 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {replyTo && (
            <button
              onClick={() => setReplyTo(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Cancel reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CommentRow({
  comment,
  onReply,
  compact,
}: {
  comment: PostComment;
  onReply?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex gap-2.5">
      <div
        className={`${
          compact ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-[11px]"
        } rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold flex-shrink-0`}
      >
        {comment.author.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[12px] font-semibold text-foreground">
            {comment.author}
          </p>
          {comment.verified && <VerifiedBadge />}
          <span className="text-[10px] text-muted-foreground">
            · {comment.authorRole} · {relativeTime(comment.publishedISO)}
          </span>
        </div>
        <p className="text-[12px] text-foreground/90 mt-0.5 leading-relaxed">
          {comment.body}
        </p>
        {onReply && (
          <button
            onClick={onReply}
            className="mt-1 text-[10px] font-medium text-muted-foreground hover:text-primary"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
