# CLAUDE.md - Sistema de Gestão de Geração Distribuída

## 🎯 Descrição do Projeto
Sistema de Gestão de Geração Distribuída - Plataforma fullstack para gerenciamento de usinas de energia solar e outras fontes de geração distribuída, com controle multi-empresa, perfis hierárquicos e auditoria completa.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3+
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5.0+
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand 4.5+ ou React Context
- **Routing**: React Router 6.20+
- **HTTP Client**: Axios 1.6+ com interceptors
- **Form Handling**: React Hook Form 7.49+
- **Validation**: Zod 3.22+
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query 5.0+ (React Query)

### Backend
- **Framework**: NestJS 10.3+
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.3+
- **ORM**: TypeORM 0.3.19+
- **Database**: PostgreSQL 16+
- **Authentication**: JWT com Passport.js
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI (@nestjs/swagger)
- **Logging**: Winston ou built-in Logger
- **Config**: @nestjs/config com dotenv

### Database
- **SGBD**: PostgreSQL 16+
- **Migrations**: TypeORM migrations
- **Seeding**: Custom seed scripts em TypeScript

### DevOps & Tools
- **Container**: Docker + Docker Compose
- **Package Manager**: npm 10+ ou pnpm 8+
- **Linting**: ESLint 8.56+
- **Formatting**: Prettier 3.2+
- **Git Hooks**: Husky + lint-staged
- **Testing Frontend**: Vitest + React Testing Library
- **Testing Backend**: Jest + Supertest

---

## 📁 Estrutura de Diretórios

```
projeto-fullstack/
├── .git/
├── .gitignore
├── .env.example
├── docker-compose.yml
├── README.md
├── CLAUDE.md                    # Este arquivo
│
├── frontend/
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   │
│   ├── public/
│   │   └── assets/
│   │
│   └── src/
│       ├── App.tsx              # Componente raiz
│       ├── main.tsx             # Entry point
│       ├── vite-env.d.ts
│       │
│       ├── components/          # Componentes React reutilizáveis
│       │   ├── ui/              # Componentes base (shadcn/ui)
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── card.tsx
│       │   │   └── ...
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Footer.tsx
│       │   └── common/
│       │       ├── Loading.tsx
│       │       ├── ErrorBoundary.tsx
│       │       └── ProtectedRoute.tsx
│       │
│       ├── pages/               # Páginas/Rotas
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx
│       │   │   └── RegisterPage.tsx
│       │   ├── dashboard/
│       │   │   └── DashboardPage.tsx
│       │   └── NotFoundPage.tsx
│       │
│       ├── hooks/               # Custom React hooks
│       │   ├── useAuth.ts
│       │   ├── useApi.ts
│       │   └── useLocalStorage.ts
│       │
│       ├── services/            # API calls & external services
│       │   ├── api.ts           # Axios config
│       │   ├── auth.service.ts
│       │   └── user.service.ts
│       │
│       ├── store/               # State management
│       │   ├── authStore.ts     # Zustand stores
│       │   └── userStore.ts
│       │
│       ├── types/               # TypeScript interfaces/types
│       │   ├── auth.types.ts
│       │   ├── user.types.ts
│       │   └── api.types.ts
│       │
│       ├── utils/               # Funções utilitárias
│       │   ├── formatters.ts
│       │   ├── validators.ts
│       │   └── constants.ts
│       │
│       ├── routes/              # Configuração de rotas
│       │   └── index.tsx
│       │
│       └── styles/              # Estilos globais
│           └── globals.css      # Tailwind imports
│
└── backend/
    ├── .eslintrc.js
    ├── .prettierrc
    ├── nest-cli.json
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.build.json
    │
    ├── test/                    # Testes E2E
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    │
    └── src/
        ├── main.ts              # Entry point
        │
        ├── app.module.ts        # Root module
        ├── app.controller.ts
        ├── app.service.ts
        │
        ├── modules/             # Feature modules
        │   ├── auth/
        │   │   ├── auth.module.ts
        │   │   ├── auth.controller.ts
        │   │   ├── auth.service.ts
        │   │   ├── auth.service.spec.ts
        │   │   ├── dto/
        │   │   │   ├── login.dto.ts
        │   │   │   └── register.dto.ts
        │   │   ├── strategies/
        │   │   │   ├── jwt.strategy.ts
        │   │   │   └── local.strategy.ts
        │   │   └── guards/
        │   │       ├── jwt-auth.guard.ts
        │   │       └── roles.guard.ts
        │   │
        │   └── users/
        │       ├── users.module.ts
        │       ├── users.controller.ts
        │       ├── users.service.ts
        │       ├── users.service.spec.ts
        │       ├── entities/
        │       │   └── user.entity.ts
        │       └── dto/
        │           ├── create-user.dto.ts
        │           └── update-user.dto.ts
        │
        ├── database/            # Database config
        │   ├── database.module.ts
        │   ├── typeorm.config.ts
        │   ├── migrations/
        │   └── seeds/
        │
        ├── common/              # Código compartilhado
        │   ├── decorators/
        │   │   └── current-user.decorator.ts
        │   ├── filters/
        │   │   └── http-exception.filter.ts
        │   ├── interceptors/
        │   │   └── transform.interceptor.ts
        │   ├── pipes/
        │   │   └── validation.pipe.ts
        │   └── guards/
        │       └── roles.guard.ts
        │
        └── config/              # Configuration
            ├── config.module.ts
            └── env.validation.ts
```

