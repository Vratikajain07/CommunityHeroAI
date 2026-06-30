import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with large limit for base64 images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database directory & path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

// Ensure data directory and database file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to load database
function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    // Seed with realistic demo data
    const initialDb = {
      users: [
        { id: "u1", username: "vratika", role: "citizen", createdAt: new Date().toISOString() },
        { id: "u2", username: "admin", role: "admin", createdAt: new Date().toISOString() }
      ],
      complaints: [
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
          createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          timeline: [
            { status: "Pending", updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), comment: "Issue reported by citizen vratika." },
            { status: "In Progress", updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), comment: "Public Works Department has dispatched a repair crew." }
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
          createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          timeline: [
            { status: "Pending", updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), comment: "Issue reported. Auto-routed to Water Department." }
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
          createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          timeline: [
            { status: "Pending", updatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), comment: "Complaint received." },
            { status: "In Progress", updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), comment: "Assigned to garbage clearance team." },
            { status: "Resolved", updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), comment: "Garbage bin cleared and area cleaned." }
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
          createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          timeline: [
            { status: "Pending", updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), comment: "Issue submitted. Routed to Electricity Department." },
            { status: "In Progress", updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), comment: "Technicians scheduled to inspect transformers and bulbs." }
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
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, returning fresh schema", err);
    return { users: [], complaints: [], notifications: [] };
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file", err);
  }
}

// Initialize Gemini SDK lazily
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined!");
    }
    geminiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Authentication APIs
app.post("/api/auth/signup", (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields (username, password, role)" });
    }

    const db = loadDb();
    if (!db || !Array.isArray(db.users)) {
      return res.status(500).json({ error: "Database state invalid or users collection missing." });
    }

    const existing = db.users.find((u: any) => u && u.username && u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Username already exists. Please choose another." });
    }

    // Create new user
    const newUser = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      role: role,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb(db);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error("Signup error details:", error);
    res.status(500).json({ error: "Internal server error during registration", details: error.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const db = loadDb();
    if (!db || !Array.isArray(db.users)) {
      return res.status(500).json({ error: "Database state invalid or users collection missing." });
    }

    // Validate username (case-insensitive)
    const user = db.users.find((u: any) => u && u.username && u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ error: "User not found. Please register an account first." });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error("Login error details:", error);
    res.status(500).json({ error: "Internal server error during authorization", details: error.message });
  }
});

// GET Complaints
app.get("/api/complaints", (req, res) => {
  const { citizenId } = req.query;
  const db = loadDb();

  let list = db.complaints;
  if (citizenId) {
    list = list.filter((c: any) => c.citizenId === citizenId);
  }

  res.json(list);
});

// GET Single Complaint
app.get("/api/complaints/:id", (req, res) => {
  const db = loadDb();
  const complaint = db.complaints.find((c: any) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }
  res.json(complaint);
});

// DELETE Complaint (Admin only)
app.delete("/api/complaints/:id", (req, res) => {
  const db = loadDb();
  const index = db.complaints.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Complaint not found" });
  }
  db.complaints.splice(index, 1);
  saveDb(db);
  res.json({ message: "Complaint successfully deleted" });
});

