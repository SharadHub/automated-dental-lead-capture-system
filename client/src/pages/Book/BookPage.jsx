import { useState, useEffect } from 'react';
import Navbar  from '../../components/Navbar/Navbar';
import Footer  from '../Landing/sections/Footer';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { appointmentsApi, prospectsApi } from '../../services/api';
import { CLINIC } from '../../data/clinicData';
import { Link } from 'react-router-dom';

/* ── Assets ── */
import medicalImg  from '../../assets/images/medical-appointment.png';
import clockImg    from '../../assets/images/clock.png';
import clinicPhoto from '../../assets/images/kari-bjorn-photography-Fdku_oMrDvk-unsplash.jpg';
import sirenImg    from '../../assets/images/siren.png';
import checkBoxImg from '../../assets/images/undraw_checking-boxes_j0im.svg';

const SERVICES_LIST = [
  'General Checkup & Cleaning', 'Teeth Whitening / Cosmetic', 'Dental Implants',
  'Braces & Orthodontics', 'Root Canal Treatment', 'Tooth Extraction',
  'Crowns, Bridges & Dentures', 'Pediatric Dentistry', 'Emergency Dental Care',
];

/* ── Fallback helpers ── */
const buildFallbackDates = () => {
  const list = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);          // start from tomorrow
  const slotCounts = [9, 8, 10, 7, 9, 8, 10, 6, 9, 8, 7, 9, 10, 8];
  while (list.length < 14) {
    if (d.getDay() !== 6) {            // skip Saturday (clinic closed)
      list.push({ date: d.toISOString().split('T')[0], slotsCount: slotCounts[list.length] });
    }
    d.setDate(d.getDate() + 1);
  }
  return list;
};

const FALLBACK_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',  '4:00 PM',  '4:30 PM',
  '5:00 PM',  '5:30 PM',  '6:00 PM',  '6:30 PM',
  '7:00 PM',  '7:30 PM',
];

/* ══════════════════════════════════════════════════════════
   Section 1 — Request Free Consultation
   ══════════════════════════════════════════════════════════ */
