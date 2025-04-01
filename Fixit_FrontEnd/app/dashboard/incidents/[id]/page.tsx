"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Trash2,
  User,
  XCircle,
  Calendar,
  MessageSquare,
  Tag,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCurrentUser, getUsers } from "@/app/lib/auth"
import {
  getIncidentById,
  updateIncident,
  deleteIncident,
  type Incident,
  addCommentToIncident,
} from "@/app/lib/incidents"

export default function IncidentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const incidentId = params.id as string

  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [technicians, setTechnicians] = useState<any[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const currentUser = getCurrentUser()
  const isTechnician = currentUser?.role === "technician" || currentUser?.role === "admin"
  const isAdmin = currentUser?.role === "admin"
  const isOwner = incident?.createdBy.id === currentUser?.id
  const isAssignedTechnician = incident?.assignee?.id === currentUser?.id
  const canAssign = isAdmin || (isTechnician && !incident?.assignee)
  const canChangeStatus = isAdmin || isAssignedTechnician
  const canComment = isAssignedTechnician || isAdmin

  useEffect(() => {
    if (!incidentId) return

    try {
      const fetchedIncident = getIncidentById(incidentId)
      if (fetchedIncident) {
        setIncident(fetchedIncident)
      } else {
        setError("Chamado não encontrado")
      }

      // Load technicians
      const users = getUsers()
      const techUsers = users.filter((user) => user.role === "technician")
      setTechnicians(techUsers)
    } catch (err) {
      setError("Erro ao carregar o chamado")
    } finally {
      setLoading(false)
    }
  }, [incidentId])

  const handleStatusChange = (newStatus: "open" | "in_progress" | "resolved" | "closed") => {
    if (!incident || !canChangeStatus) return

    try {
      const updatedIncident = updateIncident(incident.id, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })

      if (updatedIncident) {
        setIncident(updatedIncident)
        setSuccessMessage(`Status atualizado para ${getStatusLabel(newStatus)}`)
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
      } else {
        throw new Error("Falha ao atualizar o status")
      }
    } catch (err) {
      setErrorMessage("Erro ao atualizar o status do chamado")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const handleDeleteIncident = () => {
    if (!incident) return

    try {
      const deleted = deleteIncident(incident.id)
      if (deleted) {
        router.push("/dashboard/incidents")
      } else {
        throw new Error("Falha ao excluir o chamado")
      }
    } catch (err) {
      setErrorMessage("Erro ao excluir o chamado")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto"
      case "in_progress":
        return "Em Progresso"
      case "resolved":
        return "Resolvido"
      case "closed":
        return "Fechado"
      default:
        return "Desconhecido"
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Carregando detalhes do chamado...</p>
        </div>
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="space-y-6">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/dashboard/incidents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Chamados
          </Link>
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || "Chamado não encontrado"}. Por favor, tente novamente ou volte para a lista de chamados.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleAssignTechnician = (techId: string) => {
    if (!incident) return

    try {
      const techUser = technicians.find((tech) => tech.id === techId)
      if (!techUser) {
        throw new Error("Técnico não encontrado")
      }

      const updatedIncident = updateIncident(incident.id, {
        assignee: {
          id: techUser.id,
          name: techUser.name,
          email: techUser.email,
          initials: getInitials(techUser.name),
        },
        updatedAt: new Date().toISOString(),
      })

      if (updatedIncident) {
        setIncident(updatedIncident)
        setSuccessMessage("Chamado atribuído com sucesso")
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
        setAssignDialogOpen(false)
      } else {
        throw new Error("Falha ao atribuir o chamado")
      }
    } catch (err) {
      setErrorMessage("Erro ao atribuir o chamado")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const handleSelfAssign = () => {
    if (!incident || !currentUser) return

    try {
      const updatedIncident = updateIncident(incident.id, {
        assignee: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          initials: getInitials(currentUser.name),
        },
        updatedAt: new Date().toISOString(),
      })

      if (updatedIncident) {
        setIncident(updatedIncident)
        setSuccessMessage("Chamado atribuído a você com sucesso")
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
      } else {
        throw new Error("Falha ao atribuir o chamado")
      }
    } catch (err) {
      setErrorMessage("Erro ao atribuir o chamado")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const handleAddComment = () => {
    if (!incident || !currentUser || !comment.trim()) return

    try {
      const updatedIncident = addCommentToIncident(incident.id, {
        text: comment,
        createdBy: {
          id: currentUser.id,
          name: currentUser.name,
        },
        createdAt: new Date().toISOString(),
      })

      if (updatedIncident) {
        setIncident(updatedIncident)
        setComment("")
        setSuccessMessage("Comentário adicionado com sucesso")
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
      } else {
        throw new Error("Falha ao adicionar comentário")
      }
    } catch (err) {
      setErrorMessage("Erro ao adicionar comentário")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/incidents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Chamados
          </Link>
        </Button>

        <div className="flex gap-2">
          {isOwner && (
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Chamado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar exclusão</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteIncident}>
                    Excluir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Success and Error Alerts */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Incident Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className={`rounded-full p-3 ${getStatusColor(incident.status)} md:mt-2`}>
          {getStatusIcon(incident.status)}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-navy-900">{incident.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="font-medium">{incident.id}</span>
                <span>•</span>
                <span>{incident.department.charAt(0).toUpperCase() + incident.department.slice(1)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {getStatusBadge(incident.status)}
              {getPriorityBadge(incident.priority)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{incident.description}</p>
            </CardContent>
          </Card>

          {/* Status Management (Only for assigned Technician or Admin) */}
          {canChangeStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Status</CardTitle>
                <CardDescription>Atualize o status deste chamado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Button
                      variant={incident.status === "open" ? "default" : "outline"}
                      className={incident.status === "open" ? "bg-red-500 hover:bg-red-600" : ""}
                      onClick={() => handleStatusChange("open")}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Aberto
                    </Button>
                    <Button
                      variant={incident.status === "in_progress" ? "default" : "outline"}
                      className={incident.status === "in_progress" ? "bg-amber-500 hover:bg-amber-600" : ""}
                      onClick={() => handleStatusChange("in_progress")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Em Progresso
                    </Button>
                    <Button
                      variant={incident.status === "resolved" ? "default" : "outline"}
                      className={incident.status === "resolved" ? "bg-green-500 hover:bg-green-600" : ""}
                      onClick={() => handleStatusChange("resolved")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Resolvido
                    </Button>
                    <Button
                      variant={incident.status === "closed" ? "default" : "outline"}
                      onClick={() => handleStatusChange("closed")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Fechado
                    </Button>
                  </div>

                  <div className="pt-4">
                    <Label htmlFor="comment">Adicionar Comentário</Label>
                    <Textarea
                      id="comment"
                      placeholder="Adicione informações sobre a atualização do status..."
                      className="mt-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      className="mt-2 bg-navy-600 hover:bg-navy-700 text-white"
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Adicionar Comentário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isTechnician && !canChangeStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-slate-500">
                  <p>Apenas o técnico atribuído pode alterar o status deste chamado.</p>
                  {!incident.assignee && <p className="mt-2">Este chamado ainda não possui um técnico atribuído.</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              {incident.comments && incident.comments.length > 0 ? (
                <div className="space-y-4">
                  {incident.comments.map((comment, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {comment.createdBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.createdBy.name}</div>
                          <div className="text-xs text-slate-500">{formatDate(comment.createdAt)}</div>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-2">Nenhum comentário ainda</p>
                  </div>
                </div>
              )}
            </CardContent>
            {canComment && (
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    className="mb-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    className="bg-navy-600 hover:bg-navy-700 text-white"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    Enviar Comentário
                  </Button>
                </div>
              </CardFooter>
            )}
            {!canComment && incident.assignee && (
              <CardFooter className="border-t pt-4">
                <div className="w-full text-center text-sm text-slate-500">
                  Apenas o técnico atribuído pode adicionar comentários
                </div>
              </CardFooter>
            )}
            {!canComment && !incident.assignee && (
              <CardFooter className="border-t pt-4">
                <div className="w-full text-center text-sm text-slate-500">
                  Um técnico precisa ser atribuído para adicionar comentários
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Criado por</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {incident.createdBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{incident.createdBy.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Atribuído a</div>
                {incident.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{incident.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span>{incident.assignee.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4" />
                    <span>Não atribuído</span>
                  </div>
                )}

                {/* Assignment options */}
                {canAssign && !incident.assignee && (
                  <div className="mt-2 flex flex-col gap-2">
                    {isAdmin ? (
                      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full bg-navy-600 hover:bg-navy-700 text-white">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Atribuir Técnico
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Atribuir Técnico</DialogTitle>
                            <DialogDescription>Selecione um técnico para atribuir a este chamado</DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um técnico" />
                              </SelectTrigger>
                              <SelectContent>
                                {technicians.map((tech) => (
                                  <SelectItem key={tech.id} value={tech.id}>
                                    {tech.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button
                              className="bg-navy-600 hover:bg-navy-700 text-white"
                              onClick={() => handleAssignTechnician(selectedTechnician)}
                              disabled={!selectedTechnician}
                            >
                              Atribuir
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                        onClick={handleSelfAssign}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Atribuir a mim
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Departamento</div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span>{incident.department.charAt(0).toUpperCase() + incident.department.slice(1)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Prioridade</div>
                <div>{getPriorityBadge(incident.priority)}</div>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Criado em</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{formatDate(incident.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">Última atualização</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>{formatDate(incident.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/incidents`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Chamados
                </Link>
              </Button>

              {isOwner && (
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Chamado
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

