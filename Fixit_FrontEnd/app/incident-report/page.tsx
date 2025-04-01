"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Bell, CheckCircle2, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, logoutUser } from "@/app/lib/auth"
import { createIncident } from "@/app/lib/incidents"
import { useRouter } from "next/navigation"

export default function IncidentReportPage() {
  const router = useRouter()
  const currentUser = getCurrentUser()

  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState(currentUser?.department || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [incidentId, setIncidentId] = useState("")

  const isRegularUser = !currentUser?.role || currentUser?.role === "user"

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Redirect to dashboard if not a regular user
    if (!isRegularUser) {
      router.push("/dashboard")
      return
    }
  }, [currentUser, router, isRegularUser])

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create the incident
      const incident = createIncident({
        title,
        description,
        department,
        priority: priority as "low" | "medium" | "high" | "critical",
      })

      if (incident) {
        setIncidentId(incident.id)
        setSuccess(true)
      } else {
        throw new Error("Falha ao criar o chamado. Tente novamente.")
      }
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar o chamado.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser || !isRegularUser) {
    return null // Don't render anything until we check authentication
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top header - similar to dashboard */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/placeholder.svg?height=32&width=32" alt="FixIt Logo" width={32} height={32} />
          <span className="text-xl font-bold text-navy-700">FixIt</span>
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start py-2">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">Novo chamado reportado</span>
                      <Badge variant="outline" className="ml-2">
                        Novo
                      </Badge>
                    </div>
                    <span className="text-sm text-slate-500">Um novo chamado foi reportado e requer atenção.</span>
                    <span className="mt-1 text-xs text-slate-400">Há 5 minutos</span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center font-medium text-navy-600">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>
                    {currentUser?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-navy-900">Reportar um chamado</CardTitle>
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
                  <h3 className="text-xl font-medium text-navy-900">Chamado reportado com sucesso!</h3>
                  <p className="text-center text-slate-600">
                    Seu número de protocolo é: <span className="font-bold">{incidentId}</span>
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
                      setSuccess(false)
                      setTitle("")
                      setDepartment(currentUser?.department || "")
                      setPriority("medium")
                      setDescription("")
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
                      onValueChange={(value) => setPriority(value as "low" | "medium" | "high" | "critical")}
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
                <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-white" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar chamado"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!success && (
              <div className="text-center text-sm">
                <Link href="/dashboard" className="text-navy-600 hover:underline">
                  Voltar para o Dashboard
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

