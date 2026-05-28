import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { CLINIC } from '../../../data/clinicData';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToTop = (e) => {
    if (isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  return (
    <footer className="bg-gray-950 text-white">
      <div className="py-16 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" onClick={scrollToTop} className="text-xl font-bold flex items-center gap-2 mb-4 hover:text-primary-400 transition-colors">
              <span className="text-2xl">🦷</span> {CLINIC.name}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-2">
              <span className="text-white font-semibold">{CLINIC.tagline}</span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              {CLINIC.description}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href={CLINIC.social.facebook}  target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 w-9 h-9 rounded-lg flex items-center justify-center transition-colors" title="Facebook"><FaFacebookF size={16} /></a>
              <a href={CLINIC.social.instagram} target="_blank" rel="noreferrer" className="bg-gradient-to-br from-purple-500 to-pink-500 w-9 h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90" title="Instagram"><FaInstagram size={16} /></a>
              <a href={CLINIC.social.youtube}   target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 w-9 h-9 rounded-lg flex items-center justify-center transition-colors" title="YouTube"><FaYoutube size={16} /></a>
              <a href={CLINIC.social.whatsapp}  target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 w-9 h-9 rounded-lg flex items-center justify-center transition-colors" title="WhatsApp"><FaWhatsapp size={16} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Pages</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Home',             '/'],
                ['Services',         '/services'],
                ['About Us',         '/about'],
                ['Book Appointment', '/book'],
                ['Contact',          '/contact'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={to === '/' ? scrollToTop : undefined}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">📍</span>
                <span>{CLINIC.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0">📞</span>
                <a href={`tel:${CLINIC.phone}`} className="hover:text-white transition-colors">{CLINIC.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0">✉️</span>
                <a href={`mailto:${CLINIC.email}`} className="hover:text-white transition-colors break-all">{CLINIC.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">🕐</span>
                <span>{CLINIC.hours.compact}<br />Saturday: <span className={CLINIC.hours.saturday === 'Closed' ? 'text-red-400' : ''}>{CLINIC.hours.saturday}</span></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="container mx-auto mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
