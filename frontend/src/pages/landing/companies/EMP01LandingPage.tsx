import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, ArrowRight, Zap, Leaf, DollarSign } from 'lucide-react';
import type { Company } from '../../../models';

interface EMP01LandingPageProps {
  company: Partial<Company>;
  companyCode: string;
}

export function EMP01LandingPage({ company, companyCode }: EMP01LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-2">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">Energia Limpa e Renovável</p>
              </div>
            </div>
            <Link
              to={`/${companyCode}/login`}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Área do Cliente
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Energia Solar para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              sua Empresa
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Economize até 95% na conta de luz com energia solar fotovoltaica.
            Soluções completas para empresas que querem reduzir custos e contribuir com o meio ambiente.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            CNPJ: {company.cnpj || 'Não informado'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to={`/${companyCode}/login`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Acessar Sistema
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 rounded-lg font-semibold text-lg transition-all"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Por que escolher Energia Solar?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Economia Garantida</h4>
              <p className="text-gray-600">
                Reduza sua conta de luz em até 95% com geração própria de energia limpa e renovável.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sustentabilidade</h4>
              <p className="text-gray-600">
                Contribua com o meio ambiente gerando energia limpa e reduzindo a emissão de CO₂.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Independência Energética</h4>
              <p className="text-gray-600">
                Proteja-se das constantes altas nas tarifas de energia elétrica com geração própria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Sobre a {company.name}</h3>
            <p className="text-lg opacity-90 mb-8">
              Somos especialistas em soluções de energia solar fotovoltaica para empresas.
              Com anos de experiência no mercado, oferecemos desde o projeto até a instalação
              e manutenção de sistemas de geração distribuída.
            </p>
            <p className="text-lg opacity-90">
              Nossa missão é tornar a energia solar acessível e viável para empresas de todos os portes,
              contribuindo para um futuro mais sustentável e econômico.
            </p>
          </div>
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
                <div className="bg-green-100 rounded-lg p-3">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">contato@{company.code?.toLowerCase()}.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Telefone</p>
                  <p className="text-gray-600">(11) 98765-4321</p>
                  <p className="text-gray-600">(11) 3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 rounded-lg p-3">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Endereço</p>
                  <p className="text-gray-600">Av. Paulista, 1000 - São Paulo/SP</p>
                  <p className="text-gray-600">CEP: 01310-100</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <strong>Horário de Atendimento:</strong><br />
                  Segunda a Sexta: 8h às 18h<br />
                  Sábado: 8h às 12h
                </p>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Acesso ao Sistema</h4>
              <p className="text-gray-600 mb-6">
                Já é nosso cliente? Acesse o sistema para acompanhar sua geração de energia,
                consumo, faturas e muito mais.
              </p>
              <Link
                to={`/${companyCode}/login`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors w-full justify-center"
              >
                Fazer Login
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Não tem uma conta? Entre em contato conosco!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-2">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{company.name}</span>
            </div>
            <p className="text-gray-400 mb-2">
              Energia Limpa, Renovável e Econômica
            </p>
            <p className="text-gray-400">
              © 2025 {company.name}. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              CNPJ: {company.cnpj || 'Não informado'} | Código: {company.code}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
