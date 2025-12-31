import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Company } from '../models';

interface CompanyContextType {
  currentCompany: Partial<Company> | null;
  setCurrentCompany: (company: Partial<Company> | null) => void;
  clearCurrentCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [currentCompany, setCurrentCompanyState] = useState<Partial<Company> | null>(null);

  // Carregar company do localStorage na inicialização
  useEffect(() => {
    const storedCompany = localStorage.getItem('currentCompany');
    if (storedCompany) {
      try {
        setCurrentCompanyState(JSON.parse(storedCompany));
      } catch (error) {
        console.error('Erro ao carregar empresa do localStorage:', error);
        localStorage.removeItem('currentCompany');
      }
    }
  }, []);

  const setCurrentCompany = (company: Partial<Company> | null) => {
    setCurrentCompanyState(company);
    if (company) {
      localStorage.setItem('currentCompany', JSON.stringify(company));
    } else {
      localStorage.removeItem('currentCompany');
    }
  };

  const clearCurrentCompany = () => {
    setCurrentCompanyState(null);
    localStorage.removeItem('currentCompany');
  };

  return (
    <CompanyContext.Provider value={{ currentCompany, setCurrentCompany, clearCurrentCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
