import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Sun, Mail, Phone, MapPin, ArrowRight, Zap, Leaf, DollarSign, Send, CheckCircle, Loader2 } from 'lucide-react';
import type { Company } from '../../../models';
import axios from 'axios';
import { useCep } from '../../../hooks/useCep';

interface EMP01LandingPageProps {
  company: Partial<Company>;
  companyCode: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  message: string;
}

export function EMP01LandingPage({ company, companyCode }: EMP01LandingPageProps) {
  const { validateCep, formatCep, loading: cepLoading, error: cepError, clearError } = useCep();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setFormData(prev => ({ ...prev, cep: formatted }));
    clearError();
  };

  const handleCepBlur = async () => {
    if (formData.cep.replace(/\D/g, '').length === 8) {
      const cepData = await validateCep(formData.cep);

      if (cepData) {
        setFormData(prev => ({
          ...prev,
          street: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      await axios.post(`${API_URL}/contacts`, {
        ...formData,
        companyId: company.id,
        phone: formData.phone.replace(/\D/g, ''), // Remove formatação
        cep: formData.cep.replace(/\D/g, ''), // Remove hífen do CEP
        state: formData.state.toUpperCase(), // Garantir uppercase
      });

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        message: '',
      });

      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error('Erro ao enviar contato:', error);
      setSubmitError(
        error.response?.data?.message || 'Erro ao enviar mensagem. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Envie sua Mensagem</h4>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Mensagem enviada com sucesso!</p>
                    <p className="text-sm">Entraremos em contato em breve.</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="font-semibold">Erro ao enviar mensagem</p>
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleCepChange}
                      onBlur={handleCepBlur}
                      required
                      maxLength={9}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="00000-000"
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      </div>
                    )}
                  </div>
                  {cepError && (
                    <p className="mt-1 text-sm text-red-600">{cepError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    readOnly={cepLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 read-only:bg-gray-50"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Apto, Sala, etc. (opcional)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    required
                    readOnly={cepLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 read-only:bg-gray-50"
                    placeholder="Bairro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      readOnly={cepLoading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 read-only:bg-gray-50"
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      disabled={cepLoading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    placeholder="Como podemos ajudá-lo?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600 text-center mb-3">
                  Já é nosso cliente?
                </p>
                <Link
                  to={`/${companyCode}/login`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-green-600 border border-green-600 rounded-lg font-semibold transition-colors w-full"
                >
                  Acessar Sistema
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
