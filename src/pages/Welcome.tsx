import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import GridFieldCanvas from "@/components/fx/GridFieldCanvas";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-hero relative overflow-hidden">
      {/* Subtle digital-campus grid */}
      <GridFieldCanvas className="absolute inset-0 w-full h-full opacity-70" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-primary-foreground/10"
        >
          <Zap className="w-9 h-9 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-primary-foreground mb-2"
        >
          Campus Intelligence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-primary-foreground/70 text-sm mb-1"
        >
          University of Professional Studies, Accra
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-primary-foreground/50 text-xs mb-12"
        >
          Your Smart Campus Companion
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 rounded-2xl bg-primary-foreground text-primary font-semibold text-sm shadow-lg active:scale-[0.98] transition-transform"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 rounded-2xl border border-primary-foreground/30 text-primary-foreground font-medium text-sm active:scale-[0.98] transition-transform"
          >
            I have an account
          </button>
          <button
            onClick={() => navigate("/visit")}
            className="w-full py-3 rounded-2xl text-primary-foreground/80 font-medium text-xs active:scale-[0.98] transition-transform underline-offset-4 hover:underline"
          >
            Continue as Visitor →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
