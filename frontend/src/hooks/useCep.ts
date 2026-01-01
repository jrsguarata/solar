import { useState } from 'react';
import axios from 'axios';

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface CepError {
  erro: boolean;
}

export function useCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCep = async (cep: string): Promise<CepData | null> => {
    // Remover formatação (hífens, pontos, espaços)
    const cleanCep = cep.replace(/\D/g, '');

    // Validar tamanho
    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CepData | CepError>(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
        {
          timeout: 5000, // 5 segundos de timeout
        }
      );

      // Verificar se retornou erro
      if ('erro' in response.data) {
        setError('CEP não encontrado');
        return null;
      }

      return response.data as CepData;
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError('Tempo esgotado ao buscar CEP');
      } else if (err.response?.status === 400) {
        setError('CEP inválido');
      } else {
        setError('Erro ao buscar CEP. Tente novamente.');
      }
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatCep = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 8 dígitos
    const limited = numbers.slice(0, 8);

    // Adiciona hífen após 5 dígitos
    if (limited.length > 5) {
      return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    }

    return limited;
  };

  return {
    validateCep,
    formatCep,
    loading,
    error,
    clearError: () => setError(null),
  };
}
