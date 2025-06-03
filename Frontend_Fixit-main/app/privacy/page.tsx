"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
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
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              Esta Política de Privacidade descreve como coletamos, usamos e
              protegemos suas informações pessoais ao utilizar a plataforma
              FixIt.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              1. Coleta de Informações
            </h2>
            <p>
              Coletamos informações fornecidas por você no momento do cadastro,
              como nome, e-mail, telefone e cargo. Também podemos coletar dados
              de uso para melhorar nossos serviços.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              2. Uso das Informações
            </h2>
            <p>
              As informações são utilizadas para identificação de usuários,
              gerenciamento de chamados e personalização da experiência na
              plataforma.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              3. Compartilhamento de Dados
            </h2>
            <p>
              Não compartilhamos suas informações com terceiros, exceto quando
              exigido por lei ou mediante sua autorização.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              4. Segurança
            </h2>
            <p>
              Utilizamos medidas de segurança para proteger seus dados contra
              acessos não autorizados, alterações, divulgações ou destruição.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              5. Seus Direitos
            </h2>
            <p>
              Você pode solicitar a atualização, correção ou exclusão de seus
              dados a qualquer momento, entrando em contato com nosso suporte.
            </p>

            <h2 className="text-lg font-semibold text-navy-800">
              6. Alterações na Política
            </h2>
            <p>
              Podemos modificar esta política periodicamente. A versão mais
              atualizada estará sempre disponível nesta página.
            </p>

            <div className="pt-6 border-t text-center text-sm text-slate-500">
              Para dúvidas, entre em contato com nossa equipe através da{" "}
              <Link
                href="/contact"
                className="text-navy-600 hover:underline font-medium"
              >
                página de suporte
              </Link>
              .
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
