import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  MapPin, Calendar, Megaphone, Briefcase, Ticket, Building, FolderOpen,
  ShoppingBag, Bell, Compass, MessageSquare, Users,
} from "lucide-react";
import {
  announcements, events, todaySchedule, opportunities, queueOffices,
  campusSpaces, resources,
} from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";

type SearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UnifiedSearch({ open, onOpenChange }: SearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(path);
  };

  const quick = useMemo(() => ([
    { label: "Open Map", icon: MapPin, path: "/map" },
    { label: "Today's Schedule", icon: Calendar, path: "/schedule" },
    { label: "Smart Inbox", icon: Bell, path: "/inbox" },
    { label: "AI Concierge", icon: MessageSquare, path: "/bot" },
    { label: "Smart Arrival", icon: Compass, path: "/arrival" },
    { label: "Visitor Mode", icon: Users, path: "/visit" },
  ]), []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search people, places, services, opportunities…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results. Try “library”, “queue”, or “career”.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          {quick.map((q) => (
            <CommandItem key={q.path} onSelect={() => go(q.path)}>
              <q.icon className="w-4 h-4 mr-2 text-primary" />
              {q.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Places">
          {upsaBuildings.slice(0, 12).map((b) => (
            <CommandItem key={`b-${b.id}`} onSelect={() => go(`/map?to=${b.id}`)}>
              <MapPin className="w-4 h-4 mr-2 text-accent" />
              <span className="flex-1">{b.name}</span>
              <span className="text-[10px] text-muted-foreground">{b.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Today's classes">
          {todaySchedule.map((c) => (
            <CommandItem key={`c-${c.id}`} onSelect={() => go("/schedule")}>
              <Calendar className="w-4 h-4 mr-2 text-success" />
              <span className="flex-1">{c.course} — {c.title}</span>
              <span className="text-[10px] text-muted-foreground">{c.time}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Announcements">
          {announcements.slice(0, 5).map((a) => (
            <CommandItem key={`a-${a.id}`} onSelect={() => go("/inbox")}>
              <Megaphone className="w-4 h-4 mr-2 text-warning" />
              <span className="flex-1 truncate">{a.title}</span>
              <span className="text-[10px] text-muted-foreground">{a.time}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Events">
          {events.map((e) => (
            <CommandItem key={`e-${e.id}`} onSelect={() => go("/home")}>
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span className="flex-1">{e.title}</span>
              <span className="text-[10px] text-muted-foreground">{e.date}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Opportunities">
          {opportunities.slice(0, 6).map((o) => (
            <CommandItem key={`o-${o.id}`} onSelect={() => go("/opportunities")}>
              <Briefcase className="w-4 h-4 mr-2 text-warning" />
              <span className="flex-1 truncate">{o.title}</span>
              <span className="text-[10px] text-muted-foreground">{o.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Services & queues">
          {queueOffices.map((q) => (
            <CommandItem key={`q-${q.id}`} onSelect={() => go("/queues")}>
              <Ticket className="w-4 h-4 mr-2 text-primary" />
              <span className="flex-1">{q.name}</span>
              <span className="text-[10px] text-muted-foreground">~{q.averageWaitMin}m wait</span>
            </CommandItem>
          ))}
          {campusSpaces.slice(0, 4).map((s) => (
            <CommandItem key={`s-${s.id}`} onSelect={() => go("/spaces")}>
              <Building className="w-4 h-4 mr-2 text-accent" />
              <span className="flex-1">{s.name}</span>
              <span className="text-[10px] text-muted-foreground">{s.type}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Library & Marketplace">
          {resources.slice(0, 4).map((r) => (
            <CommandItem key={`r-${r.id}`} onSelect={() => go("/resources")}>
              <FolderOpen className="w-4 h-4 mr-2 text-success" />
              <span className="flex-1 truncate">{r.title}</span>
              <span className="text-[10px] text-muted-foreground">{r.course}</span>
            </CommandItem>
          ))}
          <CommandItem onSelect={() => go("/marketplace")}>
            <ShoppingBag className="w-4 h-4 mr-2 text-warning" />
            Browse marketplace
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
