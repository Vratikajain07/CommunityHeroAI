import React, { useState } from "react";
import { 
  User as UserIcon, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles,
  Info
} from "lucide-react";
import GlassCard from "./GlassCard";
import { User, UserRole } from "../types";
import { apiSignup, apiLogin } from "../lib/api";

interface AuthPageProps {
  initialMode?: "login" | "signup";
  onAuthSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ initialMode = "login", onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (username.length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain alphanumeric characters and underscores.";
    }
    if (password.length < 4) {
      return "Password must be at least 4 characters long for basic security.";
    }
    if (mode === "signup") {
      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const data = await apiSignup(username, password, role);
        setSuccessMsg("Account successfully registered! Logging you in...");
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1500);
      } else {
        const data = await apiLogin(username, password);
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Launcher Return link */}
      <button
        onClick={onBackToLanding}
        className="absolute top-8 left-8 flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-all text-sm font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-[0_4px_12px_rgba(14,165,233,0.2)] mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-850">
            CommunityHero <span className="text-sky-600">AI</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Portal Authorization
          </p>
        </div>

        <GlassCard className="border-slate-150 shadow-xs bg-white p-8 rounded-3xl">
          {/* Header tabs toggle */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 text-center font-display font-semibold text-sm pb-2 relative transition-all ${
                mode === "login" ? "text-sky-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Sign In
              {mode === "login" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 text-center font-display font-semibold text-sm pb-2 relative transition-all ${
                mode === "signup" ? "text-sky-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Register Account
              {mode === "signup" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-650 font-display">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vratika"
                  className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-650 font-display">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {mode === "signup" && (
              <div className="space-y-1.5 text-left animate-fade-in">
                <label className="text-xs font-semibold text-slate-650 font-display">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Role Selection (Signup only) */}
            {mode === "signup" && (
              <div className="space-y-2 text-left animate-fade-in">
                <label className="text-xs font-semibold text-slate-650 font-display">Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                      role === "citizen"
                        ? "bg-sky-50 border-sky-500 text-sky-600 font-bold"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:text-slate-700"
                    }`}
                  >
                    <span className="font-display">Citizen</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-normal">Report & track</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                      role === "admin"
                        ? "bg-sky-50 border-sky-500 text-sky-600 font-bold"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:text-slate-700"
                    }`}
                  >
                    <span className="font-display">Admin</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-normal">Resolve & update</span>
                  </button>
                </div>
              </div>
            )}

            {/* Alert Messages */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-750 text-xs text-left leading-relaxed flex items-start space-x-2 animate-fade-in shadow-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-750 text-xs text-left leading-relaxed flex items-start space-x-2 animate-fade-in shadow-xs">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                loading ? "opacity-70 pointer-events-none" : ""
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === "login" ? (
                "Authorize & Enter"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Prompt description details */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
              {mode === "login" ? (
                <>
                  Demo users available: <br />
                  <span className="text-slate-500">citizen: vratika</span> | <span className="text-slate-500">admin: admin</span> (any password works)
                </>
              ) : (
                "Create a real account to save reports and interact on the geolocated civic feed."
              )}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
