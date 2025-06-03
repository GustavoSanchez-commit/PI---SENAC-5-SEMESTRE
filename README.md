# FixIt MVP

**FixIt** é uma plataforma de suporte desenvolvida como projeto acadêmico. 
Seu objetivo é gerenciar chamados de suporte técnico de forma eficiente. 
A aplicação foi construída utilizando **Java com Spring Boot** no backend e **React** no frontend. 
Para fins de desenvolvimento e testes, utiliza-se o banco de dados **H2** em memória.

## Estrutura do projeto

- `/Backend_Fixit-main` — Backend desenvolvido em Spring Boot
- `/Frontend_Fixit-main` — Frontend desenvolvido em React

## Como rodar o projeto

### Backend

1. Entre na pasta do backend:
   ```bash
   cd Backend_Fixit-main
   ```
2. Execute o backend usando Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend

> **Importante:** Os arquivos `node_modules` não estão incluídos no repositório, então será necessário instalar as dependências antes de rodar.

1. Entre na pasta do frontend:
   ```bash
   cd Frontend_Fixit-main
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação React:
   ```bash
   npm run dev
   ```
