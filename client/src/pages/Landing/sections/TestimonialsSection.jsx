import useScrollAnimation from '../../../hooks/useScrollAnimation';
import smilePhoto from '../../../assets/images/lesly-juarez-1AhGNGKuhR0-unsplash.jpg';
import happyFaceImg from '../../../assets/images/happy-face.png';
import starsImg from '../../../assets/images/undraw_checking-boxes_j0im.svg';

const testimonials = [
  {
    name: 'Aarav Sharma',
    rating: 5,
    role: 'Dental Implant Patient',
    text: 'Best dental experience I\'ve ever had! The team was so gentle and professional. Got my implants done here and couldn\'t be happier.',
    avatar: 'A',
    color: 'from-primary-500 to-teal-500',
  },
  {
    name: 'Priya Thapa',
    rating: 5,
    role: 'Braces Patient',
    text: 'Booking was so easy through the website. My braces journey started perfectly here — the whole process was seamless from day one.',
    avatar: 'P',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    name: 'Rohan Karki',
    rating: 5,
    role: 'General Checkup',
    text: 'Booked an appointment online and came in the very next day. The staff was incredibly welcoming. Amazing service, highly recommend!',
    avatar: 'R',
    color: 'from-indigo-500 to-primary-500',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section className="py-28 bg-gradient-to-br from-slate-50 via-primary-50/40 to-teal-50/30 overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span data-anim className="reveal section-tag">Patient Stories</span>
          <h2 data-anim className="reveal anim-d1 text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            What Our Patients Say
          </h2>
          <p data-anim className="reveal anim-d2 text-gray-600 text-lg max-w-lg mx-auto">
            Real stories from the patients we're proud to serve.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map(({ name, rating, role, text, avatar, color }, i) => (
            <div
              key={name}
              data-anim
              className={`reveal anim-d${i + 1} card-lift bg-white rounded-2xl p-7 shadow-sm border border-gray-100/80 relative overflow-hidden group`}
            >
              {/* Decorative corner gradient */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-8 rounded-bl-3xl`} />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(rating).fill(0).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{text}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
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

        {/* Happy patient feature */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-anim className="reveal-left relative">
            <img
              src={smilePhoto}
              alt="Happy patient"
              className="rounded-3xl w-full h-80 object-cover shadow-xl"
            />
            {/* Floating stat */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <img src={happyFaceImg} alt="" className="w-12 h-12" />
              <div>
                <p className="font-extrabold text-gray-900 text-lg leading-none">98%</p>
                <p className="text-sm text-gray-600 mt-0.5">Patient Satisfaction</p>
                <p className="text-xs text-gray-400">Based on 500+ reviews</p>
              </div>
            </div>
          </div>

          <div data-anim className="reveal-right">
            <span className="section-tag">Our Track Record</span>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
              We've Transformed<br />Thousands of Smiles
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our patients come for the treatment and stay for the care. Join hundreds
              of families who trust us with their dental health.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[['500+', 'Patients Treated'], ['15+', 'Years in Practice'], ['8+', 'Specialties']].map(([val, lbl]) => (
                <div key={lbl} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-extrabold gradient-text">{val}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-tight">{lbl}</p>
                </div>
              ))}
            </div>

            <a
              href="#appointment"
              onClick={e => { e.preventDefault(); document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-primary inline-block"
            >
              Join Our Happy Patients →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
