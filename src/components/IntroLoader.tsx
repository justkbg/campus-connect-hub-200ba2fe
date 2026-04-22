import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium 2.4s cinematic intro:
 *   dark → deep blue glow → grid lines forming → nodes lighting → CIS logo → fade.
 *
 * - Runs ONCE per session (sessionStorage flag).
 * - Skippable on tap or any key.
 * - Respects prefers-reduced-motion (instant skip).
 * - Lightweight 2D canvas; graceful fallback if context fails.
 */

const SESSION_KEY = "cis.intro.played";
const TOTAL_MS = 2400;

export default function IntroLoader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Skip flag for repeat visits & reduced-motion
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduce || played) {
      setVisible(false);
      onDone();
      return;
    }

    const t = window.setTimeout(() => {
      finish();
    }, TOTAL_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
    // wait for fade-out before signalling
    window.setTimeout(onDone, 380);
  }

  // Canvas: grid + nodes
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let start = performance.now();
    let w = 0;
    let h = 0;

    type Node = { x: number; y: number; delay: number };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Generate ~22 nodes on a soft scattered grid
      nodes = [];
      const cols = 6;
      const rows = 5;
      const pad = 40;
      const cellW = (w - pad * 2) / (cols - 1);
      const cellH = (h - pad * 2) / (rows - 1);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2 === 0) continue; // sparse
          const jitter = 8;
          nodes.push({
            x: pad + c * cellW + (Math.random() - 0.5) * jitter,
            y: pad + r * cellH + (Math.random() - 0.5) * jitter,
            delay: 600 + (i++ % 12) * 60,
          });
        }
      }
    };

    const draw = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);

      // Center radial glow
      const cx = w / 2;
      const cy = h / 2;
      const glowProgress = Math.min(1, elapsed / 700);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      glow.addColorStop(0, `rgba(59,130,246,${0.25 * glowProgress})`);
      glow.addColorStop(0.4, `rgba(0,71,171,${0.18 * glowProgress})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Grid lines (form between 250ms and 1100ms)
      const gridP = Math.max(0, Math.min(1, (elapsed - 250) / 850));
      if (gridP > 0) {
        ctx.strokeStyle = `rgba(160,200,255,${0.14 * gridP})`;
        ctx.lineWidth = 1;
        const gap = 36;
        ctx.beginPath();
        const reach = gridP;
        for (let x = 0; x < w; x += gap) {
          const length = h * reach;
          ctx.moveTo(x, (h - length) / 2);
          ctx.lineTo(x, (h + length) / 2);
        }
        for (let y = 0; y < h; y += gap) {
          const length = w * reach;
          ctx.moveTo((w - length) / 2, y);
          ctx.lineTo((w + length) / 2, y);
        }
        ctx.stroke();
      }

      // Nodes light up
      for (const n of nodes) {
        const np = Math.max(0, Math.min(1, (elapsed - n.delay) / 500));
        if (np <= 0) continue;
        // glow
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14);
        g.addColorStop(0, `rgba(96,165,250,${0.55 * np})`);
        g.addColorStop(1, "rgba(96,165,250,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
        ctx.fill();
        // dot
        ctx.fillStyle = `rgba(219,234,254,${0.85 * np})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connecting lines (after nodes have started lighting up)
      const linkP = Math.max(0, Math.min(1, (elapsed - 900) / 600));
      if (linkP > 0) {
        ctx.strokeStyle = `rgba(96,165,250,${0.18 * linkP})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const onResize = () => {
      start = performance.now();
      resize();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [visible]);

  // Skip on key/tap
  useEffect(() => {
    if (!visible) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          onClick={finish}
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
          style={{ background: "#03060d" }}
          aria-label="CIS loading"
          role="status"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #0047AB 100%)",
                  boxShadow:
                    "0 0 32px rgba(59,130,246,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-white font-bold text-sm tracking-tight">
                  C
                </span>
              </div>
              <span
                className="text-white text-2xl font-semibold tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                CIS
              </span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-[10px] text-white/45 mt-2 tracking-[0.3em] uppercase"
            >
              Campus Intelligence
            </motion.p>
          </motion.div>

          {/* Skip hint */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
            className="absolute bottom-8 right-6 text-[10px] text-white/40 tracking-widest uppercase z-10 hover:text-white/70 transition-colors"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
