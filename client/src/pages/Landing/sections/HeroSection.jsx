import { useState } from 'react';
import heroImg  from '../../../assets/images/mohamed_hassan-dentist-8576790_1920.png';
import toothImg from '../../../assets/images/yamu_jay-tooth-8884057_1920.png';
import waveSvg  from '../../../assets/images/wave-haikei.svg';
import { CLINIC } from '../../../data/clinicData';

export default function HeroSection() {
  const [form, setForm]           = useState({ name: '', phone: '', service: '' });
  const [status, setStatus]       = useState('idle'); // idle | loading | success

  const services = [
    'General Checkup & Cleaning', 'Teeth Whitening', 'Dental Implants',
    'Braces & Orthodontics', 'Root Canal Treatment', 'Tooth Extraction',
    'Crowns, Bridges & Dentures', 'Pediatric Dentistry', 'Emergency Dental Care',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'hero', message: `Quick inquiry for: ${form.service}` }),
      });
    } catch { /* best-effort */ }

    setStatus('success');
    /* Show "Request Received!" for exactly 1 second, then reset */
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', phone: '', service: '' });
    }, 1000);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 min-h-screen flex items-center overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
        <div className="absolute top-20 right-[10%] w-64 h-64 border border-white/10 rounded-full animate-spin-slow" />
        <div className="absolute top-32 right-[12%] w-40 h-40 border border-white/8 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
      </div>

      <div className="container mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* ── Left: headline + form ── */}
        <div className="text-white">
          {/* Live badge */}
          <div className="hero-f1 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Now accepting new patients · {CLINIC.addressShort}
          </div>

          <h1 className="hero-f2 text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-4 tracking-tight">
            {CLINIC.tagline}<br />
            <span className="relative inline-block text-yellow-300">
              DENTISTRY
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 240 8" fill="none">
                <path d="M2 6 Q60 2 120 4 Q180 6 238 2" stroke="rgba(253,224,71,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </h1>

          <p className="hero-f3 text-lg text-white/85 mb-8 leading-relaxed max-w-md">
            {CLINIC.subTagline} Expert care by <strong className="text-white">{CLINIC.doctor}</strong> —
            compassionate, precise, and always patient-first.
          </p>

          {/* Stats row */}
          <div className="hero-f5 flex gap-8 mt-7 mb-8">
            {[
              [CLINIC.reviewsText, 'Google Reviews'],
              ['5.0★', 'Rating'],
              [CLINIC.patientsText, 'Patients Served'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs text-white/70 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Mini consultation form */}
          <div className="hero-f5 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-md">
            {status === 'success' ? (
              <div className="py-2 text-center">
                <p className="text-white font-semibold text-lg">✅ We'll call you back!</p>
                <p className="text-white/70 text-sm mt-1">Expect a call within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-white/90 font-semibold text-sm">Get a free callback — takes 30 seconds</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="bg-white/15 border border-white/25 text-white placeholder-white/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-white/50 w-full"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    className="bg-white/15 border border-white/25 text-white placeholder-white/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-white/50 w-full"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <select
                  className="bg-white/15 border border-white/25 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-white/50 w-full"
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  required
                >
                  <option value="" className="text-gray-900">What treatment? *</option>
                  {services.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                </select>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl transition-colors shadow-lg disabled:opacity-70 text-sm"
                >
                  {status === 'loading' ? 'Sending…' : 'Get Free Callback →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: floating doctor image ── */}
        <div className="hidden lg:flex justify-center items-end relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-white/8 rounded-full blur-2xl animate-pulse-ring" />
          <img
            src={heroImg}
            alt={`${CLINIC.doctor} at ${CLINIC.name}`}
            className="hero-img relative z-10 max-h-[600px] object-contain drop-shadow-2xl animate-float"
          />
          {/* Floating award badge */}
          <div className="hero-img absolute top-16 -left-6 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-float-sm" style={{ animationDelay: '1s' }}>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Google Rating</p>
              <p className="text-sm font-bold text-gray-900">5.0 ★ · {CLINIC.reviewsText} Reviews</p>
            </div>
          </div>
          {/* Floating tooth */}
          <div className="hero-img absolute bottom-28 -right-4 animate-float-sm" style={{ animationDelay: '2s' }}>
            <img src={toothImg} alt="" className="w-20 h-20 object-contain drop-shadow-xl opacity-90" />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <img src={waveSvg} alt="" className="w-full block" style={{ marginBottom: '-2px' }} />
      </div>
    </section>
  );
}
