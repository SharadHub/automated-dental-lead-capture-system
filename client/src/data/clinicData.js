/* ─────────────────────────────────────────────────────────
   Mock clinic data — Apex Dental Studio, Chicago, IL
   ───────────────────────────────────────────────────────── */

export const CLINIC = {
  name: 'Apex Dental Studio',
  nameShort: 'Apex Dental',
  tagline: 'HIGH-END',
  subTagline: 'Exceptional care for every smile.',
  description:
    'A modern dental studio committed to delivering exceptional care in a calm, welcoming environment — combining the latest technology with a patient-first approach that puts your comfort above everything.',

  doctor: 'Dr. Sarah Mitchell',
  city: 'Chicago',
  teamDesc: 'From reception to the dental chair, every member of the Apex Dental family is committed to your comfort and confidence.',
  established: '2019',
  rating: 4.9,
  ratingText: '4.9',
  reviews: 320,
  reviewsText: '320+',
  patientsText: '2,500+',

  /* Contact */
  phone: '(312) 555-0194',
  phone2: '(312) 555-0182',
  email: 'hello@apexdentalstudio.com',

  /* Location */
  address: '4280 Oak Park Ave, Chicago, IL 60634',
  addressShort: 'Oak Park Ave, Chicago',
  landmark: 'Near Oak Park Transit Center',

  /* Hours */
  hours: {
    display: 'Mon–Fri: 8:00 AM – 6:00 PM  ·  Sat: 9:00 AM – 2:00 PM  ·  Sunday: Closed',
    compact: 'Mon–Fri  8 AM – 6 PM',
    saturday: '9:00 AM – 2:00 PM',
    weekdays: '8:00 AM – 6:00 PM',
    sunday: 'Closed',
    rows: [
      { day: 'Monday',    time: '8:00 AM – 6:00 PM' },
      { day: 'Tuesday',   time: '8:00 AM – 6:00 PM' },
      { day: 'Wednesday', time: '8:00 AM – 6:00 PM' },
      { day: 'Thursday',  time: '8:00 AM – 6:00 PM' },
      { day: 'Friday',    time: '8:00 AM – 6:00 PM' },
      { day: 'Saturday',  time: '9:00 AM – 2:00 PM' },
      { day: 'Sunday',    time: 'Closed' },
    ],
  },

  /* Social */
  social: {
    facebook:  'https://www.facebook.com/apexdentalstudio',
    youtube:   'https://www.youtube.com/@ApexDentalStudio',
    instagram: 'https://www.instagram.com/apexdentalstudio',
    whatsapp:  'https://wa.me/13125550194',
  },

  /* Attributes */
  attributes: ['Free parking lot', 'Contactless payments', 'Wheelchair accessible', 'Appointments recommended'],
};

