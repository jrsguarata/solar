# Arquitetura MCP - Frontend Solar

## 📐 Visão Geral

O frontend foi reestruturado seguindo a arquitetura **MCP (Model-Controller-Presenter)** com **Axios** para comunicação HTTP.

**Data de Implementação**: 22/12/2025

---

## 🏗️ Estrutura MCP

### **M - Model** (Camada de Dados)
Definições de tipos e interfaces TypeScript

### **C - Controller** (Camada de Comunicação)
Services que fazem chamadas HTTP com Axios

### **P - Presenter** (Camada de Lógica)
Custom hooks React que encapsulam lógica de negócio

---

## 📁 Estrutura de Diretórios

```
frontend/src/
├── models/                    # M - Model (Interfaces TypeScript)
│   ├── User.ts               # Interface User, UserRole enum
│   ├── Auth.ts               # LoginDto, LoginResponse, etc
│   ├── Company.ts            # Interface Company
│   ├── Distributor.ts        # Interface Distributor
│   ├── Contact.ts            # Interface Contact, ContactStatus enum
│   └── index.ts              # Export centralizado
│
├── services/                  # C - Controller (Comunicação HTTP)
│   ├── api.ts                # Configuração Axios + Interceptors
│   ├── auth.service.ts       # AuthService (login, logout, etc)
│   ├── user.service.ts       # UserService (CRUD usuários)
│   ├── company.service.ts    # CompanyService (CRUD empresas)
│   ├── distributor.service.ts # DistributorService (CRUD distribuidoras)
│   ├── contact.service.ts    # ContactService (criar contato)
│   └── index.ts              # Export centralizado
│
├── presenters/                # P - Presenter (Lógica de Negócio)
│   ├── useAuth.ts            # Hook de autenticação
│   ├── useDistributors.ts    # Hook para distribuidoras
│   ├── useContact.ts         # Hook para formulário de contato
│   └── index.ts              # Export centralizado
│
├── components/                # View (Componentes UI)
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ContactForm.tsx       # ✅ Usa MCP
│   └── ...
│
└── pages/                     # Pages
    ├── Home.tsx
    └── Login.tsx             # ✅ Usa MCP
```

---

## 🔧 Camada M - Models

### Exemplo: `models/Contact.ts`

```typescript
export enum ContactStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  RESOLVED = 'RESOLVED',
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  distributorId?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  company?: string;
  distributorId?: string;
  message: string;
}
```

**Responsabilidade**: Definir a estrutura dos dados (interfaces, types, enums)

---

## 🌐 Camada C - Services (Controllers)

### Exemplo: `services/contact.service.ts`

```typescript
import api from './api';
import type { Contact, CreateContactDto } from '../models';

class ContactService {
  async create(contactData: CreateContactDto): Promise<Contact> {
    const { data } = await api.post<Contact>('/contacts', contactData);
    return data;
  }

  async getAll(): Promise<Contact[]> {
    const { data } = await api.get<Contact[]>('/contacts');
    return data;
  }
}

export default new ContactService();
```

**Responsabilidade**: Comunicação HTTP com backend via Axios

### Configuração Axios: `services/api.ts`

```typescript
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Adiciona token JWT automaticamente
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Renova token quando expirado (401)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Features**:
- ✅ Adiciona token JWT automaticamente
- ✅ Renova token automaticamente quando expira (401)
- ✅ Redireciona para login se refresh falhar
- ✅ Timeout de 30 segundos
- ✅ Tipagem TypeScript completa

---

## 🎯 Camada P - Presenters

### Exemplo: `presenters/useContact.ts`

```typescript
import { useState } from 'react';
import { contactService, getErrorMessage } from '../services';
import type { CreateContactDto, Contact } from '../models';

interface UseContactReturn {
  submitContact: (contactData: CreateContactDto) => Promise<Contact>;
  loading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export function useContact(): UseContactReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContact = async (contactData: CreateContactDto): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await contactService.create(contactData);
      setSuccess(true);

      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { submitContact, loading, error, success, resetState };
}
```

**Responsabilidade**:
- Encapsular lógica de negócio
- Gerenciar estado (loading, error, success)
- Prover interface simples para componentes

---

## 🖼️ Camada V - View (Componentes)

### Exemplo: `components/ContactForm.tsx` (ANTES vs DEPOIS)

#### ❌ ANTES (Fetch direto)

```typescript
export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      // ...
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
}
```

#### ✅ DEPOIS (Arquitetura MCP)

```typescript
import { useDistributors, useContact } from '../presenters';

export function ContactForm() {
  // Usar presenters
  const { distributors, loading: loadingDistributors } = useDistributors();
  const { submitContact, loading, error } = useContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Erro:', err);
    }
  };
}
```

**Benefícios**:
- ✅ Código mais limpo e legível
- ✅ Lógica reutilizável (hooks)
- ✅ Fácil de testar
- ✅ Separação de responsabilidades

---

## 🔄 Fluxo de Dados MCP

```
┌─────────────────────────────────────────────────────────┐
│                    VIEW (Component)                      │
│  ContactForm.tsx                                         │
│  - Renderiza UI                                          │
│  - Captura eventos do usuário                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ useContact()
                 │ useDistributors()
                 ▼
