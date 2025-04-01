"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Moon, Sun, Laptop } from "lucide-react"
import { getCurrentUser } from "@/app/lib/auth"

export default function SettingsPage() {
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("pt-BR")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const currentUser = getCurrentUser()

  const handleSaveSettings = () => {
    try {
      // In a real app, we would save these settings to a database or localStorage
      // For now, we'll just show a success message
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 5000)
    } catch (error) {
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 5000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Configurações</h1>
        <p className="text-slate-500">Gerencie suas preferências e configurações do sistema.</p>
      </div>

      {/* Success and Error Alerts */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Erro ao salvar configurações. Tente novamente.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Gerencie suas configurações gerais do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="America/Sao_Paulo">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                    <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-logout">Logout Automático</Label>
                  <p className="text-sm text-slate-500">Desconectar automaticamente após 30 minutos de inatividade</p>
                </div>
                <Switch id="auto-logout" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidade</CardTitle>
              <CardDescription>Gerencie suas configurações de privacidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Compartilhar Dados de Uso</Label>
                  <p className="text-sm text-slate-500">Permitir coleta de dados anônimos para melhorar o sistema</p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cookies">Aceitar Cookies</Label>
                  <p className="text-sm text-slate-500">Permitir cookies para melhorar a experiência de navegação</p>
                </div>
                <Switch id="cookies" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como e quando você recebe notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-slate-500">Receber notificações por email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <p className="text-sm text-slate-500">Receber notificações push no navegador</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="space-y-2">
                <Label>Tipos de Notificações</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-new-incidents" defaultChecked />
                    <Label htmlFor="notify-new-incidents">Novos chamados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-updates" defaultChecked />
                    <Label htmlFor="notify-updates">Atualizações de chamados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-comments" defaultChecked />
                    <Label htmlFor="notify-comments">Novos comentários</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-system" defaultChecked />
                    <Label htmlFor="notify-system">Atualizações do sistema</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a aparência do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center gap-2 p-4 h-auto ${theme === "light" ? "bg-navy-600 text-white" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Claro</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center gap-2 p-4 h-auto ${theme === "dark" ? "bg-navy-600 text-white" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Escuro</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center gap-2 p-4 h-auto ${theme === "system" ? "bg-navy-600 text-white" : ""}`}
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-6 w-6" />
                    <span>Sistema</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Densidade</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="flex flex-col items-center justify-center gap-2 p-4 h-auto">
                    <div className="flex flex-col gap-1">
                      <div className="h-1 w-12 bg-slate-300 rounded"></div>
                      <div className="h-1 w-12 bg-slate-300 rounded"></div>
                    </div>
                    <span>Compacto</span>
                  </Button>
                  <Button
                    variant="default"
                    className="flex flex-col items-center justify-center gap-2 p-4 h-auto bg-navy-600 text-white"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="h-1 w-12 bg-white rounded"></div>
                      <div className="h-1 w-12 bg-white rounded"></div>
                    </div>
                    <span>Normal</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center gap-2 p-4 h-auto">
                    <div className="flex flex-col gap-3">
                      <div className="h-1 w-12 bg-slate-300 rounded"></div>
                      <div className="h-1 w-12 bg-slate-300 rounded"></div>
                    </div>
                    <span>Confortável</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-navy-600 hover:bg-navy-700 text-white" onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}

