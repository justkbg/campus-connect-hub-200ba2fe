import { motion } from "framer-motion";

/**
 * Ambient reactive aura: soft pulsing radial glow used while the AI is
 * thinking/typing. Pure CSS/framer — no canvas, very cheap.
 */
export default function AmbientAura({ active = false }: { active?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-48 overflow-hidden -z-0" aria-hidden="true">
      <motion.div
        animate={active ? { opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] } : { opacity: 0.18, scale: 1 }}
        transition={{ duration: 2.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        className="absolute left-1/2 -translate-x-1/2 -top-24 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.45), hsl(var(--accent) / 0.2) 55%, transparent 75%)",
        }}
      />
      <motion.div
        animate={active ? { opacity: [0.2, 0.5, 0.2] } : { opacity: 0.12 }}
        transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        className="absolute left-1/2 -translate-x-1/2 top-2 w-40 h-40 rounded-full blur-2xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.6), transparent 70%)" }}
      />
    </div>
  );
}
