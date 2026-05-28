const router = require('express').Router();
const db = require('../config/db');
const { notifyOwner } = require('../services/email.service');

// Facebook / Instagram Webhook verification
router.get('/facebook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Facebook Messenger / Instagram DM webhook
router.post('/facebook', async (req, res) => {
  try {
    const { object, entry } = req.body;
    if (object !== 'page' && object !== 'instagram') return res.sendStatus(404);

    for (const e of entry || []) {
      for (const msg of e.messaging || []) {
        if (!msg.message?.text) continue;

        const senderId = msg.sender?.id;
        const text = msg.message.text;
        const source = object === 'instagram' ? 'instagram' : 'facebook';

        // Find or create prospect
        let prospect = (await db.query('SELECT * FROM prospects WHERE metadata->>\'social_id\' = $1', [senderId])).rows[0];

        if (!prospect) {
          const result = await db.query(
            `INSERT INTO prospects (source, status, message, metadata)
             VALUES ($1, 'prospect', $2, $3) RETURNING *`,
            [source, text, JSON.stringify({ social_id: senderId })]
          );
          prospect = result.rows[0];
          notifyOwner({ type: 'new_lead', prospect }).catch(console.error);
        }

        // Store message
        const conv = await db.query(
          `INSERT INTO conversations (prospect_id, channel, session_id)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING RETURNING *`,
          [prospect.id, source, senderId]
        );

        await db.query(
          'INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)',
          [conv.rows[0]?.id, 'prospect', text]
        );
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Facebook webhook error:', err);
    res.sendStatus(500);
  }
});

// WhatsApp Business API webhook
router.post('/whatsapp', async (req, res) => {
  try {
    const { entry } = req.body;
    for (const e of entry || []) {
      for (const change of e.changes || []) {
        const messages = change.value?.messages || [];
        for (const msg of messages) {
          if (msg.type !== 'text') continue;
          const phone = `+${msg.from}`;
          const text = msg.text?.body;

          let prospect = (await db.query('SELECT * FROM prospects WHERE phone = $1', [phone])).rows[0];
          if (!prospect) {
            const result = await db.query(
              `INSERT INTO prospects (phone, source, status, message)
               VALUES ($1, 'whatsapp', 'prospect', $2) RETURNING *`,
              [phone, text]
            );
            prospect = result.rows[0];
            notifyOwner({ type: 'new_lead', prospect }).catch(console.error);
          }

          await db.query(
            `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
            [
              'message_received',
              `WhatsApp from ${phone}`,
              text,
              JSON.stringify({ prospect_id: prospect.id }),
            ]
          );
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
