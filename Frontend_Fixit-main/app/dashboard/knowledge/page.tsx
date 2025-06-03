"use client"

import { useState } from "react"
import { Search, BookOpen, ArrowRight, Clock, CheckCircle2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample knowledge base articles
  const articles = [
    {
      id: 1,
      title: "Como redefinir sua senha",
      description: "Um guia passo a passo para redefinir sua senha de acesso ao sistema.",
      category: "seguranca",
      views: 1243,
      lastUpdated: "2023-11-15T10:30:00Z",
      author: "Ana Silva",
      tags: ["senha", "acesso", "segurança"],
    },
    {
      id: 2,
      title: "Solução para problemas de impressão",
      description: "Resolva os problemas mais comuns de impressão em sua estação de trabalho.",
      category: "hardware",
      views: 856,
      lastUpdated: "2023-11-10T14:45:00Z",
      author: "Carlos Oliveira",
      tags: ["impressora", "hardware", "suporte"],
    },
    {
      id: 3,
      title: "Configurando VPN para acesso remoto",
      description: "Aprenda a configurar e utilizar a VPN corporativa para trabalho remoto.",
      category: "redes",
      views: 723,
      lastUpdated: "2023-11-05T09:15:00Z",
      author: "Mariana Costa",
      tags: ["vpn", "remoto", "redes"],
    },
    {
      id: 4,
      title: "Guia de uso do Microsoft Teams",
      description: "Como utilizar o Microsoft Teams para reuniões e colaboração em equipe.",
      category: "software",
      views: 689,
      lastUpdated: "2023-10-28T11:20:00Z",
      author: "Pedro Santos",
      tags: ["teams", "microsoft", "colaboração"],
    },
    {
      id: 5,
      title: "Backup de arquivos importantes",
      description: "Procedimentos para realizar backup de seus arquivos de trabalho.",
      category: "seguranca",
      views: 542,
      lastUpdated: "2023-10-20T16:30:00Z",
      author: "Luiza Mendes",
      tags: ["backup", "arquivos", "segurança"],
    },
    {
      id: 6,
      title: "Configuração de email no celular",
      description: "Como configurar seu email corporativo em dispositivos móveis.",
      category: "email",
      views: 498,
      lastUpdated: "2023-10-15T13:45:00Z",
      author: "Rafael Almeida",
      tags: ["email", "mobile", "configuração"],
    },
    {
      id: 7,
      title: "Solicitação de novo equipamento",
      description: "Processo para solicitar novos equipamentos de TI para sua equipe.",
      category: "processos",
      views: 432,
      lastUpdated: "2023-10-10T10:00:00Z",
      author: "Juliana Ferreira",
      tags: ["equipamento", "solicitação", "processos"],
    },
    {
      id: 8,
      title: "Uso seguro da internet corporativa",
      description: "Boas práticas para utilização segura da internet no ambiente de trabalho.",
      category: "seguranca",
      views: 387,
      lastUpdated: "2023-10-05T09:30:00Z",
      author: "Bruno Oliveira",
      tags: ["internet", "segurança", "políticas"],
    },
    {
      id: 9,
      title: "Compartilhamento de arquivos na rede",
      description: "Como compartilhar e acessar arquivos na rede corporativa.",
      category: "redes",
      views: 356,
      lastUpdated: "2023-09-28T14:15:00Z",
      author: "Camila Souza",
      tags: ["arquivos", "rede", "compartilhamento"],
    },
    {
      id: 10,
      title: "Instalação de softwares aprovados",
      description: "Procedimento para instalação de softwares aprovados pela empresa.",
      category: "software",
      views: 321,
      lastUpdated: "2023-09-20T11:45:00Z",
      author: "Diego Lima",
      tags: ["software", "instalação", "políticas"],
    },
  ]

  // Format date to relative time (e.g., "Há 5 dias")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Agora mesmo"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Há ${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Há ${days} ${days === 1 ? "dia" : "dias"}`
    }
  }

  // Format view count (e.g., "1.2k")
  const formatViewCount = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Base de Conhecimento</h1>
          <p className="text-slate-500">Encontre artigos, tutoriais e soluções para problemas comuns.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Buscar artigos..."
              className="w-full pl-9 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="redes">Redes</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-slate-100">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      <span>{formatViewCount(article.views)} visualizações</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-lg">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Atualizado {formatRelativeTime(article.lastUpdated)}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-navy-600 -mr-2">
                    Ler artigo <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        {["seguranca", "hardware", "software", "redes", "email"].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles
                .filter((article) => article.category === category)
                .map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-slate-100">
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-slate-500">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          <span>{formatViewCount(article.views)} visualizações</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 text-lg">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-slate-100 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-3">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Atualizado {formatRelativeTime(article.lastUpdated)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-navy-600 -mr-2">
                        Ler artigo <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Featured Articles */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-navy-900">Artigos em Destaque</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <div key={article.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-navy-100 p-2 text-navy-600">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-navy-900">{article.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{article.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
                    <span>{formatViewCount(article.views)} visualizações</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-navy-600">
                      Ler mais
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Guides */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-navy-900">Guias Rápidos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Primeiros Passos",
              description: "Guia básico para novos usuários do sistema.",
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
            {
              title: "Segurança",
              description: "Melhores práticas para manter seus dados seguros.",
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
            {
              title: "Produtividade",
              description: "Dicas para aumentar sua produtividade no trabalho.",
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
            {
              title: "Suporte",
              description: "Como obter ajuda quando precisar.",
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
          ].map((guide, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col items-start gap-2 pt-6">
                <div className="rounded-full bg-navy-100 p-2 text-navy-600">{guide.icon}</div>
                <h3 className="font-medium text-navy-900">{guide.title}</h3>
                <p className="text-sm text-slate-600">{guide.description}</p>
                <Button variant="link" className="mt-auto p-0 text-navy-600">
                  Ver guia
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
