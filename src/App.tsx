import { useState, useEffect } from "react";
import { User, Complaint } from "./types";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ReportIssue from "./components/ReportIssue";
import InteractiveMap from "./components/InteractiveMap";
import ComplaintHistory from "./components/ComplaintHistory";
import AdminDashboard from "./components/AdminDashboard";
import AboutHelp from "./components/AboutHelp";
import Chatbot from "./components/Chatbot";

export default function App() {
  // Session User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("community_hero_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Current view toggle
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [authMode, setAuthMode] = useState<"landing" | "login" | "signup">("landing");

  // Core complaints list state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Sync session
  const handleAuthSuccess = (u: User) => {
    setUser(u);
    localStorage.setItem("community_hero_user", JSON.stringify(u));
    setAuthMode("landing");
    // Admins should land on the admin console or normal dashboard
    if (u.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("community_hero_user");
    setActiveTab("dashboard");
    setAuthMode("landing");
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Failed to load complaints from API", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // Poll every 15 seconds to ensure real-time synchronization across different browsers/roles!
    const interval = setInterval(fetchComplaints, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle cross-component complaint inspection
  const handleSelectComplaint = (c: Complaint) => {
    setSelectedComplaintId(c.id);
  };

  // If user is not authenticated, show landing or login screen
  if (!user) {
    if (authMode === "login") {
      return (
        <AuthPage
          initialMode="login"
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setAuthMode("landing")}
        />
      );
    }
    if (authMode === "signup") {
      return (
        <AuthPage
          initialMode="signup"
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setAuthMode("landing")}
        />
      );
    }
    return (
      <LandingPage
        onLoginClick={() => setAuthMode("login")}
        onSignupClick={() => setAuthMode("signup")}
      />
    );
  }

  // Render sub views based on selection
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            complaints={complaints}
            setActiveTab={setActiveTab}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case "report":
        return user.role === "citizen" ? (
          <ReportIssue
            user={user}
            onReportCreated={fetchComplaints}
            setActiveTab={setActiveTab}
          />
        ) : (
          <div className="text-center py-20">
            <h3 className="font-display font-bold text-lg text-slate-800">Unauthorized</h3>
            <p className="text-slate-500 mt-2">Only Citizen accounts can file new complaint dispatches.</p>
          </div>
        );
      case "map":
        return (
          <InteractiveMap
            complaints={complaints}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case "history":
        return (
          <ComplaintHistory
            user={user}
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            setSelectedComplaintId={setSelectedComplaintId}
          />
        );
      case "admin":
        return user.role === "admin" ? (
          <AdminDashboard
            user={user}
            complaints={complaints}
            onStatusUpdated={fetchComplaints}
            setActiveTab={setActiveTab}
            onSelectComplaint={handleSelectComplaint}
          />
        ) : (
          <div className="text-center py-20">
            <h3 className="font-display font-bold text-lg text-slate-800">Unauthorized Access</h3>
            <p className="text-slate-500 mt-2">Administrative Console is password protected.</p>
          </div>
        );
      case "help":
        return <AboutHelp />;
      default:
        return <div className="text-slate-800 py-12">View under construction...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative flex flex-col justify-between">
      {/* Visual background ambient details */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Dynamic Inner Stage */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Chatbot Overlay */}
      <Chatbot user={user} />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-5 text-center relative z-10 shrink-0">
        <p className="text-xs text-slate-500 font-mono">
          &copy; 2026 Community Hero AI. Dedicated to Clean, Accountable, and Smart Neighborhoods.
        </p>
      </footer>
    </div>
  );
}
