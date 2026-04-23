import { useState } from "react";
import { Star, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { placeForBuilding } from "@/data/placesData";

/**
 * Compact place card for the Map page selection panel.
 * Shows image previews, aggregate rating, highlights and a few reviews.
 * Renders nothing if there's no profile for the building.
 */
export default function PlaceReviewsCard({ buildingId }: { buildingId: number }) {
  const place = placeForBuilding(buildingId);
  const [openImg, setOpenImg] = useState<string | null>(null);
  if (!place) return null;

  return (
    <>
      <div className="mt-3 bg-card rounded-2xl shadow-card overflow-hidden">
        {/* Image strip */}
        {place.images.length > 0 && (
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {place.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setOpenImg(src)}
                className="relative aspect-[4/3] w-32 flex-shrink-0 bg-muted overflow-hidden first:rounded-l-2xl"
                aria-label={`Open image ${i + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-warning" fill="currentColor" />
              <span className="text-[13px] font-bold text-foreground">
                {place.rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                · {place.reviewCount} reviews
              </span>
            </div>
            {place.hours && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[60%]">
                {place.hours}
              </span>
            )}
          </div>

          {place.highlights && place.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {place.highlights.map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <ul className="space-y-2">
            {place.reviews.slice(0, 2).map((r) => (
              <li key={r.id} className="border-t border-border/60 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-foreground">
                    {r.author}
                  </span>
                  <span className="inline-flex items-center text-warning">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5" fill="currentColor" />
                    ))}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/85 leading-snug mt-0.5">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {openImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenImg(null)}
          >
            <img
              src={openImg}
              alt=""
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
