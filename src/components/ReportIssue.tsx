import React, { useState, useRef } from "react";
import { 
  Upload, 
  MapPin, 
  Bot, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  MapPinOff, 
  PlusCircle, 
  RefreshCw,
  Trash2,
  HelpCircle
} from "lucide-react";
import GlassCard from "./GlassCard";
import { User, SeverityLevel } from "../types";

interface ReportIssueProps {
  user: User;
  onReportCreated: () => void;
  setActiveTab: (tab: string) => void;
}

export default function ReportIssue({ user, onReportCreated, setActiveTab }: ReportIssueProps) {
  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [issueTitle, setIssueTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [severity, setSeverity] = useState<SeverityLevel>("Medium");
  const [department, setDepartment] = useState("Public Works Department");
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState<"gps" | "manual">("manual");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");

  // AI Analysis feedback
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisConfidence, setAnalysisConfidence] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = ["Road Damage", "Water Leakage", "Garbage", "Streetlight", "Drainage", "Infrastructure Damage"];
  const severities: SeverityLevel[] = ["Low", "Medium", "High", "Critical"];
  const departments = [
    "Public Works Department",
    "Municipal Corporation",
    "Electricity Department",
    "Water Department",
    "Sanitation Department"
  ];

  // Map category to department
  const autoAssignDepartment = (cat: string) => {
    switch (cat) {
      case "Road Damage":
      case "Infrastructure Damage":
        return "Public Works Department";
      case "Water Leakage":
        return "Water Department";
      case "Garbage":
        return "Municipal Corporation";
      case "Streetlight":
        return "Electricity Department";
      case "Drainage":
        return "Sanitation Department";
      default:
        return "Public Works Department";
    }
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Process selected file
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }
    setErrorMsg(null);
    setImageFile(file);

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      
      // Trigger auto AI Analysis!
      triggerAiAnalysis(base64, file.type);
    } catch (err) {
      setErrorMsg("Failed to process image preview.");
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // AI Image Analysis via Gemini API
  const triggerAiAnalysis = async (base64: string, mimeType: string) => {
    setAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/complaints/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI Analysis failed");
      }

      // Populate predicted parameters
      if (data.issueTitle) setIssueTitle(data.issueTitle);
      if (data.description) setDescription(data.description);
      if (data.category) {
        setCategory(data.category);
        setDepartment(autoAssignDepartment(data.category));
      }
      if (data.severity) setSeverity(data.severity as SeverityLevel);
      if (data.department) setDepartment(data.department);
      if (data.confidence) setAnalysisConfidence(data.confidence);

      setAiSuggestions("Gemini AI successfully extracted parameters from your photo.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI image analysis failed, but you can fill out the form parameters manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Fallback to IP-based geolocation
  const detectLocationByIp = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("IP geolocation service failed");
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        const cityStr = data.city ? `${data.city}, ` : "";
        const regionStr = data.region ? `${data.region}, ` : "";
        const countryStr = data.country_name || "";
        setAddress(`${cityStr}${regionStr}${countryStr}`);
        setErrorMsg(null);
      } else {
        throw new Error("Invalid lat/lng data from IP service");
      }
    } catch (err) {
      console.error("IP fallback failed:", err);
      setErrorMsg("Failed to read GPS coordinates. Please specify address and coordinates manually.");
      setLocationType("manual");
    }
  };

  // Browser Geolocation GPS integration
  const handleDetectLocation = () => {
    setErrorMsg("Detecting coordinates...");
    setLocationType("gps");

    if (!navigator.geolocation) {
      detectLocationByIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAddress(`GPS Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
        setErrorMsg(null);
      },
      (error) => {
        console.warn("Browser geolocation failed, using IP fallback...", error);
        detectLocationByIp();
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle || !address) {
      setErrorMsg("Please specify at least a title and a valid address/location.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      citizenId: user.id,
      citizenName: user.username,
      issueTitle,
      description,
      category,
      severity,
      confidence: analysisConfidence || 1.0,
      department,
      locationType,
      address,
      latitude: latitude || 37.7749,
      longitude: longitude || -122.4194,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1599740831146-80a6b7db00b2?auto=format&fit=crop&q=80&w=600"
    };

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error("Failed to file complaint.");
      }
      
      setSuccess(true);
      setTimeout(() => {
        onReportCreated();
        setActiveTab("dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case "Critical": return "bg-rose-50 text-rose-700 border border-rose-200";
      case "High": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Medium": return "bg-sky-50 text-sky-700 border border-sky-200";
      default: return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">Report New Community Issue</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          File a geolocated civic complaint. Our Gemini model will auto-analyze the image to categorize, assess severity, and draft department routing instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Image Upload & Drag Drop Panel */}
        <div className="md:col-span-1 space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center space-x-1.5">
            <span>Issue Photo</span>
            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" title="Uploading an image automatically runs Gemini AI analysis." />
          </h4>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
              isDragActive 
                ? "border-sky-500 bg-sky-50/50" 
                : imagePreview 
                  ? "border-slate-200 bg-slate-50" 
                  : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />

            {imagePreview ? (
              <>
                <img 
                  src={imagePreview} 
                  alt="Issue Preview" 
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl" 
                />
                <div className="absolute inset-0 bg-black/60 hover:bg-black/75 transition-all flex flex-col items-center justify-center opacity-0 hover:opacity-100 p-4">
                  <Trash2 className="w-8 h-8 text-rose-400 mb-2" onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(null);
                    setAnalysisConfidence(null);
                    setAiSuggestions(null);
                  }} />
                  <p className="text-xs text-white font-semibold">Change / Delete photo</p>
                </div>
              </>
            ) : (
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Drag & drop photo here</p>
                  <p className="text-xs text-slate-500 mt-1">or click to browse local files</p>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Supports PNG, JPG, JPEG</p>
              </div>
            )}
          </div>

          {/* AI Analyzing skeleton feedback */}
          {analyzing && (
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 animate-pulse text-left space-y-3">
              <div className="flex items-center space-x-2 text-sky-600">
                <Bot className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold font-display">Gemini AI Analyzing Visuals...</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-slate-200 rounded-full w-full" />
                <div className="h-2 bg-slate-200 rounded-full w-4/5" />
                <div className="h-2 bg-slate-200 rounded-full w-2/3" />
              </div>
              <p className="text-[10px] text-slate-550 leading-tight">
                "Extracting category details, severity level, routing department, and structuring visual evidence parameters..."
              </p>
            </div>
          )}

          {/* Confidence Indicator if analyzing completed */}
          {analysisConfidence !== null && !analyzing && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left">
              <p className="text-xs font-semibold text-emerald-600 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>AI Categorization Done!</span>
              </p>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-slate-500">Analysis Confidence:</span>
                <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  {(analysisConfidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Detailed Form parameters */}
        <div className="md:col-span-2">
          <GlassCard className="border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Issue Title */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-600 font-display">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous deep pothole at crossroads"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-600 font-display">Problem Description</label>
                <textarea
                  placeholder="Provide precise visual details or impact of this issue on your neighborhood..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
                />
              </div>

              {/* Two Column details: Category and Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-600 font-display">Civic Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setDepartment(autoAssignDepartment(e.target.value));
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-600 font-display flex items-center justify-between">
                    <span>Severity Rank</span>
                    {imagePreview && (
                      <span className="text-[9px] font-mono uppercase text-sky-600 font-bold">AI Evaluated</span>
                    )}
                  </label>
                  <div className="flex items-center space-x-2.5">
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                    >
                      {severities.map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                      ))}
                    </select>
                    <span className={`text-xs font-semibold px-3 py-2 rounded-xl border font-display shrink-0 ${getSeverityBadgeClass(severity)}`}>
                      {severity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Department Routing */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-600 font-display">Responsible Department (Auto-Routed)</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Location detection / Address coordinates */}
              <div className="space-y-2 border-t border-slate-105 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 font-display">Geographic Coordinates & Address</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        locationType === "gps"
                          ? "bg-sky-50 text-sky-600 border border-sky-250"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Detect via GPS</span>
                    </button>
                    {locationType === "gps" && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationType("manual");
                          setLatitude("");
                          setLongitude("");
                          setAddress("");
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all cursor-pointer"
                        title="Clear GPS"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 58 Pine Ave, Westside Neighborhood"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                  
                  {locationType === "gps" && (
                    <div className="grid grid-cols-2 gap-3 animate-fade-in text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">Latitude</span>
                        <input
                          type="number"
                          step="any"
                          required
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. 37.7749"
                          className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-850 font-mono outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">Longitude</span>
                        <input
                          type="number"
                          step="any"
                          required
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. -122.4194"
                          className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-850 font-mono outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Feedback Msg */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-start space-x-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center space-x-2 animate-fade-in">
                  <Check className="w-5 h-5 animate-bounce shrink-0 text-emerald-600" />
                  <span>Complaint filed successfully. Returning to dashboard...</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 transition-all flex items-center justify-center cursor-pointer shadow-xs hover:translate-y-[-1px] ${
                    loading || success ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      <span>Submit Case File</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
