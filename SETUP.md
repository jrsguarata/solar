# Setup Guide - Solar Project

## ✅ O que foi criado

### Estrutura do Projeto

```
solar/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── ui/       # Componentes base (shadcn/ui)
│   │   │   ├── layout/   # Header, Sidebar, Footer
│   │   │   └── common/   # Loading, ErrorBoundary, etc
│   │   ├── pages/        # Páginas/Rotas
│   │   │   ├── auth/     # Login, Register
│   │   │   └── dashboard/
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API calls (api.ts configurado)
│   │   ├── store/        # State management (Zustand)
│   │   ├── types/        # TypeScript types (auth.types.ts)
│   │   ├── utils/        # Funções utilitárias (cn.ts)
│   │   └── routes/       # Configuração de rotas
│   ├── tailwind.config.js  # Tailwind configurado
│   ├── vite.config.ts      # Aliases @ configurados
│   └── Dockerfile
│
├── backend/              # NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/     # Autenticação JWT completa
│   │   │   │   ├── dto/  # LoginDto, RegisterDto
│   │   │   │   ├── strategies/  # JWT, Local
│   │   │   │   ├── guards/      # JwtAuthGuard, LocalAuthGuard
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.module.ts
│   │   │   └── users/    # Módulo de usuários
│   │   │       ├── entities/    # User entity
│   │   │       ├── dto/         # Create/Update DTOs
│   │   │       ├── users.service.ts
│   │   │       ├── users.controller.ts
│   │   │       └── users.module.ts
│   │   ├── database/
│   │   │   ├── typeorm.config.ts
│   │   │   ├── database.module.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── common/       # Decorators, Filters, Guards
│   │   ├── config/
│   │   │   └── env.validation.ts  # Validação de env vars
│   │   ├── main.ts       # Swagger configurado
│   │   └── app.module.ts # Módulos integrados
│   └── Dockerfile
│
├── docker-compose.yml    # PostgreSQL + Backend + Frontend
├── .env                  # Variáveis de ambiente (dev)
├── .env.example          # Template de variáveis
├── .gitignore            # Configurado
├── package.json          # Scripts root
├── README.md
├── CLAUDE.md             # Especificações do projeto
└── SETUP.md              # Este arquivo
```

### Tecnologias Instaladas

#### Frontend
- ✅ React 18.3+ com TypeScript
- ✅ Vite 5+ (build tool)
- ✅ Tailwind CSS 3.4+ (estilização)
- ✅ React Router 6.20+ (rotas)
- ✅ Axios (HTTP client com interceptors)
- ✅ Zustand (state management)
- ✅ React Hook Form + Zod (formulários/validação)
- ✅ TanStack Query (data fetching)
- ✅ Lucide React (ícones)

#### Backend
- ✅ NestJS 10.3+
- ✅ TypeORM 0.3+ com PostgreSQL
- ✅ Passport.js + JWT (autenticação)
- ✅ class-validator + class-transformer
- ✅ Swagger/OpenAPI (documentação)
- ✅ bcrypt (hash de senhas)
- ✅ Winston (logging)

### Funcionalidades Implementadas

#### Backend
- ✅ Módulo de autenticação completo
  - Register (POST /api/v1/auth/register)
  - Login (POST /api/v1/auth/login)
  - Refresh Token (POST /api/v1/auth/refresh)
  - Get Profile (GET /api/v1/auth/profile)

- ✅ Módulo de usuários CRUD
  - Create User (POST /api/v1/users)
  - Get All Users (GET /api/v1/users) - protegido
  - Get User by ID (GET /api/v1/users/:id) - protegido
  - Update User (PATCH /api/v1/users/:id) - protegido
  - Delete User (DELETE /api/v1/users/:id) - protegido

- ✅ Configurações
  - Validação de variáveis de ambiente
  - CORS habilitado
  - Global validation pipe
  - Swagger UI em /api
  - TypeORM configurado com migrations

