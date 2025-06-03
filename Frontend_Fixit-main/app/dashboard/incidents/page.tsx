"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Plus,
  ExternalLink,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getAllIncidents, Incident } from "@/app/lib/incidents";
import { getCurrentUser } from "@/app/lib/auth";

const currentUser = getCurrentUser();
const isRegularUser =
  currentUser?.role?.toLowerCase() !== "technician" &&
  currentUser?.role?.toLowerCase() !== "admin";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const data = await getAllIncidents(); // Use the shared function
        setIncidents(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os chamados");
      }
    }

    fetchIncidents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            Chamados
          </h1>
          <p className="text-slate-500">
            Gerencie e acompanhe todos os chamados reportados.
          </p>
        </div>
        {isRegularUser && (
          <div className="flex items-center gap-2">
            <Button
              className="bg-navy-600 hover:bg-navy-700 text-white"
              asChild
            >
              <Link href="/incident-report">
                <Plus className="mr-2 h-4 w-4" />
                Novo Chamado
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <div
                  key={incident.codigo}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 rounded-full p-1.5 ${
                        incident.status.toLowerCase() === "aberto"
                          ? "bg-red-100 text-red-500"
                          : incident.status.toLowerCase() === "em_andamento"
                          ? "bg-amber-100 text-amber-500"
                          : incident.status.toLowerCase() === "solucionado"
                          ? "bg-green-100 text-green-500"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {incident.status.toLowerCase() === "aberto" ? (
                        <HelpCircle className="h-5 w-5" />
                      ) : incident.status.toLowerCase() === "em_andamento" ? (
                        <Clock className="h-5 w-5" />
                      ) : incident.status.toLowerCase() === "solucionado" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/incidents/${incident.id}`}
                          className="font-medium text-navy-900 hover:underline"
                        >
                          {incident.codigo}
                        </Link>
                        <StatusBadge status={incident.status.toUpperCase()} />
                        <PriorityBadge priority={incident.prioridade} />
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        <Link
                          href={`/dashboard/incidents/${incident.id}`}
                          className="hover:underline"
                        >
                          {incident.titulo}
                        </Link>
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          {(
                            incident.usuario?.department ||
                            "Departamento Desconhecido"
                          )
                            .charAt(0)
                            .toUpperCase() +
                            (
                              incident.usuario?.department ||
                              "Departamento Desconhecido"
                            ).slice(1)}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(incident.dataCriacao).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>Criado por: {incident.usuario?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {incident.tecnico ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {incident.tecnico.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
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
                <h3 className="mt-4 text-lg font-medium text-navy-900">
                  Nenhum chamado encontrado
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Tente ajustar seus filtros ou criar um novo chamado.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
