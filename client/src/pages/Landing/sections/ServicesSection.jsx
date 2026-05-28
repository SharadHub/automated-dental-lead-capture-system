import useScrollAnimation from '../../../hooks/useScrollAnimation';
import implantImg from '../../../assets/images/dental-implant.png';
import bracesImg from '../../../assets/images/braces.png';
import dentalCareImg from '../../../assets/images/dental-care.png';
import dentistChairImg from '../../../assets/images/dentist-chair.png';
import teamPhoto from '../../../assets/images/navy-medicine-aCJ2jt9yvoA-unsplash.jpg';
import { Link } from 'react-router-dom';

const services = [
  {
    img: dentalCareImg,
    title: 'General Dentistry',
    desc: 'Routine checkups, cleanings, fillings, and preventive care to keep your smile healthy.',
    color: 'bg-sky-50 hover:bg-sky-100/60',
    iconBg: 'bg-sky-100',
  },
  {
    img: bracesImg,
    title: 'Braces & Orthodontics',
    desc: 'Traditional braces and clear aligners to straighten teeth at any age.',
    color: 'bg-teal-50 hover:bg-teal-100/60',
    iconBg: 'bg-teal-100',
  },
  {
    img: implantImg,
    title: 'Dental Implants',
    desc: 'Permanent, natural-looking tooth replacements that restore your confidence.',
    color: 'bg-primary-50 hover:bg-primary-100/60',
    iconBg: 'bg-primary-100',
  },
  {
    img: dentistChairImg,
    title: 'Advanced Procedures',
    desc: 'Root canals, crowns, bridges, and full-mouth restorations with precision care.',
    color: 'bg-indigo-50 hover:bg-indigo-100/60',
    iconBg: 'bg-indigo-100',
  },
];

export default function ServicesSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section id="services" className="py-28 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">What We Offer</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Comprehensive Dental Services
          </h2>
          <p data-anim className="reveal anim-d2 text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
            From routine cleanings to complex restorations — everything under one roof.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {services.map(({ img, title, desc, color, iconBg }, i) => (
            <div
              key={title}
              data-anim
              className={`reveal anim-d${i + 1} card-lift group p-6 rounded-2xl border border-transparent ${color} cursor-pointer`}
            >
              <div className={`${iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <img src={img} alt={title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Team banner */}
        <div data-anim className="reveal relative rounded-3xl overflow-hidden shadow-xl">
          <img src={teamPhoto} alt="Our dental team" className="w-full h-72 object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/85 via-primary-700/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="text-white px-10 max-w-lg">
              <h3 className="text-3xl font-extrabold mb-3">Meet Our Expert Team</h3>
              <p className="text-white/85 mb-6 leading-relaxed">
                Board-certified dentists with years of experience delivering gentle, precision care.
              </p>
              <Link
                to="/about"
                className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
              >
                Meet the Team →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
