import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  FileText, 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  PlusCircle, 
  MessageSquare, 
  Map 
} from "lucide-react";
import GlassCard from "./GlassCard";
import { Complaint, User } from "../types";

interface DashboardProps {
  user: User;
  complaints: Complaint[];
  setActiveTab: (tab: string) => void;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export default function Dashboard({ user, complaints, setActiveTab, onSelectComplaint }: DashboardProps) {
  // Metric Calculations
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  // Chart 1: Department wise Pie Chart
  const deptMap: Record<string, number> = {};
  complaints.forEach(c => {
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
  });
  const deptData = Object.keys(deptMap).map(key => ({
    name: key.replace(" Department", ""),
    value: deptMap[key]
  }));

  // Chart 2: Status Bar Chart
  const statusData = [
    { name: "Pending", count: pending, fill: "#f59e0b" },
    { name: "In Progress", count: inProgress, fill: "#0ea5e9" },
    { name: "Resolved", count: resolved, fill: "#10b981" }
  ];

  // Chart 3: Severity Breakdown Area Chart
  const severityMap: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  complaints.forEach(c => {
    severityMap[c.severity] = (severityMap[c.severity] || 0) + 1;
  });
  const severityData = Object.keys(severityMap).map(key => ({
    name: key,
    Complaints: severityMap[key]
  }));

  // Colors for Pie Chart cells
  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#3b82f6"];

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case "Critical": return "bg-rose-50 text-rose-700 border border-rose-200/60";
      case "High": return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "Medium": return "bg-sky-50 text-sky-700 border border-sky-200/60";
      default: return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    }
  };

  const getStatusBadgeClass = (stat: string) => {
    switch (stat) {
      case "Resolved": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "In Progress": return "bg-sky-50 text-sky-700 border border-sky-200";
      default: return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Dynamic Welcome Heading banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-500 to-indigo-600 p-8 rounded-3xl shadow-xs text-white">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Welcome back, <span className="text-sky-200 font-extrabold">@{user.username}</span>
          </h2>
          <p className="text-sm text-sky-100/90 mt-1 leading-relaxed font-sans">
            Monitor hyperlocal civic health, track active investigations, or submit AI-powered issue dispatches.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user.role === "citizen" && (
            <button
              onClick={() => setActiveTab("report")}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-sky-600 bg-white hover:bg-sky-50 shadow-xs transition-all cursor-pointer hover:translate-y-[-1px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Civic Issue</span>
            </button>
          )}
          <button
            onClick={() => {
              const el = document.getElementById("chatbot-trigger");
              if (el) el.click();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600/30 border border-sky-400/25 hover:bg-sky-600/50 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-sky-200 animate-pulse" />
            <span>Consult AI Agent</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic cards with layout animations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hoverable className="flex items-center space-x-4 border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total Cases</p>
            <h3 className="text-2xl font-display font-bold text-slate-800 mt-1">{total}</h3>
          </div>
        </GlassCard>

        <GlassCard hoverable className="flex items-center space-x-4 border-amber-100 bg-amber-50/10">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-display">Pending Review</p>
            <h3 className="text-2xl font-display font-bold text-amber-600 mt-1">{pending}</h3>
          </div>
        </GlassCard>

        <GlassCard hoverable className="flex items-center space-x-4 border-sky-100 bg-sky-50/10">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-sky-600 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">In Progress</p>
            <h3 className="text-2xl font-display font-bold text-sky-600 mt-1">{inProgress}</h3>
          </div>
        </GlassCard>

        <GlassCard hoverable className="flex items-center space-x-4 border-emerald-100 bg-emerald-50/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Resolved Cases</p>
            <h3 className="text-2xl font-display font-bold text-emerald-600 mt-1">{resolved}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department pie breakdown */}
        <GlassCard className="lg:col-span-1 border-slate-100 flex flex-col justify-between">
          <h4 className="font-display font-bold text-base text-slate-800 mb-4">Department Routing</h4>
          <div className="h-64 flex items-center justify-center relative">
            {deptData.length === 0 ? (
              <p className="text-xs text-slate-500">No reported data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                    itemStyle={{ color: "#1e293b", fontSize: "12px" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={40} 
                    iconType="circle"
                    formatter={(val) => <span className="text-[10px] text-slate-600 font-display font-medium">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Status Distribution */}
        <GlassCard className="lg:col-span-1 border-slate-100 flex flex-col justify-between">
          <h4 className="font-display font-bold text-base text-slate-800 mb-4">Complaint Lifecycle</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={statusData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                  labelStyle={{ color: "#1e293b", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Severity Area chart */}
        <GlassCard className="lg:col-span-1 border-slate-100 flex flex-col justify-between">
          <h4 className="font-display font-bold text-base text-slate-800 mb-4">Severity Matrix</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                  labelStyle={{ color: "#1e293b", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ color: "#0ea5e9", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="Complaints" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorSeverity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Grid of Recent Feed and Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Feed Table/List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-lg text-slate-800">Recent Civic Dispatches</h4>
            <button 
              onClick={() => setActiveTab("history")}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1 hover:translate-x-1 transition-all cursor-pointer"
            >
              <span>View Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <GlassCard className="p-0 border-slate-100 overflow-hidden">
            {complaints.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm font-display">No cases reported yet. Use the Action utilities to file a report.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {complaints.slice(0, 4).map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => {
                      if (onSelectComplaint) onSelectComplaint(c);
                      setActiveTab("history");
                    }}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all gap-4"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Image Thumbnail */}
                      <img 
                        src={c.imageUrl} 
                        alt={c.issueTitle}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        onError={(e) => {
                          // fallback
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1599740831146-80a6b7db00b2?auto=format&fit=crop&q=80&w=150";
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">{c.id}</span>
                          <span className={`text-[10px] font-semibold font-display px-2 py-0.5 rounded-full ${getSeverityBadgeClass(c.severity)}`}>
                            {c.severity}
                          </span>
                        </div>
                        <h5 className="font-semibold text-sm text-slate-800 mt-1 truncate max-w-xs sm:max-w-md">{c.issueTitle}</h5>
                        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xs sm:max-w-md">{c.address}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl block text-center ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-1">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Quick action side utilities */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-lg text-slate-800">Interactive Portals</h4>
          <GlassCard className="p-5 border-slate-100 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer group" onClick={() => setActiveTab("map")}>
              <div className="flex items-center space-x-3.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-all">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-800">Visual Civic Map</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Track pins geographically</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-all" />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer group" onClick={() => setActiveTab("help")}>
              <div className="flex items-center space-x-3.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-all">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-800">Guidelines & Help</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Read platform handbook</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-all" />
            </div>

            <div className="p-4 bg-gradient-to-br from-sky-50 via-indigo-50/30 to-transparent border border-sky-100 rounded-2xl text-left">
              <h5 className="font-display font-bold text-sm text-sky-600 mb-1.5 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>Quick Tip</span>
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                You can drag and drop your civic photos in the reporting page. Our custom-trained Gemini engine auto-extracts metadata, severity parameters, and routing structures instantly.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
