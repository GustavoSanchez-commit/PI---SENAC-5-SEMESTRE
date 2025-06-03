// Types for our incidents system
export interface Comment {
  id: number;
  mensagem: string;
  dataComentario: string;
  autor: {
    id: number;
    name: string;
    email: string;
    department?: string;
    telephone?: string;
    role: string;
  };
}

export interface Incident {
  id: string;
  titulo: string;
  descricao: string;
  codigo: string;
  status: string;
  prioridade: string;
  dataCriacao: string;
  dataAtualizacao: string;
  dataFechamento: string;
  comentarios: Comment[];
  usuario?: {
    id: number;
    name: string;
    department?: string;
  };
  tecnico?: {
    id: number;
    name: string;
  };
}

// Map priority to backend format
export function mapPriorityToBackend(priority: string): string {
  switch (priority) {
    case "low":
      return "BAIXA"
    case "medium":
      return "MEDIA"
    case "high":
      return "ALTA"
    case "critical":
      return "CRITICA"
    default:
      return "BAIXA" 
  }
}

// Get all incidents
export async function getAllIncidents(): Promise<Incident[]> {
  const response = await fetch("http://localhost:8080/chamados", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar os chamados");
  }

  return await response.json();
}

// Get incident by ID
export async function getIncidentById(id: string | number) {
  const response = await fetch(`http://localhost:8080/chamados/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch incident")
  }

  return response.json()
}

// Create a new incident
export async function createIncident(data: {
  title: string;
  description: string;
  department: string;
  priority: "low" | "medium" | "high" | "critical";
  userId: number;
}) {
  const response = await fetch("http://localhost:8080/chamados", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: data.title,
      descricao: data.description,
      departamento: data.department,
      prioridade: mapPriorityToBackend(data.priority),
      usuario: { id: data.userId },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create incident");
  }

  return await response.json();
}

// Update an incident
export async function updateIncident(id: string, updates: Partial<Incident>) {
  const response = await fetch(`http://localhost:8080/chamados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...updates,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update the incident")
  }

  return response.json()
}

// Delete an incident
export async function deleteIncident(id: string) {
  const response = await fetch(`http://localhost:8080/chamados/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete the incident")
  }

  return true
}

// Search incidents
export async function searchIncidents(query: string) {
  const response = await fetch(`http://localhost:8080/chamados/buscar?q=${encodeURIComponent(query)}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to search incidents")
  }

  return response.json()
}

// Filter incidents
export async function filterIncidents(filters: {
  status?: string
  priority?: "low" | "medium" | "high" | "critical"
  department?: string
}) {
  const queryParams = new URLSearchParams(
    Object.entries({
      status: filters.status,
      prioridade: filters.priority ? mapPriorityToBackend(filters.priority) : undefined,
      departamento: filters.department,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value
      return acc
    }, {} as Record<string, string>)
  ).toString()

  const response = await fetch(`http://localhost:8080/chamados/filtrar?${queryParams}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to filter incidents")
  }

  return response.json()
}

// Add a comment to an incident
export async function addCommentToIncident(
  incidentId: string | number,
  mensagem: string,
  autorId: number
) {
  const response = await fetch(`http://localhost:8080/chamados/${incidentId}/comentarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mensagem,
      autorId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao adicionar comentário");
  }

  // Assuming the backend returns the updated incident
  return await response.json();
}
