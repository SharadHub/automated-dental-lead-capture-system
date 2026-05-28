import { Link } from 'react-router-dom';
import Navbar  from '../../components/Navbar/Navbar';
import Footer  from '../Landing/sections/Footer';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { SERVICES, CLINIC } from '../../data/clinicData';

/* ── Asset imports ── */
import dentalCareImg   from '../../assets/images/dental-care.png';
import implantImg      from '../../assets/images/dental-implant.png';
import bracesImg       from '../../assets/images/braces.png';
import dentistChairImg from '../../assets/images/dentist-chair.png';
import sirenImg        from '../../assets/images/siren.png';
import happyFaceImg    from '../../assets/images/happy-face.png';
import medicalImg      from '../../assets/images/medical-appointment.png';
import teamPhoto       from '../../assets/images/navy-medicine-aCJ2jt9yvoA-unsplash.jpg';
import clinicPhoto     from '../../assets/images/kari-bjorn-photography-Fdku_oMrDvk-unsplash.jpg';
import checkBoxImg     from '../../assets/images/undraw_checking-boxes_j0im.svg';
import dotBlobImg      from '../../assets/images/dot-blob-1.svg';

const IMG_MAP = {
  'dental-care':    dentalCareImg,
  'dental-implant': implantImg,
  'braces':         bracesImg,
  'dentist-chair':  dentistChairImg,
  'siren':          sirenImg,
  'happy-face':     happyFaceImg,
  'medical-appointment': medicalImg,
};

const ACCENT_MAP = {
  sky:     'bg-sky-50 border-sky-100 group-hover:border-sky-300',
  yellow:  'bg-yellow-50 border-yellow-100 group-hover:border-yellow-300',
  primary: 'bg-primary-50 border-primary-100 group-hover:border-primary-300',
  teal:    'bg-teal-50 border-teal-100 group-hover:border-teal-300',
  rose:    'bg-rose-50 border-rose-100 group-hover:border-rose-300',
  orange:  'bg-orange-50 border-orange-100 group-hover:border-orange-300',
  indigo:  'bg-indigo-50 border-indigo-100 group-hover:border-indigo-300',
  emerald: 'bg-emerald-50 border-emerald-100 group-hover:border-emerald-300',
  red:     'bg-red-50 border-red-100 group-hover:border-red-300',
};

const ICON_BG_MAP = {
  sky:     'bg-sky-100',
  yellow:  'bg-yellow-100',
  primary: 'bg-primary-100',
  teal:    'bg-teal-100',
  rose:    'bg-rose-100',
  orange:  'bg-orange-100',
  indigo:  'bg-indigo-100',
  emerald: 'bg-emerald-100',
  red:     'bg-red-100',
};

/* ── Hero ── */
function ServicesHero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-16 right-[8%] w-56 h-56 border border-white/10 rounded-full animate-spin-slow" />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="hero-f1 flex items-center gap-2 text-white/70 text-sm mb-5">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span><span className="text-white">Services</span>
        </div>
        <h1 className="hero-f2 text-5xl font-extrabold mb-4">Our Dental Services</h1>
        <p className="hero-f3 text-white/85 text-xl max-w-xl leading-relaxed">
          Comprehensive care for every smile — from your first visit to lifelong oral health.
        </p>
      </div>
    </section>
  );
}

/* ── All services grid ── */
function AllServices() {
  const ref = useScrollAnimation();
  return (
    <section className="py-24 bg-white relative overflow-hidden" ref={ref}>
      <img src={dotBlobImg} alt="" className="absolute top-0 right-0 w-72 opacity-15 pointer-events-none select-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">Full Service List</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Everything Under One Roof
          </h2>
          <p data-anim className="reveal anim-d2 text-gray-700 text-lg max-w-xl mx-auto leading-relaxed">
            {CLINIC.name} provides comprehensive dental care with state-of-the-art equipment and genuine compassion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ key, title, shortDesc, longDesc, imgKey, accent, icon }, i) => (
            <div
              key={key}
              data-anim
              className={`reveal anim-d${(i % 3) + 1} card-lift group p-7 rounded-2xl border ${ACCENT_MAP[accent]} transition-all`}
            >
              <div className={`${ICON_BG_MAP[accent]} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {IMG_MAP[imgKey]
                  ? <img src={IMG_MAP[imgKey]} alt={title} className="w-9 h-9 object-contain" />
                  : <span className="text-2xl">{icon}</span>}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{shortDesc}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{longDesc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Process steps ── */
function HowItWorks() {
  const ref = useScrollAnimation();
  const steps = [
    { n: '01', title: 'Book Online',         desc: 'Use our simple booking form or call us to schedule at a time that suits you.', icon: '📅' },
    { n: '02', title: 'Initial Consultation', desc: `Meet ${CLINIC.doctor} for a thorough exam. We explain everything clearly, no surprises.`, icon: '🔍' },
    { n: '03', title: 'Treatment Plan',       desc: 'Receive a personalised plan with transparent pricing before any work begins.', icon: '📋' },
    { n: '04', title: 'Gentle Care',          desc: 'We perform your treatment with precision and care, ensuring maximum comfort throughout.', icon: '❤️' },
  ];

  return (
    <section className="py-24 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">Our Process</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            How It Works
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map(({ n, title, desc, icon }, i) => (
            <div key={n} data-anim className={`reveal anim-d${i + 1} text-center`}>
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white text-2xl mb-4 shadow-lg shadow-primary-200">
                {icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full text-gray-900 text-xs font-extrabold flex items-center justify-center">{n}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Team banner ── */
function TeamBanner() {
  const ref = useScrollAnimation();
  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <div data-anim className="reveal relative rounded-3xl overflow-hidden shadow-xl">
          <img src={teamPhoto} alt={`${CLINIC.name} team`} className="w-full h-72 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/85 via-primary-700/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10">
            <div className="text-white max-w-lg">
              <h3 className="text-3xl font-extrabold mb-3">Experienced, Caring Team</h3>
              <p className="text-white/85 mb-6 leading-relaxed">
                Led by {CLINIC.doctor}, our clinic combines modern technology with genuine compassion — ensuring every visit is comfortable and effective.
              </p>
              <Link to="/about" className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                Meet the Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function ServicesCTA() {
  const ref = useScrollAnimation();
  return (
    <section className="py-20 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-6 text-center">
        <div data-anim className="reveal">
          <span className="section-tag">Get Started</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Ready to Book Your Treatment?
          </h2>
          <p className="text-gray-700 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Appointments available Sun–Fri, 10 AM – 8 PM. Call us or book online in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn-primary">Book Appointment →</Link>
            <a href={`tel:${CLINIC.phone}`} className="btn-secondary">📞 {CLINIC.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Navbar />
      <main id="main-content">
      <ServicesHero />
      <AllServices />
      <HowItWorks />
      <TeamBanner />
      <ServicesCTA />
      </main>
      <Footer />
    </div>
  );
}
