import { Link } from "react-router-dom";
import { Star, MapPin, Bookmark, BookmarkCheck, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import {
  type Listing,
  listingSaveStore,
  relativeListed,
} from "@/data/marketplaceData";

const URGENCY_META: Record<string, { label: string; cls: string }> = {
  today: { label: "Posted today", cls: "bg-success/10 text-success" },
  deal: { label: "Hot deal", cls: "bg-warning/15 text-warning" },
  negotiable: { label: "Negotiable", cls: "bg-muted text-muted-foreground" },
  fixed: { label: "Fixed price", cls: "bg-primary/10 text-primary" },
};

export default function ListingCard({
  listing,
  index = 0,
}: {
  listing: Listing;
  index?: number;
}) {
  const [saved, setSaved] = useState(() => listingSaveStore.has(listing.id));
  const topUrgency = listing.urgency?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-premium transition-shadow"
    >
      <Link to={`/marketplace/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
          />
          {topUrgency && (
            <span
              className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold backdrop-blur-sm ${URGENCY_META[topUrgency].cls}`}
            >
              {topUrgency === "today" && <Zap className="w-2.5 h-2.5" />}
              {URGENCY_META[topUrgency].label}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved(listingSaveStore.toggle(listing.id));
            }}
            aria-label={saved ? "Unsave listing" : "Save listing"}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-card active:scale-90 transition-transform"
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </Link>

      <Link to={`/marketplace/${listing.id}`} className="block p-3">
        <p className="text-[13px] font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.4em]">
          {listing.title}
        </p>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-[14px] font-bold text-primary">
            {listing.price}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {listing.condition}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] text-foreground truncate">
              {listing.seller.name.split(" ")[0]}
            </span>
            {listing.seller.verified && <VerifiedSellerBadge />}
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground flex-shrink-0">
            <Star className="w-2.5 h-2.5 text-warning" fill="currentColor" />
            <span className="font-semibold text-foreground">
              {listing.seller.rating.toFixed(1)}
            </span>
            <span>· {relativeListed(listing.postedISO)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
