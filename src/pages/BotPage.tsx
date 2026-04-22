import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, MapPin, BellPlus, BookOpen, Calendar, Ticket, Briefcase, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import AmbientAura from "@/components/fx/AmbientAura";
import SoundBars from "@/components/fx/SoundBars";
import { botResponses, currentUser, todaySchedule, queueOffices, opportunities } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";

interface Action { label: string; icon: any; path: string }
interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  actions?: Action[];
}

function parseStartTimeToday(timeRange: string): Date | null {
  const start = timeRange.split(/[–-]/)[0]?.trim();
  if (!start) return null;
  const m = start.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d;
}

function findVenueBuildingId(venue: string): number | undefined {
  const v = venue.toLowerCase();
  return upsaBuildings.find(
    (b) => b.name.toLowerCase().includes(v) || v.includes(b.name.toLowerCase().split(" ")[0]),
  )?.id;
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Predictive suggestions based on time of day & schedule
  const predictive = useMemo<string[]>(() => {
    const suggestions: string[] = [];
    const next = todaySchedule.find((c) => c.status === "upcoming" || c.status === "ongoing");
    if (next) {
      const start = parseStartTimeToday(next.time);
      const minsLeft = start ? Math.round((start.getTime() - Date.now()) / 60000) : null;
      if (minsLeft !== null && minsLeft > 0 && minsLeft <= 30) {
        suggestions.push(`Take me to ${next.course}`);
      } else {
        suggestions.push("What's my next class?");
      }
    }
    const busiest = queueOffices.reduce((m, o) => (o.inQueue > m.inQueue ? o : m), queueOffices[0]);
    if (busiest) suggestions.push(`How long is the ${busiest.name} queue?`);
    const closingSoon = [...opportunities].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )[0];
    if (closingSoon) suggestions.push(`Show me the ${closingSoon.type} closing soon`);
    suggestions.push("Find me a quiet study spot");
    return suggestions.slice(0, 4);
  }, []);

  // Smart context-aware response generator
  const respond = (text: string): { content: string; actions?: Action[] } => {
    const key = text.toLowerCase().replace(/[?!.,]/g, "").trim();

    // 1. Next class / take me there
    if (/next class|take me to|navigate|directions/.test(key)) {
      const next = todaySchedule.find((c) => c.status === "upcoming" || c.status === "ongoing");
      if (!next) {
        return { content: "🎉 You have no more classes scheduled today. Enjoy the rest of your day, " + currentUser.firstName + "!" };
      }
      const start = parseStartTimeToday(next.time);
      const minsLeft = start ? Math.round((start.getTime() - Date.now()) / 60000) : null;
      const eta = minsLeft === null ? next.time
        : minsLeft <= 0 ? "happening **now**"
        : minsLeft < 60 ? `in **${minsLeft} min**`
        : `in **${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m**`;
      const venueId = findVenueBuildingId(next.venue);
      return {
        content: `📚 Your next class is **${next.course} — ${next.title}**, ${eta}.\n\n📍 **${next.venue}** with ${next.lecturer}\n\n💡 *I can route you there now.*`,
        actions: [
          { label: "Open map", icon: MapPin, path: venueId ? `/map?to=${venueId}` : "/map" },
          { label: "Set reminder", icon: BellPlus, path: "/notifications" },
          { label: "View schedule", icon: Calendar, path: "/schedule" },
        ],
      };
    }

    // 2. Queue / wait time
    if (/queue|wait|line|ticket|bursary|registrar|ict help/.test(key)) {
      const office =
        queueOffices.find((o) => key.includes(o.id) || key.includes(o.name.toLowerCase().split(" ")[0])) ||
        queueOffices.reduce((m, o) => (o.inQueue > m.inQueue ? o : m), queueOffices[0]);
      return {
        content: `🎫 **${office.name}** — currently **${office.inQueue} in queue**\n\n⏱️ Average wait: **${office.averageWaitMin} min**\n📺 Now serving: **${office.nowServing}**\n\n💡 *Take a remote ticket so you don't wait in person.*`,
        actions: [
          { label: "Take ticket", icon: Ticket, path: "/queues" },
          { label: "Open map", icon: MapPin, path: `/map?to=${office.buildingId}` },
        ],
      };
    }

    // 3. Opportunity
    if (/internship|scholarship|opportunit|job|hackathon|competition/.test(key)) {
      const closing = [...opportunities].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      )[0];
      const days = Math.ceil((new Date(closing.deadline).getTime() - Date.now()) / 86400000);
      return {
        content: `💼 **${closing.title}** — ${closing.organization}\n\n⏳ Closes in **${days} days**\n${closing.stipend ? `💰 ${closing.stipend}\n` : ""}🎯 ${closing.eligibility ?? "Open"}\n\n*${closing.description}*`,
        actions: [
          { label: "View opportunity", icon: Briefcase, path: "/opportunities" },
          { label: "Set reminder", icon: BellPlus, path: "/notifications" },
        ],
      };
    }

    // 4. Study spot / space
    if (/study|quiet|space|classroom|free room/.test(key)) {
      return {
        content: `📚 **Library — Group Room A** is free right now and matches your usual booking pattern.\n\n🚶 2 min walk · ✅ reservable · 🤫 quiet\n\n💡 *I can also show you live availability across all spaces.*`,
        actions: [
          { label: "Find spaces", icon: BookOpen, path: "/spaces" },
          { label: "Open map", icon: MapPin, path: "/map?to=3" },
        ],
      };
    }

    // 5. Where is X
    if (/where|locate|find/.test(key)) {
      const building = upsaBuildings.find((b) => key.includes(b.name.toLowerCase().split(" ")[0]));
      if (building) {
        return {
          content: `📍 **${building.name}** is in the ${building.category} zone of campus.\n\n💡 *Tap below to navigate there with turn-by-turn directions.*`,
          actions: [{ label: "Open map", icon: MapPin, path: `/map?to=${building.id}` }],
        };
      }
    }

    // Fallback to seeded responses
    const match = Object.entries(botResponses).find(([k]) => key.includes(k));
    if (match) return { content: match[1] };

    return {
      content: `I can help with that! Here's what I found about "${text}":\n\n📍 Try the campus map or your schedule for more detail.\n\n💡 *You can ask me about classes, queues, opportunities, study spaces, or any building.*`,
      actions: [
        { label: "Open map", icon: MapPin, path: "/map" },
        { label: "View schedule", icon: Calendar, path: "/schedule" },
      ],
    };
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const { content, actions } = respond(text);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", content, actions }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  // Greeting context line
  const ctx = useMemo(() => {
    const next = todaySchedule.find((c) => c.status === "upcoming" || c.status === "ongoing");
    if (!next) return `${currentUser.role === "student" ? "Student" : currentUser.role} · ${currentUser.department}`;
    const start = parseStartTimeToday(next.time);
    const mins = start ? Math.round((start.getTime() - Date.now()) / 60000) : null;
    if (mins !== null && mins > 0 && mins <= 30) return `${next.course} starts in ${mins} min`;
    return `${currentUser.department} · ${currentUser.level}`;
  }, []);

  return (
    <PageShell className="flex flex-col">
      <div className="max-w-lg mx-auto flex flex-col flex-1 w-full">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground">CIS Concierge</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Clock className="w-3 h-3" /> {ctx}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 no-scrollbar">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 opacity-90">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-base font-semibold text-foreground mb-1">
                  Hi {currentUser.firstName}, what's on your mind?
                </h2>
                <p className="text-xs text-muted-foreground">I know your day, your timetable, and the campus.</p>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Suggested for now</p>
              <div className="space-y-2">
                {predictive.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="w-full text-left bg-card rounded-2xl p-3.5 shadow-card flex items-center gap-3 active:scale-[0.99] transition-transform">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground flex-1">{s}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[88%] ${m.role === "user" ? "" : "w-full"}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-card shadow-card text-foreground rounded-bl-md"
                  }`}>
                    {m.role === "bot" ? (
                      <div className="prose prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 text-foreground">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.actions.map((a) => (
                        <Link key={a.label} to={a.path}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[11px] font-semibold active:scale-95 transition-transform"
                        >
                          <a.icon className="w-3.5 h-3.5" />
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 pl-2 py-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Predictive chips during convo */}
        {messages.length > 0 && messages.length < 6 && (
          <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            {predictive.slice(0, 3).map((s) => (
              <button key={s} onClick={() => send(s)}
                className="px-3 py-1.5 bg-muted rounded-full text-[11px] font-medium text-foreground whitespace-nowrap flex-shrink-0 active:scale-95 transition-transform">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-5 pb-20 pt-2">
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask anything…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
            >
              <ArrowUp className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
