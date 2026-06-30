import { useState, useEffect } from "react";
import { 
  Shield, 
  User as UserIcon, 
  LogOut, 
  Bell, 
  Check, 
  HelpCircle, 
  Map as MapIcon, 
  List, 
  PlusCircle, 
  LayoutDashboard,
  AlertTriangle
} from "lucide-react";
import { User, Notification } from "../types";
import { apiGetNotifications, apiMarkNotificationRead } from "../lib/api";

interface NavbarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ user, activeTab, setActiveTab, onLogout }: NavbarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await apiGetNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new alerts
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user.id]);

  const markAsRead = async (id: string) => {
    try {
      await apiMarkNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.message.includes("CHA")) {
      setActiveTab("history");
    }
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs">
      {/* Brand Logo */}
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={() => setActiveTab("dashboard")}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-xs">
          <Shield className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg tracking-tight text-slate-850 flex items-center">
            CommunityHero <span className="text-sky-500 ml-1">AI</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
            Hyperlocal Solver
          </p>
        </div>
      </div>

      {/* Main Navigation tabs */}
      <nav className="hidden md:flex items-center space-x-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeTab === "dashboard"
              ? "bg-sky-50 text-sky-600 border-sky-100 shadow-xs"
              : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {user.role === "citizen" && (
          <button
            onClick={() => setActiveTab("report")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === "report"
                ? "bg-sky-50 text-sky-600 border-sky-100 shadow-xs"
                : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeTab === "map"
              ? "bg-sky-50 text-sky-600 border-sky-100 shadow-xs"
              : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Civic Map</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeTab === "history"
              ? "bg-sky-50 text-sky-600 border-sky-100 shadow-xs"
              : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <List className="w-4 h-4" />
          <span>Complaint Feed</span>
        </button>

        {user.role === "admin" && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === "admin"
                ? "bg-amber-50 text-amber-700 border-amber-200 shadow-xs"
                : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Admin Console</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("help")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeTab === "help"
              ? "bg-sky-50 text-sky-600 border-sky-100 shadow-xs"
              : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & FAQ</span>
        </button>
      </nav>

      {/* Action Utilities (Notifications + Profile Info) */}
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl animate-fade-in z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-display font-semibold text-sm text-slate-800 flex items-center space-x-1.5">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-sky-50 text-sky-600 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
                    className="text-xs text-sky-600 hover:text-sky-500"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-400 py-6 text-xs">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-xl text-left cursor-pointer transition-all border ${
                        n.read 
                          ? "bg-slate-50 border-slate-100 text-slate-500" 
                          : "bg-sky-50/50 border-sky-100 text-slate-700"
                      } hover:bg-slate-100`}
                    >
                      <div className="flex items-start space-x-2">
                        {n.type === "success" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : n.type === "warning" ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <Bell className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs text-slate-800 truncate">{n.title}</p>
                          <p className="text-[11px] leading-tight text-slate-500 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[9px] font-mono text-slate-400 block mt-1">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity tag */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5">
          <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center">
            <UserIcon className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">@{user.username}</p>
            <p className="text-[10px] text-slate-500 font-mono capitalize leading-none mt-0.5">
              {user.role} Account
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
