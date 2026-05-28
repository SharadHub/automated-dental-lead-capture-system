const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text,
  });
  return info;
}

async function notifyOwner({ type, prospect, appointment }) {
  const subject = type === 'new_lead'
    ? `🦷 New Lead: ${prospect.name} (${prospect.source})`
    : `📅 Appointment Booked: ${prospect.name}`;

  const html = type === 'new_lead'
    ? `<h2>New Lead Received</h2>
       <table style="border-collapse:collapse;width:100%">
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.name || 'N/A'}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.email || 'N/A'}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.phone || 'N/A'}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Source</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.source}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Interest</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.service_interest || 'N/A'}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.message || 'N/A'}</td></tr>
       </table>
       <p style="color:#666;margin-top:16px">Log in to your dashboard to follow up.</p>`
    : `<h2>Appointment Booked</h2>
       <table style="border-collapse:collapse;width:100%">
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Patient</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.name}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Service</strong></td><td style="padding:8px;border:1px solid #ddd">${appointment.service}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Date</strong></td><td style="padding:8px;border:1px solid #ddd">${appointment.appointment_date}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Time</strong></td><td style="padding:8px;border:1px solid #ddd">${appointment.appointment_time}</td></tr>
         <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${prospect.phone || 'N/A'}</td></tr>
       </table>`;

  await sendEmail({
    to: process.env.OWNER_EMAIL,
    subject,
    html,
    text: subject,
  });
}

async function sendAppointmentConfirmation(prospect, appointment) {
  if (!prospect.email) return;
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0ea5e9">Appointment Confirmed! 🦷</h2>
      <p>Hi <strong>${prospect.name}</strong>,</p>
      <p>Your appointment at <strong>${process.env.CLINIC_NAME}</strong> has been confirmed.</p>
      <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
        <p><strong>Service:</strong> ${appointment.service}</p>
        <p><strong>Date:</strong> ${appointment.appointment_date}</p>
        <p><strong>Time:</strong> ${appointment.appointment_time}</p>
        <p><strong>Address:</strong> ${process.env.CLINIC_ADDRESS}</p>
      </div>
      <p>If you need to reschedule, call us at <strong>${process.env.CLINIC_PHONE}</strong>.</p>
      <p>See you soon! 😊</p>
    </div>`;

  await sendEmail({
    to: prospect.email,
    subject: `Appointment Confirmed – ${process.env.CLINIC_NAME}`,
    html,
    text: `Appointment confirmed for ${appointment.appointment_date} at ${appointment.appointment_time}.`,
  });
}

module.exports = { sendEmail, notifyOwner, sendAppointmentConfirmation };
