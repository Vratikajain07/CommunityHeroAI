import { 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  MapPin, 
  Clock, 
  Upload, 
  Bot, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import GlassCard from "./GlassCard";

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function LandingPage({ onLoginClick, onSignupClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-between">
      {/* Visual background ambient details */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Landing Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-[0_4px_12px_rgba(14,165,233,0.2)]">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-bold text-lg tracking-tight text-slate-850">
              CommunityHero <span className="text-sky-600">AI</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
              Hyperlocal Problem Solver
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onSignupClick}
            className="px-4.5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left column: Text Content */}
        <div className="flex-1 text-left max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-sky-50 border border-sky-200/60 px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span className="text-xs font-semibold text-sky-700 font-display">Powered by Google Gemini AI</span>
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-800 tracking-tight leading-[1.1] mb-6">
            Smart Communities <br />
            Start with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600">Smart Reporting.</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
            Empower your neighborhood. Identify potholes, leaks, broken streetlights, or litter, upload a photo, and watch our Gemini AI categorize, estimate severity, and route it to local authorities with precision. Track status transparently in real-time.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onSignupClick}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-sky-400 to-blue-600 hover:brightness-105 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Report an Issue Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>Sign in to Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200">
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-slate-800">4,812+</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-1">Issues Solved</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-sky-600">98.4%</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-1">AI Classification</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-slate-800">&lt; 2hr</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-1">Response Dispatch</p>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Visual Concept Cards */}
        <div className="flex-1 w-full max-w-xl">
          <GlassCard className="p-8 relative border-slate-150 shadow-xs relative overflow-hidden bg-white rounded-3xl group">
            {/* Ambient card highlights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-2xl group-hover:bg-sky-200/50 transition-all duration-500" />
            
            <h3 className="font-display font-bold text-lg text-slate-850 mb-6 flex items-center space-x-2 text-left">
              <Activity className="w-5 h-5 text-sky-600 animate-pulse" />
              <span>How Hyperlocal AI Works</span>
            </h3>

            {/* Step-by-Step interactive blocks */}
            <div className="space-y-6 text-left">
              <div className="flex space-x-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-850">1. Snap & Upload Photo</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload any civic issue picture. Citizens can either manually type address or click GPS auto-detect.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-850">2. Multi-model Gemini AI Processing</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Gemini instantly analyzes the image, creates description, predicts severity (Low, Medium, High, Critical), and routes to correct departments.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-850">3. Geolocated Civic Map & Routing</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Complaints are placed as live pins on the Interactive Civic Map. Automated formal letters can be printed instantly to push the official channels.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-850">4. Transparent Workflow Resolution</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Follow tracking status transparently (Pending → In Progress → Resolved) with notifications. Admins resolve reports with full accountability.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-150 py-4.5 mt-8 text-center relative z-10">
        <p className="text-xs text-slate-500 font-mono">
          &copy; 2026 Community Hero AI. Dedicated to Clean, Accountable, and Smart Neighborhoods.
        </p>
      </footer>
    </div>
  );
}
