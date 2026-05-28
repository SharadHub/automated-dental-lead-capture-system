const Anthropic = require('@anthropic-ai/sdk');
const db = require('../config/db');
const { getAvailableSlots } = require('./calendar.service');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful dental assistant for Sewa Dental Clinic in Nakhipot, Lalitpur, Nepal. Help website visitors warmly and professionally.

CLINIC INFORMATION:
- Name: Sewa Dental Clinic
- Doctor: Dr. Pabish Rai
- Address: Nakhipot Marg, Lalitpur 44600, Nepal (Near Nakhipot Youth Club)
- Phone: +977 984-3324841 / +977-1-5171715
- Email: sewadentalclinic4@gmail.com
- Hours: Sunday–Friday 10:00 AM–8:00 PM | Saturday: Closed
- Features: Free parking, NFC mobile payments, Appointments recommended
- Rating: 5.0 stars, 700+ Google reviews, 1,000+ patients served

SERVICES:
1. General Checkup & Cleaning — Exams, digital X-rays, cleaning
2. Cosmetic Dentistry — Whitening, veneers, smile makeovers
3. Dental Implants — Permanent titanium-rooted replacements
4. Braces & Orthodontics — Metal braces and clear aligners
5. Root Canal Treatment — Pain-free endodontic care
6. Tooth Extraction — Simple and surgical extractions
7. Crowns, Bridges & Dentures — Custom restorations
8. Pediatric Dentistry — Child-friendly care
9. Emergency Dental Care — Same-day slots for urgent cases

YOUR GOALS (in priority order):
1. Understand what the visitor needs
2. Answer questions about services, location, hours, or pricing
3. Collect their name, phone or email, and service interest naturally through conversation
4. Offer to book an appointment once you have their contact info
5. Use request_human_handoff if they explicitly want to speak to someone

