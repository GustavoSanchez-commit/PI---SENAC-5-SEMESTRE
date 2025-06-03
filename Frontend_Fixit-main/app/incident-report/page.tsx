"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createIncident } from "@/app/lib/incidents";

export function getCurrentUser() {
  if (typeof window === "undefined") return null; // Ensure this runs only on the client

  const userJson = localStorage.getItem("fixit_current_user"); // Use the correct key
  console.log("Retrieved user from localStorage:", userJson); // Debugging log

  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export default function IncidentReportPage() {
  const router = useRouter();
  interface User {
    id: number; // Add the user ID
    department?: string;
    role: string;
  }

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("low");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [incidentId, setIncidentId] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    console.log("Current User:", user); // Debugging log
    setCurrentUser(user);
    setIsLoadingUser(false);

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role.toLowerCase() !== "user") {
      console.log("Redirecting to dashboard due to role:", user.role); // Debugging log
      router.push("/dashboard");
      return;
    }

    setDepartment(user.department || "");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!currentUser) {
        throw new Error("Usuário não encontrado");
      }

      const incident = await createIncident({
        title,
        description,
        department,
        priority,
        userId: currentUser.id, // Pass the user ID
      });

      if (incident) {
        setIncidentId(incident.codigo);
        setSuccess(true);
      } else {
        throw new Error("Falha ao criar o chamado. Tente novamente.");
      }
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar o chamado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return null; // Don't render anything until we check authentication
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-navy-900">
              Reportar um chamado
            </CardTitle>
            <CardDescription className="text-slate-600">
              Preencha o formulário abaixo para reportar um problema de TI
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 py-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-navy-900">
                    Chamado reportado com sucesso!
                  </h3>
                  <p className="text-center text-slate-600">
                    Seu número de protocolo é:{" "}
                    <span className="font-bold">{incidentId}</span>
                  </p>
                  <p className="text-center text-slate-600">
                    Nossa equipe de suporte irá analisar seu chamado em breve.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Voltar para o Dashboard</Link>
                  </Button>
                  <Button
                    className="bg-navy-600 hover:bg-navy-700 text-white"
                    onClick={() => {
                      setSuccess(false);
                      setTitle("");
                      setDepartment(currentUser?.department || "");
                      setPriority("medium");
                      setDescription("");
                    }}
                  >
                    Reportar outro chamado
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do chamado</Label>
                  <Input
                    id="title"
                    placeholder="Descreva brevemente o problema"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={priority}
                      onValueChange={(value) =>
                        setPriority(
                          value as "low" | "medium" | "high" | "critical"
                        )
                      }
                      required
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do problema</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o problema em detalhes"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar chamado"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
