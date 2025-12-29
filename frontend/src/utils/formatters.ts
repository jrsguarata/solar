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
