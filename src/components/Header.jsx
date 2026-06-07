import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ cart = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Efecto scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al hacer resize a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Focus en input de búsqueda cuando se abre modal
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Bloquear scroll del body cuando menú o búsqueda están abiertos
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, isSearchOpen]);

  return (
    <>
      <header className={`
        sticky top-0 w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-surface/90 backdrop-blur-lg border-b border-outline-variant/30 shadow-md' 
          : 'bg-surface/70 backdrop-blur-sm border-b border-outline-variant/10'
        }
      `}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity active:scale-95"
          >
            Play GO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" exact>Tienda</NavLink>
            <NavLink to="/guides">Guías de Instalación</NavLink>
            <NavLink to="/terms">Términos y Condiciones</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button (mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Buscar"
            >
              <span className="material-symbols-outlined text-onSurface">search</span>
            </button>

            {/* Desktop search input */}
            <div className="hidden md:relative md:block">
              <input
                type="text"
                placeholder="Buscar juegos..."
                className="w-64 pl-10 pr-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30 text-sm focus:w-80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant text-base">search</span>
            </div>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
            >
              <span className="material-symbols-outlined text-onSurface group-hover:text-primary transition-colors">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neonGreen text-background text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menú"
              aria-expanded={isMenuOpen}
            >
              <span className="material-symbols-outlined text-onSurface">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (off-canvas con overlay) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-surface/95 backdrop-blur-xl shadow-2xl p-6 flex flex-col gap-6 animate-slide-in-right">
            <nav className="flex flex-col gap-4 mt-8">
              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Tienda</MobileNavLink>
              <MobileNavLink to="/guides" onClick={() => setIsMenuOpen(false)}>Guías de Instalación</MobileNavLink>
              <MobileNavLink to="/terms" onClick={() => setIsMenuOpen(false)}>Términos y Condiciones</MobileNavLink>
            </nav>
            <div className="pt-6 border-t border-outline-variant/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar juegos..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30 text-sm outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant text-base">search</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal (mobile) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSearchOpen(false)} />
          <div className="absolute top-0 left-0 right-0 p-4 bg-surface rounded-b-2xl shadow-xl animate-slide-in-down">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar juegos..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant focus:border-primary outline-none"
                  autoFocus
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant">search</span>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-3 rounded-xl bg-surface-container-high hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
        .animate-slide-in-down {
          animation: slide-in-down 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

// Componentes internos reutilizables
const NavLink = ({ to, children, exact }) => (
  <Link
    to={to}
    className={`
      relative font-medium text-onSurfaceVariant hover:text-primary transition-colors duration-200
      after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full
    `}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-xl font-semibold text-onSurface hover:text-primary transition-colors py-2 border-l-4 border-transparent hover:border-primary pl-4"
  >
    {children}
  </Link>
);

export default Header;