# ☀️ Solar - Sistema de Gestão de Geração Distribuída

Plataforma fullstack para gerenciamento de usinas de energia solar e outras fontes de geração distribuída, com controle multi-empresa, perfis hierárquicos e auditoria completa.

## ⚡ Funcionalidades Principais

- 🏢 **Gestão Multi-Empresa**: Controle de múltiplas empresas e suas usinas
- 👥 **Controle de Acesso**: 4 níveis de permissão (ADMIN, COADMIN, OPERATOR, USER)
- 🔐 **Autenticação JWT**: Sistema seguro com access e refresh tokens
- 📊 **Auditoria Completa**: Rastreabilidade total de todas as operações
- 🔍 **Soft Delete**: Nenhum dado é excluído permanentemente
- 🌍 **Multi-tenant**: Isolamento de dados por empresa

## 🛠️ Tech Stack

### Frontend
- React 18.3+ + TypeScript 5.3+
- Vite 5.0+
- Tailwind CSS 3.4+
- shadcn/ui
- Zustand / React Context
- React Router 6.20+
- TanStack Query 5.0+

### Backend
- NestJS 10.3+
- TypeORM 0.3.19+
- PostgreSQL 16+
- JWT Authentication
- Swagger/OpenAPI

## 🚀 Quick Start

### Usando Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone <repository-url>
cd solar

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Suba toda a stack
docker-compose up -d

# 4. Acesse
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Swagger: http://localhost:3000/api
```

### Desenvolvimento Local

#### Backend

```bash
cd backend
npm install
npm run start:dev
# Server: http://localhost:3000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
# Dev server: http://localhost:5173
```

## 📁 Estrutura do Projeto

```
solar/
├── frontend/          # Aplicação React
├── backend/           # API NestJS
├── docker-compose.yml # Configuração Docker
├── .env.example       # Variáveis de ambiente
├── CLAUDE.md         # Especificações do projeto
└── README.md         # Este arquivo
```

## 🔧 Comandos Principais

### Docker

```bash
docker-compose up -d              # Iniciar
docker-compose down               # Parar
docker-compose logs -f            # Ver logs
docker-compose down -v            # Parar e limpar volumes
```

### Backend

```bash
npm run start:dev                 # Desenvolvimento
npm run build                     # Build
npm run test                      # Testes
npm run migration:generate        # Gerar migration
npm run migration:run             # Executar migrations
```

### Frontend

```bash
npm run dev                       # Desenvolvimento
npm run build                     # Build
npm run preview                   # Preview do build
npm run test                      # Testes
```

## 📚 Documentação

- Especificações completas: [CLAUDE.md](./CLAUDE.md)
- API Swagger: http://localhost:3000/api (quando backend estiver rodando)

## 📝 Licença

MIT
