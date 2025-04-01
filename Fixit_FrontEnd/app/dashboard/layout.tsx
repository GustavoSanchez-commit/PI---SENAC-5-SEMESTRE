"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser, logoutUser, initializeAdminUser, isAdmin } from "@/app/lib/auth"
import { getIncidents } from "@/app/lib/incidents"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [openIncidentsCount, setOpenIncidentsCount] = useState(0)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [userInitials, setUserInitials] = useState("U")

  useEffect(() => {
    // Initialize admin user if it doesn't exist
    initializeAdminUser()

    // Check if user is logged in
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    // Generate user initials
    if (user.name) {
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
      setUserInitials(initials)
    }

    // Check if user is admin
    setIsAdminUser(isAdmin())

    // Get open incidents count
    const incidents = getIncidents()
    const openCount = incidents.filter((inc) => inc.status === "open").length
    setOpenIncidentsCount(openCount)
  }, [router])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  // Update the navItems array to remove Chat, change Tickets, and rename Incidents to Chamados
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Chamados",
      href: "/dashboard/incidents",
      icon: LifeBuoy,
      badge: openIncidentsCount > 0 ? openIncidentsCount.toString() : undefined,
    },
    { name: "Base de Conhecimento", href: "/dashboard/knowledge", icon: BookOpen },
    ...(isAdminUser || currentUser?.role === "technician"
      ? [{ name: "Relatórios", href: "/dashboard/reports", icon: BarChart3 }]
      : []),
    ...(isAdminUser ? [{ name: "Usuários", href: "/dashboard/users", icon: Users }] : []),
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ]

  if (!currentUser) {
    return null // Don't render anything until we check authentication
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="FixIt Logo" width={32} height={32} />
              <span className="text-xl font-bold text-navy-700">FixIt</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-navy-50 text-navy-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-navy-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && <Badge className="bg-navy-600 hover:bg-navy-700">{item.badge}</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <div className="flex w-full items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{currentUser?.name || "Usuário"}</p>
                      <p className="text-xs text-slate-500">
                        {currentUser?.department
                          ? currentUser.department.charAt(0).toUpperCase() + currentUser.department.slice(1)
                          : "Departamento"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
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
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <Image src="/placeholder.svg?height=32&width=32" alt="FixIt Logo" width={32} height={32} />
            <span className="text-xl font-bold text-navy-700">FixIt</span>
          </Link>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {openIncidentsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {openIncidentsCount > 9 ? "9+" : openIncidentsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {openIncidentsCount > 0 ? (
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium">Chamados abertos</span>
                        <Badge variant="outline" className="ml-2">
                          {openIncidentsCount}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500">
                        Você tem {openIncidentsCount} chamado{openIncidentsCount !== 1 ? "s" : ""} aberto
                        {openIncidentsCount !== 1 ? "s" : ""} que requer{openIncidentsCount !== 1 ? "em" : ""} atenção.
                      </span>
                      <span className="mt-1 text-xs text-slate-400">Agora</span>
                    </DropdownMenuItem>
                  ) : (
                    <div className="py-2 px-2 text-center text-sm text-slate-500">Não há notificações no momento</div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center font-medium text-navy-600">
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
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
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

