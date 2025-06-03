"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="container flex mt-8 h-28 items-center justify-center">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/images/LogoFixit.png"
            alt="FixIt Logo"
            width={112}
            height={112}
            className="rounded-xl"
          />
          <span className="text-5xl font-extrabold text-navy-700">FixIt</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-navy-900">
              Termos de Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              Bem-vindo ao FixIt! Ao utilizar nossa plataforma, você concorda
              com os seguintes termos de serviço. Por favor, leia com atenção.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              1. Uso da Plataforma
            </h2>
            <p>
              Você se compromete a utilizar o sistema de forma responsável e a
              não realizar qualquer ação que possa comprometer a segurança ou o
              funcionamento da plataforma.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              2. Cadastro e Dados Pessoais
            </h2>
            <p>
              Ao se cadastrar, você declara que os dados fornecidos são
              verdadeiros e concorda com o uso dessas informações conforme nossa
              Política de Privacidade.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              3. Responsabilidades do Usuário
            </h2>
            <p>
              É de sua responsabilidade manter a confidencialidade de suas
              credenciais de acesso. O uso indevido da conta é de
              responsabilidade do titular.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              4. Modificações
            </h2>
            <p>
              Podemos alterar estes termos a qualquer momento. Recomendamos
              revisá-los periodicamente para estar ciente de quaisquer
              atualizações.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              5. Aceitação dos Termos
            </h2>
            <p>
              Ao utilizar a plataforma, você declara estar de acordo com todos
              os termos acima.
            </p>

            <div className="pt-6 border-t text-center text-sm text-slate-500">
              Para mais informações, veja nossa{" "}
              <Link
                href="/privacy"
                className="text-navy-600 hover:underline font-medium"
              >
                Política de Privacidade
              </Link>{" "}
              ou entre em contato com o suporte.
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-navy-600 hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
