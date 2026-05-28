const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const db = require('../config/db');
const { notifyOwner } = require('./email.service');

function createImapConnection() {
  return new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: parseInt(process.env.IMAP_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });
}

function classifySource(email, subject = '', body = '') {
  const combined = (email + subject + body).toLowerCase();
  if (combined.includes('instagram') || combined.includes('ig.')) return 'instagram';
  if (combined.includes('facebook') || combined.includes('fb.com')) return 'facebook';
  if (combined.includes('whatsapp')) return 'whatsapp';
  if (combined.includes('google') || combined.includes('maps')) return 'google';
  return 'email';
}

async function fetchNewEmails() {
  return new Promise((resolve, reject) => {
    const imap = createImapConnection();
    const results = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) { imap.end(); return reject(err); }

        // Search unseen emails from last 24 hours
        const since = new Date();
        since.setDate(since.getDate() - 1);

        imap.search(['UNSEEN', ['SINCE', since]], async (err, uids) => {
          if (err || !uids.length) {
            imap.end();
            return resolve([]);
          }

          const fetch = imap.fetch(uids, { bodies: '', markSeen: true });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) return;
                results.push({
                  from: parsed.from?.text || '',
                  subject: parsed.subject || '',
                  body: parsed.text || parsed.html || '',
                  date: parsed.date,
                });
              });
            });
          });

          fetch.once('end', async () => {
            imap.end();
            // Process each email
            for (const mail of results) {
              await processInboundEmail(mail);
            }
            resolve(results);
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

async function processInboundEmail(mail) {
  try {
    const emailMatch = mail.from.match(/[\w.-]+@[\w.-]+\.\w+/);
    const fromEmail = emailMatch ? emailMatch[0] : null;
    const source = classifySource(mail.from, mail.subject, mail.body);

    // Check if prospect exists
    let prospect = null;
    if (fromEmail) {
      const existing = await db.query('SELECT * FROM prospects WHERE email = $1', [fromEmail]);
      prospect = existing.rows[0];
    }

    if (!prospect) {
      // Create new prospect
      const nameMatch = mail.from.match(/^"?([^"<]+)"?\s*</);
      const name = nameMatch ? nameMatch[1].trim() : null;

      const result = await db.query(
        `INSERT INTO prospects (name, email, source, status, message)
         VALUES ($1, $2, $3, 'prospect', $4) RETURNING *`,
        [name, fromEmail, source, mail.body?.slice(0, 500)]
      );
      prospect = result.rows[0];

      // Notify owner of new prospect
      await notifyOwner({ type: 'new_lead', prospect });
    }

    // Log the email
    await db.query(
      `INSERT INTO email_logs (prospect_id, direction, subject, body, from_email, to_email)
       VALUES ($1, 'inbound', $2, $3, $4, $5)`,
      [prospect.id, mail.subject, mail.body?.slice(0, 2000), fromEmail, process.env.IMAP_USER]
    );

    // Create notification
    await db.query(
      `INSERT INTO notifications (type, title, body, data)
       VALUES ('message_received', $1, $2, $3)`,
      [
        `Email from ${prospect.name || fromEmail}`,
        mail.subject,
        JSON.stringify({ prospect_id: prospect.id, source }),
      ]
    );
  } catch (err) {
    console.error('Error processing inbound email:', err);
  }
}

module.exports = { fetchNewEmails, processInboundEmail };