---

## 🎨 Convenções de Código

### Nomenclatura

#### Arquivos
- **Componentes React**: PascalCase (ex: `UserProfile.tsx`)
- **Páginas React**: PascalCase com sufixo `Page` (ex: `DashboardPage.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Services**: camelCase com sufixo `.service` (ex: `auth.service.ts`)
- **Utils**: camelCase (ex: `formatDate.ts`)
- **Types**: camelCase com sufixo `.types` (ex: `user.types.ts`)
- **Constantes**: camelCase com sufixo `.constants` (ex: `api.constants.ts`)
- **Testes**: mesmo nome + `.spec.ts` ou `.test.tsx`

#### Código
- **Componentes/Classes**: PascalCase (ex: `UserProfile`, `AuthService`)
- **Interfaces**: PascalCase com prefixo `I` (ex: `IUser`, `IAuthResponse`)
- **Types**: PascalCase (ex: `UserRole`, `ApiResponse`)
- **Enums**: PascalCase (ex: `UserStatus`, `HttpMethod`)
- **Variáveis/Funções**: camelCase (ex: `getUserById`, `isAuthenticated`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Props Interfaces**: PascalCase com sufixo `Props` (ex: `UserCardProps`)
- **DTO Classes**: PascalCase com sufixo `Dto` (ex: `CreateUserDto`)

### Frontend - React + TypeScript

```typescript
// ✅ CORRETO: Functional component com TypeScript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: IUser) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const data = await userService.getById(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
    </div>
  );
};

// ❌ EVITAR: Class components
class UserProfile extends React.Component { }

// ❌ EVITAR: Componentes sem tipos
export const UserProfile = ({ userId }) => { }
```

### Backend - NestJS + TypeScript

```typescript
// ✅ CORRETO: Controller com decorators
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}

// ✅ CORRETO: Service com injeção de dependências
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new ForbiddenException('Access denied');
throw new ConflictException('Email already exists');
throw new InternalServerErrorException('Something went wrong');

// ✅ Custom exception filter (global)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
    };

    response.status(status).json(errorResponse);
  }
}

// Aplicar globalmente no main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

### Frontend - Error Handling

```typescript
// ✅ Try-catch em chamadas async
const fetchUser = async (id: string) => {
  try {
    setLoading(true);
    setError(null);
    
    const user = await userService.getById(id);
    setUser(user);
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    setError(message);
    toast.error(message);
    console.error('Error fetching user:', error);
  } finally {
    setLoading(false);
  }
};

// ✅ Error Boundary para erros de renderização
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Algo deu errado
          </h1>
          <p className="mt-2">{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🚨 REGRAS CRÍTICAS

### Regras de Autorização

**REGRA GERAL: Controle de acesso baseado em perfis de usuário.**

#### Perfis de Usuário

1. **ADMIN** - Administrador do sistema
   - Pode gerenciar empresas (criar, alterar, excluir)
   - Pode gerenciar todos os usuários
   - Não precisa estar vinculado a uma empresa

2. **COADMIN** - Administrador da Empresa
   - Deve estar vinculado a uma empresa
   - Pode gerenciar usuários da sua empresa

3. **OPERATOR** - Operador
   - Deve estar vinculado a uma empresa
   - Operações específicas do negócio

4. **USER** - Usuário comum
   - Deve estar vinculado a uma empresa
   - Acesso básico ao sistema

#### Regras de Acesso

- **Empresas (Companies)**:
  - CREATE: Apenas ADMIN
  - READ: Todos os usuários autenticados
  - UPDATE: Apenas ADMIN
  - DELETE: Apenas ADMIN

- **Usuários (Users)**:
  - CREATE: ADMIN (qualquer usuário) ou COADMIN (apenas da sua empresa)
  - READ:
    - ADMIN: Vê todos os usuários
    - COADMIN: Vê apenas usuários da sua empresa
    - OPERATOR/USER: Vê apenas usuários da sua empresa
  - UPDATE: ADMIN (qualquer usuário) ou COADMIN (apenas da sua empresa, exceto ADMIN/COADMIN)
  - DELETE: ADMIN (qualquer usuário) ou COADMIN (apenas da sua empresa, exceto ADMIN/COADMIN)
  - ACTIVATE/DEACTIVATE: ADMIN ou COADMIN (apenas da sua empresa, exceto ADMIN/COADMIN)

```typescript
// ✅ CORRETO: Controle de acesso para empresas
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new company (Admin only)' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  findAll() {
    return this.companiesService.findAll();
  }
}

