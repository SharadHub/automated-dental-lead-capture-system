import { useState, useEffect } from 'react';
import useScrollAnimation from '../../../hooks/useScrollAnimation';
import { CLINIC } from '../../../data/clinicData';
import medicalImg from '../../../assets/images/medical-appointment.png';
import clockImg from '../../../assets/images/clock.png';
import clinicPhoto from '../../../assets/images/kari-bjorn-photography-Fdku_oMrDvk-unsplash.jpg';
import { appointmentsApi, prospectsApi } from '../../../services/api';

const SERVICES = [
  'General Checkup & Cleaning', 'Teeth Whitening', 'Dental Implants',
  'Braces & Orthodontics', 'Root Canal Treatment', 'Tooth Extraction',
  'Dental Crowns & Bridges', 'Pediatric Dentistry',
];

export default function AppointmentSection() {
  const sectionRef = useScrollAnimation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
  const [availableDates, setAvailableDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    appointmentsApi.getAvailableDates().then(res => setAvailableDates(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.date) {
      appointmentsApi.getSlots(form.date).then(res => setSlots(res.data.slots)).catch(() => setSlots([]));
    }
  }, [form.date]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      const prospectRes = await prospectsApi.create({
        name: form.name, email: form.email, phone: form.phone,
        source: 'website', service_interest: form.service, message: form.notes,
      });
      await appointmentsApi.create({
        prospect_id: prospectRes.data.id,
        appointment_date: form.date,
        appointment_time: form.time,
        service: form.service,
        notes: form.notes,
      });
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointment" className="py-28 bg-slate-50" ref={sectionRef}>
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">

        {/* ── Left: clinic info ── */}
        <div data-anim className="reveal-left">
          <span className="section-tag">Easy Booking</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Book Your Appointment<br />In Minutes
          </h2>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Choose a time that works for you. We'll confirm within the hour.
          </p>

          <div className="relative rounded-2xl overflow-hidden mb-7 shadow-xl">
            <img src={clinicPhoto} alt="Our clinic" className="w-full h-60 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="font-bold text-base">Modern facilities, caring team</p>
              <p className="text-sm text-white/80 mt-0.5">{CLINIC.addressShort}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={clockImg} alt="" className="w-5 h-5" />
              </div>
              <span className="text-sm">Mon–Fri: 9:00 AM – 6:00 PM &nbsp;|&nbsp; Sat: 10:00 AM – 3:00 PM</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={medicalImg} alt="" className="w-5 h-5" />
              </div>
              <span className="text-sm">30-minute slots available with instant confirmation</span>
            </div>
          </div>
        </div>

        {/* ── Right: booking form ── */}
        <div data-anim className="reveal-right">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            {done ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Appointment Booked!</h3>
                <p className="text-gray-700 mb-2">
                  Confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-6">A confirmation has been sent to {form.email}.</p>
                <button
                  onClick={() => { setDone(false); setStep(1); setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' }); }}
                  className="text-primary-700 font-semibold underline underline-offset-2 hover:text-primary-800 text-sm"
                >
                  Book another appointment
                </button>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex gap-2 mb-7">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Your Details</h3>
                    <input className="input-field" placeholder="Full Name *" value={form.name} onChange={e => set('name', e.target.value)} required />
                    <input className="input-field" type="email" placeholder="Email Address *" value={form.email} onChange={e => set('email', e.target.value)} required />
                    <input className="input-field" placeholder="Phone Number *" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                    <select className="input-field" value={form.service} onChange={e => set('service', e.target.value)} required>
                      <option value="">Select Service *</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
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

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Choose Date & Time</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Available Dates</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableDates.slice(0, 12).map(({ date, slotsCount }) => (
                          <button
                            key={date}
                            onClick={() => set('date', date)}
                            className={`p-2.5 rounded-xl border text-sm transition-all ${form.date === date ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'border-gray-200 hover:border-primary-300 bg-white text-gray-700 hover:bg-primary-50'}`}
                          >
                            <div className="font-semibold">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div className="text-xs opacity-70 mt-0.5">{slotsCount} slots</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.date && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Available Times</label>
                        <div className="grid grid-cols-4 gap-2">
                          {slots.map(t => (
                            <button
                              key={t}
                              onClick={() => set('time', t)}
                              className={`p-2 rounded-xl border text-sm transition-all ${form.time === t ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:border-primary-300 bg-white text-gray-700 hover:bg-primary-50'}`}
                            >
                              {t}
                            </button>
                          ))}
                          {slots.length === 0 && <p className="text-gray-500 text-sm col-span-4">No slots available</p>}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                      <button className="btn-primary flex-1" disabled={!form.date || !form.time} onClick={() => setStep(3)}>
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Confirm Booking</h3>
                    <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 space-y-2.5 text-sm">
                      {[['Patient', form.name], ['Email', form.email], ['Phone', form.phone], ['Service', form.service], ['Date', form.date], ['Time', form.time]].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center">
                          <span className="text-gray-500 font-medium">{k}</span>
                          <span className="font-semibold text-gray-900">{v}</span>
                        </div>
                      ))}
                    </div>
                    <textarea
                      className="input-field"
                      placeholder="Any additional notes (optional)"
                      rows={3}
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
                      <button className="btn-primary flex-1" onClick={submit} disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Appointment ✓'}
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
