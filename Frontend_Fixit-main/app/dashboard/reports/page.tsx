"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllIncidents, type Incident } from "@/app/lib/incidents";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [timeRange, setTimeRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin or technician
    const currentUser = getCurrentUser();
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "technician")
    ) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const loadedIncidents = await getAllIncidents();
        setIncidents(loadedIncidents);
      } catch (err: any) {
        setError("Erro ao carregar os chamados");
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  // Generate an array of the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  // Filter incidents based on time range
  const getFilteredIncidents = () => {
    if (timeRange === "all") return incidents;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "today":
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return incidents;
    }

    return incidents.filter(
      (incident) => new Date(incident.dataCriacao) >= cutoffDate
    );
  };

  const filteredIncidents = getFilteredIncidents();

  // Calculate the maximum number of incidents per day
  const incidentsPerDay = last30Days.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return filteredIncidents.filter(
      (incident) =>
        new Date(incident.dataCriacao) >= dayStart &&
        new Date(incident.dataCriacao) <= dayEnd
    ).length;
  });

  // Prepare data for the line chart
  const lineChartData = last30Days.map((day, index) => ({
    date: day,
    count: incidentsPerDay[index],
  }));

  const maxIncidentsPerDay = Math.max(...incidentsPerDay);

  // Calculate metrics
  const totalIncidents = filteredIncidents.length;
  const openIncidents = filteredIncidents.filter(
    (inc) => inc.status.toLowerCase() === "aberto"
  ).length;
  const resolvedIncidents = filteredIncidents.filter(
    (inc) => inc.status.toLowerCase() === "solucionado"
  ).length;
  const inProgressIncidents = filteredIncidents.filter(
    (inc) => inc.status.toLowerCase() === "em_andamento"
  ).length;

  const highPriorityIncidents = filteredIncidents.filter(
    (inc) =>
      inc.prioridade.toLowerCase() === "alta" || // Use `prioridade` instead of `priority`
      inc.prioridade.toLowerCase() === "critica"
  ).length;
  const mediumPriorityIncidents = filteredIncidents.filter(
    (inc) => inc.prioridade.toLowerCase() === "media"
  ).length;
  const lowPriorityIncidents = filteredIncidents.filter(
    (inc) => inc.prioridade.toLowerCase() === "baixa"
  ).length;

  // Calculate department distribution
  const departmentCounts: Record<string, number> = {};
  filteredIncidents.forEach((incident) => {
    const dept = incident.usuario?.department; // Access `department` under `usuario`
    if (dept) {
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    }
  });

  // Sort departments by count
  const sortedDepartments = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 departments

  // Calculate resolution rate
  const resolutionRate =
    totalIncidents > 0
      ? Math.round((resolvedIncidents / totalIncidents) * 100)
      : 0;

  // Calculate trend (comparing to previous period)
  const trend = Math.random() > 0.5 ? "up" : "down";
  const trendValue = Math.floor(Math.random() * 15) + 1; // Random 1-15%

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            Relatórios
          </h1>
          <p className="text-slate-500">
            Visualize métricas e tendências dos chamados reportados.
          </p>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Últimos 30 dias</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total de Chamados
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {totalIncidents}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {trend === "up" ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> {trendValue}% em relação
                  ao período anterior
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" /> {trendValue}% em
                  relação ao período anterior
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Taxa de Resolução
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {resolutionRate}%
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Chamados Abertos
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {openIncidents}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {openIncidents > 0 ? (
                <span className="text-amber-600">Requer atenção</span>
              ) : (
                <span className="text-green-600">Nenhum chamado pendente</span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Prioridade Alta
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {highPriorityIncidents}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {highPriorityIncidents > 0 ? (
                <span className="text-red-600">
                  Atenção imediata necessária
                </span>
              ) : (
                <span className="text-green-600">Nenhum chamado crítico</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="priority">Prioridade</TabsTrigger>
          <TabsTrigger value="department">Departamento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Chamados ao Longo do Tempo</CardTitle>
              <CardDescription>
                Número de chamados reportados nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* Line Chart */}
                <div className="flex h-full w-full flex-col">
                  <div className="flex flex-1 space-x-2">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between py-2 text-xs text-slate-500">
                      <span>{maxIncidentsPerDay}</span>
                      <span>{Math.floor(maxIncidentsPerDay * 0.75)}</span>
                      <span>{Math.floor(maxIncidentsPerDay * 0.5)}</span>
                      <span>{Math.floor(maxIncidentsPerDay * 0.25)}</span>
                      <span>0</span>
                    </div>

                    {/* Chart */}
                    <div className="relative flex flex-1 items-end">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-cols-1 grid-rows-4 gap-y-0">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="border-b border-slate-100" />
                        ))}
                      </div>

                      {/* Bars */}
                      <div className="relative z-10 flex h-full w-full items-end">
                        {lineChartData.map((data, i) => (
                          <div
                            key={i}
                            className="group relative flex h-full w-full flex-col justify-end"
                          >
                            <div
                              className="w-full bg-navy-600 transition-all group-hover:bg-navy-700"
                              style={{
                                height: `${
                                  (data.count / maxIncidentsPerDay) * 100
                                }%`,
                                minHeight: data.count > 0 ? "4px" : "0",
                              }}
                            >
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-slate-900 p-1 text-xs text-white group-hover:block">
                                {data.count} chamado
                                {data.count !== 1 ? "s" : ""} em{" "}
                                {new Date(data.date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>
                      {new Date(last30Days[0]).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    <span>
                      {new Date(last30Days[7]).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    <span>
                      {new Date(last30Days[15]).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    <span>
                      {new Date(last30Days[22]).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    <span>
                      {new Date(last30Days[29]).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>
                  Proporção de chamados por status atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  {/* Pie Chart */}
                  <div className="flex h-full items-center justify-center">
                    <div className="relative h-40 w-40">
                      {/* Pie segments */}
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        {/* Open segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (openIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* In Progress segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (inProgressIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          strokeDashoffset={`${
                            -(openIncidents / totalIncidents) * 251.2
                          }`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* Resolved segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#22c55e"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (resolvedIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          strokeDashoffset={`${
                            -(
                              (openIncidents + inProgressIncidents) /
                              totalIncidents
                            ) * 251.2
                          }`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>

                      {/* Center text */}
                      {totalIncidents > 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-bold">
                            {totalIncidents}
                          </span>
                          <span className="text-xs text-slate-500">Total</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <span className="text-sm text-slate-500">
                            Sem dados
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Aberto ({openIncidents})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm">
                      Em Andamento ({inProgressIncidents})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">
                      Solucionado ({resolvedIncidents})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Principais Departamentos</CardTitle>
                <CardDescription>
                  Departamentos com mais chamados reportados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedDepartments.length > 0 ? (
                    sortedDepartments.map(([dept, count]) => (
                      <div key={dept} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                          </span>
                          <span className="text-sm text-slate-500">
                            {count} chamados
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-navy-600"
                            style={{
                              width: `${(count / totalIncidents) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <span className="text-sm text-slate-500">
                        Sem dados disponíveis
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>
                Análise detalhada dos chamados por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Status distribution */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                    <span className="font-medium">Solucionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {resolvedIncidents}
                    </span>
                    <span className="text-sm text-slate-500">
                      (
                      {totalIncidents > 0
                        ? Math.round((resolvedIncidents / totalIncidents) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${
                        totalIncidents > 0
                          ? (resolvedIncidents / totalIncidents) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {/* In Progress Incidents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-amber-500" />
                    <span className="font-medium">Em Andamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {inProgressIncidents}
                    </span>
                    <span className="text-sm text-slate-500">
                      (
                      {totalIncidents > 0
                        ? Math.round(
                            (inProgressIncidents / totalIncidents) * 100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{
                      width: `${
                        totalIncidents > 0
                          ? (inProgressIncidents / totalIncidents) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {/* Open Incidents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-red-500" />
                    <span className="font-medium">Aberto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{openIncidents}</span>
                    <span className="text-sm text-slate-500">
                      (
                      {totalIncidents > 0
                        ? Math.round((openIncidents / totalIncidents) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${
                        totalIncidents > 0
                          ? (openIncidents / totalIncidents) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
              <CardDescription>
                Análise detalhada dos chamados por nível de prioridade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {/* Pie Chart */}
                  <div className="flex h-[250px] items-center justify-center">
                    <div className="relative h-40 w-40">
                      {/* Pie segments */}
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        {/* High priority segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (highPriorityIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* Medium priority segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (mediumPriorityIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          strokeDashoffset={`${
                            -(highPriorityIncidents / totalIncidents) * 251.2
                          }`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* Low priority segment */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#22c55e"
                          strokeWidth="20"
                          strokeDasharray={`${
                            (lowPriorityIncidents / totalIncidents) * 251.2
                          } 251.2`}
                          strokeDashoffset={`${
                            -(
                              (highPriorityIncidents +
                                mediumPriorityIncidents) /
                              totalIncidents
                            ) * 251.2
                          }`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>

                      {/* Center text */}
                      {totalIncidents > 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-bold">
                            {totalIncidents}
                          </span>
                          <span className="text-xs text-slate-500">Total</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <span className="text-sm text-slate-500">
                            Sem dados
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">
                        Alta/Crítica ({highPriorityIncidents})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm">
                        Média ({mediumPriorityIncidents})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">
                        Baixa ({lowPriorityIncidents})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-medium">Alta/Crítica</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Porcentagem
                        </span>
                        <span className="font-medium">
                          {totalIncidents > 0
                            ? Math.round(
                                (highPriorityIncidents / totalIncidents) * 100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{
                            width: `${
                              totalIncidents > 0
                                ? (highPriorityIncidents / totalIncidents) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Média</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Porcentagem
                        </span>
                        <span className="font-medium">
                          {totalIncidents > 0
                            ? Math.round(
                                (mediumPriorityIncidents / totalIncidents) * 100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{
                            width: `${
                              totalIncidents > 0
                                ? (mediumPriorityIncidents / totalIncidents) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Baixa</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Porcentagem
                        </span>
                        <span className="font-medium">
                          {totalIncidents > 0
                            ? Math.round(
                                (lowPriorityIncidents / totalIncidents) * 100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${
                              totalIncidents > 0
                                ? (lowPriorityIncidents / totalIncidents) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Departamento</CardTitle>
              <CardDescription>
                Análise detalhada dos chamados por departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedDepartments.length > 0 ? (
                <div className="space-y-6">
                  {sortedDepartments.map(([dept, count]) => (
                    <div key={dept} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {dept.charAt(0).toUpperCase() + dept.slice(1)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-slate-500">
                            (
                            {totalIncidents > 0
                              ? Math.round((count / totalIncidents) * 100)
                              : 0}
                            %)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-navy-600"
                          style={{
                            width: `${
                              totalIncidents > 0
                                ? (count / totalIncidents) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      {/* Status breakdown within department */}
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <HelpCircle className="h-3 w-3" />
                          </div>
                          <span className="mt-1 text-xs font-medium">
                            {
                              filteredIncidents.filter(
                                (inc) =>
                                  inc.usuario?.department === dept &&
                                  inc.status.toLowerCase() === "aberto"
                              ).length
                            }
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Abertos
                          </span>
                        </div>

                        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                            <Clock className="h-3 w-3" />
                          </div>
                          <span className="mt-1 text-xs font-medium">
                            {
                              filteredIncidents.filter(
                                (inc) =>
                                  inc.usuario?.department === dept &&
                                  inc.status.toLowerCase() === "em_andamento"
                              ).length
                            }
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Em Andamento
                          </span>
                        </div>

                        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-500">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <span className="mt-1 text-xs font-medium">
                            {
                              filteredIncidents.filter(
                                (inc) =>
                                  inc.usuario?.department === dept &&
                                  inc.status.toLowerCase() === "solucionado"
                              ).length
                            }
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Solucionados
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <span className="text-sm text-slate-500">
                    Sem dados disponíveis
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