// UPDATE Complaint Status (Admin only)
app.post("/api/complaints/:id/status", (req, res) => {
  const { status, comment } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const db = loadDb();
  const complaint = db.complaints.find((c: any) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }

  const oldStatus = complaint.status;
  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({
    status: status,
    updatedAt: new Date().toISOString(),
    comment: comment || `Status updated from ${oldStatus} to ${status}.`
  });

  // Create notification for the reporter
  const newNotif = {
    id: "n_" + Math.random().toString(36).substr(2, 9),
    userId: complaint.citizenId,
    title: `Complaint Status Updated`,
    message: `Your complaint ${complaint.id} ("${complaint.issueTitle}") has been marked as ${status}.`,
    type: status === "Resolved" ? "success" : "info",
    read: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.push(newNotif);

  saveDb(db);
  res.json({ message: "Status updated successfully", complaint });
});

// POST Analyze Image
app.post("/api/complaints/analyze-image", async (req, res) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 is required" });
  }

  try {
    const ai = getGeminiClient();
    
    // Format image part for Gemini API
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const cleanMimeType = mimeType || "image/jpeg";

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: cleanMimeType
      }
    };

    const systemInstruction = `
      You are an expert AI civic analyst for "Community Hero AI". 
      Analyze the provided image representing a civic issue (such as potholes, water leakage, garbage accumulation, damaged streetlights, broken roads, drainage problems, or public infrastructure damage).
      You must categorize the issue, estimate the severity, routing department, and write a concise title and description of what you observe.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        {
          text: "Analyze this civic issue photo. Categorize, estimate severity, routing, title, and description. Return purely as valid JSON conforming to the requested schema."
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issueTitle: { type: Type.STRING, description: "A highly concise title summarizing the exact issue." },
            description: { type: Type.STRING, description: "Professional visual analysis detailing what is broken, its impact on the community, and why it requires attention." },
            category: { type: Type.STRING, description: "Civic category. Must be one of: Road Damage, Water Leakage, Garbage, Streetlight, Drainage, Infrastructure Damage." },
            severity: { type: Type.STRING, description: "Estimated severity of the issue based on hazard/impact. Must be one of: Low, Medium, High, Critical." },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0 based on image clarity and recognition." },
            department: { type: Type.STRING, description: "Routing department. Must be one of: Public Works Department, Municipal Corporation, Electricity Department, Water Department, Sanitation Department." }
          },
          required: ["issueTitle", "description", "category", "severity", "confidence", "department"]
        }
      }
    });

    const resultText = response.text || "{}";
    const analysis = JSON.parse(resultText);

    res.json(analysis);
  } catch (error: any) {
    console.error("Gemini Image Analysis failed:", error);
    res.status(500).json({ 
      error: "AI analysis failed. Please specify details manually.", 
      details: error.message 
    });
  }
});

// POST Create Complaint
app.post("/api/complaints", (req, res) => {
  const {
    citizenId,
    citizenName,
    issueTitle,
    description,
    category,
    severity,
    confidence,
    department,
    locationType,
    address,
    latitude,
    longitude,
    imageUrl
  } = req.body;

  if (!citizenId || !issueTitle || !category || !severity || !department) {
    return res.status(400).json({ error: "Missing required complaint fields" });
  }

  const db = loadDb();

  // Create unique ID like CHA000123
  const count = db.complaints.length + 105; // start from some arbitrary number
  const formattedId = `CHA${String(count).padStart(6, "0")}`;

  const newComplaint = {
    id: formattedId,
    citizenId,
    citizenName: citizenName || "Citizen",
    issueTitle,
    description: description || "No additional description provided.",
    category,
    severity,
    confidence: confidence || 1.0,
    department,
    locationType: locationType || "manual",
    address: address || "Unknown Location",
    latitude: Number(latitude) || 37.7749,
    longitude: Number(longitude) || -122.4194,
    status: "Pending",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1599740831146-80a6b7db00b2?auto=format&fit=crop&q=80&w=600",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: "Pending",
        updatedAt: new Date().toISOString(),
        comment: `Complaint filed successfully. Automatically assigned to ${department}.`
      }
    ]
  };

  db.complaints.unshift(newComplaint); // Add to the top of the list

  // Add system notification for admins
  db.notifications.push({
    id: "n_" + Math.random().toString(36).substr(2, 9),
    userId: "u2", // admin
    title: "New Civic Issue Reported",
    message: `${newComplaint.id}: "${issueTitle}" reported under ${category} with ${severity} severity.`,
    type: "warning",
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.status(201).json(newComplaint);
});

// POST Generate AI Complaint Letter
app.post("/api/complaints/:id/letter", async (req, res) => {
  const db = loadDb();
  const complaint = db.complaints.find((c: any) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = `
      You are an expert formal communications bot. Generate a highly professional, polite, and urgent civic complaint letter addressed to the Municipal Commissioner and the head of the "${complaint.department}". 
      Use official tone, realistic formatting (To, Subject, Salutation, Body paragraphs, Conclusion, and Sign-off). 
      Reference the unique Complaint ID: ${complaint.id}, the Category: ${complaint.category}, the reported Location: "${complaint.address}", the severity of "${complaint.severity}", and the date reported: ${new Date(complaint.createdAt).toLocaleDateString()}.
      Do not include any placeholders. Ensure it is complete and ready to sign.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft a formal letter regarding: "${complaint.issueTitle}". Details: ${complaint.description}.`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const letter = response.text || "Failed to generate letter content.";
    
    // Save generated letter in the db
    complaint.letterGenerated = letter;
    saveDb(db);

    res.json({ letter });
  } catch (err: any) {
    console.error("Gemini letter generation failed:", err);
    res.status(500).json({ error: "Failed to generate AI formal letter.", details: err.message });
  }
});

// POST Chatbot
app.post("/api/chatbot", async (req, res) => {
  const { messages, userRole, username } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages list is required" });
  }

  try {
    const ai = getGeminiClient();
    const db = loadDb();

    // Compile dynamic context regarding current issues in the database so the chatbot can act truly smart!
    const summaryList = db.complaints.map((c: any) => 
      `- ID: ${c.id}, Title: "${c.issueTitle}", Status: ${c.status}, Department: ${c.department}, Severity: ${c.severity}, Location: "${c.address}"`
    ).join("\n");

    const systemInstruction = `
      You are "HeroBot", the highly intelligent hyperlocal AI assistant for the "Community Hero AI" platform. 
      Your purpose is to answer citizens' and admins' questions about:
      1. Reporting issues (how it works, image analysis, department routing).
      2. Tracking complaint statuses.
      3. Providing helpful details of the platform's features (GPS detection, formal complaint letters, visual maps).
      4. General civic duty, safety, and community action guidelines.

      Here is the real-time status of civic complaints reported in our local community database. You can refer to this list directly if a user asks about a complaint or asks for a summary of issues:
      ${summaryList || "No complaints reported yet."}

      User Info:
      Name: ${username || "Guest"}
      Role: ${userRole || "citizen"}

      Always remain polite, supportive, encouraging, and informative. Use markdown headings and lists for clear structuring.
    `;

    // Package previous messages for Gemini
    // Limit to last 10 messages to avoid token bloat
    const history = messages.slice(-10).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // The user's latest message is the last one in the history
    const latestPart = history.pop();
    const contents = history.length > 0 
      ? [...history.map((h: any) => ({ role: h.role, parts: h.parts })), { role: "user", parts: latestPart.parts }]
      : [{ role: "user", parts: latestPart.parts }];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chatbot failure:", error);
    res.status(500).json({ 
      text: "I apologize, but I am currently experiencing connection difficulties. How else can I assist you with reporting civic issues manually?",
      error: error.message 
    });
  }
});

// GET Notifications for user
app.get("/api/notifications/:userId", (req, res) => {
  const db = loadDb();
  const list = db.notifications.filter((n: any) => n.userId === req.params.userId);
  res.json(list);
});

// POST Mark notification as read
app.post("/api/notifications/:id/read", (req, res) => {
  const db = loadDb();
  const notif = db.notifications.find((n: any) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDb(db);
  }
  res.json({ success: true });
});

// Vite Middleware for development / Static file serving for production
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));

  if (!isProduction) {
    console.log("[Community Hero AI] Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Community Hero AI] Starting in PRODUCTION mode serving from dist...");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Community Hero AI] Server running on http://0.0.0.0:${PORT} (isProduction=${isProduction})`);
  });
}

startServer();
