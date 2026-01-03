# Sistema de Propostas Comerciais

## 📋 Visão Geral

Sistema completo para gerenciar propostas comerciais enviadas aos prospects, com versionamento automático, armazenamento de documentos e rastreabilidade total.

---

## 🎯 Funcionalidades

### ✅ Implementado

- [x] **Versionamento Automático**: Cada nova proposta incrementa a versão (v1, v2, v3...)
- [x] **Upload de Arquivos**: Suporte a PDF, DOCX e DOC (máx 10MB)
- [x] **Armazenamento Organizado**: `documents/proposals/{contact-id}/v{version}-{filename}.pdf`
- [x] **Múltiplas Propostas**: Possibilidade de enviar várias versões para o mesmo prospect
- [x] **Rastreabilidade**: Registro de quem enviou, quando e quais valores propostos
- [x] **Download de Propostas**: Endpoint para baixar qualquer versão anterior
- [x] **Validações**: Tamanho máximo, tipos permitidos, status do contato

---

## 📊 Estrutura de Dados

### Tabela: `contact_proposals`

```sql
CREATE TABLE contact_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  quota_kwh DECIMAL(10,2) NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  monthly_savings DECIMAL(10,2),
  file_path VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  notes TEXT,
  sent_at TIMESTAMP DEFAULT now() NOT NULL,
  sent_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_contact_proposals_contact_id ON contact_proposals(contact_id);
CREATE INDEX idx_contact_proposals_version ON contact_proposals(contact_id, version DESC);
```

### Entity: `ContactProposal`

```typescript
@Entity('contact_proposals')
export class ContactProposal {
  id: string;                   // UUID
  contactId: string;            // FK para contacts
  contact: Contact;             // Relacionamento
  version: number;              // Incrementa automaticamente
  quotaKwh: number;             // Cota proposta (kWh/mês)
  monthlyValue: number;         // Valor mensal (R$)
  monthlySavings?: number;      // Economia estimada (R$)
  filePath: string;             // Caminho do arquivo
  fileName: string;             // Nome original
  fileSize: number;             // Tamanho em bytes
  mimeType: string;             // Tipo MIME
  notes?: string;               // Observações
  sentAt: Date;                 // Data/hora de envio
  sentBy: string;               // FK para users
  sentByUser: User;             // Quem enviou
}
```

---

## 🔌 API Endpoints

### 1. Enviar Nova Proposta

**POST** `/api/v1/contacts/:contactId/proposals`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** (multipart/form-data):
```typescript
{
  quotaKwh: 400,                    // number (obrigatório)
  monthlyValue: 280.00,             // number (obrigatório)
  monthlySavings: 70.00,            // number (opcional)
  notes: "Proposta com desconto",   // string (opcional)
  file: File                        // arquivo (obrigatório)
}
```

**Validações**:
- ✅ Contato deve existir
- ✅ Contato deve ter status SUSPECT ou PROSPECT
- ✅ Arquivo é obrigatório
- ✅ Tamanho máximo: 10MB
- ✅ Tipos aceitos: PDF, DOCX, DOC
- ✅ Apenas ADMIN ou COADMIN podem enviar

**Response** (201 Created):
```json
{
  "id": "uuid-da-proposta",
  "contactId": "uuid-do-contato",
  "version": 1,
  "quotaKwh": 400,
  "monthlyValue": 280.00,
  "monthlySavings": 70.00,
  "filePath": "documents/proposals/contact-uuid/v1-proposta-comercial.pdf",
  "fileName": "proposta-comercial.pdf",
  "fileSize": 245760,
  "mimeType": "application/pdf",
  "notes": "Proposta com desconto",
  "sentAt": "2026-01-03T14:30:00Z",
  "sentBy": "user-uuid",
  "sentByUser": {
    "id": "user-uuid",
    "name": "Maria Santos"
  }
}
```

---

### 2. Listar Propostas de um Contato

