import { Complaint, User, ComplaintStatus, SeverityLevel } from "../types";

const LOCAL_DB_KEY = "community_hero_local_db";

interface LocalDb {
  users: any[];
  complaints: any[];
  notifications: any[];
}

// Preseeded data mimicking db.json
const DEFAULT_LOCAL_DB: LocalDb = {
  users: [
    {
      id: "u1",
      username: "vratika",
      role: "citizen",
      createdAt: "2026-06-30T13:26:07.528Z"
    },
    {
      id: "u2",
      username: "admin",
      role: "admin",
      createdAt: "2026-06-30T13:26:07.528Z"
    },
    {
      id: "u_oq4bqfhfp",
      username: "vratika07",
      role: "citizen",
      createdAt: "2026-06-30T15:05:35.294Z"
    }
  ],
  complaints: [
    {
      id: "CHA000109",
      citizenId: "u_oq4bqfhfp",
      citizenName: "vratika07",
      issueTitle: "Severe Road Deterioration and Multiple Large Potholes",
      description: "The image shows a severely damaged, unpaved or deteriorated road surface containing multiple large, deep potholes filled with water. This severe erosion poses a major hazard to vehicles, potentially causing structural damage or accidents, and compromises pedestrian safety due to uneven terrain and hidden depths under the water.",
      category: "Road Damage",
      severity: "High",
      confidence: 0.95,
      department: "Public Works Department",
      locationType: "gps",
      address: "GPS Lat: 26.8430, Lng: 75.7728",
      latitude: 26.8430,
      longitude: 75.7728,
      status: "Pending",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
      createdAt: "2026-06-30T13:42:03.666Z",
      updatedAt: "2026-06-30T13:42:03.666Z",
      timeline: [
        {
          status: "Pending",
          updatedAt: "2026-06-30T13:42:03.666Z",
          comment: "Complaint filed successfully. Automatically assigned to Public Works Department."
        }
      ]
    },
    {
      id: "CHA000101",
      citizenId: "u1",
      citizenName: "vratika",
      issueTitle: "Huge pothole on Main St.",
      description: "There is a massive pothole in the middle of Main Street near the crossroads. Multiple cars have already damaged their tires. Needs urgent re-tarring.",
      category: "Road Damage",
      severity: "High",
      confidence: 0.95,
      department: "Public Works Department",
      locationType: "gps",
      address: "102 Main Street, Downtown",
      latitude: 37.7749,
      longitude: -122.4194,
      status: "In Progress",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
      createdAt: "2026-06-26T13:26:07.528Z",
      updatedAt: "2026-06-28T13:26:07.528Z",
      timeline: [
        {
          status: "Pending",
          updatedAt: "2026-06-26T13:26:07.528Z",
          comment: "Issue reported by citizen vratika."
        },
        {
          status: "In Progress",
          updatedAt: "2026-06-28T13:26:07.528Z",
          comment: "Public Works Department has dispatched a repair crew."
        }
      ]
    },
    {
      id: "CHA000102",
      citizenId: "u3",
      citizenName: "Rajesh Kumar",
      issueTitle: "Water leakage from main pipeline",
      description: "Clean water has been gushing out of the main joint pipeline for the last 2 days. The street is completely flooded.",
      category: "Water Leakage",
      severity: "Critical",
      confidence: 0.98,
      department: "Water Department",
      locationType: "manual",
      address: "42 Park Lane, North Sector",
      latitude: 37.7833,
      longitude: -122.4167,
      status: "Pending",
      imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e5740a95?auto=format&fit=crop&q=80&w=600",
      createdAt: "2026-06-29T13:26:07.528Z",
      updatedAt: "2026-06-29T13:26:07.528Z",
      timeline: [
        {
          status: "Pending",
          updatedAt: "2026-06-29T13:26:07.528Z",
          comment: "Issue reported. Auto-routed to Water Department."
        }
      ]
    },
    {
      id: "CHA000103",
      citizenId: "u4",
      citizenName: "David Smith",
      issueTitle: "Overflowing garbage dump",
      description: "The municipal bin at this corner has not been cleared for over a week. Stray dogs are scattering trash everywhere. Foul smell.",
      category: "Garbage",
      severity: "Medium",
      confidence: 0.92,
      department: "Municipal Corporation",
      locationType: "gps",
      address: "58 Pine Avenue, Westside",
      latitude: 37.7699,
      longitude: -122.4468,
      status: "Resolved",
      imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600",
      createdAt: "2026-06-24T13:26:07.528Z",
      updatedAt: "2026-06-29T13:26:07.528Z",
      timeline: [
        {
          status: "Pending",
          updatedAt: "2026-06-24T13:26:07.528Z",
          comment: "Complaint received."
        },
        {
          status: "In Progress",
          updatedAt: "2026-06-26T13:26:07.528Z",
          comment: "Assigned to garbage clearance team."
        },
        {
          status: "Resolved",
          updatedAt: "2026-06-29T13:26:07.528Z",
          comment: "Garbage bin cleared and area cleaned."
        }
      ]
    },
    {
      id: "CHA000104",
      citizenId: "u5",
      citizenName: "Sophia Martinez",
      issueTitle: "Broken streetlights plunge block into darkness",
      description: "All streetlights from block 4B are non-functional. It creates a major safety issue for pedestrians and children playing in the evening.",
      category: "Streetlight",
      severity: "High",
      confidence: 0.91,
      department: "Electricity Department",
      locationType: "gps",
      address: "Block 4B, Hillcrest Apartments Road",
      latitude: 37.7599,
      longitude: -122.4368,
      status: "In Progress",
      imageUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=600",
      createdAt: "2026-06-27T13:26:07.528Z",
      updatedAt: "2026-06-29T13:26:07.528Z",
      timeline: [
        {
          status: "Pending",
          updatedAt: "2026-06-27T13:26:07.528Z",
          comment: "Issue submitted. Routed to Electricity Department."
        },
        {
          status: "In Progress",
          updatedAt: "2026-06-29T13:26:07.528Z",
          comment: "Technicians scheduled to inspect transformers and bulbs."
        }
      ]
    }
  ],
  notifications: [
    {
      id: "n1",
      userId: "u1",
      title: "Complaint Status Updated",
      message: "Your complaint CHA000101 has been marked In Progress by the Public Works Department.",
      type: "success",
      read: false,
      createdAt: "2026-06-30T13:26:07.528Z"
    }
  ]
};

