# Dental Clinic — Lead Capture & Management System

A full-stack web application that automates patient acquisition for **Dental Clinic** (Nakhipot, Lalitpur, Nepal). The system captures potential patients from multiple digital channels, nurtures them through a structured pipeline, and converts them into booked appointments — all from a single unified platform.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Current Available Systems](#current-available-systems)
- [Gap Analysis](#gap-analysis)
- [How This Project Fills the Gaps](#how-this-project-fills-the-gaps)
- [Project Overview](#project-overview)
- [Tech Stack & Prerequisites](#tech-stack--prerequisites)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

---

## About the Project

Dental Clinics serve hundreds of patients and manages inquiries through phone calls, walk-ins, social media, and email. As the clinic grew, manually handling each of these channels became inefficient and error-prone leads were being missed, follow-ups were delayed, and there was no central view of where patients were coming from.

This system was built to solve exactly that. It provides:

- An **AI-powered chatbot** on the clinic's public website that holds natural conversations, collects visitor contact details, and books appointments autonomously.
- A **multi-channel lead intake pipeline** that captures inquiries from Facebook, Instagram, WhatsApp, email, and the website into one place.
- A **protected admin dashboard** for clinic staff to manage leads, view appointments, run email campaigns, and monitor real-time analytics.
- **Automatic status progression** — a visitor starts as a *prospect*, becomes a *lead* when they book, and graduates to a *patient* when their appointment is completed.

---

## Problem Statement

Small and mid-sized dental clinics face a common set of operational challenges that silently cost them patients and revenue:

| Challenge | Impact |
|---|---|
| Inquiries arrive across WhatsApp, Facebook, email, and phone with no unified inbox | Leads fall through the cracks |
| Receptionists manually handle every booking request and follow-up | High staff workload, slow response times |
| No visibility into which marketing channels generate the most patients | Marketing spend is uninformed |
| After-hours visitors have no way to get answers or book appointments | Lost conversions outside working hours |
| No automated follow-up for prospects who enquired but never booked | Revenue left on the table |
| Appointment scheduling relies on a physical register or disconnected spreadsheets | Double-bookings, missed slots |

These problems are especially acute for growing clinics in markets like Nepal, where patients increasingly discover and contact businesses through social media before ever making a phone call.

---

## Current Available Systems

Several commercial and open-source tools exist in this space, but none are purpose-built for the specific needs of small dental clinics in emerging markets:

**Generic CRM Platforms (HubSpot, Zoho CRM, Salesforce)**
Full-featured sales CRMs. Powerful, but designed for B2B sales teams. Require significant configuration, come with high subscription costs, and have no built-in dental domain knowledge or appointment slot management.

**Practice Management Software (Dentrix, Eaglesoft, Open Dental)**
Purpose-built dental software for patient records, billing, and chair-side operations. Strong on the clinical side, but weak on digital lead capture and marketing automation. Most are desktop-only, expensive, and not designed for emerging markets.

**Generic Appointment Booking Tools (Calendly, Acuity Scheduling)**
Solve the scheduling piece in isolation. No lead tracking, no CRM, no chatbot, no analytics. Patients must already be motivated and know where to look.

**Social Media Inbox Tools (ManyChat, Respond.io)**
Automate messaging on Facebook and WhatsApp. Good at triage but not integrated with appointment calendars, patient records, or analytics. Subscription-based pricing grows with volume.

**DIY Chatbot Builders (Tidio, Intercom, Drift)**
Provide website chat widgets and basic bots. Highly generic and rule-based; require extensive setup to approximate clinic-specific behaviour. Do not integrate with booking or lead pipelines.

---

## Gap Analysis

Despite the range of tools above, a clear gap exists for small dental clinics that need an integrated, affordable, domain-aware solution:

| Capability | CRM Platforms | Practice Software | Booking Tools | Chatbot Builders | **This Project** |
|---|:---:|:---:|:---:|:---:|:---:|
| Multi-channel lead capture (web, FB, IG, WhatsApp, email) | Partial | No | No | Partial | **Yes** |
| AI chatbot with dental domain knowledge | No | No | No | Generic | **Yes** |
| End-to-end prospect → lead → patient pipeline | Yes | Yes | No | No | **Yes** |
| Real-time appointment slot management | No | Yes | Yes | No | **Yes** |
| Outbound email campaigns | Yes | Partial | No | No | **Yes** |
| Real-time admin notifications (Socket.io) | No | No | No | No | **Yes** |
| Source-level analytics and conversion tracking | Yes | No | No | No | **Yes** |
| Human handoff from chatbot to staff | No | No | No | Partial | **Yes** |
| Self-hosted, no per-seat subscription cost | No | No | No | No | **Yes** |
| Clinic-specific AI behaviour (services, hours, doctor) | No | No | No | No | **Yes** |

---

## How This Project Fills the Gaps

**1. Unified Multi-Channel Intake**
Inquiries from the website chatbot, Facebook/Instagram DMs, WhatsApp Business, and inbound emails are all funnelled into the same `prospects` table. Staff see everything in one place — no switching between apps.

**2. Conversational AI with Tool Use**
The chatbot is powered by Claude (Anthropic) and goes beyond a simple FAQ bot. It understands natural language, asks follow-up questions, pulls live availability from the database, saves lead contact details, and books appointments — all in a single conversation. It knows the clinic's exact services, hours, address, and doctor by name.

**3. Automated Lead Pipeline**
Status transitions are automatic and business-rule-driven:
- A new contact from any channel enters as a `prospect`.
- Booking an appointment upgrades them to `lead`.
- Completing an appointment marks them as `patient`.

Staff never manually update statuses for routine flows.

**4. Conflict-Safe Appointment Slots**
Available slots are generated from the `availability` table and checked for conflicts before any INSERT. Double-bookings are structurally prevented, not just validated client-side.

**5. Owner Notifications and Email Campaigns**
The clinic owner receives email alerts for every new lead and booking. Staff can also trigger outbound email campaigns to re-engage cold prospects — all from within the admin dashboard.

**6. Real-Time Admin Dashboard**
Socket.io pushes new lead and booking events to the admin interface instantly, without polling. Staff see new prospects appear live without refreshing the page.

**7. Built-In Analytics**
The analytics module tracks lead sources, conversion rates (prospect → lead → patient), and appointment volume. Clinic management can see, for the first time, exactly which channels generate paying patients.

---

## Project Overview

### Architecture

```
dental-clinic/
├── client/                             # React 19 + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing/                # Public website (chatbot, services, booking CTA)
│       │   │   └── sections/           # Hero, Services, Appointment, Contact, Footer
│       │   ├── Admin/                  # Protected staff dashboard
│       │   │   ├── Dashboard/          # KPI overview and conversion rate
│       │   │   ├── Leads/              # Prospect / lead / patient management
│       │   │   ├── Appointments/       # Appointment management
│       │   │   ├── Analytics/          # Source and conversion charts
│       │   │   └── Notifications/      # Real-time notification feed
│       │   ├── Book/                   # Public appointment booking page
│       │   ├── About/                  # About the clinic
│       │   ├── Contact/                # Contact page
│       │   └── Services/               # Services listing
│       ├── components/
│       │   ├── ChatWidget/             # Floating AI chatbot widget
│       │   └── Navbar/                 # Top navigation
│       └── services/api.js             # Centralised Axios API client
│
├── server/                             # Node.js + Express backend
│   └── src/
│       ├── app.js                      # Entry point, Socket.io, IMAP scheduler
│       ├── config/db.js                # PostgreSQL connection pool
│       ├── routes/                     # Express route definitions
│       ├── controllers/                # Request handlers and business logic
│       ├── services/
│       │   ├── chatbot.service.js      # Claude AI agentic loop + tool handlers
│       │   ├── email.service.js        # SMTP outbound email (Nodemailer)
│       │   ├── emailReader.service.js  # IMAP inbound email polling
│       │   ├── emailCampaign.service.js# Bulk campaign sending
│       │   └── calendar.service.js     # Slot generation and availability
│       ├── middleware/
│       │   ├── auth.js                 # JWT verification
│       │   └── errorHandler.js         # Global error handler
│       └── database/
│           └── migrations/             # SQL schema (001_initial.sql)
│
└── start.sh                            # Convenience script to start both servers
```

### API Routes

| Method | Route | Auth | Description |
|---|---|:---:|---|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/prospects` | Yes | List all prospects |
| POST | `/api/prospects` | No | Create prospect (public form) |
| PATCH | `/api/prospects/:id` | Yes | Update prospect status / notes |
| GET | `/api/appointments` | No | List appointments |
| POST | `/api/appointments` | No | Book appointment |
| PATCH | `/api/appointments/:id` | Yes | Update appointment status |
| POST | `/api/chatbot/message` | No | Send message to AI chatbot |
| GET | `/api/analytics/overview` | Yes | KPI overview |
| GET | `/api/analytics/recent` | Yes | Recent activity |
| GET | `/api/notifications` | Yes | Notification list |
| POST | `/api/email-campaign` | Yes | Trigger email campaign |
| POST | `/api/webhooks/facebook` | No | Facebook / Instagram webhook |
| POST | `/api/webhooks/whatsapp` | No | WhatsApp Business webhook |

### Lead Pipeline

```
[Website Chatbot]    ──┐
[Facebook/Instagram] ──┤
[WhatsApp Business]  ──┼──→  prospect  ──→  lead  ──→  patient
[Inbound Email]      ──┤    (enquired)   (booked)   (completed)
[Manual Entry]       ──┘
```

---

## Tech Stack & Prerequisites

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19.x |
| Frontend build tool | Vite | 8.x |
| CSS framework | Tailwind CSS | 3.x |
| Charts | Recharts | 2.x |
| Real-time client | Socket.io-client | 4.x |
| Backend runtime | Node.js | 18+ |
| Backend framework | Express | 4.x |
| Real-time server | Socket.io | 4.x |
| Database | PostgreSQL | 14+ |
| AI | Anthropic Claude API (`claude-haiku-4-5`) | SDK 0.55+ |
| Email sending | Nodemailer (SMTP) | 6.x |
| Email reading | node-imap | 0.9.x |
| Authentication | JSON Web Tokens + bcryptjs | JWT 9.x |
| WhatsApp | whatsapp-web.js | 1.x |

### Prerequisites

Before running the project, ensure the following are installed:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (bundled with Node.js)
- **PostgreSQL** 14 or higher — [postgresql.org](https://www.postgresql.org/download/)
- **An Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- **A Gmail account** with an App Password enabled (for SMTP + IMAP) — [Google App Passwords](https://myaccount.google.com/apppasswords)
- **Git** — [git-scm.com](https://git-scm.com)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dental-clinic.git
cd dental-clinic
```

### 2. Set Up the Database

Start PostgreSQL and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE dental_clinic;
\q
```

Run the schema migrations:

```bash
cd server
npm run migrate
```

Optionally seed initial data:

```bash
npm run seed
```

### 3. Configure the Server Environment

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in all values:

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/dental_clinic

# JWT
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d

# Anthropic / Claude AI
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# SMTP — outbound email via Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_clinic_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Sewa Dental Clinic <your_clinic_email@gmail.com>"

# Owner notification email
OWNER_EMAIL=owner@example.com

# IMAP — inbound email reading via Gmail
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your_clinic_email@gmail.com
IMAP_PASS=your_gmail_app_password

# CORS
CLIENT_URL=http://localhost:5173

# Clinic details
CLINIC_NAME=Sewa Dental Clinic
CLINIC_PHONE=+977 984-3324841
CLINIC_ADDRESS=Nakhipot, Lalitpur, Nepal
```

> **Note:** For Gmail, generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Your regular Gmail password will not work with SMTP or IMAP.

### 4. Create the Admin Account

```bash
cd server
node setup-admin.js
```

This creates the initial admin user for the dashboard.

### 5. Install Dependencies

```bash
# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 6. Run the Application

**Option A — Convenience script (recommended):**

```bash
# From the project root
chmod +x start.sh
./start.sh
```

This starts both the backend and frontend concurrently. Press `Ctrl+C` to stop both.

**Option B — Manual (two terminals):**

```bash
# Terminal 1 — Backend
cd server
npm run dev
# Runs at http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# Runs at http://localhost:5173
```

### 7. Access the Application

| URL | Description |
|---|---|
| `http://localhost:5173` | Public website with AI chatbot widget |
| `http://localhost:5173/book` | Public appointment booking page |
| `http://localhost:5173/admin` | Admin login |
| `http://localhost:5000/health` | Server health check |

Log in at `/admin` using the credentials created in step 4.

---

## Future Enhancements

The following improvements are planned for future iterations:

**AI & Chatbot**
- Voice-enabled chatbot for phone call handling
- Nepali language support for the chatbot interface
- AI-generated personalised appointment reminders
- Sentiment analysis to flag dissatisfied patients before they leave

**Patient Management**
- Full electronic health record (EHR) module per patient
- Treatment history and past appointment records
- Before/after photo upload for cosmetic procedures

**Scheduling**
- Multi-doctor availability calendars
- Recurring appointment scheduling (monthly checkups)
- Automated SMS/WhatsApp reminders 24 hours before appointments

**Marketing & Growth**
- Google Ads and Meta Ads conversion tracking integration
- Referral tracking — which patients referred which new patients
- Automated re-engagement campaigns for patients inactive for 6+ months
- Post-appointment satisfaction surveys

**Operations**
- Mobile app for clinic staff (React Native)
- Billing and invoice generation
- Role-based access control (receptionist vs. doctor vs. admin)
- Integration with national health insurance systems

**Infrastructure**
- Docker Compose setup for one-command deployment
- CI/CD pipeline with automated testing
- Cloud deployment guide (AWS / DigitalOcean / Render)

---

## Conclusion

This Dental Clinic's lead capture system demonstrates how a small healthcare provider can compete with larger, better-resourced clinics by intelligently automating the patient acquisition process. Rather than juggling phone calls, social media inboxes, and a paper appointment book, the clinic now has a single system that works around the clock — capturing leads while the receptionist is off duty, booking appointments without back-and-forth, and surfacing exactly which channels and services drive the most patient conversions.

The PERN stack (PostgreSQL, Express, React, Node.js) combined with the Anthropic Claude API provides a foundation that is affordable to run, straightforward to extend, and powerful enough to handle the multi-channel complexity of modern patient acquisition.

The result is a system that does not just digitise existing workflows — it fundamentally improves them, giving the clinic a measurable advantage in converting online interest into seated patients.

---

> Built with Node.js, React, PostgreSQL, and the Anthropic Claude API.