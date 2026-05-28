const { sendEmail } = require('./email.service');

function renderTemplate(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCampaign({ recipients, subject, htmlTemplate, textTemplate, delayMs = 2000 }) {
  const results = [];

  for (const recipient of recipients) {
    if (!recipient.email) {
      results.push({ email: 'unknown', name: recipient.name, status: 'skipped', reason: 'no email' });
      continue;
    }

    const variables = {
      name: recipient.name || recipient.email,
      clinic_name: recipient.name || recipient.email,
      city: recipient.city || '',
      website: recipient.website || '',
      phone: recipient.phone || '',
      address: recipient.address || '',
      email: recipient.email,
      ...recipient.extra,
    };

    try {
      const renderedSubject = renderTemplate(subject, variables);
      const renderedHtml = renderTemplate(htmlTemplate, variables);
      const renderedText = textTemplate ? renderTemplate(textTemplate, variables) : undefined;

      await sendEmail({
        to: recipient.email,
        subject: renderedSubject,
        html: renderedHtml,
        text: renderedText,
      });

      results.push({ email: recipient.email, name: recipient.name, status: 'sent' });
      console.log(`[campaign] Sent to ${recipient.name} <${recipient.email}>`);
    } catch (err) {
      results.push({ email: recipient.email, name: recipient.name, status: 'failed', reason: err.message });
      console.error(`[campaign] Failed for ${recipient.email}: ${err.message}`);
    }

    if (delayMs > 0) await sleep(delayMs);
  }

  const sent = results.filter((r) => r.status === 'sent').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  return { total: recipients.length, sent, failed, skipped, results };
}

const DEFAULT_TEMPLATE = {
  subject: 'Partnership Opportunity – {name}',
  html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: #0ea5e9; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 22px;">Bright Smile Dental Clinic</h1>
  </div>
  <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px;">Hi <strong>{name}</strong>,</p>
    <p>I hope this message finds you well. My name is [Your Name] from <strong>Bright Smile Dental Clinic</strong>, and I'm reaching out to explore a potential collaboration with your clinic{city_phrase}.</p>
    <p>We specialize in [Your Services] and are looking to connect with fellow dental professionals to:</p>
    <ul style="line-height: 1.8;">
      <li>Share patient referrals for specialized treatments</li>
      <li>Collaborate on community dental health programs</li>
      <li>Explore mutual growth opportunities</li>
    </ul>
    <p>I'd love to schedule a brief 15-minute call to discuss how we might work together. Would you be available sometime this week?</p>
    <a href="mailto:{email}" style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Reply to Connect</a>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
    <p style="font-size: 13px; color: #6b7280;">
      Bright Smile Dental Clinic &nbsp;|&nbsp; ${process.env.CLINIC_PHONE || '+977-1-4567890'} &nbsp;|&nbsp; ${process.env.CLINIC_ADDRESS || 'Lalitpur, Nepal'}
      <br>
      <a href="#" style="color:#6b7280;font-size:12px;">Unsubscribe</a>
    </p>
  </div>
</div>`,
  text: `Hi {name},\n\nI hope this message finds you well. I'm reaching out from Bright Smile Dental Clinic to explore a potential collaboration.\n\nWe'd love to connect about referral partnerships and community health programs.\n\nReply to this email to get started.\n\nBest regards,\nBright Smile Dental Clinic\n${process.env.CLINIC_PHONE || '+977-1-4567890'}`,
};

module.exports = { sendCampaign, renderTemplate, DEFAULT_TEMPLATE };
