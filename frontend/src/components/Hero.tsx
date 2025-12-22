import { ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Sistema de Gestão de Geração Distribuída</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Transforme a Energia Solar em{' '}
              <span className="text-yellow-400">Economia Real</span>
            </h1>

            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
              Plataforma completa para gerenciar sua geração distribuída de energia solar.
              Monitore, controle e maximize seus resultados com inteligência e simplicidade.
            </p>

            {/* Features Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-semibold mb-1">Economia de até 95%</h3>
                <p className="text-sm text-blue-100">Reduza sua conta de energia</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="w-8 h-8 text-yellow-400 mb-2" />
                <h3 className="font-semibold mb-1">Gestão Segura</h3>
                <p className="text-sm text-blue-100">Controle total e auditável</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Zap className="w-8 h-8 text-orange-400 mb-2" />
                <h3 className="font-semibold mb-1">Monitoramento Real</h3>
                <p className="text-sm text-blue-100">Dados em tempo real</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                Fale com Especialista
              </button>
            </div>
          </div>

          {/* Right Content - Visual/Image Placeholder */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Zap className="w-24 h-24 mx-auto mb-4 text-yellow-400 animate-pulse" />
                  <p className="text-xl font-semibold">Dashboard Preview</p>
                  <p className="text-blue-100 mt-2">Sistema Inteligente de Gestão</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">500+</div>
                  <div className="text-xs text-blue-100 mt-1">Empresas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">95%</div>
                  <div className="text-xs text-blue-100 mt-1">Economia</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">24/7</div>
                  <div className="text-xs text-blue-100 mt-1">Suporte</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full filter blur-2xl opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400 rounded-full filter blur-2xl opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