// Lazy initialization of local state
function getLocalDb(): LocalDb {
  const data = localStorage.getItem(LOCAL_DB_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(DEFAULT_LOCAL_DB));
    return DEFAULT_LOCAL_DB;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(DEFAULT_LOCAL_DB));
    return DEFAULT_LOCAL_DB;
  }
}

function saveLocalDb(db: LocalDb) {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
}

// Determines if we should use fallback
async function executeApiRequest<T>(
  apiCall: () => Promise<Response>,
  fallbackCall: () => T
): Promise<T> {
  try {
    const res = await apiCall();
    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      return await res.json() as T;
    }
    // If not ok or not JSON, fallback
    console.warn("API returned invalid/non-JSON response. Falling back to local state storage.");
    return fallbackCall();
  } catch (error) {
    console.warn("API request failed or host offline. Falling back to local state storage.", error);
    return fallbackCall();
  }
}

// --- USER AUTHENTICATION APIs ---

export async function apiSignup(username: string, password: string, role: string): Promise<{ message: string; user: User }> {
  return executeApiRequest(
    () => fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    }),
    () => {
      const db = getLocalDb();
      const lowerUsername = username.toLowerCase().trim();
      const existing = db.users.find(u => u && u.username && u.username.toLowerCase() === lowerUsername);
      if (existing) {
        throw new Error("Username already exists. Please choose another.");
      }

      const newUser: User = {
        id: "u_" + Math.random().toString(36).substring(2, 11),
        username: username.trim(),
        role: role as "citizen" | "admin",
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      saveLocalDb(db);

      return {
        message: "Signup successful",
        user: newUser
      };
    }
  );
}

export async function apiLogin(username: string, password: string): Promise<{ message: string; user: User }> {
  return executeApiRequest(
    () => fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }),
    () => {
      const db = getLocalDb();
      const lowerUsername = username.toLowerCase().trim();
      const user = db.users.find(u => u && u.username && u.username.toLowerCase() === lowerUsername);
      if (!user) {
        throw new Error("User not found. Please register an account first.");
      }

      return {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt || new Date().toISOString()
        }
      };
    }
  );
}

// --- COMPLAINTS LIST APIs ---

export async function apiGetComplaints(): Promise<Complaint[]> {
  return executeApiRequest(
    () => fetch("/api/complaints"),
    () => {
      const db = getLocalDb();
      return db.complaints;
    }
  );
}

