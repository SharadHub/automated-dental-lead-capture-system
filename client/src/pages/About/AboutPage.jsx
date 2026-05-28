import { Link } from 'react-router-dom';
import Navbar  from '../../components/Navbar/Navbar';
import Footer  from '../Landing/sections/Footer';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { CLINIC, SERVICES } from '../../data/clinicData';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

/* ── Assets ── */
import doctorImg      from '../../assets/images/doctor.png';
import clinicPhoto    from '../../assets/images/kari-bjorn-photography-Fdku_oMrDvk-unsplash.jpg';
import teamPhoto      from '../../assets/images/navy-medicine-aCJ2jt9yvoA-unsplash.jpg';
import smilePhoto     from '../../assets/images/lesly-juarez-1AhGNGKuhR0-unsplash.jpg';
import dentalCloseup  from '../../assets/images/ozkan-guner-6E-3v5NZxMw-unsplash.jpg';
import stockPhoto     from '../../assets/images/istockphoto-1419895646-1024x1024.jpg';
import happyFaceImg   from '../../assets/images/happy-face.png';
import dentalCareImg  from '../../assets/images/dental-care.png';
import implantImg     from '../../assets/images/dental-implant.png';
import bracesImg      from '../../assets/images/braces.png';
import clockImg       from '../../assets/images/clock.png';
import medicalImg     from '../../assets/images/medical-appointment.png';
import checkBoxImg    from '../../assets/images/undraw_checking-boxes_j0im.svg';
import blobImg        from '../../assets/images/blob-haikei.svg';

/* ── Hero ── */
function AboutHero() {
  return (
    <section className="relative min-h-[65vh] flex items-end overflow-hidden">
      <img src={teamPhoto} alt={`${CLINIC.name} team`} className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/30" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 border border-white/10 rounded-full animate-spin-slow" />
        <div className="absolute top-20 right-20 w-36 h-36 border border-white/8 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />
      </div>
      <div className="relative z-10 container mx-auto px-6 pb-20 pt-48">
        <div className="hero-f1 flex items-center gap-2 text-white/70 text-sm mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span><span className="text-white">About</span>
        </div>
        <h1 className="hero-f2 text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          About <span className="text-yellow-300">{CLINIC.nameShort}</span>
        </h1>
        <p className="hero-f3 text-white/85 text-lg max-w-xl leading-relaxed">{CLINIC.subTagline}</p>
      </div>
    </section>
  );
}

/* ── Story ── */
function OurStory() {
  const ref = useScrollAnimation();
  return (
    <section className="py-28 bg-white" ref={ref}>
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div data-anim className="reveal-left relative">
          <img src={clinicPhoto} alt="Clinic interior" className="rounded-3xl w-full h-80 object-cover shadow-2xl" />
          <div className="absolute -bottom-8 -right-6 w-52 h-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img src={dentalCloseup} alt="Dental care" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-5 -left-5 bg-primary-600 text-white rounded-2xl p-4 shadow-xl text-center">
            <p className="text-2xl font-extrabold leading-none">Since</p>
            <p className="text-3xl font-extrabold leading-none">{CLINIC.established}</p>
          </div>
        </div>
        <div data-anim className="reveal-right mt-8 lg:mt-0">
          <span className="section-tag">Our Story</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight">
            High-End Dentistry<br />for Everyone
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Founded in {CLINIC.established} by {CLINIC.doctor}, {CLINIC.name} was built on a single belief:
            high-quality dental care should be accessible to everyone in the community. Nestled in {CLINIC.addressShort},
            we quickly became the neighbourhood's most trusted dental destination.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            With {CLINIC.reviewsText} five-star Google reviews, we're proud to serve patients of all ages —
            from their first baby tooth to complex restorative work — always in a warm, judgement-free environment.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[[CLINIC.reviewsText, 'Google Reviews'], ['5.0★', 'Rating'], [CLINIC.patientsText, 'Patients']].map(([v, l]) => (
              <div key={l} className="text-center bg-primary-50 rounded-2xl p-4">
                <p className="text-2xl font-extrabold gradient-text">{v}</p>
                <p className="text-xs text-gray-600 mt-1">{l}</p>
              </div>
            ))}
          </div>
          <Link to="/book" className="btn-primary">Book a Consultation →</Link>
        </div>
      </div>
    </section>
  );
}

