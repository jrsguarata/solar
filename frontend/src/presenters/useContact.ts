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

  return {
    submitContact,
    loading,
    error,
    success,
    resetState,
  };
}
