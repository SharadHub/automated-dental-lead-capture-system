import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from './sections/HeroSection';
import Footer from './sections/Footer';
import ChatWidget from '../../components/ChatWidget/ChatWidget';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { SERVICES, TESTIMONIALS, CLINIC } from '../../data/clinicData';

/* ── Asset imports ── */
import dentalCareImg  from '../../assets/images/dental-care.png';
import implantImg     from '../../assets/images/dental-implant.png';
import bracesImg      from '../../assets/images/braces.png';
import dentistChairImg from '../../assets/images/dentist-chair.png';
import sirenImg       from '../../assets/images/siren.png';
import happyFaceImg   from '../../assets/images/happy-face.png';
import smilePhoto     from '../../assets/images/lesly-juarez-1AhGNGKuhR0-unsplash.jpg';
import checkBoxImg    from '../../assets/images/undraw_checking-boxes_j0im.svg';

const IMG_MAP = {
  'dental-care':   dentalCareImg,
  'dental-implant': implantImg,
  'braces':        bracesImg,
  'dentist-chair': dentistChairImg,
  'siren':         sirenImg,
  'happy-face':    happyFaceImg,
};

/* ── Services preview (4 cards) ── */
function ServicesPreview() {
  const ref = useScrollAnimation();
  const preview = SERVICES.slice(0, 4);

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span data-anim className="reveal section-tag">What We Offer</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Our Dental Services
          </h2>
          <p data-anim className="reveal anim-d2 text-gray-700 text-lg max-w-xl mx-auto leading-relaxed">
            From routine check-ups to advanced restorations — all under one roof in {CLINIC.addressShort}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {preview.map(({ key, title, shortDesc, imgKey, icon }, i) => (
            <div
              key={key}
              data-anim
              className={`reveal anim-d${i + 1} card-lift bg-gray-50 hover:bg-primary-50/60 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 group cursor-pointer`}
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {IMG_MAP[imgKey]
                  ? <img src={IMG_MAP[imgKey]} alt={title} className="w-9 h-9 object-contain" />
                  : <span className="text-2xl">{icon}</span>}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">{title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{shortDesc}</p>
            </div>
          ))}
        </div>

        <div data-anim className="reveal anim-d5 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
function TestimonialsSection() {
  const ref = useScrollAnimation();
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-primary-50/40 to-teal-50/30 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span data-anim className="reveal section-tag">Patient Stories</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            What Our Patients Say
          </h2>
          <p data-anim className="reveal anim-d2 text-gray-600 text-lg max-w-md mx-auto">
            {CLINIC.reviewsText} five-star reviews on Google speak for themselves.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {TESTIMONIALS.map(({ name, role, text, rating, avatar, gradient }, i) => (
            <div
              key={name}
              data-anim
              className={`reveal anim-d${i + 1} card-lift bg-white rounded-2xl p-7 shadow-sm border border-gray-100`}
            >
              <div className="flex gap-1 mb-4">
                {Array(rating).fill(0).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500">{role} · Verified Patient</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Satisfaction callout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-anim className="reveal-left relative">
            <img src={smilePhoto} alt={`Happy patient at ${CLINIC.name}`} className="rounded-3xl w-full h-80 object-cover shadow-xl" />
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <img src={happyFaceImg} alt="" className="w-12 h-12" />
              <div>
                <p className="font-extrabold text-gray-900 text-lg leading-none">5.0 ★</p>
                <p className="text-sm text-gray-700 mt-0.5">Google Rating</p>
                <p className="text-xs text-gray-400">{CLINIC.reviewsText} verified reviews</p>
              </div>
            </div>
          </div>
          <div data-anim className="reveal-right">
            <span className="section-tag">Our Track Record</span>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
              Trusted by {CLINIC.city}'s<br />Families Since {CLINIC.established}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-7">
              {CLINIC.description}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-7">
              {[[CLINIC.reviewsText, 'Google Reviews'], ['5.0★', 'Rating'], [CLINIC.patientsText, 'Patients']].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-xl font-extrabold gradient-text">{v}</p>
                  <p className="text-xs text-gray-600 mt-1">{l}</p>
                </div>
              ))}
            </div>
            <Link to="/book" className="btn-primary inline-block">Book Your Appointment →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ── */
function CTABanner() {
  const ref = useScrollAnimation();
  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <div data-anim className="reveal bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <img src={checkBoxImg} alt="" className="w-28 mx-auto mb-6 opacity-80 filter brightness-0 invert" />
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join {CLINIC.patientsText} patients who trust {CLINIC.name}. Book a free consultation today —
              no commitment, just a friendly conversation about your oral health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                Book Free Consultation →
              </Link>
              <a href={`tel:${CLINIC.phone}`} className="bg-white/15 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
                📞 {CLINIC.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page root ── */
export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Navbar />
      <main id="main-content">
      <HeroSection />
      <ServicesPreview />
      <TestimonialsSection />
      <CTABanner />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