// ✅ CORRETO: Controle de acesso para usuários com CompanyAccessGuard
@Controller('users')
export class UsersController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  create(@Body() dto: CreateUserDto, @CurrentUser() user: any) {
    return this.usersService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    // Filtra automaticamente por empresa para COADMIN
    return this.usersService.findAll(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // CompanyAccessGuard garante que COADMIN só acessa sua empresa
    return this.usersService.update(id, dto);
  }
}

// ❌ ERRADO: Endpoint sem controle de acesso
@Post()
create(@Body() createCompanyDto: CreateCompanyDto) {
  return this.companiesService.create(createCompanyDto);
}
```

### Sistema de Auditoria

**REGRA GERAL: O sistema deve ser completamente auditável com rastreabilidade total.**

#### Princípios

1. **Nenhum registro é excluído permanentemente** - Usar soft delete
2. **Todas as alterações são registradas** - Tabela `audit_logs`
3. **Rastreabilidade completa** - Valores antes e depois de cada mudança
4. **Campos sensíveis são protegidos** - Passwords/tokens ocultados nos logs
5. **CRUD completo é auditado** - Todo CREATE, UPDATE e DELETE gera registro em `audit_logs`

**REGRA CRÍTICA: Qualquer operação de CRUD (Create, Read, Update, Delete) em qualquer tabela do sistema DEVE gerar automaticamente um registro na tabela `audit_logs`.**

- **CREATE**: Registra `action: INSERT` com os valores do novo registro em `newValues`
- **UPDATE**: Registra `action: UPDATE` com valores antigos em `oldValues` e novos em `newValues`, além de `changedFields`
- **DELETE/SOFT DELETE**: Registra `action: DELETE` com os valores do registro em `oldValues`
- **READ**: Não é auditado por questões de performance (exceto em casos críticos específicos)

Isso é implementado através de **TypeORM Subscribers** que escutam todos os eventos de banco de dados automaticamente.

#### Implementação

**Duas Camadas de Auditoria:**

1. **Soft Delete** - Registros nunca são removidos fisicamente
   - Campo `deletedAt` marca quando foi "excluído"
   - Campo `deletedBy` identifica quem excluiu
   - TypeORM automaticamente filtra registros deletados

2. **Audit Logs** - Histórico completo de todas as mudanças
   - INSERT: Registra valores novos
   - UPDATE: Registra valores antes e depois
   - DELETE: Registra valores antes da exclusão
   - Campos alterados são identificados
   - IP e User Agent podem ser capturados

```typescript
// ✅ Estrutura da tabela audit_logs
@Entity('audit_logs')
export class AuditLog {
  id: string;                    // UUID do log
  tableName: string;             // Nome da tabela afetada
  recordId: string;              // ID do registro afetado
  action: 'INSERT'|'UPDATE'|'DELETE';  // Tipo de operação
  oldValues?: Record<string,any>;      // Valores anteriores
  newValues?: Record<string,any>;      // Valores novos
  changedFields?: string[];            // Campos modificados
  userId?: string;                     // Quem fez a mudança
  ipAddress?: string;                  // IP da requisição
  userAgent?: string;                  // Navegador/cliente
  createdAt: Date;                     // Quando ocorreu
}

// ✅ Soft Delete em todos os services
async remove(id: string): Promise<void> {
  const company = await this.findOne(id);
  // Usa softDelete em vez de delete
  await this.companiesRepository.softDelete(company.id);
}

// ✅ Auditoria automática via TypeORM Subscribers
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface<any> {
  constructor(private dataSource: DataSource) {}

  // Não implementar listenTo() para escutar TODAS as entidades

  async afterInsert(event: InsertEvent<any>) {
    // Registra INSERT na tabela audit_logs
    // Ignora audit_logs para evitar loop infinito
  }

  async afterUpdate(event: UpdateEvent<any>) {
    // Registra UPDATE com valores antigos e novos
    // Calcula changedFields automaticamente
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    // Registra DELETE (soft)
  }

  async afterRemove(event: RemoveEvent<any>) {
    // Registra DELETE (hard - não recomendado)
  }
}

