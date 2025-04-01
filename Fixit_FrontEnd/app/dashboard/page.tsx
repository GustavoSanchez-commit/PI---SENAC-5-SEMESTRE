"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  LifeBuoy,
  MoreHorizontal,
  XCircle,
  Plus,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser } from "@/app/lib/auth"
import { getIncidents, type Incident } from "@/app/lib/incidents"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const { toast } = useToast()
  const currentUser = getCurrentUser()
  const isRegularUser = !currentUser?.role || currentUser?.role === "user"

  useEffect(() => {
    // Load incidents from localStorage
    const loadedIncidents = getIncidents()
    setIncidents(loadedIncidents)

    // Check if this is the first login
    const isFirstLogin = !localStorage.getItem("hasLoggedIn")

    if (isFirstLogin && currentUser) {
      setShowWelcome(true)
      localStorage.setItem("hasLoggedIn", "true")

      // Show welcome toast
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ${currentUser.name}! Você está conectado ao sistema.`,
        duration: 5000,
      })
    }
  }, [toast])

  // Calculate stats based on real incidents
  const stats = [
    {
      title: "Total de Chamados",
      value: incidents.length.toString(),
      change: "+12%",
      status: "up",
    },
    {
      title: "Chamados Abertos",
      value: incidents.filter((inc) => inc.status === "open").length.toString(),
      change: incidents.filter((inc) => inc.status === "open").length > 0 ? "+5%" : "-5%",
      status: incidents.filter((inc) => inc.status === "open").length > 0 ? "up" : "down",
    },
    {
      title: "Tempo Médio de Resolução",
      value: "3.2h",
      change: "-10%",
      status: "down",
    },
    {
      title: "Satisfação do Cliente",
      value: "94%",
      change: "+2%",
      status: "up",
    },
  ]

  // Sort incidents by creation date (newest first)
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Get the 5 most recent incidents
  const recentIncidents = sortedIncidents.slice(0, 5)

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

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="font-medium">Login realizado com sucesso!</p>
            <p className="text-sm">Bem-vindo(a) {currentUser?.name}! Você está conectado ao sistema.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Dashboard</h1>
          <p className="text-slate-500">
            Bem-vindo de volta, {currentUser?.name?.split(" ")[0] || "Usuário"}! Aqui está um resumo do seu sistema de
            suporte.
          </p>
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div
                className={`flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  stat.status === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {stat.status === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowUpRight className="mr-1 h-3 w-3 rotate-180" />
                )}
                {stat.change}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Incidents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900">Chamados Recentes</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/incidents">
              Ver Todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="open">Abertos</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents.length > 0 ? (
                    recentIncidents.map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-0.5 rounded-full p-1.5 ${
                              incident.status === "open"
                                ? "bg-red-100 text-red-500"
                                : incident.status === "in_progress"
                                  ? "bg-amber-100 text-amber-500"
                                  : incident.status === "resolved"
                                    ? "bg-green-100 text-green-500"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {incident.status === "open" ? (
                              <HelpCircle className="h-5 w-5" />
                            ) : incident.status === "in_progress" ? (
                              <Clock className="h-5 w-5" />
                            ) : incident.status === "resolved" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-navy-900">{incident.id}</span>
                              {getStatusBadge(incident.status)}
                              {getPriorityBadge(incident.priority)}
                            </div>
                            <p className="mt-1 text-sm text-slate-700">{incident.title}</p>
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
                              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Atribuir</DropdownMenuItem>
                              <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-slate-100 p-3">
                        <LifeBuoy className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-navy-900">Nenhum chamado encontrado</h3>
                      <p className="mt-1 text-sm text-slate-500">Comece criando seu primeiro chamado.</p>
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
          </TabsContent>
          <TabsContent value="open" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents
                    .filter((incident) => incident.status === "open")
                    .map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 rounded-full bg-red-100 p-1.5 text-red-500">
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-navy-900">{incident.id}</span>
                              {getStatusBadge(incident.status)}
                              {getPriorityBadge(incident.priority)}
                            </div>
                            <p className="mt-1 text-sm text-slate-700">{incident.title}</p>
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
                              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Atribuir</DropdownMenuItem>
                              <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="in_progress" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents
                    .filter((incident) => incident.status === "in_progress")
                    .map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 rounded-full bg-amber-100 p-1.5 text-amber-500">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-navy-900">{incident.id}</span>
                              {getStatusBadge(incident.status)}
                              {getPriorityBadge(incident.priority)}
                            </div>
                            <p className="mt-1 text-sm text-slate-700">{incident.title}</p>
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
                              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Atribuir</DropdownMenuItem>
                              <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolved" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents
                    .filter((incident) => incident.status === "resolved")
                    .map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 rounded-full bg-green-100 p-1.5 text-green-500">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-navy-900">{incident.id}</span>
                              {getStatusBadge(incident.status)}
                              {getPriorityBadge(incident.priority)}
                            </div>
                            <p className="mt-1 text-sm text-slate-700">{incident.title}</p>
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
                              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Atribuir</DropdownMenuItem>
                              <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isRegularUser && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/incident-report">
                    <LifeBuoy className="mr-2 h-4 w-4 text-navy-600" />
                    Reportar Chamado
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/knowledge">
                  <BookOpen className="mr-2 h-4 w-4 text-navy-600" />
                  Base de Conhecimento
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Visão geral do status dos serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Servidor Principal</span>
                <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sistema ERP</span>
                <Badge className="bg-amber-500 hover:bg-amber-600">Degradado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Banco de Dados</span>
                <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full justify-center text-navy-600">
              Ver Status Detalhado
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artigos Populares</CardTitle>
            <CardDescription>Artigos mais acessados da base de conhecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="#" className="block">
                <div className="text-sm font-medium text-navy-700 hover:underline">Como redefinir sua senha</div>
                <div className="text-xs text-slate-500">Visualizado 1.2k vezes</div>
              </Link>
              <Link href="#" className="block">
                <div className="text-sm font-medium text-navy-700 hover:underline">
                  Solução para problemas de impressão
                </div>
                <div className="text-xs text-slate-500">Visualizado 856 vezes</div>
              </Link>
              <Link href="#" className="block">
                <div className="text-sm font-medium text-navy-700 hover:underline">
                  Configurando VPN para acesso remoto
                </div>
                <div className="text-xs text-slate-500">Visualizado 723 vezes</div>
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full justify-center text-navy-600" asChild>
              <Link href="/dashboard/knowledge">Ver Todos os Artigos</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      {isRegularUser && (
        <Button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white" asChild>
          <Link href="/incident-report">
            <Plus className="mr-2 h-4 w-4" />
            Novo Chamado
          </Link>
        </Button>
      )}
    </div>
  )
}

