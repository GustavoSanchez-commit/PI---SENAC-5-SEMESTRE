"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  ChevronRight,
  Ticket,
  BookOpen,
  Monitor,
  Star,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/images/LogoFixit.png"
              alt="FixIt Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-xl font-bold text-navy-700">FixIt</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-700 hover:text-navy-600"
            >
              Recursos
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-slate-700 hover:text-navy-600"
            >
              Depoimentos
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-700 hover:text-navy-600"
            >
              Preços
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-700 hover:text-navy-600"
            >
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
            >
              Entrar
            </Link>
            <Button
              size="sm"
              asChild
              className="bg-navy-600 hover:bg-navy-700 text-white"
            >
              <Link href="/signup">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-navy-900">
                    Simplifique seu Suporte de TI
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl">
                    Aumente a produtividade, reduza custos e concentre-se no que
                    realmente importa com nossa plataforma completa de helpdesk.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="gap-1 bg-navy-600 hover:bg-navy-700 text-white"
                  >
                    Iniciar Teste Gratuito <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-navy-600 border-navy-200 hover:bg-navy-50"
                  >
                    <Link
                      href="https://www.youtube.com/watch?v=7WFC_1UFadU"
                      target="_blank"
                    >
                      Ver Demonstração
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Não é necessário cartão de crédito. Teste gratuito por 14
                  dias.
                </p>
              </div>
              <Image
                src="https://img.freepik.com/free-vector/flat-customer-support-illustration_23-2148899114.jpg?semt=ais_hybrid&w=740"
                width={550}
                height={550}
                alt="Dashboard de Helpdesk"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-navy-100 px-3 py-1 text-sm text-navy-700">
                  Recursos
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-navy-900">
                  Tudo que você precisa para o suporte de TI
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma oferece todas as ferramentas necessárias para
                  gerenciar tickets, resolver problemas rapidamente e manter sua
                  infraestrutura de TI funcionando perfeitamente.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="border-navy-100">
                <CardHeader>
                  <Ticket className="h-10 w-10 text-navy-600" />
                  <CardTitle className="mt-4">
                    Gerenciamento de Tickets
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Organize, priorize e resolva tickets de suporte com
                    eficiência através de um sistema intuitivo de gerenciamento.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-navy-100">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-navy-600" />
                  <CardTitle className="mt-4">Base de Conhecimento</CardTitle>
                  <CardDescription className="text-slate-600">
                    Crie e compartilhe soluções para problemas comuns, reduzindo
                    o tempo de resolução e capacitando os usuários.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-navy-100">
                <CardHeader>
                  <Monitor className="h-10 w-10 text-navy-600" />
                  <CardTitle className="mt-4">Suporte Remoto</CardTitle>
                  <CardDescription className="text-slate-600">
                    Resolva problemas rapidamente com ferramentas de acesso
                    remoto seguras e eficientes para qualquer dispositivo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-navy-100 px-3 py-1 text-sm text-navy-700">
                  Depoimentos
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-navy-900">
                  Amado por empresas em todo o Brasil
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Não acredite apenas em nossa palavra. Veja o que nossos
                  clientes têm a dizer sobre o FixIt.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 xl:gap-10">
              <Card className="border-navy-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      width={40}
                      height={40}
                      alt="Avatar"
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">Ana Silva</CardTitle>
                      <CardDescription>
                        Diretora de TI, TechBrasil
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 text-yellow-400 mb-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-slate-600">
                    "O FixIt transformou completamente como nossa equipe de TI
                    opera. Reduzimos o tempo de resolução de problemas pela
                    metade e aumentamos a satisfação dos usuários em 40%."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-navy-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      width={40}
                      height={40}
                      alt="Avatar"
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">
                        Ricardo Oliveira
                      </CardTitle>
                      <CardDescription>CTO, Inova Soluções</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 text-yellow-400 mb-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-slate-600">
                    "Os recursos de segurança do FixIt são incomparáveis. Como
                    CTO, finalmente posso dormir tranquilo sabendo que nossos
                    dados estão protegidos enquanto nossa equipe resolve
                    problemas de TI com eficiência."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-navy-100 px-3 py-1 text-sm text-navy-700">
                  Preços
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-navy-900">
                  Preços simples e transparentes
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Escolha o plano ideal para sua empresa. Todos os planos
                  incluem teste gratuito de 14 dias.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card className="border-navy-100">
                <CardHeader>
                  <CardTitle className="text-navy-900">Básico</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-navy-900">
                      R$149
                    </span>
                    <span className="text-slate-500">/mês</span>
                  </div>
                  <CardDescription className="text-slate-600">
                    Perfeito para pequenas equipes começando.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Até 5 agentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Análises básicas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        5GB de armazenamento
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Suporte por email</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-navy-600 hover:bg-navy-700 text-white">
                    Começar
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-navy-600">
                <CardHeader>
                  <div className="inline-block rounded-lg bg-navy-600 px-3 py-1 text-sm text-white mb-2">
                    Popular
                  </div>
                  <CardTitle className="text-navy-900">Profissional</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-navy-900">
                      R$399
                    </span>
                    <span className="text-slate-500">/mês</span>
                  </div>
                  <CardDescription className="text-slate-600">
                    Ideal para empresas em crescimento com mais necessidades.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Até 20 agentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Análises avançadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        20GB de armazenamento
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Suporte prioritário
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Integrações personalizadas
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-navy-600 hover:bg-navy-700 text-white">
                    Começar
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-navy-100">
                <CardHeader>
                  <CardTitle className="text-navy-900">Empresarial</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-navy-900">
                      R$999
                    </span>
                    <span className="text-slate-500">/mês</span>
                  </div>
                  <CardDescription className="text-slate-600">
                    Para grandes organizações com requisitos complexos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Agentes ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Análises empresariais
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Armazenamento ilimitado
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Suporte 24/7 dedicado
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">
                        Desenvolvimento personalizado
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-navy-600" />
                      <span className="text-slate-700">Garantias de SLA</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-navy-600 hover:bg-navy-700 text-white">
                    Fale com Vendas
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-navy-900">
                  Pronto para transformar seu suporte de TI?
                </h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a milhares de clientes satisfeitos que otimizaram
                  suas operações de TI com nossa plataforma.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="gap-1 bg-navy-600 hover:bg-navy-700 text-white"
                >
                  Inicie seu Teste Gratuito <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-navy-600 border-navy-200 hover:bg-navy-50"
                >
                  Agende uma Demonstração
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Não é necessário cartão de crédito. Teste gratuito por 14 dias.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0 border-navy-100">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/images/LogoFixit.png"
              alt="FixIt Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-lg font-bold text-navy-700">FixIt</span>
          </a>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <nav className="flex gap-4 md:gap-6">
              <Link
                href="#"
                className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
              >
                Termos
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
              >
                Contato
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-slate-500 hover:text-navy-600">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-slate-500 hover:text-navy-600">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-slate-500 hover:text-navy-600">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-slate-500 hover:text-navy-600">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="container mt-4 text-center text-xs text-slate-500 md:mt-0">
          &copy; {new Date().getFullYear()} FixIt, Inc. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}
