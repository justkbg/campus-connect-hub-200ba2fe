import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ShoppingBag, Plus, Tag, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { marketplaceItems } from "@/data/mockData";

const categories = ["All", "Textbooks", "Gadgets", "Tutoring", "Services", "Opportunities"];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = marketplaceItems.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || item.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Marketplace</h1>
              <p className="text-xs text-muted-foreground">Buy, sell & find opportunities</p>
            </div>
            <button className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-premium">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marketplace…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  cat === c ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 grid grid-cols-2 gap-3 mb-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="h-28 bg-muted flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1">{item.title}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold text-primary">{item.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{item.seller}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.posted}</span>
                </div>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">{item.condition}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
