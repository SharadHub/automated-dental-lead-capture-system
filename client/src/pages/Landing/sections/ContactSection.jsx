import { useState } from 'react';
import useScrollAnimation from '../../../hooks/useScrollAnimation';
import { prospectsApi } from '../../../services/api';
import { CLINIC } from '../../../data/clinicData';
import dotBlobImg from '../../../assets/images/dot-blob-1.svg';
import phoneCallImg from '../../../assets/images/phone-call.png';
import mapImg from '../../../assets/images/map.png';

export default function ContactSection() {
  const sectionRef = useScrollAnimation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', source: 'website' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await prospectsApi.create(form);
      setDone(true);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: '📍', label: 'Address', value: CLINIC.address, sub: CLINIC.landmark },
    { icon: '📞', label: 'Phone', value: CLINIC.phone, sub: 'Call or WhatsApp' },
    { icon: '✉️', label: 'Email', value: CLINIC.email, sub: 'Responds within 2 hrs' },
    { icon: '🕐', label: 'Hours', value: CLINIC.hours.compact, sub: `Saturday: ${CLINIC.hours.saturday}` },
  ];

  return (
    <section id="contact" className="py-28 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Background decoration */}
      <img src={dotBlobImg} alt="" className="absolute top-0 right-0 w-80 opacity-20 pointer-events-none select-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start relative z-10">

        {/* ── Left: info ── */}
        <div data-anim className="reveal-left">
          <span className="section-tag">Get In Touch</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Have Questions?<br />We're Here to Help
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-10">
            Reach out anytime. Our team typically responds within 2 hours during clinic hours.
          </p>

          <div className="space-y-5 mb-10">
            {contactItems.map(({ icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-colors">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-700 text-sm mt-0.5">{value}</p>
                  {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-3 flex-wrap">
            {[
              ['Facebook', CLINIC.social.facebook, 'bg-blue-600 hover:bg-blue-700'],
              ['Instagram', CLINIC.social.instagram, 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'],
              ['WhatsApp', CLINIC.social.whatsapp, 'bg-green-500 hover:bg-green-600'],
            ].map(([name, href, color]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`${color} text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md`}
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: form ── */}
        <div data-anim className="reveal-right">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
            {done ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-700">We'll get back to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="input-field"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    required
                  />
                  <input
                    className="input-field"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                />
                <select
                  className="input-field text-gray-700"
                  value={form.source}
                  onChange={e => set('source', e.target.value)}
                >
                  <option value="website">Found us online</option>
                  <option value="google">Google Search</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="referral">Friend / Referral</option>
                </select>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Your message or question..."
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                />
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