// ✅ IMPORTANTE: Subscriber deve ser registrado no typeorm.config.ts
export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  // ... outras configs
  subscribers: [AuditSubscriber, AuditLogSubscriber],
});

// ✅ Consultar histórico de auditoria
const history = await auditService.getAuditHistory('users', userId);
// Retorna todos os logs de mudanças para aquele usuário

// ✅ Verificar auditoria via SQL
-- Ver total de registros por ação
SELECT COUNT(*) as total, action FROM audit_logs GROUP BY action;

-- Ver últimos registros de auditoria
SELECT table_name, action, record_id, user_id, created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;

-- Ver histórico de um registro específico
SELECT * FROM audit_logs
WHERE table_name = 'users' AND record_id = 'uuid-do-usuario'
ORDER BY created_at DESC;
```

#### Benefícios

- **Compliance**: Atende requisitos regulatórios (LGPD, SOX, etc.)
- **Debugging**: Facilita investigação de problemas
- **Segurança**: Detecta acessos não autorizados
- **Rollback**: Permite reverter mudanças se necessário
- **Análise**: Histórico completo para auditoria

#### Exceção: Tabela Users

A tabela `users` usa sistema de **ativação/desativação** em vez de soft delete:
- Campo `isActive` (true/false)
- Campo `deactivatedAt`
- Campo `deactivatedBy`
- Motivo: Segurança (usuários desativados não podem fazer login)

#### Foreign Keys de Auditoria

**REGRA GERAL: Todos os campos de auditoria devem ter Foreign Keys para a tabela `users`.**

Os campos `created_by`, `updated_by`, `deleted_by`, e `deactivated_by` em todas as tabelas devem:

1. **Ter Foreign Key** apontando para `users.id`
2. **Usar `onDelete: 'SET NULL'`** - Se o usuário for deletado, o campo vira NULL
3. **Ser nullable** - Permitir NULL quando o usuário não existe mais
4. **Usar lazy loading** - Para evitar referência circular com User entity

```typescript
// ✅ BaseEntity com FKs para auditoria
@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'created_by' })
createdByUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.createdByUser)
createdBy?: string;  // Propriedade virtual com o ID

@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'updated_by' })
updatedByUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.updatedByUser)
updatedBy?: string;
```

**Benefícios:**
- ✅ **Integridade Referencial**: Banco garante que IDs são válidos
- ✅ **Validação Automática**: Impossível inserir user_id inexistente
- ✅ **Cascata Segura**: Se user deletado, campos ficam NULL (não falham)
- ✅ **Queries Otimizadas**: Índices nas FKs melhoram performance
- ✅ **Navegação**: Pode fazer JOIN para buscar dados do usuário que fez a ação

### Mensagens de Erro

**REGRA GERAL: Todas as mensagens de erro devem ser emitidas em português brasileiro.**

- Exceptions do backend devem ter mensagens em português
- Validações devem retornar erros em português
- Mensagens de feedback no frontend devem ser em português
- Textos de interface (labels, botões, placeholders) devem ser em português
- Logs de erro podem ser em português ou inglês técnico

```typescript
// ✅ BACKEND: Mensagens em português
throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
throw new BadRequestException('Formato de email inválido');
throw new UnauthorizedException('Credenciais inválidas');
throw new ConflictException('Email já existe');
throw new BadRequestException('Usuário já está desativado');

// ❌ BACKEND: Mensagens em inglês
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid email format');

// ✅ BACKEND: Validações class-validator em português
export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;
}

// ❌ BACKEND: Validações em inglês
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Erro: "name should not be empty"
}

// ✅ FRONTEND: Mensagens e textos em português
toast.error('Erro ao carregar dados');
toast.success('Usuário criado com sucesso');
setError('Falha ao fazer login. Verifique suas credenciais.');
<button>Salvar</button>
<input placeholder="Digite seu email" />

// ❌ FRONTEND: Mensagens em inglês
toast.error('Failed to load data');
toast.success('User created successfully');
setError('Login failed. Check your credentials.');
<button>Save</button>
<input placeholder="Enter your email" />
```

### Paginação de Tabelas

**REGRA GERAL: Todas as tabelas exibidas no frontend devem ter paginação.**

#### Requisitos de Paginação

1. **Frontend (Exibição)**:
   - Máximo de **10 elementos por página** na interface
   - Componente de paginação com navegação entre páginas
   - Indicação da página atual e total de páginas
   - Botões: Primeira, Anterior, Próxima, Última

2. **Backend (Carregamento)**:
   - Buscar registros em lotes de **200 em 200**
   - Quando a visualização ultrapassar os 200 registros carregados, fazer nova requisição
   - Cache local dos registros já carregados para evitar requisições repetidas

3. **Implementação**:

```typescript
// ✅ FRONTEND: Paginação com carregamento incremental
interface PaginationState {
  currentPage: number;        // Página atual (interface)
  itemsPerPage: number;       // 10 itens por página
  totalItems: number;         // Total de registros
  loadedItems: any[];         // Registros carregados do backend
  backendOffset: number;      // Offset para próxima carga do backend
  backendLimit: number;       // 200 registros por lote
}

