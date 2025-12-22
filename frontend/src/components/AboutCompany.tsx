import { Award, Users, Target, TrendingUp, Shield, Heart } from 'lucide-react';

export function AboutCompany() {
  return (
    <section id="company" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">Sobre Nós</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Líderes em Gestão de Energia Solar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transformando o futuro da energia com tecnologia, inovação e compromisso com a sustentabilidade
          </p>
        </div>

        {/* Company Story */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Nossa História
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Fundada com a missão de democratizar o acesso à energia solar no Brasil,
                desenvolvemos a plataforma mais completa para gestão de geração distribuída.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Combinamos tecnologia de ponta com profundo conhecimento do setor energético
                para oferecer soluções que realmente fazem a diferença na vida de nossos clientes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Hoje, atendemos centenas de empresas e residências em todo o país,
                ajudando a reduzir custos, aumentar a sustentabilidade e contribuir
                para um futuro mais verde.
              </p>

              <div className="flex gap-4 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                  Conheça Nossa Equipe
                </button>
                <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors">
                  Nossa Missão
                </button>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Users className="w-32 h-32 mx-auto mb-4 text-blue-600" />
                  <p className="text-xl font-semibold text-gray-800">Nossa Equipe</p>
                  <p className="text-gray-600 mt-2">Especialistas em Energia Solar</p>
                </div>
              </div>

              {/* Decorative Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6">
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Nossos Valores
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Excelência</h4>
              <p className="text-gray-700 leading-relaxed">
                Comprometidos em entregar soluções de alta qualidade que superam
                as expectativas de nossos clientes.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sustentabilidade</h4>
              <p className="text-gray-700 leading-relaxed">
                Acreditamos em um futuro sustentável e trabalhamos para tornar
                a energia limpa acessível a todos.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Inovação</h4>
              <p className="text-gray-700 leading-relaxed">
                Investimos constantemente em tecnologia e inovação para oferecer
                as melhores soluções do mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100 font-medium">Empresas Atendidas</div>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50MW</div>
              <div className="text-blue-100 font-medium">Energia Gerenciada</div>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">R$ 100M</div>
              <div className="text-blue-100 font-medium">Economia Gerada</div>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100 font-medium">Anos de Mercado</div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Certificações e Reconhecimentos
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 mx-auto text-blue-600 mb-3" />
              <p className="font-semibold text-gray-900">ISO 9001</p>
              <p className="text-sm text-gray-600 mt-1">Qualidade</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 mx-auto text-green-600 mb-3" />
              <p className="font-semibold text-gray-900">ISO 14001</p>
              <p className="text-sm text-gray-600 mt-1">Meio Ambiente</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <Award className="w-12 h-12 mx-auto text-yellow-600 mb-3" />
              <p className="font-semibold text-gray-900">ANEEL</p>
              <p className="text-sm text-gray-600 mt-1">Certificada</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <Award className="w-12 h-12 mx-auto text-orange-600 mb-3" />
              <p className="font-semibold text-gray-900">Top 100</p>
              <p className="text-sm text-gray-600 mt-1">Empresas Verdes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