export async function apiReportComplaint(complaintData: {
  citizenId: string;
  citizenName: string;
  issueTitle: string;
  description: string;
  category: string;
  severity: string;
  address: string;
  latitude: number;
  longitude: number;
  locationType: string;
  base64Image?: string;
}): Promise<{ message: string; complaint: Complaint }> {
  return executeApiRequest(
    () => fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaintData)
    }),
    () => {
      const db = getLocalDb();
      const prefixMap: Record<string, string> = {
        "Road Damage": "Road Damage",
        "Garbage": "Municipal Corporation",
        "Water Leakage": "Water Department",
        "Streetlight": "Electricity Department",
        "Other": "Municipal Corporation"
      };
      
      const department = prefixMap[complaintData.category] || "Municipal Corporation";
      const complaintId = "CHA" + Math.floor(100000 + Math.random() * 900000);

      const newComplaint: Complaint = {
        id: complaintId,
        citizenId: complaintData.citizenId,
        citizenName: complaintData.citizenName,
        issueTitle: complaintData.issueTitle,
        description: complaintData.description,
        category: complaintData.category,
        severity: complaintData.severity as SeverityLevel,
        confidence: 0.95,
        department,
        locationType: complaintData.locationType as "gps" | "manual",
        address: complaintData.address,
        latitude: complaintData.latitude,
        longitude: complaintData.longitude,
        status: "Pending",
        imageUrl: complaintData.base64Image || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: "Pending",
            updatedAt: new Date().toISOString(),
            comment: `Complaint filed successfully. Automatically routed to ${department}.`
          }
        ]
      };

      db.complaints.unshift(newComplaint);
      saveLocalDb(db);

      return {
        message: "Complaint reported successfully",
        complaint: newComplaint
      };
    }
  );
}

// --- IMAGE ANALYSIS APIs ---

export async function apiAnalyzeImage(base64Image: string): Promise<{
  category: string;
  confidence: number;
  severity: string;
  department: string;
  suggestedTitle: string;
  suggestedDescription: string;
}> {
  return executeApiRequest(
    () => fetch("/api/complaints/analyze-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image })
    }),
    () => {
      // High-quality Client-side AI Simulation mapping categories
      const categories = ["Road Damage", "Water Leakage", "Garbage", "Streetlight"];
      const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const details: Record<string, any> = {
        "Road Damage": {
          confidence: 0.94,
          severity: "High",
          department: "Public Works Department",
          suggestedTitle: "Severe Road Damage and Multiple Potholes detected",
          suggestedDescription: "The uploaded visual file depicts severe damage and multiple deep potholes on the road surface. This presents immediate risk to vehicle tires, suspensions, and poses serious accident hazards for incoming traffic."
        },
        "Water Leakage": {
          confidence: 0.96,
          severity: "Critical",
          department: "Water Department",
          suggestedTitle: "Major Pipeline Leakage & Street Flooding",
          suggestedDescription: "Water is detected forcefully gushing out onto public roads, indicating a damaged main pipeline. Heavy flooding on the sidewalks poses severe water logging and contamination issues."
        },
        "Garbage": {
          confidence: 0.91,
          severity: "Medium",
          department: "Municipal Corporation",
          suggestedTitle: "Accumulated Solid Waste and Overflowing Bin",
          suggestedDescription: "An overflowing municipal trash container with uncollected garbage scattered in the surrounding area. Emits bad odors and creates health/sanitation hazards."
        },
        "Streetlight": {
          confidence: 0.93,
          severity: "High",
          department: "Electricity Department",
          suggestedTitle: "Non-functional Public Streetlights",
          suggestedDescription: "Multiple street lights on this block are non-operational, leaving major parts of the street in pitch-black darkness during evening hours, which significantly elevates safety hazards."
        }
      };

      return {
        category: selectedCategory,
        ...details[selectedCategory]
      };
    }
  );
}

// --- OFFICIAL LETTER GENERATION APIs ---

export async function apiGenerateLetter(id: string): Promise<{ message: string; letter: string }> {
  return executeApiRequest(
    () => fetch(`/api/complaints/${id}/letter`, { method: "POST" }),
    () => {
      const db = getLocalDb();
      const complaint = db.complaints.find(c => c.id === id);
      if (!complaint) {
        throw new Error("Complaint not found.");
      }

      const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const letter = `**Date:** ${dateStr}\n\n**To,**\n\n**The Department Chief,**  \n${complaint.department} Office,  \nCivic Administration Building.\n\n---\n\n**Subject:** Urgent Complaint Resolution Call regarding: ${complaint.issueTitle} (Complaint ID: ${complaint.id})\n\n**Respected Sir/Madam,**\n\nI am writing to formally log a public appeal concerning the resolved or pending civic dispatch at **Location: ${complaint.address}**.\n\nThis incident has been categorized under **${complaint.category}** with a **${complaint.severity}** severity level. Specifically, the issue is described as: "${complaint.description}".\n\nDue to the severity of this issue, the local residents demand immediate oversight, on-ground inspections, and complete technical repair operations to prevent any further risk to public welfare and security.\n\nThank you for your prompt response and dedicated service.\n\nSincerely,\n\n**Community Representative**  \nCommunityHero AI Portal Automated Grievance Dispatch`;

      complaint.letterGenerated = letter;
      saveLocalDb(db);

      return {
        message: "Official grievance dispatch letter prepared.",
        letter
      };
    }
  );
}