/* ── Mission & Values ── */
function MissionValues() {
  const ref = useScrollAnimation();
  const cards = [
    { img: dentalCareImg, title: 'Compassionate Care', desc: 'Every patient is treated with warmth and respect from the moment they walk through our door. No anxiety, no judgement — just genuine care.', gradient: 'from-sky-400 to-primary-500', bg: 'bg-sky-50' },
    { img: implantImg,    title: 'Clinical Excellence', desc: `${CLINIC.doctor} stays at the forefront of modern dentistry with continuing education and state-of-the-art equipment.`, gradient: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50' },
    { img: medicalImg,    title: 'Patient-First Always', desc: 'Transparent pricing, honest diagnosis, and treatment plans that match your needs and budget — no unnecessary upselling.', gradient: 'from-primary-500 to-indigo-500', bg: 'bg-primary-50' },
  ];
  return (
    <section className="py-28 bg-gradient-to-br from-slate-50 to-primary-50/30" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">What Drives Us</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">Mission & Values</h2>
          <p data-anim className="reveal anim-d2 text-gray-600 text-lg max-w-lg mx-auto">The principles behind every treatment, every interaction, every smile.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-7">
          {cards.map(({ img, title, desc, gradient, bg }, i) => (
            <div key={title} data-anim className={`reveal anim-d${i + 1} card-lift ${bg} rounded-3xl p-8 border border-white shadow-sm`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <img src={img} alt={title} className="w-9 h-9 object-contain filter brightness-0 invert" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Doctor ── */
function MeetTheDoctor() {
  const ref = useScrollAnimation();
  return (
    <section className="py-28 bg-white overflow-hidden" ref={ref}>
      <img src={blobImg} alt="" className="absolute right-0 opacity-5 pointer-events-none select-none w-1/3" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">Your Doctor</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">Meet {CLINIC.doctor}</h2>
          <p data-anim className="reveal anim-d2 text-gray-600 text-lg max-w-lg mx-auto">Founder and lead dentist at {CLINIC.name}.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div data-anim className="reveal-left flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-end justify-center overflow-hidden shadow-2xl">
                <img src={doctorImg} alt={CLINIC.doctor} className="w-64 object-contain" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white rounded-2xl p-4 shadow-xl text-center">
                <p className="text-2xl font-extrabold leading-none">5.0</p>
                <p className="text-xs mt-1 font-medium text-primary-100">★ Rating</p>
              </div>
            </div>
          </div>

          <div data-anim className="reveal-right">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{CLINIC.doctor}</h3>
            <p className="text-primary-700 font-semibold mb-5">Founder & Lead Dentist · {CLINIC.name}</p>
            <p className="text-gray-700 leading-relaxed mb-5">
              {CLINIC.doctor} founded {CLINIC.name} with a clear vision: to bring high-end dental care to the people of {CLINIC.city} and beyond.
              Specialising in general, cosmetic, and restorative dentistry, {CLINIC.doctor} combines technical expertise with a warm,
              unhurried bedside manner that puts even the most anxious patients at ease.
            </p>
            <p className="text-gray-700 leading-relaxed mb-7">
              The clinic's {CLINIC.reviewsText} five-star Google reviews and {CLINIC.patientsText} patients served are a testament
              to the trust the community has placed in {CLINIC.doctor} and the entire {CLINIC.name} team.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href={CLINIC.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"><FaFacebookF size={13} /> Facebook</a>
              <a href={CLINIC.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"><FaInstagram size={13} /> Instagram</a>
              <a href={`mailto:${CLINIC.email}`} aria-label="Email" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">✉ Email</a>
            </div>
          </div>
        </div>

        {/* Team photo */}
        <div data-anim className="reveal mt-14 relative rounded-3xl overflow-hidden shadow-xl">
          <img src={teamPhoto} alt="Full team" className="w-full h-64 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/80 to-primary-600/40" />
          <div className="absolute inset-0 flex items-center px-10">
            <div className="text-white max-w-lg">
              <h3 className="text-2xl font-extrabold mb-2">Our Entire Team Cares</h3>
              <p className="text-white/85 text-sm leading-relaxed">{CLINIC.teamDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Why Choose Us ── */
function WhyChooseUs() {
  const ref = useScrollAnimation();
  const reasons = [
    { img: dentalCareImg, title: 'Modern Equipment',    desc: 'Digital X-rays, rotary root canal, and the latest sterilisation protocols for your safety.' },
    { img: implantImg,    title: 'Proven Expertise',    desc: `${CLINIC.doctor} brings precision and skill to every procedure, from simple cleanings to complex implants.` },
    { img: bracesImg,     title: 'All Treatments',      desc: 'Nine specialties under one roof — no need for multiple referrals.' },
    { img: clockImg,      title: 'Generous Hours',      desc: 'Open 10 AM – 8 PM, Sunday through Friday. Plenty of evening slots.' },
    { img: medicalImg,    title: 'Transparent Pricing', desc: 'Clear costs before treatment begins. No hidden fees, no surprises.' },
    { img: happyFaceImg,  title: `${CLINIC.reviewsText} 5★ Reviews`, desc: `The highest-rated dental clinic in ${CLINIC.city} on Google Maps.` },
  ];
  return (
    <section className="py-28 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span data-anim className="reveal inline-block text-yellow-300 font-semibold text-sm uppercase tracking-widest">Why We Stand Out</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-white mt-3 mb-4">Why Choose {CLINIC.nameShort}?</h2>
          <p data-anim className="reveal anim-d2 text-white/80 text-lg max-w-lg mx-auto">More than great dentistry — an experience worth smiling about.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ img, title, desc }, i) => (
            <div key={title} data-anim className={`reveal anim-d${(i % 3) + 1} bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors group`}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <img src={img} alt={title} className="w-8 h-8 object-contain filter brightness-0 invert" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Gallery ── */
function Gallery() {
  const ref = useScrollAnimation();
  const photos = [
    { src: smilePhoto,   alt: 'Happy patient' },
    { src: stockPhoto,   alt: 'Dental treatment' },
    { src: clinicPhoto,  alt: 'Clinic interior' },
    { src: dentalCloseup, alt: 'Dental care close-up' },
  ];
  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span data-anim className="reveal section-tag">A Glimpse Inside</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">Our Clinic & Patients</h2>
        </div>
        <div data-anim className="reveal grid grid-cols-3 gap-4" style={{ height: '380px' }}>
          {photos.map(({ src, alt }, i) => (
            <div key={i} className={`${i === 0 ? 'row-span-2' : ''} overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow group`} style={i === 0 ? { gridRow: 'span 2' } : {}}>
              <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function AboutCTA() {
  const ref = useScrollAnimation();
  return (
    <section className="py-24 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-6">
        <div data-anim className="reveal bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <img src={checkBoxImg} alt="" className="w-28 mx-auto mb-6 opacity-80 filter brightness-0 invert" />
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Visit Us?</h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Find us at {CLINIC.address}. Open Sun–Fri, 10 AM – 8 PM.
              Book online or call {CLINIC.doctor} directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                Book Appointment →
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

export default function AboutPage() {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Navbar />
      <main id="main-content">
      <AboutHero />
      <OurStory />
      <MissionValues />
      <MeetTheDoctor />
      <WhyChooseUs />
      <Gallery />
      <AboutCTA />
      </main>
      <Footer />
    </div>
  );
}
