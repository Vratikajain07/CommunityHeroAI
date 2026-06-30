import { useState, useMemo } from "react";
import { 
  MapPin, 
  Map as MapIcon, 
  Layers, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  X,
  FileText,
  User
} from "lucide-react";
import GlassCard from "./GlassCard";
import { Complaint, SeverityLevel } from "../types";

interface InteractiveMapProps {
  complaints: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
}

export default function InteractiveMap({ complaints, onSelectComplaint }: InteractiveMapProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Filter complaints based on selection
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchSev = filterSeverity === "All" || c.severity === filterSeverity;
      const matchStat = filterStatus === "All" || c.status === filterStatus;
      return matchSev && matchStat;
    });
  }, [complaints, filterSeverity, filterStatus]);

  // Map latitude/longitude dynamically to percentage (0 to 100)
  // If all complaints are inside SF, we use standard SF bounds.
  // Otherwise, we scale bounds dynamically to perfectly fit all coordinates.
  const mapCoords = (lat: number, lng: number) => {
    let latMin = 37.7500;
    let latMax = 37.7900;
    let lngMin = -122.4500;
    let lngMax = -122.4100;

    // Check if any complaints are outside standard SF bounds
    const hasExternal = complaints.some(c => 
      c.latitude < 37.7500 || c.latitude > 37.7900 || 
      c.longitude < -122.4500 || c.longitude > -122.4100
    );

    if (hasExternal && complaints.length > 0) {
      const lats = complaints.map(c => c.latitude);
      const lngs = complaints.map(c => c.longitude);
      const minLa = Math.min(...lats);
      const maxLa = Math.max(...lats);
      const minLn = Math.min(...lngs);
      const maxLn = Math.max(...lngs);

      // Add a clean 15% boundary padding buffer
      const latDiff = maxLa - minLa || 0.01;
      const lngDiff = maxLn - minLn || 0.01;

      latMin = minLa - latDiff * 0.15;
      latMax = maxLa + latDiff * 0.15;
      lngMin = minLn - lngDiff * 0.15;
      lngMax = maxLn + lngDiff * 0.15;
    }

    // Calculate percentage coordinates
    let y = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    let x = ((lng - lngMin) / (lngMax - lngMin)) * 100;

    // Clamp values inside grid borders (5% to 95%)
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    return { x: `${x}%`, y: `${y}%` };
  };

  const getMarkerColor = (sev: SeverityLevel) => {
    switch (sev) {
      case "Critical": return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]";
      case "High": return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]";
      case "Medium": return "bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.6)]";
      default: return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]";
    }
  };

  const getMarkerBorderColor = (sev: SeverityLevel) => {
    switch (sev) {
      case "Critical": return "border-rose-400";
      case "High": return "border-amber-400";
      case "Medium": return "border-sky-400";
      default: return "border-emerald-400";
    }
  };

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
    <div className="space-y-6 animate-fade-in text-left">
      {/* Top filter dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <MapIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-800">Geolocated Civic Map</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time incident feed plotted on neighborhood vector grids.</p>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-semibold outline-none border-none cursor-pointer pr-2"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-semibold outline-none border-none cursor-pointer pr-2"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map + Info panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stylized City Vector Blueprint Canvas */}
        <GlassCard className="lg:col-span-3 border-slate-150 h-[500px] relative overflow-hidden p-0 flex items-center justify-center bg-slate-50/50">
          
          {/* Blueprint map gird lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          {/* Simulated blueprint city elements (water body, zones, transit highway) */}
          <div className="absolute top-[15%] left-0 w-[20%] h-[35%] border-r border-b border-sky-200 bg-sky-100/30 backdrop-blur-xs pointer-events-none flex items-center justify-center">
            <span className="text-[10px] font-mono text-sky-600 font-bold uppercase tracking-widest rotate-[-45deg]">Bay Reservoir</span>
          </div>
          
          <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[20%] border-l border-t border-slate-200/60 bg-slate-100/30 pointer-events-none flex items-center justify-center">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Industrial Area</span>
          </div>

          <div className="absolute top-[8%] right-[20%] w-[120px] h-[120px] rounded-full border border-dashed border-emerald-200/80 bg-emerald-50/40 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-widest">Main Plaza</span>
          </div>

          {/* City main avenues transit crossbars */}
          <div className="absolute inset-y-0 left-[48%] w-[1px] bg-slate-200 pointer-events-none" />
          <div className="absolute inset-x-0 top-[52%] h-[1px] bg-slate-200 pointer-events-none" />
          
          {/* Simulated highway bypass curves */}
          <div className="absolute bottom-[35%] left-[-10%] right-[-10%] h-[60px] border-y border-slate-200/80 bg-slate-100/60 rotate-[10deg] pointer-events-none flex items-center justify-center">
            <span className="text-[8px] font-mono text-slate-500 tracking-[0.25em] uppercase font-bold">Express Bypass-101</span>
          </div>

          {/* Neighborhood Labels */}
          <div className="absolute top-8 left-8 text-left pointer-events-none">
            <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Downtown Zone</h5>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Grid Ref: 37.77N / -122.41W</p>
          </div>
          <div className="absolute bottom-8 left-8 text-left pointer-events-none">
            <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Westside Suburb</h5>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Grid Ref: 37.76N / -122.44W</p>
          </div>
          <div className="absolute top-8 right-8 text-right pointer-events-none">
            <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">North Sector Hub</h5>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Grid Ref: 37.78N / -122.41W</p>
          </div>

          {/* Plotting active complaints */}
          {filteredComplaints.length === 0 ? (
            <div className="absolute p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-500">No reported complaints matching filters.</p>
            </div>
          ) : (
            filteredComplaints.map(c => {
              const pos = mapCoords(c.latitude, c.longitude);
              const isSelected = selectedComplaint?.id === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{ top: pos.y, left: pos.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none"
                >
                  {/* Visual locator animation rings */}
                  <div className={`w-8 h-8 rounded-full border-2 absolute -top-2.5 -left-2.5 animate-ping opacity-30 ${
                    c.severity === "Critical" ? "border-rose-500" :
                    c.severity === "High" ? "border-amber-500" :
                    c.severity === "Medium" ? "border-sky-500" : "border-emerald-500"
                  }`} style={{ animationDuration: "2.5s" }} />

                  {/* Dynamic Core Pin */}
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white group-hover:scale-125 transition-all duration-300 ${getMarkerColor(c.severity)} ${
                    isSelected ? "scale-125 ring-4 ring-sky-500/25" : ""
                  }`} />

                  {/* Simplified hover floating metadata label */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-2xl shrink-0 z-30 min-w-max">
                    <p className="text-[10px] font-bold text-white font-display">{c.issueTitle}</p>
                    <p className="text-[9px] font-mono text-slate-300">{c.id} • {c.severity}</p>
                  </div>
                </button>
              );
            })
          )}
        </GlassCard>

        {/* Right side drawer: Detail Popup Panel */}
        <div className="lg:col-span-1">
          {selectedComplaint ? (
            <div className="space-y-4 animate-fade-in text-left">
              <GlassCard className="border-slate-100 relative shadow-xs flex flex-col justify-between">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="absolute top-4 right-4 p-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider">
                      {selectedComplaint.id}
                    </span>
                    <span className={`text-[10px] font-semibold font-display px-2 py-0.5 rounded-full ${getSeverityBadgeClass(selectedComplaint.severity)}`}>
                      {selectedComplaint.severity}
                    </span>
                  </div>

                  {/* Image View */}
                  <img
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.issueTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-32 rounded-xl object-cover border border-slate-200 bg-slate-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1599740831146-80a6b7db00b2?auto=format&fit=crop&q=80&w=300";
                    }}
                  />

                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 leading-tight">{selectedComplaint.issueTitle}</h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-display">Dept assigned:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[120px]" title={selectedComplaint.department}>
                        {selectedComplaint.department.replace(" Department", "")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-display">Workflow:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${getStatusBadgeClass(selectedComplaint.status)}`}>
                        {selectedComplaint.status}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-500 font-display mt-0.5">Location:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[120px] text-right" title={selectedComplaint.address}>
                        {selectedComplaint.address}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-display flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Date filed:</span>
                      </span>
                      <span className="font-mono text-slate-850">
                        {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      if (onSelectComplaint) onSelectComplaint(selectedComplaint);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Track Status Timeline</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectComplaint) onSelectComplaint(selectedComplaint);
                    }}
                    className="w-full py-2 bg-sky-55 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-semibold text-sky-600 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                    <span>Generate Complaint Letter</span>
                  </button>
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="border-slate-100 p-8 text-center h-[280px] flex flex-col items-center justify-center bg-slate-50/20">
              <MapPin className="w-8 h-8 text-slate-400 animate-pulse mb-3" />
              <h4 className="font-display font-semibold text-sm text-slate-800">Inspect Incident Core</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Click any active colored coordinate marker on the neighborhood grid to view specific photos, departments, timeline reports, and automated formal letters.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
