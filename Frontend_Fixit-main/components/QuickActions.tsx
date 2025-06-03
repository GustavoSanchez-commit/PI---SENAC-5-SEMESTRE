"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, BookOpen, Settings, ScanFaceIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  isRegularUser: boolean;
}

export function QuickActions({ isRegularUser }: QuickActionsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isRegularUser && (
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/incident-report">
                  <LifeBuoy className="mr-2 h-4 w-4 text-navy-600" />
                  Reportar Chamado
                </Link>
              </Button>
            )}
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/knowledge">
                <BookOpen className="mr-2 h-4 w-4 text-navy-600" />
                Base de Conhecimento
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4 text-navy-600" />
                Configurações
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/profile">
                <ScanFaceIcon className="mr-2 h-4 w-4 text-navy-600" />
                Perfil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>Visão geral do status dos serviços</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Servidor Principal</span>
              <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email</span>
              <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sistema ERP</span>
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Degradado
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Banco de Dados</span>
              <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full justify-center text-navy-600"
          >
            Ver Status Detalhado
          </Button>
        </CardFooter>
      </Card>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Artigos Populares</CardTitle>
          <CardDescription>
            Artigos mais acessados da base de conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="#" className="block">
              <div className="text-sm font-medium text-navy-700 hover:underline">
                Como redefinir sua senha
              </div>
              <div className="text-xs text-slate-500">
                Visualizado 1.2k vezes
              </div>
            </Link>
            <Link href="#" className="block">
              <div className="text-sm font-medium text-navy-700 hover:underline">
                Solução para problemas de impressão
              </div>
              <div className="text-xs text-slate-500">
                Visualizado 856 vezes
              </div>
            </Link>
            <Link href="#" className="block">
              <div className="text-sm font-medium text-navy-700 hover:underline">
                Configurando VPN para acesso remoto
              </div>
              <div className="text-xs text-slate-500">
                Visualizado 723 vezes
              </div>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full justify-center text-navy-600"
            asChild
          >
            <Link href="/dashboard/knowledge">Ver Todos os Artigos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