function ConsultationSection() {
  const ref = useScrollAnimation();
  const [form, setForm]     = useState({ name: '', phone: '', service: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website', message: `Consultation request for: ${form.service}` }),
      });
    } catch { /* best-effort */ }

    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', phone: '', service: '' });
    }, 1000);
  };

  return (
    <section id="consultation" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

        {/* Left: benefits */}
        <div data-anim className="reveal-left">
          <span className="section-tag">Free · No Commitment</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
            Request a Free<br />Consultation
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Not sure where to start? Tell us your concern and {CLINIC.doctor} will call you back to discuss your options — completely free.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              ['🎯', 'Personalised advice for your specific concern'],
              ['⏱️', 'We call back within 24 hours'],
              ['💰', 'Zero cost, zero obligation'],
              ['🗓️', 'Quick — takes under 30 seconds to submit'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-gray-700">
                <span className="text-xl w-7 flex-shrink-0">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <img src={checkBoxImg} alt="" className="w-52 opacity-70" />
        </div>

        {/* Right: form */}
        <div data-anim className="reveal-right">
          <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-8 border border-primary-100 shadow-sm">
            {status === 'success' ? (
              <div className="py-10 text-center">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-700">We'll call you within 24 hours to confirm your appointment.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-5">Your Details</h3>
                <input
                  className="input-field"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <select
                  className="input-field text-gray-700"
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  required
                >
                  <option value="">What treatment are you interested in? *</option>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-70"
                >
                  {status === 'loading' ? 'Sending…' : 'Request Free Consultation →'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  We'll call you — no spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Section 2 — Full Appointment Booking
   ══════════════════════════════════════════════════════════ */
function AppointmentSection() {
  const ref = useScrollAnimation();
  const [step, setStep]                   = useState(1);
  const [form, setForm]                   = useState({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
  const [availableDates, setAvailableDates] = useState([]);
  const [slots, setSlots]                 = useState([]);
  const [loading, setLoading]             = useState(false);
  const [done, setDone]                   = useState(false);
  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    appointmentsApi.getAvailableDates()
      .then(res => {
        const data = res.data;
        setAvailableDates(data && data.length ? data : buildFallbackDates());
      })
      .catch(() => setAvailableDates(buildFallbackDates()));
  }, []);

  useEffect(() => {
    if (!form.date) return;
    appointmentsApi.getSlots(form.date)
      .then(res => {
        const s = res.data?.slots;
        setSlots(s && s.length ? s : FALLBACK_SLOTS);
      })
      .catch(() => setSlots(FALLBACK_SLOTS));
  }, [form.date]);

  const submit = async () => {
    setLoading(true);
    try {
      const pr = await prospectsApi.create({
        name: form.name, email: form.email, phone: form.phone,
        source: 'website', service_interest: form.service, message: form.notes,
      });
      await appointmentsApi.create({
        prospect_id: pr.data.id, appointment_date: form.date,
        appointment_time: form.time, service: form.service, notes: form.notes,
      });
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDone(false); setStep(1);
    setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
  };

  return (
    <section id="appointment" className="py-24 bg-slate-50" ref={ref}>
      {/* Divider */}
      <div className="container mx-auto px-6 mb-14">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="text-center">
            <span className="section-tag">Full Appointment</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Book Your Appointment</h2>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">

        {/* Left: clinic info */}
        <div data-anim className="reveal-left">
          <div className="relative rounded-2xl overflow-hidden mb-7 shadow-xl">
            <img src={clinicPhoto} alt={CLINIC.name} className="w-full h-60 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="font-bold">{CLINIC.name}</p>
              <p className="text-sm text-white/80">{CLINIC.addressShort}</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { img: clockImg,   text: CLINIC.hours.compact },
              { img: medicalImg, text: '30-minute slots · instant confirmation' },
              { img: sirenImg,   text: 'Emergency slots available daily' },
            ].map(({ img, text }) => (
              <div key={text} className="flex items-center gap-3 text-gray-700">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={img} alt="" className="w-5 h-5" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: multi-step form */}
        <div data-anim className="reveal-right">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            {done ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Appointment Booked!</h3>
                <p className="text-gray-700 mb-1">Confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.</p>
                <p className="text-gray-500 text-sm mb-6">Confirmation sent to {form.email}</p>
                <button onClick={resetForm} className="text-primary-700 font-semibold underline underline-offset-2 text-sm hover:text-primary-800">
                  Book another appointment
                </button>
              </div>
            ) : (
              <>
                {/* Step bar */}
                <div className="flex gap-2 mb-7">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  ))}
                </div>

                {/* Step 1: details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Details</h3>
                    <input className="input-field" placeholder="Full Name *" value={form.name} onChange={e => setField('name', e.target.value)} required />
                    <input className="input-field" type="email" placeholder="Email Address *" value={form.email} onChange={e => setField('email', e.target.value)} required />
                    <input className="input-field" placeholder="Phone Number *" value={form.phone} onChange={e => setField('phone', e.target.value)} required />
                    <select className="input-field text-gray-700" value={form.service} onChange={e => setField('service', e.target.value)} required>
                      <option value="">Select Service *</option>
                      {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      className="btn-primary w-full"
                      disabled={!form.name || !form.email || !form.phone || !form.service}
                      onClick={() => setStep(2)}
                    >
                      Next: Choose Time →
                    </button>
                  </div>
                )}

                {/* Step 2: date + time */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Date & Time</h3>

                    {/* Date grid */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Available Dates</p>
                      <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                        {availableDates.map(({ date, slotsCount }) => {
                          const d = new Date(date + 'T00:00:00');
                          const isSelected = form.date === date;
                          return (
                            <button
                              key={date}
                              onClick={() => { setField('date', date); setField('time', ''); }}
                              className={`p-2.5 rounded-xl border text-sm transition-all ${
                                isSelected
                                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                              }`}
                            >
                              <div className="font-semibold">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                              <div className="text-xs opacity-70 mt-0.5">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              <div className="text-xs opacity-60">{slotsCount} slots</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time grid */}
                    {form.date && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Available Times
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            {new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </span>
                        </p>
                        <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                          {slots.map(t => (
                            <button
                              key={t}
                              onClick={() => setField('time', t)}
                              className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                                form.time === t
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                      <button className="btn-primary flex-1" disabled={!form.date || !form.time} onClick={() => setStep(3)}>
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: confirm */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
                    <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 space-y-2.5 text-sm">
                      {[['Patient', form.name], ['Email', form.email], ['Phone', form.phone], ['Service', form.service], ['Date', form.date], ['Time', form.time]].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center">
                          <span className="text-gray-500 font-medium">{k}</span>
                          <span className="font-semibold text-gray-900 text-right max-w-[60%]">{v}</span>
                        </div>
                      ))}
                    </div>
                    <textarea
                      className="input-field"
                      placeholder="Additional notes (optional)"
                      rows={3}
                      value={form.notes}
                      onChange={e => setField('notes', e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
                      <button className="btn-primary flex-1" onClick={submit} disabled={loading}>
                        {loading ? 'Booking…' : 'Confirm Appointment ✓'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page root ── */
export default function BookPage() {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Navbar />
      <main id="main-content">

      {/* Page hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-16 right-[8%] w-48 h-48 border border-white/10 rounded-full animate-spin-slow" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="hero-f1 flex items-center gap-2 text-white/70 text-sm mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span><span className="text-white">Book Appointment</span>
          </div>
          <h1 className="hero-f2 text-5xl font-extrabold mb-4">Schedule Your Visit</h1>
          <p className="hero-f3 text-white/85 text-xl max-w-xl leading-relaxed">
            Two ways to get started — pick what suits you.
          </p>
          {/* Jump links */}
          <div className="hero-f4 flex gap-4 mt-6">
            <a href="#consultation" className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              Quick Callback ↓
            </a>
            <a href="#appointment" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg">
              Self-Schedule ↓
            </a>
          </div>
        </div>
      </section>

      {/* Choice banner */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-8 grid sm:grid-cols-2 gap-4">
          <a href="#consultation" className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-primary-100 hover:border-primary-400 bg-primary-50 hover:bg-primary-50 transition-all">
            <div className="w-11 h-11 bg-primary-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">⚡</div>
            <div>
              <p className="font-bold text-gray-900 text-base">Quick Callback</p>
              <p className="text-gray-600 text-sm mt-0.5">30 seconds. Leave your number and we call you.</p>
            </div>
          </a>
          <a href="#appointment" className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-teal-100 hover:border-teal-400 bg-teal-50 hover:bg-teal-50 transition-all">
            <div className="w-11 h-11 bg-teal-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">📅</div>
            <div>
              <p className="font-bold text-gray-900 text-base">Self-Schedule</p>
              <p className="text-gray-600 text-sm mt-0.5">Pick your exact date and time slot online.</p>
            </div>
          </a>
        </div>
      </section>

      <ConsultationSection />
      <AppointmentSection />
      </main>
      <Footer />
    </div>
  );
}
