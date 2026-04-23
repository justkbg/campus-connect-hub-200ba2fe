import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Pause } from "lucide-react";
import type { PostMedia } from "@/data/channelsData";

/**
 * Clean, structured media preview.
 * - 1 image  → full-width hero
 * - 2 images → side-by-side
 * - 3+       → first hero + grid of next two with "+N" overlay
 * - video    → poster thumbnail with center play; tap-to-play inline
 *
 * Tap any item to open a lightweight lightbox. No autoplay, no infinite scroll.
 */
export default function MediaGallery({ media }: { media: PostMedia[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  if (!media?.length) return null;

  const first = media[0];
  const rest = media.slice(1, 3);
  const more = Math.max(0, media.length - 3);

  return (
    <>
      <div className="mt-3 rounded-xl overflow-hidden border border-border/60">
        {media.length === 1 ? (
          <Tile item={first} onOpen={() => setOpenIdx(0)} aspect="aspect-[16/10]" />
        ) : (
          <div className="grid grid-cols-2 gap-0.5">
            <Tile item={first} onOpen={() => setOpenIdx(0)} aspect="aspect-[4/5]" />
            <div className="grid grid-rows-2 gap-0.5">
              {rest.map((m, i) => (
                <Tile
                  key={i}
                  item={m}
                  onOpen={() => setOpenIdx(i + 1)}
                  aspect="aspect-[4/2.5]"
                  overlay={i === rest.length - 1 && more > 0 ? `+${more}` : undefined}
                />
              ))}
              {rest.length < 2 && <div className="bg-muted" />}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <Lightbox
            media={media}
            index={openIdx}
            onClose={() => setOpenIdx(null)}
            onIndex={setOpenIdx}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Tile({
  item,
  onOpen,
  aspect,
  overlay,
}: {
  item: PostMedia;
  onOpen: () => void;
  aspect: string;
  overlay?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative ${aspect} w-full bg-muted overflow-hidden`}
      aria-label={item.alt || (item.kind === "video" ? "Play video" : "Open image")}
    >
      <img
        src={item.kind === "video" ? item.poster : item.url}
        alt={item.alt || ""}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      {item.kind === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
          </div>
          {item.durationSec && (
            <span className="absolute bottom-1.5 right-2 text-[10px] font-semibold text-white bg-black/60 rounded px-1.5 py-0.5">
              {formatDur(item.durationSec)}
            </span>
          )}
        </div>
      )}
      {overlay && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-base font-semibold">
          {overlay}
        </div>
      )}
    </button>
  );
}

function Lightbox({
  media,
  index,
  onClose,
  onIndex,
}: {
  media: PostMedia[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const item = media[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white text-xs">
        <span>
          {index + 1} / {media.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {item.kind === "image" ? (
          <img
            src={item.url}
            alt={item.alt || ""}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        ) : (
          <InlineVideo url={item.url} poster={item.poster} />
        )}
      </div>
      {media.length > 1 && (
        <div className="flex gap-1.5 justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndex(i)}
              aria-label={`Show item ${i + 1}`}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function InlineVideo({ url, poster }: { url: string; poster: string }) {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="relative max-h-full max-w-full">
      <video
        src={url}
        poster={poster}
        controls
        autoPlay
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="max-h-[80vh] max-w-full rounded-lg bg-black"
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Pause className="w-10 h-10 text-white/60" />
        </div>
      )}
    </div>
  );
}

function formatDur(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
