import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CLINIC } from '../../data/clinicData';

const NAV_LINKS = [
  { label: 'Home',            to: '/',        type: 'page' },
  { label: 'About',           to: '/about',    type: 'page' },
  { label: 'Services',        to: '/services', type: 'page' },
  // { label: 'Book Appointment', to: '/book',    type: 'page' },
  { label: 'Contact',         to: '/contact',  type: 'page' },
];

const linkCls = (transparent, active) =>
  `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
    transparent
      ? active ? 'text-white bg-white/25 shadow-sm' : 'text-white hover:text-white hover:bg-white/15'
      : active  ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-gray-800 hover:text-primary-700 hover:bg-primary-50/70'
  }`;

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const isHome                    = location.pathname === '/';
  const transparent               = !scrolled && isHome;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /** Logo + Home click: always return to top of home */
  const handleHomeNav = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    /* else: let Link navigate normally, browser will start at top */
    setMenuOpen(false);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent'
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between" style={{ height: '84px' }}>

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={handleHomeNav}
            className={`flex items-center gap-2.5 font-extrabold text-xl tracking-tight transition-colors flex-shrink-0 ${
              transparent ? 'text-white' : 'text-primary-800'
            }`}
          >
            <span className="text-2xl leading-none">🦷</span>
            <span>{CLINIC.nameShort}</span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              const isHomeLink = to === '/';
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={isHomeLink ? handleHomeNav : undefined}
                  className={linkCls(transparent, active)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Book button (desktop) ── */}
          <Link
            to="/book"
            className={`hidden lg:inline-flex items-center gap-1.5 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
              transparent
                ? 'bg-white/25 text-white border border-white/60 backdrop-blur-sm hover:bg-white/35 shadow-sm'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
            }`}
          >
            <span></span> Book Appointment
          </Link>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors ${
              transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 shadow-xl ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 space-y-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = location.pathname === to;
            const isHomeLink = to === '/';
            return (
              <Link
                key={to}
                to={to}
                onClick={isHomeLink ? handleHomeNav : () => setMenuOpen(false)}
                className={`block py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-800 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            to="/book"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center mt-2 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            📅 Book Appointment
          </Link>
        </div>
      </div>
    </header>
    </>
  );
}