GUIDELINES:
- Be warm and concise — 2-3 sentences per reply unless explaining a service
- Collect info naturally through conversation, never as a form
- If someone is in pain or has an emergency, prioritize getting them seen quickly
- Once you have name + one contact method, call save_lead_info
- When they want to book, call get_available_slots first, then book_appointment after confirmation`;

const TOOLS = [
  {
    name: 'save_lead_info',
    description: 'Save prospect contact information once you have their name and at least a phone number or email',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Full name" },
        phone: { type: 'string', description: "Phone number" },
        email: { type: 'string', description: "Email address" },
        service_interest: { type: 'string', description: "Service they are interested in" },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_available_slots',
    description: 'Get available appointment time slots for a specific date',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      },
      required: ['date'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment after the prospect has confirmed date, time, and service',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'YYYY-MM-DD' },
        time: { type: 'string', description: 'HH:MM in 24-hour format' },
        service: { type: 'string', description: 'Service name' },
        notes: { type: 'string', description: 'Optional notes' },
      },
      required: ['date', 'time', 'service'],
    },
  },
  {
    name: 'request_human_handoff',
    description: 'Use when visitor explicitly wants to speak to a human or when you cannot resolve their query',
    input_schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Why handoff is needed' },
      },
      required: ['reason'],
    },
  },
];

async function getOrCreateConversation(session_id) {
  let conv = (await db.query(
    'SELECT * FROM conversations WHERE session_id = $1 AND channel = $2',
    [session_id, 'chatbot']
  )).rows[0];

  if (!conv) {
    conv = (await db.query(
      `INSERT INTO conversations (channel, session_id) VALUES ('chatbot', $1) RETURNING *`,
      [session_id]
    )).rows[0];
  }

  return conv;
}

async function getHistory(conversation_id) {
  const result = await db.query(
    'SELECT sender, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 40',
    [conversation_id]
  );
  return result.rows.map(row => ({
    role: row.sender === 'bot' ? 'assistant' : 'user',
    content: row.content,
  }));
}

async function storeMessage(conversation_id, sender, content) {
  await db.query(
    'INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)',
    [conversation_id, sender, content]
  );
}

async function handleTool(name, input, conversation) {
  if (name === 'save_lead_info') {
    const { name: pName, phone, email, service_interest } = input;

    if (conversation.prospect_id) {
      await db.query(
        `UPDATE prospects SET
           name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           service_interest = COALESCE($4, service_interest),
           updated_at = NOW()
         WHERE id = $5`,
        [pName, phone, email, service_interest, conversation.prospect_id]
      );
      return { success: true, prospect_id: conversation.prospect_id };
    }

    // Find existing or create new prospect
    const existing = email
      ? (await db.query('SELECT id FROM prospects WHERE email = $1', [email])).rows[0]
      : phone
        ? (await db.query('SELECT id FROM prospects WHERE phone = $1', [phone])).rows[0]
        : null;

    let prospect_id;
    if (existing) {
      prospect_id = existing.id;
    } else {
      const r = await db.query(
        `INSERT INTO prospects (name, phone, email, source, status, service_interest)
         VALUES ($1, $2, $3, 'website', 'prospect', $4) RETURNING id`,
        [pName, phone, email, service_interest]
      );
      prospect_id = r.rows[0].id;

      // Fire-and-forget notifications
      const { notifyOwner } = require('./email.service');
      notifyOwner({ type: 'new_lead', prospect: { name: pName, phone, email, source: 'website', service_interest } })
        .catch(console.error);

      db.query(
        `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
        [
          'new_lead',
          `Chat Lead: ${pName}`,
          `Interested in: ${service_interest || 'general enquiry'}`,
          JSON.stringify({ prospect_id, source: 'chatbot' }),
        ]
      ).catch(console.error);
    }

    await db.query('UPDATE conversations SET prospect_id = $1 WHERE id = $2', [prospect_id, conversation.id]);
    conversation.prospect_id = prospect_id;
    return { success: true, prospect_id };
  }

  if (name === 'get_available_slots') {
    try {
      const slots = await getAvailableSlots(input.date);
      return { date: input.date, available_slots: slots };
    } catch {
      return { error: 'Could not fetch slots for that date', date: input.date };
    }
  }

  if (name === 'book_appointment') {
    const { date, time, service, notes } = input;
    if (!conversation.prospect_id) {
      return { error: 'Please collect contact info before booking' };
    }
    try {
      const r = await db.query(
        `INSERT INTO appointments (prospect_id, appointment_date, appointment_time, service, notes)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [conversation.prospect_id, date, time, service, notes]
      );
      const appt = r.rows[0];

      await db.query(
        `UPDATE prospects SET status = 'lead' WHERE id = $1 AND status = 'prospect'`,
        [conversation.prospect_id]
      );

      const prospect = (await db.query('SELECT * FROM prospects WHERE id = $1', [conversation.prospect_id])).rows[0];
      const { notifyOwner, sendAppointmentConfirmation } = require('./email.service');
      notifyOwner({ type: 'appointment_booked', prospect, appointment: appt }).catch(console.error);
      sendAppointmentConfirmation(prospect, appt).catch(console.error);

      db.query(
        `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
        [
          'appointment_booked',
          `Chat Booking: ${prospect.name}`,
          `${service} on ${date} at ${time}`,
          JSON.stringify({ prospect_id: conversation.prospect_id, appointment_id: appt.id }),
        ]
      ).catch(console.error);

      return { success: true, date, time, service };
    } catch {
      return { error: 'Slot no longer available. Please choose another time.' };
    }
  }

  if (name === 'request_human_handoff') {
    db.query(
      `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
      [
        'human_handoff',
        'Chat: Human Handoff Requested',
        input.reason,
        JSON.stringify({ prospect_id: conversation.prospect_id, session_id: conversation.session_id }),
      ]
    ).catch(console.error);
    return { success: true };
  }

  return { error: 'Unknown tool' };
}

async function chat(session_id, userMessage) {
  const conversation = await getOrCreateConversation(session_id);

  await storeMessage(conversation.id, 'prospect', userMessage);

  const history = await getHistory(conversation.id);
  // history includes the message we just stored; rebuild as claude messages
  const messages = history.map(h => ({ role: h.role, content: h.content }));

  let currentMessages = messages;
  let finalText = '';
  let action = null;

  // Agentic tool-use loop
  while (true) {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: currentMessages,
    });

    const toolBlocks = response.content.filter(b => b.type === 'tool_use');
    const textBlocks = response.content.filter(b => b.type === 'text');

    if (textBlocks.length) {
      finalText = textBlocks.map(b => b.text).join('');
    }

    if (response.stop_reason === 'end_turn' || !toolBlocks.length) break;

    // Execute tools
    const toolResults = [];
    for (const block of toolBlocks) {
      const result = await handleTool(block.name, block.input, conversation);
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) });

      if (block.name === 'book_appointment' && result.success) action = 'appointment_booked';
      if (block.name === 'request_human_handoff' && result.success) action = 'human_handoff';
      if (block.name === 'save_lead_info' && result.success && !action) action = 'lead_saved';
    }

    currentMessages = [
      ...currentMessages,
      { role: 'assistant', content: response.content },
      { role: 'user', content: toolResults },
    ];
  }

  if (finalText) await storeMessage(conversation.id, 'bot', finalText);

  return { reply: finalText, action };
}

module.exports = { chat };
