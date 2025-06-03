"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Trash2,
  User,
  Calendar,
  MessageSquare,
  Tag,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/app/lib/auth";
import {
  getIncidentById,
  updateIncident,
  deleteIncident,
  type Incident,
  addCommentToIncident,
} from "@/app/lib/incidents";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusLabel } from "@/components/StatusLabel";
import StatusIcon from "@/components/StatusIcon";

export default function IncidentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmSolveOpen, setConfirmSolveOpen] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const currentUser = getCurrentUser();
  const isTechnician =
    currentUser?.role === "technician" || currentUser?.role === "admin";
  const isAdmin = currentUser?.role === "admin";
  const isOwner = incident?.usuario?.id === currentUser?.id;
  const isAssignedTechnician = incident?.tecnico?.id === currentUser?.id;
  const canAssign = isAdmin || (isTechnician && !incident?.tecnico);
  const canSolve = isAdmin || isAssignedTechnician;
  const canComment =
    isAssignedTechnician || isAdmin || (isOwner && incident?.tecnico);

  useEffect(() => {
    async function loadData() {
      if (!incidentId) return;

      try {
        // Load incident
        const fetchedIncident = await getIncidentById(incidentId);
        if (fetchedIncident) {
          setIncident(fetchedIncident);
        } else {
          setError("Chamado não encontrado");
        }

        // Load technicians with error handling
        try {
          // Get users from localStorage directly to avoid async issues
          const usersJson = localStorage.getItem("fixit_users");
          if (!usersJson) {
            console.log("No users found in localStorage");
            setTechnicians([]);
            return;
          }

          const users = JSON.parse(usersJson);
          if (!Array.isArray(users)) {
            console.error("Users is not an array:", users);
            setTechnicians([]);
            return;
          }

          const techUsers = users.filter((user) => user.role === "technician");
          console.log("Found technicians:", techUsers.length);
          setTechnicians(techUsers);
        } catch (err) {
          console.error("Erro ao carregar técnicos:", err);
          setTechnicians([]);
        }
      } catch (err) {
        setError("Erro ao carregar o chamado");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [incidentId]);

  const handleSolveIncident = async () => {
    if (!incident || !canSolve) return;

    try {
      const updatedIncident = await updateIncident(incident.id, {
        tecnico: incident.tecnico,
        status: "solucionado",
        // Ensure the property exists in the type or remove it
        ...(incident.dataAtualizacao !== undefined && {
          updatedAt: new Date().toISOString(),
        }),
      });

      if (updatedIncident) {
        setIncident(updatedIncident);
        setSuccessMessage("Chamado marcado como solucionado");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
        setConfirmSolveOpen(false);
      } else {
        throw new Error("Falha ao solucionar o chamado");
      }
    } catch (err) {
      setErrorMessage("Erro ao solucionar o chamado");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  const handleDeleteIncident = async () => {
    if (!incident) return;

    try {
      const deleted = await deleteIncident(incident.id);
      if (deleted) {
        router.push("/dashboard/incidents");
      } else {
        throw new Error("Falha ao excluir o chamado");
      }
    } catch (err) {
      setErrorMessage("Erro ao excluir o chamado");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">
            Carregando detalhes do chamado...
          </p>
        </div>
      </div>
    );
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
            {error || "Chamado não encontrado"}. Por favor, tente novamente ou
            volte para a lista de chamados.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Also fix the handleAssignTechnician function with similar improvements
  const handleAssignTechnician = async (techId: string) => {
    if (!incident) return;

    try {
      // Find the technician in the current technicians array
      const techUser = technicians.find((tech) => tech.id === techId);
      if (!techUser) {
        throw new Error("Técnico não encontrado");
      }

      // Get initials safely
      const initials = techUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

      console.log(
        "Assigning technician:",
        techUser.name,
        "with ID:",
        techUser.id
      );

      // Create the tecnico object
      const tecnico = {
        id: techUser.id,
        name: techUser.name,
        email: techUser.email,
        initials: initials,
      };

      // Log the update we're about to make
      console.log("Updating incident with:", {
        tecnico,
      });

      const updatedIncident = updateIncident(incident.id, {
        tecnico,
        status: "in_progress",
      });

      if (!updatedIncident) {
        throw new Error(
          "Falha ao atribuir o chamado - updateIncident returned null"
        );
      }

      setIncident(await updatedIncident);
      setSuccessMessage(
        "Chamado atribuído com sucesso e status alterado para Em Atendimento"
      );
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
      setAssignDialogOpen(false);
    } catch (err) {
      console.error("Error assigning technician:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao atribuir o chamado"
      );
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };
  const handleSelfAssign = async () => {
    if (!incident) return;

    try {
      const updatedIncident = await updateIncident(incident.id, {
        tecnico: {
          id: Number(currentUser?.id) ?? 0,
          name: currentUser?.name ?? "Unknown",
        },
        status: "em_andamento",
      });

      if (updatedIncident) {
        setIncident(updatedIncident);
        setSuccessMessage("Incident successfully assigned to you");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        throw new Error("Error: Unable to assign the incident");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ??
        (err instanceof Error
          ? err.message
          : "Error while assigning the incident");
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };
  const handleAddComment = async () => {
    if (!incident || !currentUser || !comment.trim()) return;

    try {
      // Add the comment
      await addCommentToIncident(incident.id, comment, Number(currentUser.id));

      // Fetch the updated incident from backend
      const refreshedIncident = await getIncidentById(incident.id);
      setIncident(refreshedIncident);

      setComment("");
      setSuccessMessage("Comentário adicionado com sucesso");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err) {
      setErrorMessage("Erro ao adicionar comentário");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  // Fix the getInitials function to be more robust
  const getInitials = (name: string): string => {
    if (!name) return "??";

    return (
      name
        .split(" ")
        .filter((part) => part.length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "??"
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/incidents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Chamados
            </Link>
          </Button>

          <div className="flex gap-2">
            {canSolve &&
              (incident.status === "em_atendimento" ||
                incident.tecnico?.name === currentUser?.name) && (
                <Dialog
                  open={confirmSolveOpen}
                  onOpenChange={setConfirmSolveOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Solucionar Chamado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar solução</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja marcar este chamado como
                        solucionado?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setConfirmSolveOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSolveIncident}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

            {isOwner && (
              <Dialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
              >
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
                      Tem certeza que deseja excluir este chamado? Esta ação não
                      pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDeleteOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteIncident}
                    >
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

        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-navy-900">
                {incident.titulo
                  ? incident.titulo.charAt(0).toUpperCase() +
                    incident.titulo.slice(1)
                  : ""}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500"></div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <StatusBadge status={(incident.status || "").toUpperCase()} />
              {typeof incident.prioridade === "string" && (
                <PriorityBadge priority={incident.prioridade} />
              )}
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
              <p className="whitespace-pre-wrap">{incident.descricao}</p>
            </CardContent>
          </Card>

          {/* Status Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Status do Chamado</CardTitle>
                <span>
                  {incident.tecnico?.name === undefined ? (
                    <StatusLabel status={incident.status} />
                  ) : incident.tecnico ? (
                    <StatusLabel status={incident.status} />
                  ) : (
                    "Status do técnico desconhecido."
                  )}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/*.comentarios Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              {incident.comentarios && incident.comentarios.length > 0 ? (
                <div className="space-y-4">
                  {incident.comentarios.map((comment, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {comment.autor?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {comment.autor?.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(comment.dataComentario)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {comment.mensagem}
                      </p>
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
            {!canComment && incident.tecnico && (
              <CardFooter className="border-t pt-4">
                <div className="w-full text-center text-sm text-slate-500">
                  Apenas o técnico atribuído e o criador do chamado podem
                  adicionar comentários
                </div>
              </CardFooter>
            )}
            {!canComment && !incident.tecnico && (
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
                <div className="text-sm font-medium text-slate-500">
                  Protocolo
                  <p className="font-medium"> {incident.codigo}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">
                  Criado por
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {incident.usuario?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{incident.usuario?.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">
                  Atribuído a
                </div>
                {incident.tecnico ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {getInitials(incident.tecnico.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{incident.tecnico.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4" />
                    <span>Não atribuído</span>
                  </div>
                )}

                {/* Assignment options */}
                {canAssign &&
                  !incident.tecnico &&
                  incident.status.toLowerCase() !== "solucionado" && (
                    <div className="mt-2 flex flex-col gap-2">
                      {isAdmin ? (
                        <Dialog
                          open={assignDialogOpen}
                          onOpenChange={setAssignDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Atribuir Técnico
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Atribuir Técnico</DialogTitle>
                              <DialogDescription>
                                Selecione um técnico para atribuir a este
                                chamado
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              {technicians.length > 0 ? (
                                <Select
                                  value={selectedTechnician}
                                  onValueChange={setSelectedTechnician}
                                >
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
                              ) : (
                                <div className="text-center py-2 text-slate-500">
                                  Não foi possível carregar a lista de técnicos.
                                  Por favor, tente novamente mais tarde.
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setAssignDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                className="bg-navy-600 hover:bg-navy-700 text-white"
                                onClick={() =>
                                  handleAssignTechnician(selectedTechnician)
                                }
                                disabled={
                                  !selectedTechnician ||
                                  technicians.length === 0
                                }
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
                <div className="text-sm font-medium text-slate-500">
                  Departamento
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span>
                    {incident.usuario?.department
                      ? incident.usuario.department.charAt(0).toUpperCase() +
                        incident.usuario.department.slice(1)
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">
                  Prioridade
                </div>
                <div>{PriorityBadge({ priority: incident.prioridade })}</div>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">
                  Criado em
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{formatDate(incident.dataCriacao)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
