import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sun, Loader2 } from 'lucide-react';
import { companyService } from '../../services';
import { useCompany } from '../../contexts/CompanyContext';
import type { Company } from '../../models';
import { hasCustomLandingPage, getCompanyLandingPage } from './companies';

export function CompanyLandingPage() {
  const { companyCode } = useParams<{ companyCode: string }>();
  const navigate = useNavigate();
  const { setCurrentCompany } = useCompany();
  const [company, setCompany] = useState<Partial<Company> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompany();
  }, [companyCode]);

  const loadCompany = async () => {
    if (!companyCode) {
      setError('Código da empresa não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Normalizar código da empresa para uppercase
      const normalizedCode = companyCode.toUpperCase();

      // Verificar se existe landing page customizada para esta empresa
      if (!hasCustomLandingPage(normalizedCode)) {
        throw new Error(
          `Landing page não existe para a empresa ${normalizedCode}. ` +
          `Por favor, crie o arquivo antes de cadastrar a empresa no sistema.`
        );
      }

      const data = await companyService.getByCode(companyCode);
      setCompany(data);
      setCurrentCompany(data);
    } catch (err: any) {
      console.error('Erro ao carregar empresa:', err);
      setError(err.message || err.response?.data?.message || 'Empresa não encontrada');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações da empresa...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Sun className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao Carregar Landing Page</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  // Buscar o componente de landing page customizado (normalizado para uppercase)
  const normalizedCode = companyCode!.toUpperCase();
  const CustomLandingPage = getCompanyLandingPage(normalizedCode);

  // Renderizar o componente customizado
  if (CustomLandingPage) {
    return <CustomLandingPage company={company} companyCode={normalizedCode} />;
  }

  // Fallback: não deveria chegar aqui devido à validação anterior
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Sun className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Landing Page Não Encontrada</h1>
        <p className="text-gray-600 mb-6">
          Landing page não configurada para a empresa {companyCode}.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}