const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  loadedItems: [],
  backendOffset: 0,
  backendLimit: 200,
});

// Calcular registros da página atual
const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
const endIndex = startIndex + pagination.itemsPerPage;
const currentPageItems = pagination.loadedItems.slice(startIndex, endIndex);

// Verificar se precisa carregar mais registros
useEffect(() => {
  const needMoreData = endIndex >= pagination.loadedItems.length
    && pagination.loadedItems.length < pagination.totalItems;

  if (needMoreData) {
    loadMoreFromBackend();
  }
}, [pagination.currentPage]);

const loadMoreFromBackend = async () => {
  const { data, total } = await api.get('/users', {
    params: {
      offset: pagination.backendOffset,
      limit: pagination.backendLimit,
    },
  });

  setPagination(prev => ({
    ...prev,
    loadedItems: [...prev.loadedItems, ...data],
    backendOffset: prev.backendOffset + prev.backendLimit,
    totalItems: total,
  }));
};

// Componente de paginação
<div className="flex items-center justify-between mt-4">
  <p className="text-sm text-gray-600">
    Exibindo {startIndex + 1} a {Math.min(endIndex, pagination.totalItems)} de {pagination.totalItems} registros
  </p>

  <div className="flex gap-2">
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
      disabled={pagination.currentPage === 1}
    >
      Primeira
    </button>
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
      disabled={pagination.currentPage === 1}
    >
      Anterior
    </button>
    <span>Página {pagination.currentPage} de {Math.ceil(pagination.totalItems / pagination.itemsPerPage)}</span>
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
      disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
    >
      Próxima
    </button>
    <button
      onClick={() => setPagination(prev => ({
        ...prev,
        currentPage: Math.ceil(pagination.totalItems / pagination.itemsPerPage)
      }))}
      disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
    >
      Última
    </button>
  </div>
