"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { getCurrentUser, loginUser, initializeDefaultUsers } from "@/app/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Initialize default users
    initializeDefaultUsers()

    // Check if user is already logged in
    const user = getCurrentUser()
    if (user) {
      router.push("/dashboard")
      return
    }

    // Check for success message from signup
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("registered") === "true") {
      setSuccessMessage("Cadastro realizado com sucesso! Faça login para continuar.")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await loginUser(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Email ou senha inválidos. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="container flex h-16 items-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/LogoFixit.png" alt="FixIt Logo" width={32} height={32} className="rounded-sm" />
          <span className="text-xl font-bold text-navy-700">FixIt</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-navy-900">Entrar</CardTitle>
            <CardDescription className="text-slate-600">Entre com sua conta para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/forgot-password" className="text-sm text-navy-600 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar de mim
                </Label>
              </div>
              <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-white" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-slate-200 p-4">
              <h3 className="mb-2 text-sm font-medium">Usuários para teste:</h3>
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div className="font-medium">Administrador:</div>
                  <div>admin@fixit.com / admin123</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="font-medium">Técnico:</div>
                  <div>tech@fixit.com / tech123</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="font-medium">Usuário:</div>
                  <div>user@fixit.com / user123</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-navy-600 hover:underline">
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-navy-600 hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
