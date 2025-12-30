/**
 * Formata um número de celular brasileiro
 * Exemplo: 11999887766 -> (11) 99988-7766
 */
export const formatMobile = (value: string): string => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Remove a máscara de um celular e retorna apenas números
 * Exemplo: (11) 99988-7766 -> 11999887766
 */
export const unformatMobile = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata uma data ISO para o formato brasileiro
 * Exemplo: 2024-01-15T10:30:00.000Z -> 15/01/2024 10:30
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