// --- ADMIN / WORKFLOW ACTIONS ---

export async function apiUpdateStatus(id: string, status: ComplaintStatus, comment: string): Promise<{ message: string; complaint: Complaint }> {
  return executeApiRequest(
    () => fetch(`/api/complaints/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, comment })
    }),
    () => {
      const db = getLocalDb();
      const complaint = db.complaints.find(c => c.id === id);
      if (!complaint) {
        throw new Error("Complaint not found.");
      }

      complaint.status = status;
      complaint.updatedAt = new Date().toISOString();
      if (!complaint.timeline) {
        complaint.timeline = [];
      }
      complaint.timeline.unshift({
        status,
        updatedAt: new Date().toISOString(),
        comment: comment || `Status updated to ${status}`
      });

      // Also dispatch a notification to the user
      const newNotif = {
        id: "n_" + Math.random().toString(36).substring(2, 9),
        userId: complaint.citizenId,
        title: "Complaint Status Updated",
        message: `Your complaint ${complaint.id} status was set to "${status}" by the Admin.`,
        type: status === "Resolved" ? "success" : "info",
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(newNotif);

      saveLocalDb(db);
      return {
        message: "Status updated successfully",
        complaint
      };
    }
  );
}

export async function apiDeleteComplaint(id: string): Promise<{ message: string }> {
  return executeApiRequest(
    () => fetch(`/api/complaints/${id}`, { method: "DELETE" }),
    () => {
      const db = getLocalDb();
      const initialLength = db.complaints.length;
      db.complaints = db.complaints.filter(c => c.id !== id);
      if (db.complaints.length === initialLength) {
        throw new Error("Complaint not found.");
      }
      saveLocalDb(db);
      return { message: "Complaint removed from administration index" };
    }
  );
}

// --- NOTIFICATION APIs ---

export async function apiGetNotifications(userId: string): Promise<any[]> {
  return executeApiRequest(
    () => fetch(`/api/notifications/${userId}`),
    () => {
      const db = getLocalDb();
      return db.notifications.filter(n => n.userId === userId);
    }
  );
}

export async function apiMarkNotificationRead(id: string): Promise<{ success: boolean }> {
  return executeApiRequest(
    () => fetch(`/api/notifications/${id}/read`, { method: "POST" }),
    () => {
      const db = getLocalDb();
      const notification = db.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
        saveLocalDb(db);
      }
      return { success: true };
    }
  );
}

// --- CHATBOT/AI ASSISTANT APIs ---

export async function apiChat(message: string, history: { role: string; content: string }[]): Promise<{ reply: string }> {
  return executeApiRequest(
    () => fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    }),
    () => {
      // Smart offline rule chatbot mimicking response
      const lower = message.toLowerCase();
      let reply = "Hello! I am your AI Civic Assistant. How can I help you resolve community or municipal issues today?";

      if (lower.includes("pothole") || lower.includes("road")) {
        reply = "Road deterioration and pothole issues should be filed under 'Road Damage'. Once reported, our system uses AI to route it straight to the Public Works Department. You can also view unresolved potholes directly on our Interactive Live Map.";
      } else if (lower.includes("leak") || lower.includes("water")) {
        reply = "Water leaks and joints damage are routed directly to the Water Department to stop clean water wastage. Please report it under 'Water Leakage' and specify coordinates using your GPS or interactive address finder.";
      } else if (lower.includes("garbage") || lower.includes("trash") || lower.includes("dump")) {
        reply = "Overflowing waste or illegal dumping should be filed under 'Garbage'. The Municipal Corporation sweeps these spots and updates resolution status once cleared.";
      } else if (lower.includes("streetlight") || lower.includes("dark") || lower.includes("electricity")) {
        reply = "Streetlight hazards are automatically assigned to the Electricity Department. Dark blocks present significant safety issues. Please lodge an operation dispatch immediately.";
      } else if (lower.includes("how to report") || lower.includes("file a complaint")) {
        reply = "To log a new complaint: 1. Click 'Report Issue' in the navbar. 2. Drag & drop or take a photo of the incident. 3. Our system will analyze the photo, suggest category, severity, and department. 4. Pin coordinates via GPS or address, then click 'Submit Complaint Dispatch'.";
      } else if (lower.includes("admin") || lower.includes("resolve")) {
        reply = "Administrators can log in to view all complaints, assign crews, update statuses (In Progress, Resolved, Pending), log notes, and export official administrative correspondence.";
      }

      return { reply };
    }
  );
}
