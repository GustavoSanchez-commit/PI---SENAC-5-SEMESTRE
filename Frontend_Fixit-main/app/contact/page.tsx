"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContatoSuporte() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Mensagem enviada com sucesso!");
        setForm({ nome: "", email: "", mensagem: "" });
      } else {
        alert("Erro ao enviar mensagem.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Bloco de logo */}
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

      {/* Conteúdo */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-navy-900">
              Entre em contato com o suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="nome"
                  className="text-sm font-medium text-slate-700"
                >
                  Seu nome
                </label>
                <Input
                  id="nome"
                  placeholder="Digite seu nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Seu e-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@fixit.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="mensagem"
                  className="text-sm font-medium text-slate-700"
                >
                  Mensagem
                </label>
                <Textarea
                  id="mensagem"
                  placeholder="Descreva seu problema ou dúvida..."
                  rows={5}
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar mensagem
              </Button>
            </form>
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
