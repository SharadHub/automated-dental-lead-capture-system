const { sendCampaign, renderTemplate, DEFAULT_TEMPLATE } = require('../services/emailCampaign.service');

async function preview(req, res) {
  const { recipient, subject, htmlTemplate, textTemplate } = req.body;

  if (!recipient || !subject || !htmlTemplate) {
    return res.status(400).json({ error: 'recipient, subject, and htmlTemplate are required' });
  }

  const variables = {
    name: recipient.name || recipient.email,
    clinic_name: recipient.name || recipient.email,
    city: recipient.city || '',
    city_phrase: recipient.city ? ` in ${recipient.city}` : '',
    website: recipient.website || '',
    phone: recipient.phone || '',
    address: recipient.address || '',
    email: recipient.email || '',
    ...recipient.extra,
  };

  res.json({
    subject: renderTemplate(subject, variables),
    html: renderTemplate(htmlTemplate, variables),
    text: textTemplate ? renderTemplate(textTemplate, variables) : undefined,
  });
}

async function send(req, res) {
  const {
    recipients,
    subject,
    htmlTemplate,
    textTemplate,
    delayMs,
    useDefaultTemplate,
  } = req.body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'recipients must be a non-empty array' });
  }

  const resolvedSubject = useDefaultTemplate ? DEFAULT_TEMPLATE.subject : subject;
  const resolvedHtml = useDefaultTemplate ? DEFAULT_TEMPLATE.html : htmlTemplate;
  const resolvedText = useDefaultTemplate ? DEFAULT_TEMPLATE.text : textTemplate;

  if (!resolvedSubject || !resolvedHtml) {
    return res.status(400).json({ error: 'subject and htmlTemplate are required (or set useDefaultTemplate: true)' });
  }

  try {
    const report = await sendCampaign({
      recipients,
      subject: resolvedSubject,
      htmlTemplate: resolvedHtml,
      textTemplate: resolvedText,
      delayMs: delayMs ?? 2000,
    });

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDefaultTemplate(req, res) {
  res.json(DEFAULT_TEMPLATE);
}

module.exports = { preview, send, getDefaultTemplate };
