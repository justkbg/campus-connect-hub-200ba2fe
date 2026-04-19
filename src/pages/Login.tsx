import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Zap } from "lucide-react";
import { useRole, ROLE_PROFILES, AppRole } from "@/contexts/RoleContext";

const selectableRoles: AppRole[] = [
  "student", "lecturer", "course_rep", "admin", "leadership", "alumni", "parent", "vendor", "applicant",
];

export default function Login() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [showPw, setShowPw] = useState(false);
  const [activeRole, setActiveRole] = useState<AppRole>("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(activeRole);
    navigate(ROLE_PROFILES[activeRole].homePath);
  };

  const isStudentLike = activeRole === "student" || activeRole === "course_rep";
  const isApplicant = activeRole === "applicant";

  return (
    <div className="min-h-screen bg-background px-6 pt-12 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto">
        <button onClick={() => navigate("/")} className="mb-8 p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
            <p className="text-xs text-muted-foreground">Sign in to your UPSA account</p>
          </div>
        </div>

        {/* Role chips */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">I am a</p>
          <div className="flex flex-wrap gap-1.5">
            {selectableRoles.map((r) => {
              const profile = ROLE_PROFILES[r];
              const active = activeRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRole(r)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-premium"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{profile.emoji}</span>{profile.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">{ROLE_PROFILES[activeRole].description}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {isStudentLike ? "Student ID" : isApplicant ? "Application Reference" : "UPSA Email"}
            </label>
            <input
              type="text"
              placeholder={
                isStudentLike ? "e.g. STU-2024-0847" :
                isApplicant ? "e.g. APP-2025-0142" :
                "email@upsa.edu.gh"
              }
              className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 pr-12"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-primary font-medium">Forgot password?</button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold text-sm shadow-premium active:scale-[0.98] transition-transform"
          >
            Sign In as {ROLE_PROFILES[activeRole].label}
          </button>

          <button
            type="button"
            onClick={() => { setRole("visitor"); navigate("/visit"); }}
            className="w-full py-3 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip — Continue as Visitor
          </button>
        </form>
      </motion.div>
    </div>
  );
}
