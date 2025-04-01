import { getCurrentUser } from "./auth"

// Types for our incidents system
export interface Comment {
  text: string
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  department: string
  createdBy: {
    id: string
    name: string
    email: string
    department?: string
  }
  assignee?: {
    id: string
    name: string
    email: string
    initials: string
  }
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

// Key for localStorage
const INCIDENTS_STORAGE_KEY = "fixit_incidents"

// Get all incidents from localStorage
export function getIncidents(): Incident[] {
  if (typeof window === "undefined") return []

  const incidentsJson = localStorage.getItem(INCIDENTS_STORAGE_KEY)
  if (!incidentsJson) return []

  try {
    return JSON.parse(incidentsJson)
  } catch (error) {
    console.error("Failed to parse incidents from localStorage", error)
    return []
  }
}

// Save incidents to localStorage
export function saveIncidents(incidents: Incident[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents))
}

// Create a new incident
export function createIncident(incidentData: {
  title: string
  description: string
  department: string
  priority: "low" | "medium" | "high" | "critical"
}): Incident | null {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const incidents = getIncidents()

  const newIncident: Incident = {
    id: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
    title: incidentData.title,
    description: incidentData.description,
    status: "open",
    priority: incidentData.priority,
    department: incidentData.department,
    createdBy: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  incidents.push(newIncident)
  saveIncidents(incidents)

  return newIncident
}

// Update an incident
export function updateIncident(id: string, updates: Partial<Incident>): Incident | null {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const incidents = getIncidents()
  const index = incidents.findIndex((incident) => incident.id === id)

  if (index === -1) return null

  const incident = incidents[index]

  // Check permissions for status changes
  if (
    updates.status &&
    incident.status !== updates.status &&
    currentUser.role !== "admin" &&
    (!incident.assignee || incident.assignee.id !== currentUser.id)
  ) {
    return null // Only assigned technician or admin can change status
  }

  const updatedIncident = {
    ...incidents[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  incidents[index] = updatedIncident
  saveIncidents(incidents)

  return updatedIncident
}

// Get incident by ID
export function getIncidentById(id: string): Incident | null {
  const incidents = getIncidents()
  const incident = incidents.find((incident) => incident.id === id)
  return incident || null
}

// Delete an incident
export function deleteIncident(id: string): boolean {
  const currentUser = getCurrentUser()
  if (!currentUser) return false

  const incidents = getIncidents()
  const incident = incidents.find((inc) => inc.id === id)

  // Only allow deletion if user is the creator or an admin
  if (!incident) return false
  if (incident.createdBy.id !== currentUser.id && currentUser.role !== "admin") return false

  const updatedIncidents = incidents.filter((inc) => inc.id !== id)
  saveIncidents(updatedIncidents)

  return true
}

// Get user's initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// Add a comment to an incident
export function addCommentToIncident(id: string, comment: Comment): Incident | null {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const incidents = getIncidents()
  const index = incidents.findIndex((incident) => incident.id === id)

  if (index === -1) return null

  // Check if user is the assigned technician or admin
  const incident = incidents[index]
  const isAdmin = currentUser.role === "admin"
  const isAssignedTechnician = incident.assignee?.id === currentUser.id

  if (!isAdmin && !isAssignedTechnician) {
    return null
  }

  // Initialize comments array if it doesn't exist
  if (!incident.comments) {
    incident.comments = []
  }

  // Add the comment
  incident.comments.push(comment)

  // Update the incident
  const updatedIncident = {
    ...incident,
    updatedAt: new Date().toISOString(),
  }

  incidents[index] = updatedIncident
  saveIncidents(incidents)

  return updatedIncident
}

