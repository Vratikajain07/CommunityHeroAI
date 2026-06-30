import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  MapPin, 
  Mail, 
  Sparkles,
  Printer,
  X,
  FileCheck,
  Building,
  RefreshCw
} from "lucide-react";
import GlassCard from "./GlassCard";
import { Complaint, SeverityLevel, ComplaintStatus, User } from "../types";

interface ComplaintHistoryProps {
  user: User;
  complaints: Complaint[];
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  onStatusUpdated?: () => void; // call if status changed in parent (for admins)
}

export default function ComplaintHistory({ 
  user,
  complaints, 
  selectedComplaintId, 
  setSelectedComplaintId 
}: ComplaintHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);

  // Set the first complaint in list as default if none selected
  const activeComplaint = useMemo(() => {
    if (selectedComplaintId) {
      const match = complaints.find(c => c.id === selectedComplaintId);
      if (match) return match;
    }
    return complaints[0] || null;
  }, [complaints, selectedComplaintId]);

  // Handle letter generation
  const handleGenerateLetter = async (id: string) => {
    setGeneratingLetter(true);
    setLetterContent(null);
    try {
      const res = await fetch(`/api/complaints/${id}/letter`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLetterContent(data.letter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Download Letter as TXT file
  const handleDownloadLetter = (id: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_Complaint_Letter_${id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export full complaints list as CSV
  const handleExportCSV = () => {
    const headers = ["Complaint ID,Reporter,Title,Description,Category,Severity,Department,Status,Address,DateFiled\n"];
    const rows = complaints.map(c => 
      `"${c.id}","${c.citizenName}","${c.issueTitle.replace(/"/g, '""')}","${c.description.replace(/"/g, '""')}","${c.category}","${c.severity}","${c.department}","${c.status}","${c.address.replace(/"/g, '""')}","${new Date(c.createdAt).toLocaleDateString()}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Community_Hero_AI_Complaints.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter complaints list
  const filteredList = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = 
        c.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchDept = filterDept === "All" || c.department === filterDept;
      const matchSev = filterSeverity === "All" || c.severity === filterSeverity;
      const matchStat = filterStatus === "All" || c.status === filterStatus;

      return matchSearch && matchDept && matchSev && matchStat;
    });
  }, [complaints, searchTerm, filterDept, filterSeverity, filterStatus]);

  const departments = [
    "Public Works Department",
    "Municipal Corporation",
    "Electricity Department",
    "Water Department",
    "Sanitation Department"
  ];

  const getStatusIcon = (stat: ComplaintStatus) => {
    switch (stat) {
      case "Resolved": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "In Progress": return <Activity className="w-5 h-5 text-sky-500 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusBadgeClass = (stat: ComplaintStatus) => {
    switch (stat) {
      case "Resolved": return "bg-emerald-50 text-emerald-750 border border-emerald-200/60";
      case "In Progress": return "bg-sky-50 text-sky-750 border border-sky-200/60";
      default: return "bg-amber-50 text-amber-700 border border-amber-200/60";
    }
  };

  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case "Critical": return "bg-rose-50 text-rose-700 border border-rose-200/60";
      case "High": return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "Medium": return "bg-sky-50 text-sky-700 border border-sky-200/60";
      default: return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    }
  };

  // Timeline percentage representation
  const getProgressPercentage = (stat: ComplaintStatus) => {
    switch (stat) {
      case "Resolved": return 100;
      case "In Progress": return 60;
      default: return 20;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">Hyperlocal Incident Feed</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Search, filter, and track all community case files. Access progress timelines, print formal letters, or audit email dispatches in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Complaint Search & Listing */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-base text-slate-800">Active Case Files</h4>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Search bar input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, title, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Inline list filters */}
          <div className="space-y-2 bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Quick Filters</span>
              </span>
              <button
                onClick={() => {
                  setFilterDept("All");
                  setFilterSeverity("All");
                  setFilterStatus("All");
                }}
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Department</p>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 mt-1 text-slate-700 outline-none"
                >
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d.replace(" Department", "")}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Severity</p>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 mt-1 text-slate-700 outline-none"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Status</p>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 mt-1 text-slate-700 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* List display */}
          <GlassCard className="p-0 border-slate-150 max-h-[400px] overflow-y-auto bg-white">
            {filteredList.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-xs">No complaints found matching filters</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredList.map(c => {
                  const isSelected = activeComplaint?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedComplaintId(c.id);
                        setLetterContent(c.letterGenerated || null);
                      }}
                      className={`p-4 text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected 
                          ? "bg-sky-50 border-l-4 border-sky-500" 
                          : "hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono font-bold text-slate-400">{c.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSeverityBadgeClass(c.severity)}`}>
                            {c.severity}
                          </span>
                        </div>
                        <h5 className="font-semibold text-sm text-slate-800 mt-1 truncate">{c.issueTitle}</h5>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.address}</p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${getStatusBadgeClass(c.status)}`}>
                          {c.status}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 mt-1">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Case Details, Status Progress bar, and AI Letter generator */}
        <div className="lg:col-span-2">
          {activeComplaint ? (
            <div className="space-y-6 animate-fade-in">
              {/* Core Info card */}
              <GlassCard className="border-slate-150 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4.5 mb-4.5">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block">CASE FILE REF: {activeComplaint.id}</span>
                    <h3 className="font-display font-bold text-lg text-slate-800 mt-1 leading-tight">{activeComplaint.issueTitle}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${getSeverityBadgeClass(activeComplaint.severity)}`}>
                      {activeComplaint.severity} Severity
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${getStatusBadgeClass(activeComplaint.status)}`}>
                      {activeComplaint.status}
                    </span>
                  </div>
                </div>

                {/* Split media and description details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-1">
                    <img 
                      src={activeComplaint.imageUrl} 
                      alt={activeComplaint.issueTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-xs"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1599740831146-80a6b7db00b2?auto=format&fit=crop&q=80&w=300";
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed font-sans">{activeComplaint.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Building className="w-4 h-4 text-sky-600" />
                        <div>
                          <p className="text-[10px] uppercase font-mono text-slate-450">Routing Dept</p>
                          <p className="text-slate-800 font-semibold mt-0.5 truncate max-w-[130px]">{activeComplaint.department.replace(" Department", "")}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-[10px] uppercase font-mono text-slate-450">Location Landmarks</p>
                          <p className="text-slate-800 font-semibold mt-0.5 truncate max-w-[130px]" title={activeComplaint.address}>{activeComplaint.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Status Tracking Progress Timeline with animated bar */}
              <GlassCard className="border-slate-150 text-left">
                <h4 className="font-display font-bold text-sm text-slate-800 mb-6 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
                  <span>Interactive Case Tracker Timeline</span>
                </h4>

                {/* Interactive tracker progress bar bar */}
                <div className="relative mb-8 px-6">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-sky-500 to-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700" 
                    style={{ width: `${getProgressPercentage(activeComplaint.status)}%` }} 
                  />

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center text-xs font-bold transition-all ${
                        activeComplaint.status === "Pending" || activeComplaint.status === "In Progress" || activeComplaint.status === "Resolved"
                          ? "border-amber-500 text-amber-600 font-bold"
                          : "border-slate-200 text-slate-400"
                      }`}>
                        1
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 font-display mt-2">Reported</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center text-xs font-bold transition-all ${
                        activeComplaint.status === "In Progress" || activeComplaint.status === "Resolved"
                          ? "border-sky-500 text-sky-600 font-bold"
                          : "border-slate-200 text-slate-400"
                      }`}>
                        2
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 font-display mt-2">In Action</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center text-xs font-bold transition-all ${
                        activeComplaint.status === "Resolved"
                          ? "border-emerald-500 text-emerald-600 font-bold"
                          : "border-slate-200 text-slate-400"
                      }`}>
                        3
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 font-display mt-2">Resolved</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Milestone items */}
                <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-4 text-xs">
                  {activeComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative animate-fade-in">
                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]" />
                      <div className="flex items-center space-x-2.5">
                        <span className="font-bold text-slate-850 font-display">Milestone Checked</span>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(step.updatedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-650 mt-1 leading-relaxed">{step.comment}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Complaint Letter layout */}
              <GlassCard className="border-slate-150 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-display font-bold text-sm text-slate-800 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-sky-600 animate-bounce" />
                    <span>AI-Generated Formal Complaint Letter</span>
                  </h4>
                  {letterContent && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadLetter(activeComplaint.id, letterContent)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
                        title="Download TXT"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
                        title="Print Letter"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {letterContent ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] leading-relaxed font-mono text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto text-left shadow-xs">
                    {letterContent}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                      Need official action? Instruct Gemini AI to draft a formal, legally compliance and structured municipal petition letter addressed to department officials.
                    </p>
                    <button
                      onClick={() => handleGenerateLetter(activeComplaint.id)}
                      disabled={generatingLetter}
                      className="mt-4 flex items-center space-x-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                    >
                      {generatingLetter ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{generatingLetter ? "Drafting Formal Letter..." : "Generate Official Municipal Letter"}</span>
                    </button>
                  </div>
                )}
              </GlassCard>

              {/* simulated email tracker dispatch logs */}
              <GlassCard className="border-slate-150 text-left">
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Simulated Dispatch Logs (Automated Emails)</span>
                </h4>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850 font-mono text-[10px] text-emerald-400 space-y-1.5 leading-relaxed shadow-sm">
                  <p className="text-slate-400 flex items-center justify-between">
                    <span>STATUS: SENT (SUCCESS)</span>
                    <span>{new Date(activeComplaint.createdAt).toLocaleString()}</span>
                  </p>
                  <p>&gt; Connection established with SMTP Mailserver on port 465...</p>
                  <p>&gt; Dispatching notification package regarding {activeComplaint.id}...</p>
                  <p>&gt; To: civic-response@{activeComplaint.department.toLowerCase().replace(/[^a-z]/g, "")}.gov.org</p>
                  <p>&gt; CC: citizen-reporter@{user.username.toLowerCase()}.com</p>
                  <p>&gt; Subject: [CommunityHero AI Urgent Trigger] - Category: {activeComplaint.category} (Severity: {activeComplaint.severity})</p>
                  <p className="text-slate-400">&gt; Email body compiled with real-time GPS metadata and visual image attachment indicators.</p>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="py-24 text-center">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
              <h3 className="font-display font-bold text-lg text-slate-800 mt-4">Inspect Active Cases</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Choose any active file from the hyperlocal feed on the left to audit status milestones, print letters, and check email notification triggers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
