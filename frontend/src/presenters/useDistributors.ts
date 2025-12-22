import { useState, useEffect } from 'react';
import { distributorService, getErrorMessage } from '../services';
import type { Distributor } from '../models';

interface UseDistributorsReturn {
  distributors: Distributor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDistributors(): UseDistributorsReturn {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await distributorService.getAll();
      setDistributors(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  return {
    distributors,
    loading,
    error,
    refetch: fetchDistributors,
  };
}
