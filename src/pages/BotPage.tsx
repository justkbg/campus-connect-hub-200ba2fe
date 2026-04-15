import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { botSuggestions, botResponses } from "@/data/mockData";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const key = text.toLowerCase().replace(/[?!.,]/g, "").trim();
      const match = Object.entries(botResponses).find(([k]) => key.includes(k));
      const reply = match ? match[1] : `I can help with that! Here's what I found about "${text}":\n\n📍 Try searching the campus map or checking your schedule for more details.\n\n💡 *You can ask me about locations, classes, events, or services.*`;
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", content: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <PageShell className="flex flex-col">
      <div className="max-w-lg mx-auto flex flex-col flex-1 w-full">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CIS Assistant</h1>
              <p className="text-xs text-muted-foreground">Your smart campus guide</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 no-scrollbar">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
              <div className="w-16 h-16 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 opacity-80">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-1">How can I help?</h2>
              <p className="text-xs text-muted-foreground mb-6">Ask me anything about campus</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {botSuggestions.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="px-3 py-2 bg-card rounded-xl text-xs font-medium text-foreground shadow-card active:scale-95 transition-transform">
                    {s}
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
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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

        {/* Suggestion chips when in convo */}
        {messages.length > 0 && messages.length < 4 && (
          <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            {botSuggestions.slice(0, 3).map((s) => (
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
