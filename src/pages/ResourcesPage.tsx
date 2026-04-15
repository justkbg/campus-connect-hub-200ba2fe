import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, FileText, Download, ExternalLink, Monitor, BookOpen, CreditCard, Globe, FileCheck, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { resources, officialLinks } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ExternalLink, Monitor, BookOpen, CreditCard, Globe, FileCheck,
};

const categories = ["All", "Lecture Notes", "Past Questions", "Forms", "Guides"];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [tab, setTab] = useState<"resources" | "links">("resources");

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || r.category === cat;
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
            <div>
              <h1 className="text-xl font-bold text-foreground">Resources</h1>
              <p className="text-xs text-muted-foreground">Notes, past questions, forms & links</p>
            </div>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-4">
            {(["resources", "links"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all capitalize ${
                  tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}>
                {t === "resources" ? "Resources" : "Official Links"}
              </button>
            ))}
          </div>

          {tab === "resources" && (
            <>
              <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources…"
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
            </>
          )}
        </div>

        {tab === "resources" ? (
          <div className="px-5 space-y-2 mb-4">
            {filtered.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category} • {r.course} • {r.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">{r.downloads} downloads</span>
                    <span className="text-[10px] text-muted-foreground/60">by {r.uploadedBy}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 text-primary" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3 mb-4">
            {officialLinks.map((link, i) => {
              const Icon = iconMap[link.icon] || ExternalLink;
              return (
                <motion.a key={link.id} href={link.url}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card rounded-2xl p-4 shadow-card flex flex-col items-center gap-2 text-center active:scale-95 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{link.title}</span>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
}