</div>
```

```typescript
// ✅ BACKEND: Suporte a paginação
@Get()
async findAll(
  @Query('offset') offset: number = 0,
  @Query('limit') limit: number = 200,
  @CurrentUser() currentUser: any,
) {
  const [data, total] = await this.usersRepository.findAndCount({
    skip: offset,
    take: Math.min(limit, 200), // Máximo 200 por requisição
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    total,
    offset,
    limit,
  };
}
```

#### Benefícios:
- ✅ **Performance**: Carrega apenas dados necessários
- ✅ **UX**: Navegação rápida entre páginas
- ✅ **Escalabilidade**: Funciona com milhares de registros
- ✅ **Economia**: Reduz tráfego de rede e uso de memória

### NUNCA Commitar

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# Test coverage
coverage/

# Docker
.dockerignore
```

### SEMPRE Fazer

1. **Validar entrada do usuário**
   - Frontend: Zod schemas + React Hook Form
   - Backend: class-validator DTOs

2. **Sanitizar dados**
   - Usar ORM (TypeORM) - evita SQL injection
   - Validar tipos TypeScript
   - Limitar tamanho de payloads

3. **Autenticação & Autorização**
   - JWT com refresh tokens
   - Guards em rotas protegidas (JwtAuthGuard)
   - Controle de acesso por perfil (RolesGuard + @Roles decorator)
   - HTTPS em produção
   - Rate limiting em endpoints públicos

4. **Logging apropriado**
   ```typescript
   // ✅ CORRETO: Log sem dados sensíveis
   logger.log('User logged in', { userId: user.id });
   
   // ❌ ERRADO: Log com dados sensíveis
   logger.log('User logged in', { password: user.password });
   ```

5. **Variáveis de Ambiente**
   - Criar `.env.example` com placeholders
   - Validar vars na inicialização
   - Nunca hardcode secrets

### Variáveis de Ambiente Necessárias

```bash
# .env.example

# Backend
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=myapp_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-this
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=MyApp
```

---

## 💡 Instruções Específicas para Claude

### Ao gerar código, SEMPRE:

1. **Use TypeScript strict**
   - Nunca use `any` - sempre defina tipos específicos
   - Interfaces para objetos complexos
   - Enums para valores fixos
   - Genéricos quando apropriado

2. **Inclua tipos/interfaces**
   ```typescript
   // ✅ SEMPRE assim
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   const getUser = async (id: string): Promise<User> => {
     // ...
   };
   
   // ❌ NUNCA assim
   const getUser = async (id) => {
     // ...
   };
   ```

3. **Siga a estrutura de pastas**
   - Componentes em `/components`
   - Páginas em `/pages`
   - Services em `/services`
   - Types em `/types`

4. **Adicione comentários apenas quando necessário**
   ```typescript
   // ✅ Bom: explica lógica complexa
   // Calcula hash usando salt rounds de 10 para melhor performance
   const hash = await bcrypt.hash(password, 10);
   
   // ❌ Ruim: comenta o óbvio
   // Define a variável name
   const name = 'John';
   ```

5. **Implemente tratamento de erros**
   - Try-catch em operações async
   - Validação de entrada
   - Mensagens de erro úteis
   - Never fail silently

6. **Gere testes junto com código**
   - Teste unitário para cada service/função
   - Teste de componente para React
   - Coverage mínimo: 80%

7. **Use async/await** (não .then/.catch)
   ```typescript
   // ✅ CORRETO
   const user = await userService.getById(id);
   
   // ❌ EVITAR
   userService.getById(id).then(user => { });
   ```

8. **Prefira composição sobre herança**
   - Functional components com hooks
   - Composition pattern para reutilização

9. **Funções pequenas e focadas**
   - Uma responsabilidade por função
   - Máximo ~20-30 linhas
   - Nomes descritivos

10. **Valide SEMPRE dados de entrada**
    ```typescript
    // Backend
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // Frontend
    const schema = z.object({
      email: z.string().email(),
    });
    ```

11. **Implemente paginação em todas as tabelas**
    - Máximo de **10 itens por página** na interface
    - Carregar do backend em lotes de **200 registros**
    - Carregar mais 200 quando necessário (carregamento incremental)
    - Componente de paginação com: Primeira, Anterior, Próxima, Última
    - Indicador de "Exibindo X a Y de Z registros"

12. **Use mensagens em português**
    - Todas as mensagens de erro, validação e feedback em português brasileiro
    - Traduzir mensagens padrão do class-validator
    - Textos de interface (labels, botões, placeholders) em português

### Ao sugerir mudanças:

1. **Explique o porquê**
   ```
   Vou mudar de useState para useReducer porque:
   - Estado complexo com múltiplas sub-values
   - Lógica de atualização complexa
   - Facilita testes
   ```

2. **Mostre antes/depois se relevante**
   ```typescript
   // Antes
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   
   // Depois
   const [state, dispatch] = useReducer(userReducer, initialState);
   ```

3. **Indique side effects**
   ```
   ⚠️ Esta mudança requer:
   - Executar migration: npm run migration:run
   - Atualizar seed scripts
   - Modificar testes relacionados
   ```

4. **Sugira testes**
   ```
   Para validar esta mudança:
   - Teste que user não autenticado é redirecionado
   - Teste que token expirado é renovado
   - Teste de integração do fluxo completo
   ```

### Padrões de Resposta

Quando eu pedir para criar algo:

1. **Confirme o entendimento**
   ```
   Vou criar um módulo de Posts com:
   - Entity Post (título, conteúdo, autor)
   - CRUD completo no backend
   - Interface no frontend
   - Testes unitários
   
   Está correto?
   ```

2. **Liste os arquivos que serão criados/modificados**
   ```
   Arquivos a criar:
   - backend/src/modules/posts/posts.entity.ts
   - backend/src/modules/posts/posts.service.ts
   - backend/src/modules/posts/posts.controller.ts
   - backend/src/modules/posts/dto/create-post.dto.ts
   - frontend/src/pages/posts/PostsPage.tsx
   - frontend/src/services/posts.service.ts
   ```

3. **Gere código completo e funcional**
   - Não use placeholders ou "// TODO"
   - Código pronto para executar
   - Com imports corretos
   - Com tratamento de erros

4. **Indique próximos passos**
   ```
   Próximos passos:
   1. Gerar migration: npm run migration:generate -- -n CreatePosts
   2. Executar migration: npm run migration:run
   3. Testar endpoints: npm run test:e2e
   4. Verificar UI: npm run dev
   ```

---

## 🔗 Recursos e Documentação

### Documentação Oficial
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NestJS**: https://docs.nestjs.com
- **TypeORM**: https://typeorm.io
- **PostgreSQL**: https://www.postgresql.org/docs

### Bibliotecas Principais
- **React Router**: https://reactrouter.com
- **Zustand**: https://zustand-demo.pmnd.rs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Axios**: https://axios-http.com
- **TanStack Query**: https://tanstack.com/query

### UI & Styling
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Radix UI**: https://www.radix-ui.com

### Testing
- **Vitest**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **Jest**: https://jestjs.io
- **Supertest**: https://github.com/ladjs/supertest

### Tools
- **Docker**: https://docs.docker.com
- **PostgreSQL Admin**: pgAdmin / DBeaver
- **API Testing**: Postman / Insomnia / Thunder Client
- **Swagger UI**: http://localhost:3000/api (em desenvolvimento)

---

## ✅ Code Review Checklist

Antes de commitar, verificar:

- [ ] **Código**
  - [ ] TypeScript sem erros (`npm run type-check`)
  - [ ] Sem `any` types
  - [ ] Sem `console.log` ou `debugger`
  - [ ] Sem código comentado
  - [ ] Imports otimizados

- [ ] **Qualidade**
  - [ ] ESLint passou (`npm run lint`)
  - [ ] Prettier aplicado (`npm run format`)
  - [ ] Testes passam (`npm run test`)
  - [ ] Coverage adequado (>80%)

- [ ] **Funcionalidade**
  - [ ] Feature funciona como esperado
  - [ ] Tratamento de erros implementado
  - [ ] Validação de dados presente
  - [ ] Loading states implementados
  - [ ] Mensagens de feedback ao usuário

- [ ] **Database** (se aplicável)
  - [ ] Migration criada
  - [ ] Migration testada
  - [ ] Seed atualizado
  - [ ] Índices criados quando necessário

- [ ] **Documentação**
  - [ ] README atualizado (se necessário)
  - [ ] Swagger/JSDoc atualizado
  - [ ] CHANGELOG atualizado
  - [ ] Variáveis de ambiente documentadas

- [ ] **Git**
  - [ ] Mensagem de commit descritiva
  - [ ] Branch nomeada corretamente
  - [ ] Sem arquivos desnecessários
  - [ ] `.env` não commitado

---

## 🎓 Exemplos de Uso

### Criar novo módulo completo

```bash
> Crie um módulo de Posts com:
> - Backend: Entity, Service, Controller, DTOs
> - Relacionamento com User (autor)
> - Endpoints CRUD protegidos
> - Frontend: Página de lista e formulário
> - Testes unitários
```

### Adicionar feature específica

```bash
> Adicione paginação na listagem de posts:
> - Backend: query params page/limit
> - Frontend: componente de paginação
> - Manter no padrão do projeto
```

### Debug e correção

```bash
> Estou recebendo erro 401 no login.
> Verifique o fluxo de autenticação e corrija
```

### Refatoração

```bash
> Refatore o UserService para usar repository patterns
> Mantenha todos os testes passando
```

---

## 📝 Notas Finais

Este CLAUDE.md deve evoluir com o projeto. Use a tecla `#` durante conversas com Claude para adicionar instruções que você se pega repetindo.

**Mantenha este arquivo:**
- ✅ Conciso (< 300 linhas idealmente)
- ✅ Atualizado
- ✅ Focado no essencial
- ✅ Com exemplos práticos

**Este arquivo define:**
- Stack completa
- Estrutura de pastas
- Convenções de código
- Comandos principais
- Padrões de segurança
- Como Claude deve se comportar

Qualquer dúvida, consulte este arquivo primeiro! NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}

