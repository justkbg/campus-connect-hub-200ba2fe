import { motion } from "framer-motion";

/**
 * Tiny animated sound-bar / waveform indicator used in the chat input
 * when the AI is responding. Replaces the dot pulse with a more "alive" feel.
 */
export default function SoundBars({ active = false, bars = 5 }: { active?: boolean; bars?: number }) {
  return (
    <div className="flex items-end gap-[3px] h-4" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={
            active
              ? { height: ["20%", "100%", "40%", "80%", "30%"] }
              : { height: "20%" }
          }
          transition={{
            duration: 0.9,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}
