import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Flag,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import VerifiedSellerBadge from "@/components/marketplace/VerifiedSellerBadge";
import {
  listingById,
  listingSaveStore,
  listingReportStore,
  relativeListed,
} from "@/data/marketplaceData";
import { toast } from "@/hooks/use-toast";

export default function ListingDetailPage() {
  const { id = "" } = useParams();
  const listing = listingById(id);
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(() =>
    listing ? listingSaveStore.has(listing.id) : false
  );
  const [reported, setReported] = useState(() =>
    listing ? listingReportStore.has(listing.id) : false
  );

  if (!listing) return <Navigate to="/marketplace" replace />;

  const handleReport = () => {
    listingReportStore.add(listing.id);
    setReported(true);
    toast({
      title: "Listing reported",
      description: "Our team will review this within 24 hours.",
    });
  };

  const handleMessage = () => {
    toast({
      title: `Message sent to ${listing.seller.name.split(" ")[0]}`,
      description: `Typical reply: ~${listing.seller.responseMin} min. Stay on-platform until you've met in person.`,
    });
  };

  return (
    <PageShell>
      <div className="max-w-lg mx-auto pb-32">
        {/* Image gallery */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIdx}
              src={listing.images[imgIdx]}
              alt={listing.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <Link
            to="/marketplace"
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-card"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>

          <button
            onClick={() => setSaved(listingSaveStore.toggle(listing.id))}
            aria-label={saved ? "Unsave" : "Save"}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-card active:scale-90 transition-transform"
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-foreground" />
            )}
          </button>

          {listing.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setImgIdx((i) => (i - 1 + listing.images.length) % listing.images.length)
                }
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() =>
                  setImgIdx((i) => (i + 1) % listing.images.length)
                }
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {listing.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    className={`h-1 rounded-full transition-all ${
                      i === imgIdx ? "w-6 bg-white" : "w-3 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pt-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {listing.category}
              </span>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-muted-foreground">
                {listing.condition}
              </span>
              {listing.urgency?.includes("today") && (
                <span className="text-[9px] font-bold uppercase bg-success/10 text-success px-2 py-0.5 rounded-full">
                  Posted today
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground leading-snug">
              {listing.title}
            </h1>
            <p className="text-2xl font-bold text-primary mt-1">
              {listing.price}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-[12px] text-foreground bg-muted rounded-xl px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium flex-1">{listing.location}</span>
            {listing.buildingId && (
              <Link
                to={`/map?to=${listing.buildingId}`}
                className="text-[11px] font-semibold text-primary"
              >
                View on map
              </Link>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </h2>
            <p className="text-[13px] text-foreground/90 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Seller */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Seller
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {listing.seller.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[14px] font-semibold text-foreground truncate">
                    {listing.seller.name}
                  </p>
                  {listing.seller.verified && <VerifiedSellerBadge />}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {listing.seller.department} · {listing.seller.level}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat
                icon={<Star className="w-3 h-3 text-warning" />}
                value={listing.seller.rating.toFixed(1)}
                label={`${listing.seller.reviewCount} reviews`}
              />
              <Stat
                icon={<Clock className="w-3 h-3 text-primary" />}
                value={`~${listing.seller.responseMin}m`}
                label="response"
              />
              <Stat
                icon={<ShieldCheck className="w-3 h-3 text-success" />}
                value={`Joined ${listing.seller.joinedYear}`}
                label="member"
              />
            </div>
          </div>

          {/* Safety */}
          <div className="bg-warning/5 border border-warning/20 rounded-2xl p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-warning mb-1">
              Safe interaction
            </p>
            <ul className="text-[11px] text-foreground/80 space-y-1 leading-relaxed">
              <li>• Meet in public campus locations (Library, Student Center).</li>
              <li>• Verify the item before paying. Keep messages on-platform.</li>
              <li>• Never share OTPs or pay outside agreed channels.</li>
            </ul>
          </div>

          {/* Posted */}
          <p className="text-[11px] text-muted-foreground">
            Listed {relativeListed(listing.postedISO)} · ID {listing.id}
          </p>

          {/* Report */}
          <button
            onClick={handleReport}
            disabled={reported}
            className={`w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-medium py-2 rounded-lg transition-colors ${
              reported
                ? "bg-muted text-muted-foreground cursor-default"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            }`}
          >
            {reported ? (
              <>
                <ShieldAlert className="w-3 h-3" />
                Reported — under review
              </>
            ) : (
              <>
                <Flag className="w-3 h-3" />
                Report this listing
              </>
            )}
          </button>
        </div>

        {/* Sticky action bar */}
        <div className="fixed bottom-16 left-0 right-0 z-30">
          <div className="max-w-lg mx-auto px-5 pb-3">
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-premium p-2 flex items-center gap-2">
              <button
                onClick={() => setSaved(listingSaveStore.toggle(listing.id))}
                aria-label={saved ? "Unsave" : "Save"}
                className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
              >
                {saved ? (
                  <BookmarkCheck className="w-5 h-5 text-primary" />
                ) : (
                  <Bookmark className="w-5 h-5 text-foreground" />
                )}
              </button>
              <button
                onClick={handleMessage}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl gradient-primary text-primary-foreground text-[13px] font-semibold shadow-premium active:scale-[0.98] transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                Message seller
              </button>
              <button
                onClick={handleMessage}
                aria-label="Call (in-app)"
                className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
              >
                <Phone className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-muted/60 rounded-lg py-2">
      <div className="flex items-center justify-center gap-1 text-[12px] font-bold text-foreground">
        {icon}
        {value}
      </div>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
        {label}
      </p>
    </div>
  );
}
