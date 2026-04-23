import { useMemo, useState } from "react";
import { ArrowLeft, Search, Plus, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import ListingCard from "@/components/marketplace/ListingCard";
import {
  listings,
  listingCategories,
  suggestedListings,
  type ListingCategory,
} from "@/data/marketplaceData";

type CatFilter = "All" | ListingCategory;
const SORTS = ["Recommended", "Newest", "Price ↑", "Price ↓"] as const;
type Sort = (typeof SORTS)[number];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<CatFilter>("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("Recommended");

  const suggestions = useMemo(() => suggestedListings(4), []);

  const filtered = useMemo(() => {
    const base = listings.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "All" || item.category === cat;
      const matchVerified = !verifiedOnly || item.seller.verified;
      return matchSearch && matchCat && matchVerified;
    });
    switch (sort) {
      case "Newest":
        return [...base].sort(
          (a, b) => +new Date(b.postedISO) - +new Date(a.postedISO)
        );
      case "Price ↑":
        return [...base].sort((a, b) => a.priceValue - b.priceValue);
      case "Price ↓":
        return [...base].sort((a, b) => b.priceValue - a.priceValue);
      default:
        return base;
    }
  }, [search, cat, verifiedOnly, sort]);

  const showSuggestions = sort === "Recommended" && cat === "All" && !search;

  return (
    <PageShell>
      <div className="max-w-lg mx-auto pb-24">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to="/home"
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Marketplace
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Verified students only · Safe & structured
              </p>
            </div>
            <button
              aria-label="New listing"
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-premium active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          {/* Trust banner */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <p className="text-[11px] text-foreground/90 leading-tight">
              Every listing is tied to a UPSA student. Report anything suspicious.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marketplace…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {(["All", ...listingCategories] as CatFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  cat === c
                    ? "gradient-primary text-primary-foreground shadow-premium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort + verified toggle */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              aria-pressed={verifiedOnly}
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                verifiedOnly
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Verified sellers
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="text-[11px] font-medium bg-muted text-foreground rounded-full px-3 py-1.5 border-0 focus:outline-none focus:ring-1 focus:ring-primary/40"
              aria-label="Sort listings"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  Sort: {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Suggested */}
        {showSuggestions && suggestions.length > 0 && (
          <section className="px-5 mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Suggested for you
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {suggestions.map((l, i) => (
                <div key={l.id} className="w-44 flex-shrink-0">
                  <ListingCard listing={l} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center text-sm text-muted-foreground shadow-card">
              No listings match your filters.
            </div>
          ) : (
            <>
              <p className="text-[11px] text-muted-foreground mb-2">
                {filtered.length} listing{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((item, i) => (
                  <ListingCard key={item.id} listing={item} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
