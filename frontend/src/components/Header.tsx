import { Sun, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLogin = () => {
    // TODO: Integrar com a página de login
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Solar</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('about-gd')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sobre GD
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contato
            </button>
            <button
              onClick={() => scrollToSection('company')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sobre Nós
            </button>
          </nav>

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Entrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('about-gd')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                Sobre GD
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                Contato
              </button>
              <button
                onClick={() => scrollToSection('company')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg"
              >
                Sobre Nós
              </button>
              <button
                onClick={handleLogin}
                className="mt-2 mx-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
