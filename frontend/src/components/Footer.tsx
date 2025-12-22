import { Sun, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Solar</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma completa para gestão de geração distribuída de energia solar.
              Transformando energia em economia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 p-2 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-sky-500 p-2 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="#about-gd" className="hover:text-white transition-colors">Sobre GD</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contato</a>
              </li>
              <li>
                <a href="#company" className="hover:text-white transition-colors">Sobre Nós</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Gestão de Energia</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Monitoramento</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Consultoria</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Suporte Técnico</a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>contato@solar.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>São Paulo, SP<br />Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © 2024 Solar. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
