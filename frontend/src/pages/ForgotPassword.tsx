import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { usePasswordRecovery } from '../presenters';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { requestCode, loading, error, success, devCode } = usePasswordRecovery();

  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await requestCode({ email });

      // Redirecionar para página de reset com o telefone retornado
      setTimeout(() => {
        navigate('/reset-password', { state: { phone: response.phone } });
      }, 2000);
    } catch (err) {
      console.error('Erro ao solicitar código:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3">
              <Sun className="w-10 h-10 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Solar</span>
          </div>
          <p className="text-blue-100 text-lg">
            Recuperação de Senha
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {success ? (
            // Success State
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Código Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Um código de 6 dígitos foi enviado para o celular cadastrado.
              </p>

              {devCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    [Modo Desenvolvimento]
                  </p>
                  <p className="text-2xl font-mono font-bold text-yellow-900">
                    {devCode}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Redirecionando para próxima etapa...
              </p>
            </div>
          ) : (
            // Form State
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Esqueceu sua senha?
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Informe seu email para receber um código de recuperação no celular cadastrado
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Digite o email cadastrado na sua conta
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Código'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
