"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle2, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCurrentUser, getUsers } from "@/app/lib/auth"
import type { User as UserType } from "@/app/lib/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [department, setDepartment] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Get full user data including password
    const allUsers = getUsers()
    const fullUserData = allUsers.find((u) => u.id === currentUser.id)

    if (fullUserData) {
      setUser(fullUserData)
      setName(fullUserData.name)
      setEmail(fullUserData.email)
      setTelephone(fullUserData.telephone || "")
      setDepartment(fullUserData.department || "")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validation
      if (!name || !email) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // If password is being changed, validate it
      if (password) {
        if (password !== confirmPassword) {
          setErrorMessage("As senhas não coincidem.")
          setShowErrorAlert(true)
          setTimeout(() => setShowErrorAlert(false), 5000)
          return
        }

        if (password.length < 6) {
          setErrorMessage("A senha deve ter pelo menos 6 caracteres.")
          setShowErrorAlert(true)
          setTimeout(() => setShowErrorAlert(false), 5000)
          return
        }
      }

      // Get all users
      const allUsers = getUsers()

      // Check if email already exists (except for the current user)
      const existingUser = allUsers.find((u) => u.email === email && u.id !== user?.id)
      if (existingUser) {
        setErrorMessage("Este email já está em uso.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // Find user to update
      const userIndex = allUsers.findIndex((u) => u.id === user?.id)

      if (userIndex !== -1) {
        // Update user data
        allUsers[userIndex] = {
          ...allUsers[userIndex],
          name,
          email,
          telephone,
          // Don't change department for technicians
          department: allUsers[userIndex].role === "technician" ? "suporte" : department,
          // Only update password if a new one was provided
          ...(password ? { password } : {}),
        }

        // Save to localStorage
        localStorage.setItem("fixit_users", JSON.stringify(allUsers))

        // Update current user in session
        const { password: _, ...userWithoutPassword } = allUsers[userIndex]
        localStorage.setItem("fixit_current_user", JSON.stringify(userWithoutPassword))

        // Show success message
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)

        // Reset password fields
        setPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("Erro ao atualizar perfil. Tente novamente.")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  if (!user) {
    return null // Don't render anything until user data is loaded
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Meu Perfil</h1>
        <p className="text-slate-500">Gerencie suas informações pessoais e senha.</p>
      </div>

      {/* Success and Error Alerts */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Perfil atualizado com sucesso!</AlertDescription>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo*</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Telefone</Label>
                <Input
                  id="telephone"
                  placeholder="(00) 00000-0000"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>

              {user.role !== "technician" && (
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User className="h-4 w-4" />
                  <span>
                    Tipo de usuário:{" "}
                    {user.role === "admin" ? "Administrador" : user.role === "technician" ? "Técnico" : "Usuário"}
                  </span>
                </div>
                {user.role === "technician" && <div className="mt-1 text-sm text-slate-500">Departamento: Suporte</div>}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Atualize sua senha de acesso.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-slate-500">Deixe em branco para manter a senha atual</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="profile-form" className="w-full bg-navy-600 hover:bg-navy-700 text-white">
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

