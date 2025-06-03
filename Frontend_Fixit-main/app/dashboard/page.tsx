"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ExternalLink,
  Settings,
  ScanFaceIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser } from "@/app/lib/auth";
import { getAllIncidents, type Incident } from "@/app/lib/incidents";
import { useToast } from "@/components/ui/use-toast";
import { QuickActions } from "@/components/QuickActions";
import { IncidentCard } from "@/components/IncidentCard";
import { NoIncidentsMessage } from "@/components/NoIncidentsMessage";

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const isRegularUser =
    currentUser?.role?.toLowerCase() !== "technician" &&
    currentUser?.role?.toLowerCase() !== "admin";

  useEffect(() => {
    // Load incidents from localStorage
    getAllIncidents().then((loadedIncidents) => {
      setIncidents(loadedIncidents);
    });

    // Check if this is the first login
    const isFirstLogin = !localStorage.getItem("hasLoggedIn");

    if (isFirstLogin && currentUser) {
      setShowWelcome(true);
      localStorage.setItem("hasLoggedIn", "true");

      // Show welcome toast
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ${currentUser.name}! Você está conectado ao sistema.`,
        duration: 5000,
      });
    }
  }, [toast]);

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
      value: incidents
        .filter((inc) => inc.status.toLowerCase() === "aberto")
        .length.toString(),
      change:
        incidents.filter((inc) => inc.status.toLowerCase() === "aberto")
          .length > 0
          ? "+5%"
          : "-5%",
      status:
        incidents.filter((inc) => inc.status.toLowerCase() === "aberto")
          .length > 0
          ? "up"
          : "down",
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
  ];

  // Sort incidents by creation date (newest first)
  const sortedIncidents = [...incidents].sort(
    (a, b) =>
      new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
  );

  // Get the 5 most recent incidents
  const recentIncidents = sortedIncidents.slice(0, 5);

  // Format date to relative time (e.g., "Há 5 minutos")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Agora mesmo";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Há ${hours} ${hours === 1 ? "hora" : "horas"}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Há ${days} ${days === 1 ? "dia" : "dias"}`;
    }
  };

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="font-medium">Login realizado com sucesso!</p>
            <p className="text-sm">
              Bem-vindo(a) {currentUser?.name}! Você está conectado ao sistema.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Bem-vindo de volta,{" "}
            <span className="font-semibold">
              {currentUser?.name?.split(" ")[0] || "Usuário"}!
            </span>
            Aqui está um resumo do seu sistema de suporte.
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <div
                className={`flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  stat.status === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
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
              <div className="text-2xl font-bold text-navy-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Incidents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900">
            Chamados Recentes
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/incidents">
              Ver Todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="aberto">Abertos</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="solucionado">Solucionados</TabsTrigger>
          </TabsList>

          {/* All Incidents */}
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents.length > 0 ? (
                    recentIncidents.map((incident) => (
                      <IncidentCard key={incident.id} incident={incident} />
                    ))
                  ) : (
                    <NoIncidentsMessage isRegularUser={isRegularUser} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Open Incidents */}
          <TabsContent value="aberto" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents.filter(
                    (incident) => incident.status.toLowerCase() === "aberto"
                  ).length > 0 ? (
                    recentIncidents
                      .filter(
                        (incident) => incident.status.toLowerCase() === "aberto"
                      )
                      .map((incident) => (
                        <IncidentCard key={incident.id} incident={incident} />
                      ))
                  ) : (
                    <NoIncidentsMessage isRegularUser={isRegularUser} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* In Progress Incidents */}
          <TabsContent value="em_andamento" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents.filter(
                    (incident) =>
                      incident.status.toLowerCase() === "em_andamento"
                  ).length > 0 ? (
                    recentIncidents
                      .filter(
                        (incident) =>
                          incident.status.toLowerCase() === "em_andamento"
                      )
                      .map((incident) => (
                        <IncidentCard key={incident.id} incident={incident} />
                      ))
                  ) : (
                    <NoIncidentsMessage isRegularUser={isRegularUser} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resolved Incidents */}
          <TabsContent value="solucionado" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentIncidents.filter(
                    (incident) =>
                      incident.status.toLowerCase() === "solucionado"
                  ).length > 0 ? (
                    recentIncidents
                      .filter(
                        (incident) =>
                          incident.status.toLowerCase() === "solucionado"
                      )
                      .map((incident) => (
                        <IncidentCard key={incident.id} incident={incident} />
                      ))
                  ) : (
                    <NoIncidentsMessage isRegularUser={isRegularUser} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <QuickActions isRegularUser={isRegularUser} />
    </div>
  );
}