**GET** `/api/v1/contacts/:contactId/proposals`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid-v2",
    "version": 2,
    "quotaKwh": 450,
    "monthlyValue": 300.00,
    "monthlySavings": 80.00,
    "fileName": "proposta-revisada.pdf",
    "fileSize": 289034,
    "notes": "Proposta revisada com aumento de cota",
    "sentAt": "2026-01-05T10:15:00Z",
    "sentByUser": {
      "name": "Maria Santos"
    }
  },
  {
    "id": "uuid-v1",
    "version": 1,
    "quotaKwh": 400,
    "monthlyValue": 280.00,
    "monthlySavings": 70.00,
    "fileName": "proposta-comercial.pdf",
    "fileSize": 245760,
    "notes": "Primeira proposta",
    "sentAt": "2026-01-03T14:30:00Z",
    "sentByUser": {
      "name": "João Silva"
    }
  }
]
```

---

### 3. Buscar Última Proposta

**GET** `/api/v1/contacts/:contactId/proposals/latest`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "uuid-v2",
  "version": 2,
  "quotaKwh": 450,
  "monthlyValue": 300.00,
  "monthlySavings": 80.00,
  "fileName": "proposta-revisada.pdf",
  "sentAt": "2026-01-05T10:15:00Z",
  "sentByUser": {
    "name": "Maria Santos"
  }
}
```

---

### 4. Buscar Proposta Específica

**GET** `/api/v1/contacts/:contactId/proposals/:id`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "uuid-da-proposta",
  "contactId": "uuid-do-contato",
  "version": 1,
  "quotaKwh": 400,
  "monthlyValue": 280.00,
  "filePath": "documents/proposals/contact-uuid/v1-proposta-comercial.pdf",
  "fileName": "proposta-comercial.pdf",
  "fileSize": 245760,
  "sentAt": "2026-01-03T14:30:00Z",
  "sentByUser": {
    "id": "user-uuid",
    "name": "Maria Santos"
  },
  "contact": {
    "id": "uuid-do-contato",
    "name": "João Silva",
    "status": "PROSPECT"
  }
}
```

---

### 5. Baixar Arquivo da Proposta

**GET** `/api/v1/contacts/:contactId/proposals/:id/download`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
- Content-Type: `application/pdf` (ou `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Content-Disposition: `attachment; filename="proposta-comercial.pdf"`
- Body: Stream do arquivo

**Uso no Frontend**:
```typescript
// Download automático
const downloadProposal = async (proposalId: string) => {
  const response = await api.get(
    `/contacts/${contactId}/proposals/${proposalId}/download`,
    { responseType: 'blob' }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'proposta.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
```

---

### 6. Excluir Proposta (ADMIN apenas)

**DELETE** `/api/v1/contacts/:contactId/proposals/:id`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Proposta excluída com sucesso"
}
```

**Efeitos**:
- Exclui registro do banco de dados
- Exclui arquivo do sistema de arquivos

---

## 🎭 Fluxo Completo de Uso

### Cenário: Enviar Proposta para Prospect

**Dia 1 - 10:00**: COADMIN qualifica lead como PROSPECT

```
Lead: João Silva
Status: SUSPECT → PROSPECT
Distribuidora: CPFL Paulista
Consumo: 450 kWh/mês
```

---

**Dia 1 - 14:00**: COADMIN envia primeira proposta

```
Frontend:
- Acessa modal "Enviar Proposta"
- Preenche formulário:
  - Cota: 400 kWh/mês
  - Valor Mensal: R$ 280,00
  - Economia: R$ 70,00
  - Arquivo: proposta-comercial-joao-silva.pdf (1.2MB)
  - Observações: "Primeira proposta com valores padrão"
- Clica "Enviar Proposta"

