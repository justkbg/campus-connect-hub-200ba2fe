import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-sm"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <span className="text-3xl font-bold text-primary-foreground">C</span>
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
        </motion.div>
      </motion.div>
    </div>
  );
}
