"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle2, Edit, Plus, Search, Trash2 } from "lucide-react"
import { getUsers, isAdmin, type User as UserType } from "@/app/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  // Form states for new technician
  const [newTechName, setNewTechName] = useState("")
  const [newTechEmail, setNewTechEmail] = useState("")
  const [newTechPhone, setNewTechPhone] = useState("")
  const [newTechPassword, setNewTechPassword] = useState("")
  const [newTechDialogOpen, setNewTechDialogOpen] = useState(false)

  // Form states for editing user
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const [editUserName, setEditUserName] = useState("")
  const [editUserEmail, setEditUserEmail] = useState("")
  const [editUserPhone, setEditUserPhone] = useState("")
  const [editUserDepartment, setEditUserDepartment] = useState("")
  const [editUserRole, setEditUserRole] = useState<"admin" | "user" | "technician" | undefined>("user")
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const loadUsers = async () => {
    try {
      const loadedUsers = await getUsers()
      // Remove passwords for security
      const usersWithoutPasswords = loadedUsers.map(({ password, ...rest }) => rest) as UserType[]
      setUsers(usersWithoutPasswords)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is admin
    const adminCheck = isAdmin()
    setIsAdminUser(adminCheck)

    if (!adminCheck) {
      // Redirect non-admin users
      router.push("/dashboard")
      return
    }

    // Load users
    loadUsers()
  }, [router])

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validation - note that department is no longer required
      if (!newTechName || !newTechEmail || !newTechPassword) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // Get all users including passwords
      const allUsers = await getUsers()

      // Check if email already exists
      const existingUser: UserType | undefined = allUsers.find((user: UserType) => user.email === newTechEmail)
      if (existingUser) {
        setErrorMessage("Este email já está em uso.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // Create new technician with department always set to "suporte"
      const newTechnician: UserType = {
        id: `tech-${Date.now()}`,
        name: newTechName,
        email: newTechEmail,
        telephone: newTechPhone,
        department: "suporte", // Always set to "suporte"
        password: newTechPassword,
        createdAt: new Date().toISOString(),
        role: "technician",
      }

      // Add to users array
      allUsers.push(newTechnician)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("fixit_users", JSON.stringify(allUsers))
      }

      // Reload users
      loadUsers()

      // Reset form
      setNewTechName("")
      setNewTechEmail("")
      setNewTechPhone("")
      setNewTechPassword("")
      setNewTechDialogOpen(false)

      // Show success message
      setSuccessMessage("Técnico cadastrado com sucesso!")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 5000)
    } catch (error) {
      console.error("Error creating technician:", error)
      setErrorMessage("Erro ao cadastrar técnico. Tente novamente.")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const handleEditUser = (user: UserType) => {
    setEditUserId(user.id)
    setEditUserName(user.name)
    setEditUserEmail(user.email)
    setEditUserPhone(user.telephone || "")
    setEditUserDepartment(user.department || "")
    setEditUserRole(user.role || "user")
    setEditDialogOpen(true)
  }

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validation
      if (!editUserName || !editUserEmail) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // Get all users including passwords
      const allUsers = await getUsers()

      // Check if email already exists (except for the current user)
      const existingUser = allUsers.find((user) => user.email === editUserEmail && user.id !== editUserId)
      if (existingUser) {
        setErrorMessage("Este email já está em uso.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
        return
      }

      // Find user to edit
      const userIndex = allUsers.findIndex((user) => user.id === editUserId)

      if (userIndex !== -1) {
        // Update user data
        allUsers[userIndex] = {
          ...allUsers[userIndex],
          name: editUserName,
          email: editUserEmail,
          telephone: editUserPhone,
          department: allUsers[userIndex].department,
          role: allUsers[userIndex].role,
        }

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("fixit_users", JSON.stringify(allUsers))
        }

        // Reload users
        loadUsers()

        // Reset form
        setEditDialogOpen(false)

        // Show success message
        setSuccessMessage("Usuário atualizado com sucesso!")
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      setErrorMessage("Erro ao atualizar usuário. Tente novamente.")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        // Get all users
        const allUsers = await getUsers()

        // Filter out the user to delete
        const updatedUsers = allUsers.filter((user) => user.id !== userId)

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("fixit_users", JSON.stringify(updatedUsers))
        }

        // Reload users
        loadUsers()

        // Show success message
        setSuccessMessage("Usuário excluído com sucesso!")
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 5000)
      } catch (error) {
        console.error("Error deleting user:", error)
        setErrorMessage("Erro ao excluir usuário. Tente novamente.")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 5000)
      }
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // If not admin, don't render the page
  if (!isAdminUser) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Gerenciamento de Usuários</h1>
          <p className="text-slate-500">Gerencie usuários e técnicos da plataforma.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="w-full pl-9 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={newTechDialogOpen} onOpenChange={setNewTechDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-navy-600 hover:bg-navy-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Novo Técnico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Técnico</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para cadastrar um novo técnico de suporte.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTechnician}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="techName">Nome completo*</Label>
                    <Input
                      id="techName"
                      placeholder="Nome do técnico"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="techEmail">Email*</Label>
                    <Input
                      id="techEmail"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newTechEmail}
                      onChange={(e) => setNewTechEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="techPhone">Telefone</Label>
                    <Input
                      id="techPhone"
                      placeholder="(00) 00000-0000"
                      value={newTechPhone}
                      onChange={(e) => setNewTechPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="techDepartment">Departamento</Label>
                    <Input id="techDepartment" value="Suporte" disabled className="bg-slate-50" />
                    <p className="text-xs text-slate-500">Técnicos são sempre do departamento de Suporte</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="techPassword">Senha*</Label>
                    <Input
                      id="techPassword"
                      type="password"
                      placeholder="Senha"
                      value={newTechPassword}
                      onChange={(e) => setNewTechPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewTechDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-navy-600 hover:bg-navy-700 text-white">
                    Cadastrar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

      {/* User Management Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Usuários</CardTitle>
              <CardDescription>Lista de todos os usuários cadastrados na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.telephone || "Sem telefone"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.department
                            ? user.department.charAt(0).toUpperCase() + user.department.slice(1)
                            : "Não definido"}
                        </TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            <Badge className="bg-purple-500 hover:bg-purple-600">Administrador</Badge>
                          ) : user.role === "technician" ? (
                            <Badge className="bg-blue-500 hover:bg-blue-600">Técnico</Badge>
                          ) : (
                            <Badge variant="outline">Usuário</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Excluir"
                              disabled={user.role === "admin" && user.email === "admin@fixit.com"}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Lista de usuários comuns da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.filter((user) => !user.role || user.role === "user").length > 0 ? (
                    filteredUsers
                      .filter((user) => !user.role || user.role === "user")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.telephone || "Sem telefone"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.department
                              ? user.department.charAt(0).toUpperCase() + user.department.slice(1)
                              : "Não definido"}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Técnicos</CardTitle>
              <CardDescription>Lista de técnicos de suporte da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.filter((user) => user.role === "technician").length > 0 ? (
                    filteredUsers
                      .filter((user) => user.role === "technician")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.telephone || "Sem telefone"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.department
                              ? user.department.charAt(0).toUpperCase() + user.department.slice(1)
                              : "Não definido"}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Nenhum técnico encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Administradores</CardTitle>
              <CardDescription>Lista de administradores da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.filter((user) => user.role === "admin").length > 0 ? (
                    filteredUsers
                      .filter((user) => user.role === "admin")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.telephone || "Sem telefone"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.department
                              ? user.department.charAt(0).toUpperCase() + user.department.slice(1)
                              : "Não definido"}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Excluir"
                                disabled={user.email === "admin@fixit.com"}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Nenhum administrador encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Edite os dados do usuário selecionado.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUserEdit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Nome completo*</Label>
                <Input
                  id="editName"
                  placeholder="Nome do usuário"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email*</Label>
                <Input
                  id="editEmail"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Telefone</Label>
                <Input
                  id="editPhone"
                  placeholder="(00) 00000-0000"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-navy-600 hover:bg-navy-700 text-white">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
