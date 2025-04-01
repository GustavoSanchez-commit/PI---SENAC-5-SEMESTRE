"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  Clock,
  Filter,
  HelpCircle,
  LifeBuoy,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { getIncidents, type Incident, updateIncident } from "@/app/lib/incidents"
import { getCurrentUser } from "@/app/lib/auth"

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [incidents, setIncidents] = useState<Incident[]>([])
  const currentUser = getCurrentUser()
  const isRegularUser = !currentUser?.role || currentUser?.role === "user"

  useEffect(() => {
    // Load incidents from localStorage
    const loadedIncidents = getIncidents()
    setIncidents(loadedIncidents)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-500 hover:bg-red-600">Aberto</Badge>
      case "in_progress":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Em Progresso</Badge>
      case "resolved":
        return <Badge className="bg-green-500 hover:bg-green-600">Resolvido</Badge>
      case "closed":
        return <Badge variant="outline">Fechado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            {priority === "critical" ? "Crítica" : "Alta"}
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Média
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Baixa
          </Badge>
        )
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <HelpCircle className="h-5 w-5" />
      case "in_progress":
        return <Clock className="h-5 w-5" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5" />
      case "closed":
        return <XCircle className="h-5 w-5" />
      default:
        return <HelpCircle className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-500"
      case "in_progress":
        return "bg-amber-100 text-amber-500"
      case "resolved":
        return "bg-green-100 text-green-500"
      case "closed":
        return "bg-slate-100 text-slate-500"
      default:
        return "bg-slate-100 text-slate-500"
    }
  }

  // Format date to relative time (e.g., "Há 5 minutos")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Agora mesmo"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Há ${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Há ${days} ${days === 1 ? "dia" : "dias"}`
    }
  }

  // Handle status update
  const handleStatusUpdate = (incidentId: string, newStatus: "open" | "in_progress" | "resolved" | "closed") => {
    const updatedIncident = updateIncident(incidentId, { status: newStatus })
    if (updatedIncident) {
      // Refresh incidents list
      setIncidents(getIncidents())
    }
  }

  // Filter incidents based on search query and filters
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter
    const matchesDepartment =
      departmentFilter === "all" || incident.department.toLowerCase() === departmentFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
  })

  // Sort incidents by creation date (newest first)
  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Chamados</h1>
          <p className="text-slate-500">Gerencie e acompanhe todos os chamados reportados.</p>
        </div>
        {isRegularUser && (
          <div className="flex items-center gap-2">
            <Button className="bg-navy-600 hover:bg-navy-700 text-white" asChild>
              <Link href="/incident-report">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Novo Chamado
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Buscar chamados..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="ti">TI</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="rh">RH</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedIncidents.length > 0 ? (
              sortedIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 rounded-full p-1.5 ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/incidents/${incident.id}`}
                          className="font-medium text-navy-900 hover:underline"
                        >
                          {incident.id}
                        </Link>
                        {getStatusBadge(incident.status)}
                        {getPriorityBadge(incident.priority)}
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        <Link href={`/dashboard/incidents/${incident.id}`} className="hover:underline">
                          {incident.title}
                        </Link>
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{incident.department.charAt(0).toUpperCase() + incident.department.slice(1)}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(incident.createdAt)}</span>
                        <span>•</span>
                        <span>Criado por: {incident.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {incident.assignee ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {incident.assignee
                            ? incident.assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            : "NA"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>NA</AvatarFallback>
                      </Avatar>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/incidents/${incident.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-slate-100 p-3">
                  <Filter className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-navy-900">Nenhum chamado encontrado</h3>
                <p className="mt-1 text-sm text-slate-500">Tente ajustar seus filtros ou criar um novo chamado.</p>
                {isRegularUser && (
                  <Button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white" asChild>
                    <Link href="/incident-report">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Chamado
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

