import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar  from '../../components/Navbar/Navbar';
import Footer  from '../Landing/sections/Footer';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { prospectsApi } from '../../services/api';
import { CLINIC } from '../../data/clinicData';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

/* ── Assets ── */
import phoneCallImg from '../../assets/images/phone-call.png';
import clockImg     from '../../assets/images/clock.png';
import medicalImg   from '../../assets/images/medical-appointment.png';
import dotBlobImg   from '../../assets/images/dot-blob-1.svg';
import mapImg       from '../../assets/images/map.png';

/* ── Hero ── */
function ContactHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-16 right-[8%] w-56 h-56 border border-white/10 rounded-full animate-spin-slow" />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="hero-f1 flex items-center gap-2 text-white/70 text-sm mb-5">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span><span className="text-white">Contact</span>
        </div>
        <h1 className="hero-f2 text-5xl font-extrabold mb-4">Get In Touch</h1>
        <p className="hero-f3 text-white/85 text-xl max-w-xl leading-relaxed">
          Have a question about our services or just want to say hello? We'd love to hear from you.
        </p>
      </div>
    </section>
  );
}

/* ── Contact info + form ── */
function ContactMain() {
  const ref = useScrollAnimation();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '', source: 'website' });
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await prospectsApi.create(form);
      setDone(true);
    } catch {
      alert('Failed to send. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { icon: '📍', label: 'Address',    primary: CLINIC.address,    sub: CLINIC.landmark },
    { icon: '📞', label: 'Phone',      primary: CLINIC.phone,      sub: CLINIC.phone2 },
    { icon: '✉️', label: 'Email',      primary: CLINIC.email,      sub: 'Responds within 2 hours' },
    { icon: '🕐', label: 'Hours',      primary: CLINIC.hours.display, sub: `Saturday: ${CLINIC.hours.saturday}` },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" ref={ref}>
      <img src={dotBlobImg} alt="" className="absolute top-0 right-0 w-80 opacity-15 pointer-events-none select-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start relative z-10">

        {/* Left: info */}
        <div data-anim className="reveal-left">
          <span className="section-tag">Reach Us</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-5">
            We're Here<br />to Help
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-10">
            Our team at {CLINIC.address} is ready to assist you.
            Call, WhatsApp, or fill the form — we typically respond within two hours during clinic hours.
          </p>

          <div className="space-y-5 mb-10">
            {infoItems.map(({ icon, label, primary, sub }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-colors">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-700 text-sm mt-0.5">{primary}</p>
                  {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Hours table */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <img src={clockImg} alt="" className="w-4 h-4" /> Opening Hours
            </h4>
            <div className="space-y-2">
              {CLINIC.hours.rows.map(({ day, time }) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">{day}</span>
                  <span className={`font-semibold ${time === 'Closed' ? 'text-red-500' : 'text-gray-900'}`}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3 flex-wrap">
            <a href={CLINIC.social.facebook}  target="_blank" rel="noreferrer" aria-label="Facebook" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"><FaFacebookF size={14} /> Facebook</a>
            <a href={CLINIC.social.whatsapp}  target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"><FaWhatsapp size={14} /> WhatsApp</a>
            <a href={CLINIC.social.youtube}   target="_blank" rel="noreferrer" aria-label="YouTube"  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"><FaYoutube size={14} /> YouTube</a>
            <a href={CLINIC.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"><FaInstagram size={14} /> Instagram</a>
          </div>
        </div>

        {/* Right: form */}
        <div data-anim className="reveal-right">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
            {done ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-700">We'll get back to you within 2 hours during clinic hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-5">Send Us a Message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Your Name *" value={form.name} onChange={e => set('name', e.target.value)} required />
                  <input className="input-field" placeholder="Phone Number" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <input className="input-field" type="email" placeholder="Email Address *" value={form.email} onChange={e => set('email', e.target.value)} required />
                <select className="input-field text-gray-700" value={form.source} onChange={e => set('source', e.target.value)}>
                  <option value="website">Found us online</option>
                  <option value="google">Google Maps</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="referral">Friend / Referral</option>
                  <option value="walkin">Walk-in / Nearby</option>
                </select>
                <textarea className="input-field" rows={4} placeholder="Your message or question…" value={form.message} onChange={e => set('message', e.target.value)} />
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* Location card */}
          <div className="mt-6 bg-primary-50 rounded-2xl p-5 border border-primary-100 flex items-start gap-4">
            <img src={mapImg} alt="Map" className="w-12 h-12 object-contain opacity-80 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{CLINIC.name}</p>
              <p className="text-gray-700 text-sm mt-0.5">{CLINIC.address}</p>
              <p className="text-xs text-gray-500 mt-1">{CLINIC.landmark}</p>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(CLINIC.name + ' ' + CLINIC.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-xs text-primary-700 font-semibold hover:underline"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Emergency strip ── */
function EmergencyStrip() {
  const ref = useScrollAnimation();
  return (
    <section className="py-12 bg-red-600" ref={ref}>
      <div data-anim className="reveal container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-center sm:text-left">
          <p className="text-xl font-extrabold">🚨 Dental Emergency?</p>
          <p className="text-white/85 text-sm mt-1">We keep emergency slots open during all working hours. Call us immediately.</p>
        </div>
        <a
          href={`tel:${CLINIC.phone}`}
          className="flex-shrink-0 bg-white text-red-700 font-extrabold px-7 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg text-sm"
        >
          📞 {CLINIC.phone}
        </a>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Navbar />
      <main id="main-content">
      <ContactHero />
      <ContactMain />
      <EmergencyStrip />
      </main>
      <Footer />
    </div>
  );
}
