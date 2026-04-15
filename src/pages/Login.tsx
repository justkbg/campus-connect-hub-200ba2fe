import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Zap } from "lucide-react";

const roles = ["Student", "Lecturer", "Course Rep", "Admin"];

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState("Student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "Admin") navigate("/admin");
    else if (role === "Lecturer") navigate("/lecturer");
    else if (role === "Course Rep") navigate("/course-rep");
    else navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-12">
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

        {/* Role selector */}
        <div className="flex gap-1.5 mb-6 p-1 bg-muted rounded-2xl">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-[11px] font-semibold rounded-xl transition-all ${
                role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {role === "Student" ? "Student ID" : role === "Course Rep" ? "Student ID" : "UPSA Email"}
            </label>
            <input
              type="text"
              placeholder={role === "Student" || role === "Course Rep" ? "e.g. STU-2024-0847" : "email@upsa.edu.gh"}
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
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
