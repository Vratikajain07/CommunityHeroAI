export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export interface Complaint {
  id: string; // e.g. CHA000123
  citizenId: string;
  citizenName: string;
  issueTitle: string;
  description: string;
  category: string;
  severity: SeverityLevel;
  confidence: number;
  department: string;
  locationType: "gps" | "manual";
  address: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  letterGenerated?: string;
  timeline: {
    status: ComplaintStatus;
    updatedAt: string;
    comment: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  complaints: Complaint[];
  notifications: Notification[];
}