┌─────────────────────────────────────────────────────────┐
│               PRESENTER (Custom Hook)                    │
│  useContact.ts                                           │
│  - Gerencia estado (loading, error)                      │
│  - Encapsula lógica de negócio                           │
│  - Chama services                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ submitContact(data)
                 ▼
┌─────────────────────────────────────────────────────────┐
│            CONTROLLER (Service)                          │
│  contact.service.ts                                      │
│  - Faz chamada HTTP com Axios                            │
│  - Trata resposta                                        │
│  - Retorna dados tipados                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ api.post('/contacts', data)
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    MODEL (Interface)                     │
│  Contact.ts                                              │
│  - Define estrutura dos dados                            │
│  - Garante type-safety                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Comparação: Fetch vs MCP + Axios

| Aspecto | Fetch (Antes) | MCP + Axios (Agora) |
|---------|---------------|---------------------|
| **Type Safety** | ❌ Manual | ✅ Automático |
| **Interceptors** | ❌ Não | ✅ Sim (token, refresh) |
| **Reusabilidade** | ❌ Baixa | ✅ Alta |
| **Testabilidade** | ❌ Difícil | ✅ Fácil |
| **Error Handling** | ❌ Manual | ✅ Centralizado |
| **Loading State** | ❌ Repetitivo | ✅ Encapsulado |
| **Timeout** | ❌ Manual | ✅ Configurado |

---

## 🎨 Padrões de Uso

### 1. Usar Presenter em Componente

```typescript
import { useDistributors } from '../presenters';

function MyComponent() {
  const { distributors, loading, error, refetch } = useDistributors();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {distributors.map(d => <div key={d.id}>{d.name}</div>)}
    </div>
  );
}
```

### 2. Chamar Service Diretamente (quando não precisa de estado)

```typescript
import { distributorService } from '../services';

async function handleDelete(id: string) {
  try {
    await distributorService.delete(id);
    alert('Removido com sucesso!');
  } catch (err) {
    alert('Erro ao remover');
  }
}
```

### 3. Usar Models para Tipagem

```typescript
import type { Distributor, CreateDistributorDto } from '../models';

function DistributorForm() {
  const [formData, setFormData] = useState<CreateDistributorDto>({
    name: '',
    code: '',
    uf: '',
  });

  // TypeScript garante que formData tem a estrutura correta
}
```

---

## ✅ Vantagens da Arquitetura MCP

### **1. Separação de Responsabilidades**
- **Models**: Só definem dados
- **Services**: Só fazem HTTP
- **Presenters**: Só gerenciam lógica
- **Components**: Só renderizam UI

### **2. Reusabilidade**
```typescript
// Mesmo hook usado em múltiplos componentes
import { useDistributors } from '../presenters';

// Em ContactForm
const { distributors } = useDistributors();

// Em DistributorList
const { distributors, loading, error } = useDistributors();

// Em DistributorSelect
const { distributors, refetch } = useDistributors();
```

### **3. Testabilidade**
```typescript
// Testar service isoladamente
import { contactService } from '../services';

test('should create contact', async () => {
  const contact = await contactService.create(mockData);
  expect(contact.id).toBeDefined();
});

// Testar presenter isoladamente
import { renderHook } from '@testing-library/react-hooks';
import { useContact } from '../presenters';

test('should manage loading state', async () => {
  const { result } = renderHook(() => useContact());
  expect(result.current.loading).toBe(false);
});
```

### **4. Manutenibilidade**
- Mudanças na API: alterar apenas Services
- Mudanças na lógica: alterar apenas Presenters
- Mudanças no tipo: alterar apenas Models
- Componentes permanecem intactos

### **5. Type Safety**
```typescript
// TypeScript garante type-safety em toda a cadeia
const contact: Contact = await contactService.create(data);
//    ^^^^^^^                                        ^^^^
//    Tipo garantido                                Tipo validado
```

---

## 🔐 Segurança

### Autenticação Automática
O interceptor do Axios adiciona o token JWT automaticamente:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Renovação Automática de Token
Quando o token expira (401), o sistema renova automaticamente:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Renova token
      const { data } = await axios.post('/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);

      // Refaz requisição original
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 📝 Próximos Passos

### Implementações Futuras

1. **Context API** para estado global
   ```typescript
   <AuthProvider>
     <App />
   </AuthProvider>
   ```

2. **React Query** para cache de dados
   ```typescript
   const { data, isLoading } = useQuery(['distributors'],
     () => distributorService.getAll()
   );
   ```

3. **Error Boundary** para capturar erros
   ```typescript
   <ErrorBoundary fallback={<ErrorPage />}>
     <App />
   </ErrorBoundary>
   ```

4. **Loading Suspense** para carregamento
   ```typescript
   <Suspense fallback={<Loading />}>
     <ContactForm />
   </Suspense>
   ```

---

## 📚 Referências

- **Axios**: https://axios-http.com
- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org
- **MCP Pattern**: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter

---

## 🎯 Resumo

A arquitetura MCP + Axios traz:

- ✅ **Organização** clara do código
- ✅ **Type safety** com TypeScript
- ✅ **Reutilização** de lógica
- ✅ **Testabilidade** facilitada
- ✅ **Manutenibilidade** a longo prazo
- ✅ **Interceptors** para token JWT
- ✅ **Error handling** centralizado

**Data**: 22/12/2025
**Status**: ✅ Implementado e Testado