// ✅ CORRETO: DTOs com validação
export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}

// ✅ CORRETO: Entity com TypeORM
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Formatação

```typescript
// Configuração Prettier (já aplicada)
{
  "semi": true,              // Sempre usar ponto e vírgula
  "singleQuote": true,       // Aspas simples
  "tabWidth": 2,             // 2 espaços de indentação
  "trailingComma": "all",    // Vírgula trailing sempre
  "printWidth": 100,         // Max 100 caracteres por linha
  "arrowParens": "always"    // Parênteses em arrow functions
}
```

### Imports

```typescript
// ✅ CORRETO: Imports ordenados e agrupados
// 1. Bibliotecas externas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 2. Aliases internos
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Relativos
import { UserCard } from './UserCard';
import type { IUser } from './types';

// ❌ EVITAR: Imports misturados
import { UserCard } from './UserCard';
import React from 'react';
import { Button } from '@/components/ui/button';
```

---

## 🔧 Comandos Principais

### Setup Inicial

```bash
# Clone ou crie o projeto
git clone <repository-url>
cd projeto-fullstack

# Copiar .env.example
cp .env.example .env
# Editar .env com suas configurações

# Instalar dependências
npm run install:all
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm install              # Instalar dependências
npm run dev             # Dev server → http://localhost:5173
npm run dev:host        # Dev server acessível na rede

# Build
npm run build           # Build de produção → /dist
npm run preview         # Preview do build

# Qualidade de código
npm run lint            # ESLint check
npm run lint:fix        # ESLint fix automático
npm run format          # Prettier format
npm run format:check    # Prettier check
npm run type-check      # TypeScript validation

# Testes
npm run test            # Run tests com Vitest
npm run test:ui         # Vitest UI
npm run test:coverage   # Coverage report
```

