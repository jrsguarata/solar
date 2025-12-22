import { Sun, Leaf, DollarSign, Home, Factory, Building2 } from 'lucide-react';

export function AboutGD() {
  return (
    <section id="about-gd" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sun className="w-4 h-4" />
            <span className="text-sm font-semibold">Geração Distribuída</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Entenda a Geração Distribuída
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Produza sua própria energia limpa e economize na conta de luz
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Conheça GD */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <Sun className="w-12 h-12 text-yellow-400 mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">O que é Geração Distribuída?</h3>
              <p className="text-blue-100">Energia solar produzida no local de consumo</p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                A <strong>Geração Distribuída (GD)</strong> é a produção de energia elétrica próxima ou no próprio local de consumo.
                Com painéis solares instalados no seu telhado, você gera sua própria energia limpa e renovável.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Renovável</h4>
                    <p className="text-sm text-gray-600">Energia limpa e sustentável direto do sol</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Economia Garantida</h4>
                    <p className="text-sm text-gray-600">Reduza até 95% da sua conta de energia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 rounded-full p-2 mt-1">
                    <Sun className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Valorização do Imóvel</h4>
                    <p className="text-sm text-gray-600">Propriedades com energia solar valem mais</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                  <strong>Como funciona:</strong> Os painéis solares captam a luz do sol e convertem em energia elétrica.
                  O excedente é injetado na rede e você recebe créditos na sua conta.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Vantagens para Você */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <DollarSign className="w-12 h-12 text-yellow-400 mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">Vantagens para Você</h3>
              <p className="text-green-100">Benefícios reais e mensuráveis</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Residencial */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Para sua Residência</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Economia de até 95% na conta de luz
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Proteção contra aumento de tarifas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Energia limpa para sua família
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Valorização do imóvel
                  </li>
                </ul>
              </div>

              {/* Comercial */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-gray-900">Para seu Comércio</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Redução drástica de custos operacionais
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Maior competitividade no mercado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Marketing verde e sustentável
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    ROI em 3-5 anos
                  </li>
                </ul>
              </div>

              {/* Industrial */}
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-gray-900">Para sua Indústria</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Economia em larga escala
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Previsibilidade de custos energéticos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Certificações ambientais (ISO 14001)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Energia estável e confiável
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  💰 Retorno Garantido
                </p>
                <p className="text-sm text-gray-700">
                  Com nossa plataforma, você monitora em tempo real a economia gerada e o retorno do seu investimento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
            <p className="text-gray-600">Anos de Durabilidade</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <p className="text-gray-600">Economia Média</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-yellow-600 mb-2">3-5</div>
            <p className="text-gray-600">Anos para ROI</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <p className="text-gray-600">Energia Limpa</p>
          </div>
        </div>
      </div>
    </section>
  );
}