Backend:
- Valida arquivo (tamanho, tipo)
- Verifica se contato é PROSPECT ✅
- Calcula versão: v1 (primeira proposta)
- Salva arquivo em: documents/proposals/{contact-id}/v1-proposta-comercial-joao-silva.pdf
- Cria registro no banco
- Retorna proposta criada

Resultado:
✅ Proposta v1 enviada
📄 Arquivo salvo
📧 (Futuro) Email automático para João Silva
```

---

**Dia 3 - 16:00**: Cliente solicita revisão de valores

```
COADMIN adiciona nota no contato:
"Cliente solicitou aumento de cota para 450 kWh/mês"
```

---

**Dia 4 - 10:00**: COADMIN envia proposta revisada

```
Frontend:
- Acessa modal "Enviar Proposta"
- Vê aviso: "Este prospect já possui 1 proposta(s) enviada(s)"
- Preenche nova proposta:
  - Cota: 450 kWh/mês (aumentou)
  - Valor Mensal: R$ 320,00 (aumentou)
  - Economia: R$ 90,00 (maior economia)
  - Arquivo: proposta-revisada-450kwh.pdf (980KB)
  - Observações: "Proposta revisada conforme solicitação - cota 450 kWh"
- Clica "Enviar Proposta"

Backend:
- Busca última versão: v1
- Calcula próxima versão: v2
- Salva arquivo em: documents/proposals/{contact-id}/v2-proposta-revisada-450kwh.pdf
- Cria registro no banco
- Retorna proposta criada

Resultado:
✅ Proposta v2 enviada
📄 Arquivo salvo (v1 mantido intacto)
📧 (Futuro) Email para João Silva
```

---

**Dia 6 - 11:00**: Cliente aceita proposta v2

```
COADMIN:
- Adiciona nota: "Cliente aceitou proposta v2 (450 kWh @ R$ 320/mês)"
- Muda status: PROSPECT → CLIENTE (futuro)
```

---

**Dia 30 - Auditoria**: ADMIN revisa todas as propostas

```
GET /contacts/{contact-id}/proposals

Retorna:
[
  { version: 2, quotaKwh: 450, monthlyValue: 320, sentAt: "2026-01-06" },
  { version: 1, quotaKwh: 400, monthlyValue: 280, sentAt: "2026-01-03" }
]

ADMIN pode:
- Ver histórico completo de propostas
- Baixar qualquer versão
- Comparar valores entre versões
- Auditar quem enviou cada proposta
```

---

## 📁 Estrutura de Arquivos

```
backend/
├── documents/
│   └── proposals/
│       ├── {contact-uuid-1}/
│       │   ├── v1-proposta-comercial.pdf
│       │   ├── v2-proposta-revisada.pdf
│       │   └── v3-proposta-final.pdf
│       │
│       ├── {contact-uuid-2}/
│       │   ├── v1-proposta-inicial.docx
│       │   └── v2-proposta-ajustada.pdf
│       │
│       └── .gitkeep
│
└── .gitignore
    # Ignora PDFs/DOCXs mas mantém estrutura:
    documents/proposals/**/*.pdf
    documents/proposals/**/*.docx
    !documents/proposals/.gitkeep