#### Frontend
- ✅ Estrutura de pastas conforme CLAUDE.md
- ✅ Axios configurado com interceptors para JWT
- ✅ Types TypeScript para autenticação
- ✅ Tailwind CSS com tema customizado
- ✅ Path aliases (@/) configurados
- ✅ Prettier configurado

---

## 🚀 Como Usar

### 1. Usando Docker (Recomendado)

```bash
# Subir toda a stack (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api

### 2. Desenvolvimento Local

#### Backend

```bash
cd backend

# Instalar dependências (se necessário)
npm install

# Criar o banco de dados PostgreSQL (se não usar Docker)
# Execute o PostgreSQL e crie o database 'solar_dev'

# Rodar em modo desenvolvimento
npm run start:dev
```

O backend estará rodando em: http://localhost:3000
Swagger docs: http://localhost:3000/api

#### Frontend

```bash
cd frontend

# Instalar dependências (se necessário)
npm install

# Rodar em modo desenvolvimento
npm run dev
```

O frontend estará rodando em: http://localhost:5173

---

## 📝 Próximos Passos

### 1. Criar Migration Inicial

```bash
cd backend
npm run build

# Gerar migration para a tabela users
npm run typeorm migration:generate -- -n CreateUsersTable

# Executar migration
npm run typeorm migration:run
```

### 2. Testar Endpoints da API

Use o Swagger (http://localhost:3000/api) ou faça requests:

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Implementar Páginas no Frontend

Criar as páginas de autenticação:

```typescript
// frontend/src/pages/auth/LoginPage.tsx
// frontend/src/pages/auth/RegisterPage.tsx
// frontend/src/pages/dashboard/DashboardPage.tsx
```

### 4. Configurar Rotas

```typescript
// frontend/src/routes/index.tsx
// Implementar React Router com rotas protegidas
```

### 5. Criar Componentes UI Base

Você pode usar shadcn/ui para adicionar componentes:

```bash
cd frontend
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
```

### 6. Implementar State Management

```typescript
// frontend/src/store/authStore.ts
// Criar store Zustand para autenticação
```

### 7. Adicionar Seeds (Opcional)

```typescript
// backend/src/database/seeds/user.seed.ts
// Criar dados iniciais para desenvolvimento
```

---

## 🔧 Scripts Disponíveis

### Root

```bash
npm run install:all    # Instalar deps em frontend e backend
npm run clean          # Limpar node_modules
npm run lint:all       # Lint em todo o projeto
npm run docker:up      # docker-compose up -d
npm run docker:down    # docker-compose down
npm run docker:logs    # docker-compose logs -f
```

### Backend

```bash
npm run start          # Rodar em produção
npm run start:dev      # Rodar em desenvolvimento (watch)
npm run start:debug    # Rodar em modo debug
npm run build          # Build de produção
npm run lint           # ESLint
npm run test           # Testes unitários
npm run test:e2e       # Testes E2E
```

### Frontend

```bash
npm run dev            # Dev server
npm run build          # Build de produção
npm run preview        # Preview do build
npm run lint           # ESLint
npm run type-check     # TypeScript check
```

---

## 🐛 Troubleshooting

### Backend não conecta ao PostgreSQL

Verifique se:
- PostgreSQL está rodando
- Credenciais em `.env` estão corretas
- Database `solar_dev` existe

### Frontend não conecta ao Backend

Verifique:
- `VITE_API_URL` no `.env` está correto
- CORS está habilitado no backend
- Backend está rodando

### TypeScript errors no Frontend

Execute:
```bash
cd frontend
npm run type-check
```

---

## 📚 Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [TypeORM Docs](https://typeorm.io)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## ✨ Features para Implementar

- [ ] Páginas de Login e Register no frontend
- [ ] Dashboard com dados do usuário
- [ ] Reset de senha
- [ ] Roles e permissões (RBAC)
- [ ] Refresh token automático
- [ ] Testes unitários e E2E
- [ ] CI/CD pipeline
- [ ] Deploy (Docker)
- [ ] Monitoramento e logs

---

Projeto criado conforme especificações do CLAUDE.md!