/* ── Services ─────────────────────────────────────────────── */
export const SERVICES = [
  {
    key: 'general',
    title: 'General Checkup & Cleaning',
    shortDesc: 'Comprehensive exams, digital X-rays, plaque removal, and oral hygiene guidance.',
    longDesc:
      'Our thorough dental exams and professional cleaning sessions ensure your teeth and gums stay healthy. Using digital radiography for precise, low-dose diagnostics, we catch problems early and keep your mouth in peak condition.',
    imgKey: 'dental-care',
    accent: 'sky',
    icon: '🦷',
  },
  {
    key: 'cosmetic',
    title: 'Cosmetic Dentistry',
    shortDesc: 'Professional whitening, veneers, and full smile makeovers.',
    longDesc:
      'From in-chair teeth whitening to porcelain veneers and complete smile makeovers, our cosmetic treatments are designed to give you the bright, symmetrical smile you have always wanted — in just one or two visits.',
    imgKey: 'braces',
    accent: 'yellow',
    icon: '✨',
  },
  {
    key: 'implants',
    title: 'Dental Implants',
    shortDesc: 'Permanent, titanium-rooted tooth replacements that look and feel natural.',
    longDesc:
      'Our surgical implants use medical-grade titanium posts fused to the jawbone, providing a stable foundation for crowns that match your natural teeth perfectly. Restore your bite and confidence permanently.',
    imgKey: 'dental-implant',
    accent: 'primary',
    icon: '🔩',
  },
  {
    key: 'braces',
    title: 'Braces & Orthodontics',
    shortDesc: 'Metal braces and clear aligners for all ages.',
    longDesc:
      'Whether you choose traditional metal braces or modern clear aligners, our orthodontic treatments gently shift teeth into their ideal positions — improving both aesthetics and function at any age.',
    imgKey: 'braces',
    accent: 'teal',
    icon: '😁',
  },
  {
    key: 'rootcanal',
    title: 'Root Canal Treatment',
    shortDesc: 'Pain-free endodontic care to save infected teeth.',
    longDesc:
      'Modern root canal therapy is nothing to fear. Using precision rotary instruments and local anaesthesia, we remove infected pulp, clean the canals thoroughly, and seal the tooth — relieving pain while saving your natural tooth.',
    imgKey: 'dental-care',
    accent: 'rose',
    icon: '💉',
  },
  {
    key: 'extraction',
    title: 'Tooth Extraction',
    shortDesc: 'Gentle simple and surgical extractions with fast recovery.',
    longDesc:
      'When a tooth cannot be saved, our dentists perform simple and surgical extractions with minimum trauma, using advanced pain management techniques so you feel comfortable throughout. Detailed aftercare instructions ensure swift healing.',
    imgKey: 'medical-appointment',
    accent: 'orange',
    icon: '🪥',
  },
  {
    key: 'crowns',
    title: 'Crowns, Bridges & Dentures',
    shortDesc: 'Custom-crafted restorations for a complete, functional smile.',
    longDesc:
      'From single porcelain crowns to full-arch dentures and fixed bridges, our lab-precision restorations look natural, feel comfortable, and are built to last. We restore your ability to eat, speak, and smile with confidence.',
    imgKey: 'dentist-chair',
    accent: 'indigo',
    icon: '👑',
  },
  {
    key: 'pediatric',
    title: 'Pediatric Dentistry',
    shortDesc: 'Child-friendly care from the very first tooth.',
    longDesc:
      'We make dental visits fun and fear-free for children. Our paediatric approach uses gentle techniques, patient explanations, and a welcoming environment to build positive dental habits that last a lifetime.',
    imgKey: 'happy-face',
    accent: 'emerald',
    icon: '🧒',
  },
  {
    key: 'emergency',
    title: 'Emergency Dental Care',
    shortDesc: 'Same-day slots for urgent dental pain and trauma.',
    longDesc:
      'Toothaches, broken teeth, and dental trauma can\'t wait. We keep same-day emergency slots open during all working hours. Call us immediately and we will get you seen and out of pain as quickly as possible.',
    imgKey: 'siren',
    accent: 'red',
    icon: '🚨',
  },
];

/* ── Testimonials ─────────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    name: 'Jennifer Walsh',
    role: 'Cosmetic Dentistry Patient',
    text: 'Dr. Mitchell completely transformed my smile. The veneers look so natural — friends keep asking if they\'re real. The studio is spotless, the team is warm, and I never felt rushed. Worth every penny.',
    rating: 5,
    avatar: 'J',
    gradient: 'from-primary-500 to-teal-500',
  },
  {
    name: 'Marcus Reid',
    role: 'Dental Implant Patient',
    text: 'I put off getting implants for years out of fear. Apex made the whole process straightforward and surprisingly comfortable. Six months later my implants feel completely natural. Genuinely life-changing.',
    rating: 5,
    avatar: 'M',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Orthodontics Patient',
    text: 'Clear aligners from Apex have been a great experience from day one. Dr. Mitchell mapped out the full treatment plan upfront so I always knew what to expect. My teeth are straight in less time than I was quoted elsewhere.',
    rating: 5,
    avatar: 'P',
    gradient: 'from-indigo-500 to-primary-500',
  },
];