```

---

## 🔐 Permissões

| Ação | ADMIN | COADMIN | OPERATOR | USER |
|------|-------|---------|----------|------|
| **Enviar Proposta** | ✅ | ✅ | ❌ | ❌ |
| **Listar Propostas** | ✅ | ✅ | ✅ | ❌ |
| **Baixar Proposta** | ✅ | ✅ | ✅ | ❌ |
| **Excluir Proposta** | ✅ | ❌ | ❌ | ❌ |

---

## ✅ Validações

### Upload de Arquivo

**Tamanho Máximo**: 10MB
```typescript
if (file.size > 10 * 1024 * 1024) {
  throw new BadRequestException('Arquivo muito grande. Máximo: 10MB');
}
```

**Tipos Aceitos**:
- `application/pdf` (PDF)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
- `application/msword` (DOC)

```typescript
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];
```

### Status do Contato

Propostas só podem ser enviadas para contatos com status:
- ✅ `SUSPECT`
- ✅ `PROSPECT`

```typescript
if (contact.status !== 'SUSPECT' && contact.status !== 'PROSPECT') {
  throw new BadRequestException(
    'Propostas só podem ser enviadas para contatos SUSPECT ou PROSPECT'
  );
}
```

---

## 📊 Métricas e Analytics (Futuro)

### Dashboards Sugeridos

**Por Vendedor**:
- Quantidade de propostas enviadas
- Taxa de conversão (propostas → clientes)
- Tempo médio entre propostas
- Versões médias até fechamento

**Por Prospect**:
- Quantidade de propostas recebidas
- Variação de valores entre versões
- Tempo médio de resposta
- Taxa de aceitação por versão (v1, v2, v3+)

**Geral**:
- Total de propostas no período
- Tamanho médio de arquivos
- Tipos de arquivo mais usados (PDF vs. DOCX)
- Propostas em aberto vs. aceitas

---

## 🚀 Melhorias Futuras

### Sprint 7: Automações
- [ ] Email automático ao enviar proposta
- [ ] Template de proposta (geração automática de PDF)
- [ ] Alerta após X dias sem resposta
- [ ] Lembrete para follow-up

### Sprint 8: Assinatura Eletrônica
- [ ] Integração com Clicksign/Docusign
- [ ] Envio de proposta direto para assinatura
- [ ] Status: `ENVIADA`, `VISUALIZADA`, `ASSINADA`
- [ ] Notificação quando cliente visualizar
- [ ] Armazenamento de proposta assinada

### Sprint 9: Analytics Avançado
- [ ] Comparador de propostas (v1 vs v2 vs v3)
- [ ] Dashboard de performance
- [ ] Previsão de conversão baseado em histórico
- [ ] Alertas de propostas atrasadas

### Sprint 10: Templates e Geração
- [ ] Sistema de templates de proposta
- [ ] Geração automática de PDF
- [ ] Inserção de dados dinâmicos (nome, valores, cooperativa)
- [ ] Personalização por empresa/partner

---

## 📝 Exemplo de Uso no Frontend

### Upload de Proposta

```typescript
// components/modals/SendProposalModal.tsx
import { useState } from 'react';
import { Upload } from 'lucide-react';

interface SendProposalModalProps {
  contactId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendProposalModal({ contactId, onClose, onSuccess }: SendProposalModalProps) {
  const [formData, setFormData] = useState({
    quotaKwh: '',
    monthlyValue: '',
    monthlySavings: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('quotaKwh', formData.quotaKwh);
      formDataObj.append('monthlyValue', formData.monthlyValue);
      if (formData.monthlySavings) {
        formDataObj.append('monthlySavings', formData.monthlySavings);
      }
      if (formData.notes) {
        formDataObj.append('notes', formData.notes);
      }
      if (file) {
        formDataObj.append('file', file);
      }

      await api.post(`/contacts/${contactId}/proposals`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Proposta enviada com sucesso!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar proposta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Enviar Proposta Comercial</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cota (kWh/mês) *
              </label>
              <input
                type="number"
                value={formData.quotaKwh}
                onChange={(e) => setFormData({ ...formData, quotaKwh: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Valor Mensal (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyValue}
                onChange={(e) => setFormData({ ...formData, monthlyValue: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Economia Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlySavings}
                onChange={(e) => setFormData({ ...formData, monthlySavings: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Arquivo da Proposta * (PDF, DOCX ou DOC - máx 10MB)
              </label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer text-blue-600">
                  {file ? file.name : 'Clique para selecionar arquivo'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Informações adicionais sobre esta proposta..."
              />
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? 'Enviando...' : 'Enviar Proposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

**Versão**: 1.0
**Última Atualização**: 03/01/2026
**Status**: ✅ Implementado (Backend)
