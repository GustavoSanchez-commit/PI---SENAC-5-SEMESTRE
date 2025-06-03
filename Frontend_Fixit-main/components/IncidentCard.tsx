"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Incident } from "@/app/lib/incidents";

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <div className="flex items-center justify-between p-4">
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
              {(incident.usuario?.department || "Departamento Desconhecido")
                .charAt(0)
                .toUpperCase() +
                (
                  incident.usuario?.department || "Departamento Desconhecido"
                ).slice(1)}
            </span>
            <span>•</span>
            <span>{new Date(incident.dataCriacao).toLocaleString()}</span>
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
  );
}