### Backend

```bash
cd backend

# Desenvolvimento
npm install             # Instalar dependências
npm run start:dev       # Dev mode com watch → http://localhost:3000
npm run start:debug     # Debug mode

# Build
npm run build           # Build de produção → /dist
npm run start:prod      # Rodar produção

# Database
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
npm run seed            # Popular banco com dados

# Qualidade de código
npm run lint            # ESLint check
npm run lint:fix        # ESLint fix automático
npm run format          # Prettier format

# Testes
npm run test            # Unit tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage
npm run test:e2e        # E2E tests
```

### Docker (Recomendado)

```bash
# Subir toda a stack (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Ver logs
docker-compose logs -f
docker-compose logs -f backend    # Logs específicos

# Parar
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados do DB)
docker-compose down -v

# Rebuild
docker-compose up -d --build

# Executar comandos no container
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed
```

### Utilitários

```bash
# Instalar dependências em ambos (root)
npm run install:all

# Limpar node_modules
npm run clean

# Rodar linter em tudo
npm run lint:all
```

---

## 🧪 Testes

### Frontend - Vitest + React Testing Library

```typescript
// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProfile } from './UserProfile';
import * as userService from '@/services/user.service';

describe('UserProfile', () => {
  it('should render user name when data is loaded', async () => {
    // Mock do service
    vi.spyOn(userService, 'getById').mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });

    render(<UserProfile userId="1" />);

    // Espera loading desaparecer
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verifica se nome aparece
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('should show error when user not found', async () => {
    vi.spyOn(userService, 'getById').mockRejectedValue(
      new Error('User not found')
    );

    render(<UserProfile userId="999" />);

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});
```

**Executar testes:**
```bash
cd frontend
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # Com coverage
```

### Backend - Jest + Supertest

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      jest.spyOn(repository, 'save').mockResolvedValue({
        id: '1',
        ...createUserDto,
      } as User);

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw error if email already exists', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue({
        code: '23505', // Unique violation
      });

      await expect(
        service.create({ 
          email: 'existing@example.com',
          name: 'Test',
          password: 'pass'
        })
      ).rejects.toThrow();
    });
  });
});

// users.controller.e2e-spec.ts (E2E)
describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) should create a user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });
});
```

**Executar testes:**
```bash
cd backend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Com coverage
npm run test:e2e          # E2E tests
```

---

## 🔒 Segurança & Autenticação

### Backend - JWT Authentication

```typescript
// ✅ Pattern de autenticação
// 1. Hash de senha com bcrypt
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async comparePasswords(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// 2. Gerar JWT token
import { JwtService } from '@nestjs/jwt';

async generateTokens(user: User) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  
  return {
    accessToken: await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    }),
    refreshToken: await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    }),
  };
}

// 3. Proteger rotas com Guards
@Controller('users')
@UseGuards(JwtAuthGuard)  // ← Protege todo o controller
export class UsersController {
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
  
  @Post()
  @Roles(UserRole.ADMIN)  // ← Só admin pode criar
  @UseGuards(RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// 4. SEMPRE validar entrada
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;
}
```

### Frontend - Auth Pattern

```typescript
// ✅ Axios interceptor para adicionar token
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - renova token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, redirecionar para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ✅ Protected Route component
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole 
}) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// ✅ Uso nas rotas
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

---

## 📊 Database

### TypeORM Patterns

```typescript
// ✅ SEMPRE usar migrations para mudanças no schema
// Nunca alterar diretamente em produção!

// Gerar migration
npm run migration:generate -- -n CreateUsersTable

// Executar migrations
npm run migration:run

// Reverter última migration
npm run migration:revert

// ✅ Entity com relacionamentos
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })  // Não retorna em queries normais
  password: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })  // Soft delete
  deletedAt?: Date;
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { 
    onDelete: 'CASCADE'  // Deleta posts quando user for deletado
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ✅ Repository patterns no Service
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Busca simples
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id } 
    });
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }

  // Busca com relacionamentos
  async findWithPosts(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  // Paginação
  async findAll(page: number = 1, limit: number = 10) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // Soft delete
  async remove(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
```

### Seeds (Popular DB)

```typescript
// src/database/seeds/user.seed.ts
import { DataSource } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    },
    {
      email: 'user@example.com',
      name: 'Regular User',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
    },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOne({ 
      where: { email: userData.email } 
    });
    
    if (!exists) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✓ Created user: ${user.email}`);
    }
  }
}
```

---

## 🎯 Padrões de Erro

### Backend - Exception Handling

```typescript
// ✅ Usar built-in exceptions do NestJS
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid email format');
throw new UnauthorizedException('Invalid credentials');
throw new