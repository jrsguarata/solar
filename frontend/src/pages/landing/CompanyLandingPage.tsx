import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { companyService } from '../../services';
import { useCompany } from '../../contexts/CompanyContext';
import type { Company } from '../../models';

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

      const data = await companyService.getByCode(companyCode);
      setCompany(data);
      setCurrentCompany(data);
    } catch (err: any) {
      console.error('Erro ao carregar empresa:', err);
      setError(err.response?.data?.message || 'Empresa não encontrada');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Empresa não encontrada</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">Código: {company.code}</p>
              </div>
            </div>
            <Link
              to={`/${companyCode}/login`}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo à
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              {' '}{company.name}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Acesse sua conta para gerenciar informações de energia solar e geração distribuída.
          </p>
          <Link
            to={`/${companyCode}/login`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Acessar Sistema
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Entre em Contato</h3>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Informações de Contato</h4>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">contato@{company.code?.toLowerCase()}.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Telefone</p>
                  <p className="text-gray-600">(00) 0000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-lg p-3">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Endereço</p>
                  <p className="text-gray-600">Informações disponíveis após o login</p>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Acesso Rápido</h4>
              <p className="text-gray-600 mb-6">
                Já possui uma conta? Faça login para acessar o sistema e gerenciar suas informações.
              </p>
              <Link
                to={`/${companyCode}/login`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors w-full justify-center"
              >
                Fazer Login
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{company.name}</span>
            </div>
            <p className="text-gray-400">
              © 2025 {company.name}. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              CNPJ: {company.cnpj || 'Não informado'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
