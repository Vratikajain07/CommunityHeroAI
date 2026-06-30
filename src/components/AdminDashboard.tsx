import { useState, useMemo } from "react";
import { 
  CheckCircle, 
  Activity, 
  Clock, 
  Trash2, 
  Building, 
  AlertTriangle, 
  UserCheck, 
  ExternalLink,
  Users,
  Search,
  Filter,
  Check,
  Building2,
  Lock,
  X
} from "lucide-react";
import GlassCard from "./GlassCard";
import { Complaint, User, ComplaintStatus, SeverityLevel } from "../types";
import { apiUpdateStatus, apiDeleteComplaint } from "../lib/api";

interface AdminDashboardProps {
  user: User;
  complaints: Complaint[];
  onStatusUpdated: () => void;
  setActiveTab: (tab: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function AdminDashboard({ 
  user, 
  complaints, 
  onStatusUpdated, 
  setActiveTab,
  onSelectComplaint
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resolutionComment, setResolutionComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>("In Progress");

  // Filter complaints
  const filteredList = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = 
        c.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSev = filterSeverity === "All" || c.severity === filterSeverity;
      const matchStat = filterStatus === "All" || c.status === filterStatus;

      return matchSearch && matchSev && matchStat;
    });
  }, [complaints, searchTerm, filterSeverity, filterStatus]);

  // Update complaint status API call
  const handleUpdateStatus = async (id: string) => {
    if (!id) return;
    try {
      await apiUpdateStatus(id, selectedStatus, resolutionComment);
      onStatusUpdated();
      setUpdatingId(null);
      setResolutionComment("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete complaint API call
  const handleDeleteComplaint = async (id: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete complaint ${id}? This action is irreversible.`)) {
      return;
    }
    try {
      await apiDeleteComplaint(id);
      onStatusUpdated();
    } catch (err) {
      console.error(err);
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

  const getStatusBadgeClass = (stat: ComplaintStatus) => {
    switch (stat) {
      case "Resolved": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "In Progress": return "bg-sky-50 text-sky-700 border border-sky-200";
      default: return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Top statistics overview panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">Administrative Control Console</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage civic dispatches, process resolutions, reassign departments, and moderate reports.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-150 px-4.5 py-2 rounded-xl">
          <Users className="w-4 h-4 text-sky-600" />
          <div>
            <p className="text-[9px] uppercase font-mono text-slate-450">Platform Users</p>
            <p className="text-sm font-semibold text-slate-800">5 Active Accounts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Administrative List Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-150 p-4 rounded-xl shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by ID, Title, Reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-250 focus:border-sky-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none placeholder-slate-400 transition-all"
              />
            </div>

            {/* Severity Status Quick filters */}
            <div className="flex items-center space-x-2">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <GlassCard className="p-0 border-slate-150 overflow-hidden bg-white shadow-xs">
            {filteredList.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-xs">No reports found matching criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-650">
                  <thead className="bg-slate-50 font-display font-semibold text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="p-3.5 pl-5">ID</th>
                      <th className="p-3.5">Reporter</th>
                      <th className="p-3.5">Issue Title</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-800 shrink-0">{c.id}</td>
                        <td className="p-3.5 font-medium text-slate-650">@{c.citizenName}</td>
                        <td className="p-3.5 font-semibold text-slate-800 truncate max-w-[150px]" title={c.issueTitle}>{c.issueTitle}</td>
                        <td className="p-3.5 text-slate-500 truncate max-w-[130px]">{c.department.replace(" Department", "")}</td>
                        <td className="p-3.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getSeverityBadgeClass(c.severity)}`}>
                            {c.severity}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${getStatusBadgeClass(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              onSelectComplaint(c);
                              setSelectedStatus(c.status);
                              setUpdatingId(c.id);
                            }}
                            className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 hover:text-sky-700 transition-all cursor-pointer"
                            title="Update Status"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteComplaint(c.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-650 hover:text-rose-700 transition-all cursor-pointer"
                            title="Delete Complaint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: Selected item update/assignment pane */}
        <div className="lg:col-span-1">
          {updatingId ? (
            <div className="space-y-4 animate-fade-in text-left">
              <GlassCard className="border-slate-150 relative shadow-xs flex flex-col justify-between">
                <button
                  onClick={() => setUpdatingId(null)}
                  className="absolute top-4 right-4 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">Moderating Issue {updatingId}</span>
                    <h4 className="font-display font-semibold text-sm text-slate-800 mt-1">Update Status & Timeline</h4>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-650 font-semibold font-display">Target Status</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {(["Pending", "In Progress", "Resolved"] as ComplaintStatus[]).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedStatus(s)}
                          className={`py-1.5 rounded-lg border font-semibold transition-all text-[11px] cursor-pointer ${
                            selectedStatus === s
                              ? "bg-sky-50 border-sky-500 text-sky-600"
                              : "bg-white border-slate-200 text-slate-550 hover:text-slate-750 hover:bg-slate-50/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-650 font-semibold font-display">Timeline Resolution Comment</label>
                    <textarea
                      placeholder="e.g. Repair dispatch crew tarred the hole successfully."
                      rows={3}
                      value={resolutionComment}
                      onChange={(e) => setResolutionComment(e.target.value)}
                      className="w-full bg-slate-55 hover:bg-slate-100/55 focus:bg-white border border-slate-250 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all resize-none mt-1"
                    />
                  </div>

                  {/* Instructions help block */}
                  <div className="p-3.5 bg-sky-5/55 border border-sky-100 rounded-xl flex items-start space-x-2 text-[11px] leading-relaxed text-sky-600 font-sans">
                    <Building2 className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                    <span>Updating the status automatically creates a real-time notification alert packet and triggers simulated email dispatches directly to the citizen account.</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setUpdatingId(null)}
                    className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(updatingId)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 shadow-sm cursor-pointer flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Resolution</span>
                  </button>
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="border-slate-100 p-8 text-center h-[280px] flex flex-col items-center justify-center bg-slate-50/20">
              <CheckCircle className="w-8 h-8 text-slate-400 animate-pulse mb-3" />
              <h4 className="font-display font-semibold text-sm text-slate-800">Resolve Civic Incidents</h4>
              <p className="text-xs text-slate-505 mt-2 leading-relaxed">
                Choose any complaint row and click the action key to review, override routing parameters, re-schedule department dispatches, and log final resolution milestones.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
